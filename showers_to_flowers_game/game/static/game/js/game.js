"use strict";
import { spawnAmbientClouds } from "./ambient-clouds.js";
import { CloudController } from "./cloud-controller.js";
import { Cutscene } from "./cutscene.js";
import { GameState } from "./game-state.js";
import { GrowthBar } from "./growth-bar.js";
import { LivesUI } from "./lives-ui.js";
import { PlantController } from "./plant-controller.js";
import { RainEngine } from "./rain-engine.js";
import { SheepController } from "./sheep-controller.js";

console.log("GAME.JS LOADED");
console.log("GameState instance =", GameState);
document.addEventListener("sheep:success", () => {
  console.log("🔥 SHEEP SUCCESS EVENT RECEIVED");
});



let bloomTimer = null;
let roundResolving = false;
let lastShownAttempt = 0;
let gamePhase = "growing"; // or "defense"



function showStatusMessage(text, cls) {
  const msg = document.getElementById("stage-message");
  if (!msg) return;
  msg.textContent = text;
  msg.className = "visible " + cls;
}

function showRoundBanner(text) {
  const banner = document.getElementById("round-banner");
  if (!banner) return;
  banner.textContent = text;
  banner.classList.add("visible");
  setTimeout(() => banner.classList.remove("visible"), 1200);
}

function showAttemptBannerIfChanged() {
  const attempt = GameState.getAttempt();
  if (attempt === lastShownAttempt) return;
  lastShownAttempt = attempt;
  showRoundBanner(`Attempt ${attempt}`);
}

function updateLevelBadge() {
  const badge = document.getElementById("level-badge");
  badge.textContent = `Level ${GameState.getLevel()}`;


}

function resetRound() {
  clearBloomTimer();
  SheepController.hide();
  PlantController.reset();
  GrowthBar.update();
  roundResolving = false;
}

function clearBloomTimer() {
  if (bloomTimer === null) return;
  clearTimeout(bloomTimer);
  bloomTimer = null;
}

function restartAttempt() {
  resetRound();

  gamePhase = "growing"; // 🔥 ensure clean state reset

  showAttemptBannerIfChanged();
  showStatusMessage("Grow the next flower.", "msg-info");

  CloudController.enable();
  RainEngine.start();
}
function startDefenseRound() {
  gamePhase = "defense";
  showStatusMessage("Sheep incoming!", "msg-warning");

  bloomTimer = setTimeout(() => {
    bloomTimer = null;
    if (!roundResolving && gamePhase === "defense") {
      SheepController.startHunt();
    }
  }, 650);
}
function handleFailure(message) {
  if (roundResolving) return;
  roundResolving = true;
  clearBloomTimer();
  SheepController.hide();

  GameState.loseLife();      // decrease lives
  LivesUI.render();
  RainEngine.stop();
  CloudController.disable();

  if (GameState.isGameOver()) {
    showStatusMessage(`${message} Game over.`, "msg-dead");
    GameState.resetGame();    // full reset only on game over
    return;
  }

  showStatusMessage(`${message} Try again!`, "msg-dead");
  showAttemptBannerIfChanged();

  // restart only the round, not full game
  setTimeout(() => restartAttempt(), 1400);
}



function handleFlowerEaten() {
  handleFailure("The sheep ate the flower.");
}

function handleOverwatered() {
  handleFailure("Too much water wilted the flower.");
}

function handleSheepScaredAway() {

  showStatusMessage(
    "Sheep scared away! Flower protected.",
    "msg-info"
  );

}

function handleBloom() {
  gamePhase = "defense";

  SheepController.hide();

  showStatusMessage("Sheep incoming!", "msg-warning");

  bloomTimer = setTimeout(() => {
    bloomTimer = null;

    if (!roundResolving && gamePhase === "defense") {
      SheepController.startHunt();
    }
  }, 650);
}

function handleSheepSuccess() {
  console.log("SHEEP SUCCESS EVENT FIRED");
GameState.advanceLevel();
  updateLevelBadge();

  showRoundBanner(`Level ${GameState.getLevel()}`);
  showStatusMessage("Sheep survived! Next one incoming...", "msg-info");

  // small delay before next sheep
  setTimeout(() => {
    if (PlantController.getStage().label === "bloom") {
      console.log("bloom and level must advanced");
      startDefenseRound(); // start a new sheep round
    }
  }, 1200);
}

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
  SheepController.setHandlers({
    onFlowerEaten: handleFlowerEaten,
    onScaredAway: handleSheepScaredAway,
  });
  PlantController.setHandlers({
    onBloom: handleBloom,
    onOverwatered: handleOverwatered,
  });
  CloudController.init();
  CloudController.enable();
  PlantController.init();
  LivesUI.render();
  updateLevelBadge();
  showAttemptBannerIfChanged();
  GrowthBar.update();
  RainEngine.init();

}
document.addEventListener("sheep:success", handleSheepSuccess);
document.addEventListener("DOMContentLoaded", initGame);
