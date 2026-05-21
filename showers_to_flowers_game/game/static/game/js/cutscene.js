const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

function animateTo(el, props, duration, easing = "ease") {
  return new Promise(resolve => {
    Object.keys(props).forEach(key => {
      el.style.transition = `${key} ${duration}ms ${easing}`;
      el.style[key] = props[key];
    });
    setTimeout(resolve, duration);
  });
}

async function seedBounce(el, x, groundY, height) {
  const duration = height * 18;
  const start = performance.now();
  const startY = groundY;

  await new Promise(resolve => {
    function frame(now) {
      const t = Math.min((now - start) / duration, 1);
      const cy = startY - Math.sin(t * Math.PI) * height;
      el.style.top = cy + "px";
      el.style.left = x + "px";
      if (t < 1) requestAnimationFrame(frame);
      else resolve();
    }
    requestAnimationFrame(frame);
  });
}

async function tossSeed(el, fromX, fromY) {
  el.textContent = "\u{1F330}";
  el.style.opacity = "1";
  el.style.left = fromX + "px";
  el.style.top = fromY + "px";
  el.style.fontSize = "24px";

  const groundY = window.innerHeight - 95;
  const targetX = fromX + 160 + Math.random() * 80;
  const peakY = fromY - 110;
  const duration = 700;
  const start = performance.now();

  await new Promise(resolve => {
    function frame(now) {
      const t = Math.min((now - start) / duration, 1);
      const cx = fromX + (targetX - fromX) * t;
      const cy = (1 - t) * (1 - t) * fromY + 2 * (1 - t) * t * peakY + t * t * groundY;
      el.style.left = cx + "px";
      el.style.top = cy + "px";
      el.style.transform = `rotate(${t * 540}deg)`;
      if (t < 1) requestAnimationFrame(frame);
      else resolve();
    }
    requestAnimationFrame(frame);
  });

  await seedBounce(el, targetX, groundY, 18);
  await seedBounce(el, targetX + 12, groundY, 7);

  el.style.transition = "opacity 0.5s, transform 0.5s";
  el.style.opacity = "0";
  el.style.transform = "scale(0.3) rotate(720deg)";
  await wait(500);

  const plant = document.getElementById("plant");
  if (!plant) return;
  plant.style.left = targetX + "px";
  plant.style.transform = "translateX(-50%)";
}

async function runFarmer() {
  const farmer = document.getElementById("farmer");
  const seedToss = document.getElementById("seed-toss");
  if (!farmer || !seedToss) return;

  const vw = window.innerWidth;
  farmer.style.left = "-90px";
  farmer.style.opacity = "1";

  await animateTo(farmer, { left: vw * 0.4 + "px" }, 2200, "linear");
  await tossSeed(seedToss, vw * 0.4 + 40, 160);
  await wait(200);
  await animateTo(farmer, { left: vw + 100 + "px" }, 2000, "linear");
  farmer.style.opacity = "0";
}

async function runSun() {
  const sun = document.getElementById("sun");
  const rays = document.getElementById("sun-rays");
  if (!sun || !rays) return;

  sun.style.opacity = "0";
  sun.style.transform = "translate(0, -120px) scale(0.4)";
  rays.style.opacity = "0";
  sun.style.transition = "opacity 0.8s ease, transform 1s cubic-bezier(0.34,1.4,0.64,1)";
  rays.style.transition = "opacity 0.6s ease 0.4s";

  await wait(50);
  sun.style.opacity = "1";
  sun.style.transform = "translate(0, 0) scale(1)";
  rays.style.opacity = "1";
  await wait(2200);

  sun.style.transition = "opacity 0.7s ease, transform 0.7s ease";
  rays.style.transition = "opacity 0.5s ease";
  sun.style.opacity = "0";
  sun.style.transform = "translate(30px, -40px) scale(0.5)";
  rays.style.opacity = "0";
  await wait(700);
}

async function runYourTurn() {
  const el = document.getElementById("your-turn");
  const cutscene = document.getElementById("cutscene");
  const gameLayer = document.getElementById("game-layer");
  if (!el || !cutscene || !gameLayer) return;

  el.textContent = "Your turn! \u{1F327}\uFE0F";
  el.style.opacity = "0";
  el.style.transform = "translateY(10px)";
  el.style.transition = "opacity 0.6s ease, transform 0.6s cubic-bezier(0.34,1.56,0.64,1)";

  await wait(50);
  el.style.opacity = "1";
  el.style.transform = "translateY(0)";
  await wait(1400);

  cutscene.style.transition = "opacity 0.7s ease";
  cutscene.style.opacity = "0";
  gameLayer.style.transition = "opacity 0.7s ease 0.3s";
  gameLayer.classList.remove("game-hidden");
  await wait(50);
  gameLayer.style.opacity = "1";
  await wait(700);
  cutscene.style.display = "none";
}

async function play() {
  await runFarmer();
  await wait(300);
  await runSun();
  await wait(200);
  await runYourTurn();
}

export const Cutscene = { play };
