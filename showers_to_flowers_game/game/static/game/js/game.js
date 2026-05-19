/**
 * game.js — Showers to Flowers
 * Refactored: single-responsibility modules, no globals, bug-fixed growth logic
 *
 * Module map:
 *   CloudController  — input + position state
 *   RainEngine       — drop lifecycle + physics
 *   PlantController  — growth state + stage rendering
 *   GrowthBar        — UI-only, reads from PlantController
 *   Game             — orchestrator (wires modules, owns the loop)
 */

/**
 * game.js — Showers to Flowers v3
 *
 * Flow:
 *   Cutscene → Game
 *
 * Cutscene sequence:
 *   1. Farmer walks L→R, tosses seed mid-screen, seed bounces, farmer exits
 *   2. Sun rises top-right, rays spin, sun warms then fades
 *   3. "Your turn! 🌧️" fades in → game starts
 *
 * Growth stages:
 *   0–39   🌱 seed
 *   40–79  🌿 sprout
 *   80–99  🌸 flower (almost full — anticipation)
 *   100    🌸 bloom  (bar full — confetti)
 *   110+   🥀 overwatered
 */

"use strict";

/* ═══════════════════════════════════════════
   CUTSCENE
═══════════════════════════════════════════ */
const Cutscene = (() => {

  // Simple promise-based delay helper
  const wait = ms => new Promise(res => setTimeout(res, ms));

  async function play() {
    await runFarmer();
    await wait(300);
    await runSun();
    await wait(200);
    await runYourTurn();
  }

  /* ── Step 1: Farmer walks across, tosses seed ── */
  async function runFarmer() {
    const farmer   = document.getElementById("farmer");
    const seedToss = document.getElementById("seed-toss");
    const vw       = window.innerWidth;

    // Farmer starts just off-screen left
    farmer.style.left = "-90px";
    farmer.style.opacity = "1";

    // Walk to ~40% of screen (toss point)
    await animateTo(farmer, { left: vw * 0.4 + "px" }, 2200, "linear");

    // Toss seed
    await tossSeed(seedToss, vw * 0.4 + 40, 160);

    await wait(200);

    // Continue walking off right edge
    await animateTo(farmer, { left: vw + 100 + "px" }, 2000, "linear");
    farmer.style.opacity = "0";
  }

  /* Seed arc + bounce physics */
  async function tossSeed(el, fromX, fromY) {
    el.textContent = "🌰";
    el.style.opacity  = "1";
    el.style.left     = fromX + "px";
    el.style.top      = fromY + "px";
    el.style.fontSize = "24px";

    const groundY    = window.innerHeight - 95; // just above ground
    const targetX    = fromX + 160 + Math.random() * 80; // random landing x
    const peakY      = fromY - 110;
    const duration   = 700;
    const start      = performance.now();

    await new Promise(resolve => {
      function frame(now) {
        const t  = Math.min((now - start) / duration, 1);
        // Parabolic arc: x linear, y quadratic
        const cx = fromX + (targetX - fromX) * t;
        const cy = (1 - t) * (1 - t) * fromY
                 + 2 * (1 - t) * t * peakY
                 + t * t * groundY;
        el.style.left = cx + "px";
        el.style.top  = cy + "px";
        el.style.transform = `rotate(${t * 540}deg)`;
        if (t < 1) { requestAnimationFrame(frame); }
        else       { resolve(); }
      }
      requestAnimationFrame(frame);
    });

    // Two small bounces
    await seedBounce(el, targetX, groundY, 18);
    await seedBounce(el, targetX + 12, groundY, 7);

    // Seed settles and becomes the plant anchor — store position for plant
    window._seedX = targetX;

    // Seed shrinks into ground
    el.style.transition = "opacity 0.5s, transform 0.5s";
    el.style.opacity    = "0";
    el.style.transform  = "scale(0.3) rotate(720deg)";
    await wait(500);

    // Move the plant to this x position
    const plant = document.getElementById("plant");
    plant.style.left      = targetX + "px";
    plant.style.transform = "translateX(-50%)";
  }

  async function seedBounce(el, x, groundY, height) {
    const duration = height * 18;
    const start    = performance.now();
    const startY   = groundY;
    await new Promise(resolve => {
      function frame(now) {
        const t  = Math.min((now - start) / duration, 1);
        const cy = startY - Math.sin(t * Math.PI) * height;
        el.style.top  = cy + "px";
        el.style.left = x + "px";
        if (t < 1) { requestAnimationFrame(frame); }
        else        { resolve(); }
      }
      requestAnimationFrame(frame);
    });
  }

  /* ── Step 2: Sun rises, glows, fades ── */
  async function runSun() {
    const sun     = document.getElementById("sun");
    const rays    = document.getElementById("sun-rays");

    // Rise in from top-right
    sun.style.opacity   = "0";
    sun.style.transform = "translate(0, -120px) scale(0.4)";
    rays.style.opacity  = "0";

    sun.style.transition  = "opacity 0.8s ease, transform 1s cubic-bezier(0.34,1.4,0.64,1)";
    rays.style.transition = "opacity 0.6s ease 0.4s";

    await wait(50); // let browser register initial state
    sun.style.opacity   = "1";
    sun.style.transform = "translate(0, 0) scale(1)";
    rays.style.opacity  = "1";

    await wait(2200); // sun shines

    // Fade out
    sun.style.transition  = "opacity 0.7s ease, transform 0.7s ease";
    rays.style.transition = "opacity 0.5s ease";
    sun.style.opacity     = "0";
    sun.style.transform   = "translate(30px, -40px) scale(0.5)";
    rays.style.opacity    = "0";
    await wait(700);
  }

  /* ── Step 3: "Your turn" message ── */
  async function runYourTurn() {
    const el = document.getElementById("your-turn");
    el.textContent = "Your turn! 🌧️";
    el.style.opacity   = "0";
    el.style.transform = "translateY(10px)";
    el.style.transition = "opacity 0.6s ease, transform 0.6s cubic-bezier(0.34,1.56,0.64,1)";

    await wait(50);
    el.style.opacity   = "1";
    el.style.transform = "translateY(0)";
    await wait(1400);

    // Fade out cutscene, reveal game
    const cutscene   = document.getElementById("cutscene");
    const gameLayer  = document.getElementById("game-layer");

    cutscene.style.transition  = "opacity 0.7s ease";
    cutscene.style.opacity     = "0";
    gameLayer.style.transition = "opacity 0.7s ease 0.3s";
    gameLayer.classList.remove("game-hidden");
    await wait(50);
    gameLayer.style.opacity    = "1";
    await wait(700);

    cutscene.style.display = "none";
  }

  /* Generic CSS-property animator using rAF */
  function animateTo(el, props, duration, easing = "ease") {
    return new Promise(resolve => {
      Object.keys(props).forEach(k => {
        el.style.transition = `${k} ${duration}ms ${easing}`;
        el.style[k] = props[k];
      });
      setTimeout(resolve, duration);
    });
  }

  return { play };
})();


