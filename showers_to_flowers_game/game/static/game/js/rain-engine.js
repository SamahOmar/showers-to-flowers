import { RAIN_SETTINGS } from "./constants.js";
import { CloudController } from "./cloud-controller.js";
import { GrowthBar } from "./growth-bar.js";
import { PlantController } from "./plant-controller.js";

let intervalId = null;

function getRainOriginX() {
  return CloudController.getX() + RAIN_SETTINGS.DROP_ORIGIN_X;
}

function spawnSplash(x, y) {
  const container = document.getElementById("rain-container");
  if (!container) return;

  const splash = document.createElement("div");
  splash.className = "splash";
  splash.style.left = x + "px";
  splash.style.top = y + "px";
  container.appendChild(splash);
  splash.addEventListener("animationend", () => splash.remove());
}

function createDrop() {
  const container = document.getElementById("rain-container");
  const plantEl = document.getElementById("plant");
  if (!container || !plantEl) return;

  const drop = document.createElement("div");
  drop.className = "rain-drop";
  drop.setAttribute("aria-hidden", "true");
  drop.textContent = "\u{1F4A7}";

  const streamOffset = Math.random() * 16 - 8;
  let dropX = getRainOriginX() + streamOffset;
  let dropY = CloudController.getY() + RAIN_SETTINGS.DROP_ORIGIN_Y;

  drop.style.left = dropX + "px";
  drop.style.top = dropY + "px";
  container.appendChild(drop);

  function fall() {
    const targetX = getRainOriginX() + streamOffset;
    dropX += (targetX - dropX) * RAIN_SETTINGS.STREAM_FOLLOW;
    dropY += RAIN_SETTINGS.FALL_SPEED;
    drop.style.left = dropX + "px";
    drop.style.top = dropY + "px";

    if (dropY > window.innerHeight - 90) {
      const rect = plantEl.getBoundingClientRect();
      if (dropX > rect.left - 10 && dropX < rect.right + 10) {
        PlantController.water(RAIN_SETTINGS.WATER_AMOUNT);
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

function start() {
  if (intervalId !== null) return;
  intervalId = setInterval(createDrop, RAIN_SETTINGS.INTERVAL_MS);
}

function stop() {
  clearInterval(intervalId);
  intervalId = null;
}

function init() {
  start();
}

export const RainEngine = { init, start, stop };
