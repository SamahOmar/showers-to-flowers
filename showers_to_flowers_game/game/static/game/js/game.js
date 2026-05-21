"use strict";

import { spawnAmbientClouds } from "./ambient-clouds.js";
import { CloudController } from "./cloud-controller.js";
import { Cutscene } from "./cutscene.js";
import { GrowthBar } from "./growth-bar.js";
import { PlantController } from "./plant-controller.js";
import { RainEngine } from "./rain-engine.js";

async function initGame() {
  const gameLayer = document.getElementById("game-layer");
  const cutscene = document.getElementById("cutscene");
  if (!gameLayer) return;

  if (cutscene) {
    await Cutscene.play();
  } else {
    gameLayer.classList.remove("game-hidden");
    gameLayer.style.opacity = "1";
  }

  gameLayer.focus({ preventScroll: true });
  spawnAmbientClouds();
  CloudController.init();
  CloudController.enable();
  PlantController.init();
  GrowthBar.update();
  RainEngine.init();
}

document.addEventListener("DOMContentLoaded", initGame);
