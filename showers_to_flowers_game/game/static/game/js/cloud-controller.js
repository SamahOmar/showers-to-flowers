const STEP = 18;
const CLOUD_WIDTH = 70;
const CLOUD_Y = 110;

let x = window.innerWidth / 2 - CLOUD_WIDTH / 2;
let active = false;
let initialized = false;

function getElement() {
  return document.getElementById("cloud");
}

function clamp(val) {
  return Math.max(0, Math.min(window.innerWidth - CLOUD_WIDTH, val));
}

function getDirection(e) {
  if (e.key === "ArrowLeft" || e.code === "ArrowLeft") return -1;
  if (e.key === "ArrowRight" || e.code === "ArrowRight") return 1;
  return 0;
}

function handleKey(e) {
  if (!active) return;
  const direction = getDirection(e);
  if (direction === 0) return;

  const el = getElement();
  if (!el) return;

  e.preventDefault();
  x = clamp(x + direction * STEP);
  el.style.left = x + "px";
}

function init() {
  const el = getElement();
  if (!el) return;

  if (!initialized) {
    initialized = true;
    window.addEventListener("keydown", handleKey, { capture: true });
  }
  el.style.left = x + "px";
}

function enable() {
  init();
  active = true;
}

function disable() {
  active = false;
}

export const CloudController = {
  init,
  enable,
  disable,
  getX: () => x,
  getY: () => CLOUD_Y,
};