/* ═══════════════════════════════════════════
   CloudController
═══════════════════════════════════════════ */
const CloudController = (() => {
  const el = document.getElementById("cloud");
  const STEP = 18;
  const CLOUD_WIDTH = 70;
  let x = window.innerWidth / 2 - 35;
  const y = 110;
  let active = false;

  function clamp(val) {
    return Math.max(0, Math.min(window.innerWidth - CLOUD_WIDTH, val));
  }

  function handleKey(e) {
    if (!active) return;
    if (e.key === "ArrowLeft")  { e.preventDefault(); x = clamp(x - STEP); }
    if (e.key === "ArrowRight") { e.preventDefault(); x = clamp(x + STEP); }
    el.style.left = x + "px";
  }

  function init() {
    document.addEventListener("keydown", handleKey);
    el.style.left = x + "px";
  }

  function enable()  { active = true;  }
  function disable() { active = false; }

  return { init, enable, disable, getX: () => x, getY: () => y };
})();


/* ═══════════════════════════════════════════
   PlantController
═══════════════════════════════════════════ */
const PlantController = (() => {
  const el = document.getElementById("plant");

  const STAGES = [
    { threshold: 0,   emoji: "🌱", label: "seed",        cls: "stage-seed"    },
    { threshold: 40,  emoji: "🌿", label: "sprout",      cls: "stage-sprout"  },
    { threshold: 80,  emoji: "🌸", label: "flower",      cls: "stage-flower"  },
    { threshold: 100, emoji: "🌸", label: "bloom",       cls: "stage-bloom"   },
    { threshold: 110, emoji: "🥀", label: "overwatered", cls: "stage-dead"    },
  ];

  let growth = 0;
  let currentLabel = "seed";

  function getStage() {
    for (let i = STAGES.length - 1; i >= 0; i--) {
      if (growth >= STAGES[i].threshold) return STAGES[i];
    }
    return STAGES[0];
  }

  function render() {
    const stage = getStage();
    if (stage.label === currentLabel) return;
    currentLabel = stage.label;
    el.innerHTML = stage.emoji;
    STAGES.forEach(s => el.classList.remove(s.cls));
    el.classList.add(stage.cls);
    if (stage.label === "bloom")       fireBloom();
    if (stage.label === "overwatered") fireOverwatered();
  }

  function fireBloom() {
    showMessage("🌸 Beautiful! You grew a flower!", "msg-bloom");
    spawnConfetti();
  }

  function fireOverwatered() {
    showMessage("💦 Too much water... it wilted.", "msg-dead");
    const bar = document.getElementById("growth-bar");
    bar.classList.add("shake");
    bar.addEventListener("animationend", () => bar.classList.remove("shake"), { once: true });
  }

  function showMessage(text, cls) {
    const msg = document.getElementById("stage-message");
    msg.textContent = text;
    msg.className = "visible " + cls;
  }

  function water(amount) {
    if (growth >= 120) return;
    growth = Math.min(120, growth + amount);
    render();
  }

  function init() { render(); }

  return { init, water, getGrowth: () => growth, getStage, isGameOver: () => growth >= 110 };
})();


