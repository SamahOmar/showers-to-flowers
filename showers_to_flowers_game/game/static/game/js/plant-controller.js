import { GROWTH_THRESHOLDS, PLANT_STAGES } from "./constants.js";
import { spawnConfetti } from "./confetti.js";

let growth = 0;
let currentLabel = "seed";
let onBloom = () => {};
let onOverwatered = () => {};

function getElement() {
  return document.getElementById("plant");
}

function getStage() {
  for (let i = PLANT_STAGES.length - 1; i >= 0; i--) {
    if (growth >= PLANT_STAGES[i].threshold) return PLANT_STAGES[i];
  }
  return PLANT_STAGES[0];
}

function showMessage(text, cls) {
  const msg = document.getElementById("stage-message");
  if (!msg) return;
  msg.textContent = text;
  msg.className = "visible " + cls;
}

function fireBloom() {
  showMessage("\u{1F338} Beautiful! You grew a flower!", "msg-bloom");
  spawnConfetti();
  onBloom();
}

function fireOverwatered() {
  showMessage("\u{1F4A6} Too much water... it wilted.", "msg-dead");
  const bar = document.getElementById("growth-bar");
  if (!bar) return;
  bar.classList.add("shake");
  bar.addEventListener("animationend", () => bar.classList.remove("shake"), { once: true });
  onOverwatered();
}

function render() {
  const el = getElement();
  if (!el) return;

  const stage = getStage();
  if (stage.label === currentLabel) return;

  currentLabel = stage.label;
  el.textContent = stage.emoji;
  PLANT_STAGES.forEach(s => el.classList.remove(s.cls));
  el.classList.add(stage.cls);

  if (stage.label === "bloom") fireBloom();
  if (stage.label === "overwatered") fireOverwatered();
}

function water(amount) {
  if (growth >= GROWTH_THRESHOLDS.MAX) return;
  growth = Math.min(GROWTH_THRESHOLDS.MAX, growth + amount);
  render();
}

function init() {
  render();
}

function reset() {
  const el = getElement();
  growth = 0;
  currentLabel = "seed";
  if (!el) return;
  el.textContent = "\u{1F331}";
  PLANT_STAGES.forEach(s => el.classList.remove(s.cls));
  el.classList.add("stage-seed");
}

function setHandlers(handlers) {
  onBloom = handlers.onBloom || onBloom;
  onOverwatered = handlers.onOverwatered || onOverwatered;
}

export const PlantController = {
  init,
  reset,
  setHandlers,
  water,
  getGrowth: () => growth,
  getStage,
  isGameOver: () => growth >= GROWTH_THRESHOLDS.OVERWATERED,
};
