import { GROWTH_LABELS } from "./constants.js";
import { PlantController } from "./plant-controller.js";

function update() {
  const fill = document.getElementById("growth-fill");
  const label = document.getElementById("growth-label");
  if (!fill || !label) return;

  const growth = PlantController.getGrowth();
  const pct = Math.min(growth, 100);
  const stage = PlantController.getStage();

  fill.style.width = pct + "%";
  fill.setAttribute("aria-valuenow", pct);
  label.textContent = GROWTH_LABELS[stage.label] || "";
  fill.classList.toggle("fill-bloom", growth >= 100 && growth < 110);
  fill.classList.toggle("fill-dead", growth >= 110);
}

export const GrowthBar = { update };