/* ═══════════════════════════════════════════
   GrowthBar
═══════════════════════════════════════════ */
const GrowthBar = (() => {
  const fill  = document.getElementById("growth-fill");
  const label = document.getElementById("growth-label");

  const LABELS = {
    seed:        "🌱 Seed",
    sprout:      "🌿 Sprout",
    flower:      "🌸 Growing…",
    bloom:       "🌸 Flower!",
    overwatered: "🥀 Overwatered",
  };

  function update() {
    const g   = PlantController.getGrowth();
    const pct = Math.min(g, 100);
    fill.style.width = pct + "%";
    fill.setAttribute("aria-valuenow", pct);
    label.textContent = LABELS[PlantController.getStage().label] || "";
    fill.classList.toggle("fill-bloom", g >= 100 && g < 110);
    fill.classList.toggle("fill-dead",  g >= 110);
  }

  return { update };
})();


/* ═══════════════════════════════════════════
   Confetti
═══════════════════════════════════════════ */
function spawnConfetti() {
  const colors    = ["#ff6b9d","#ffd93d","#6bcb77","#4d96ff","#ff6b6b","#c77dff"];
  const container = document.getElementById("confetti-container");
  for (let i = 0; i < 65; i++) {
    const p = document.createElement("div");
    p.className = "confetti-piece";
    p.style.cssText = `
      left:${Math.random()*100}vw;
      background:${colors[Math.floor(Math.random()*colors.length)]};
      width:${6+Math.random()*8}px;
      height:${6+Math.random()*8}px;
      border-radius:${Math.random()>0.5?"50%":"2px"};
      animation-delay:${Math.random()*0.6}s;
      animation-duration:${1.2+Math.random()*1}s;
    `;
    container.appendChild(p);
    p.addEventListener("animationend", () => p.remove());
  }
}


/* ═══════════════════════════════════════════
   RainEngine
═══════════════════════════════════════════ */
const RainEngine = (() => {
  const container = document.getElementById("rain-container");
  const plantEl   = document.getElementById("plant");

  const INTERVAL_MS  = 180;
  const FALL_SPEED   = 3;
  const WATER_AMOUNT = 2;
  let intervalId     = null;

  function createDrop() {
    const drop = document.createElement("div");
    drop.className = "rain-drop";
    drop.setAttribute("aria-hidden", "true");
    drop.textContent = "💧";

    let dropX = CloudController.getX() + 22;
    let dropY = CloudController.getY() + 48;

    drop.style.left = dropX + "px";
    drop.style.top  = dropY + "px";
    container.appendChild(drop);

    function fall() {
      dropY += FALL_SPEED;
      drop.style.top = dropY + "px";

      if (dropY > window.innerHeight - 90) {
        const rect = plantEl.getBoundingClientRect();
        if (dropX > rect.left - 10 && dropX < rect.right + 10) {
          PlantController.water(WATER_AMOUNT);
          GrowthBar.update();
          spawnSplash(dropX, window.innerHeight - 92);
        }
        drop.remove();
        return;
      }
      requestAnimationFrame(fall);
    }
    fall();
  }

  function spawnSplash(x, y) {
    const s = document.createElement("div");
    s.className   = "splash";
    s.style.left  = x + "px";
    s.style.top   = y + "px";
    container.appendChild(s);
    s.addEventListener("animationend", () => s.remove());
  }

  function start() {
    if (intervalId !== null) return;
    intervalId = setInterval(createDrop, INTERVAL_MS);
  }

  function stop() {
    clearInterval(intervalId);
    intervalId = null;
  }

  function init() { start(); }

  return { init, start, stop };
})();


/* ═══════════════════════════════════════════
   Ambient clouds
═══════════════════════════════════════════ */
function spawnAmbientClouds() {
  const sky    = document.getElementById("sky-clouds");
  const emojis = ["☁️","⛅","🌤️"];
  for (let i = 0; i < 4; i++) {
    const c   = document.createElement("div");
    c.className = "ambient-cloud";
    c.textContent = emojis[i % emojis.length];
    const dur   = 28 + Math.random() * 20;
    const delay = -(Math.random() * dur);
    c.style.cssText = `
      top:${20 + Math.random()*120}px;
      font-size:${32 + Math.random()*28}px;
      animation-duration:${dur}s;
      animation-delay:${delay}s;
      opacity:${0.3 + Math.random()*0.25};
    `;
    sky.appendChild(c);
  }
}


/* ═══════════════════════════════════════════
   Game — orchestrator
═══════════════════════════════════════════ */
const Game = (() => {
  async function init() {
    // Run cutscene first — game controls disabled during it
    await Cutscene.play();

    // Boot game
    spawnAmbientClouds();
    CloudController.init();
    CloudController.enable();
    PlantController.init();
    GrowthBar.update();
    RainEngine.init();
  }
  return { init };
})();

document.addEventListener("DOMContentLoaded", () => Game.init());