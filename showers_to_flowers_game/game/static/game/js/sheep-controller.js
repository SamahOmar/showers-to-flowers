import { GameState } from "./game-state.js";

console.log("GameState instance 2 =", GameState);

const SHEEP_STATE = {
  IDLE: "idle",
  HUNTING: "hunting",
  RETREATING: "retreating",
};

let state = SHEEP_STATE.IDLE;
const SHEEP_SPEED = 1.1;
const SHEEP_RETREAT_SPEED = 3.8;
const SHEEP_SIZE = 86;

let sheep = null;
let animationId = null;
let active = false;
let x = 0;
let entryX = -SHEEP_SIZE;
let onFlowerEaten = () => {};
let onScaredAway = () => {};

function getPlantCenterX() {
  const plant = document.getElementById("plant");
  if (!plant) return window.innerWidth / 2;
  const rect = plant.getBoundingClientRect();
  return rect.left + rect.width / 2;
}

function ensureSheep() {
  if (sheep) return sheep;

  sheep = document.getElementById("sheep");
  return sheep;
}

function hide() {
  state = SHEEP_STATE.IDLE;
  active = false;

  if (animationId !== null) {
    cancelAnimationFrame(animationId);
    animationId = null;
  }

  if (sheep) {
    sheep.classList.remove(
      "visible",
      "scared",
      "from-left",
      "from-right"
    );
  }
}

function faceDirection(direction) {
  if (!sheep) return;
  sheep.classList.toggle("from-right", direction < 0);
  sheep.classList.toggle("from-left", direction > 0);
}

function startHunt() {
  const el = ensureSheep();
  if (!el) return;

  const targetX = getPlantCenterX();
  const fromLeft = Math.random() < 0.5;
  x = fromLeft ? -SHEEP_SIZE : window.innerWidth + SHEEP_SIZE;
  entryX = x;

  active = true;
  state = SHEEP_STATE.HUNTING;
  el.classList.remove("scared", "from-left", "from-right");
  el.classList.add("visible", fromLeft ? "from-left" : "from-right");
  el.style.left = x + "px";

  function step() {
    if (!active) return;

    const direction = targetX > x ? 1 : -1;
    faceDirection(direction);
    x += direction * SHEEP_SPEED;
    el.style.left = x + "px";

    if (Math.abs(x - targetX) <= 30) {
      hide();
      onFlowerEaten();
      return;
    }

    animationId = requestAnimationFrame(step);
  }

  animationId = requestAnimationFrame(step);
}


function scareAway() {
  if (!active || !sheep) return false;

  state = SHEEP_STATE.RETREATING;

  cancelAnimationFrame(animationId);
  sheep.classList.add("scared");
  faceDirection(entryX > x ? 1 : -1);

  function retreat() {
    if (!active) return;

    const direction = entryX > x ? 1 : -1;
    faceDirection(direction);
    x += direction * SHEEP_RETREAT_SPEED;
    sheep.style.left = x + "px";

if (Math.abs(x - entryX) <= SHEEP_RETREAT_SPEED + 1) {
  hide();
 onScaredAway();
document.dispatchEvent(new CustomEvent("sheep:success"));
  return;
}

    animationId = requestAnimationFrame(retreat);
  }

  animationId = requestAnimationFrame(retreat);
  return true;
}

function isRainHit(x, y) {
   if (state !== SHEEP_STATE.HUNTING || !sheep) {
    return false;
  }

  const rect = sheep.getBoundingClientRect();
  return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
}

function setHandlers(handlers) {
  onFlowerEaten = handlers.onFlowerEaten || onFlowerEaten;
  onScaredAway = handlers.onScaredAway || onScaredAway;
}

export const SheepController = {
  hide,
  isRainHit,
  scareAway,
  setHandlers,
  startHunt,
};
