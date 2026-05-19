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

"use strict";

/* ─────────────────────────────────────────────
   CloudController
   Owns: x position, clamped to viewport
   Public API: getX(), getY()
───────────────────────────────────────────── */
const CloudController = (() => {
  const el = document.getElementById("cloud");
  const STEP = 15;
  const CLOUD_WIDTH = 60;
  let x = 200;
  const y = 100;

  function clamp(val) {
    return Math.max(0, Math.min(window.innerWidth - CLOUD_WIDTH, val));
  }

  function handleKey(e) {
    if (e.key === "ArrowLeft")  x = clamp(x - STEP);
    if (e.key === "ArrowRight") x = clamp(x + STEP);
    el.style.left = x + "px";
  }

  function init() {
    document.addEventListener("keydown", handleKey);
    el.style.left = x + "px";
  }

  return { init, getX: () => x, getY: () => y };
})();

/* ─────────────────────────────────────────────
   PlantController
   Owns: growth value (0–100), stage thresholds
   Bug fix: flower stage triggers at >= 80 (was only >= 100, unreachable)
   Public API: water(amount), getGrowth(), getStage()
───────────────────────────────────────────── */
const PlantController = (() => {
  const el = document.getElementById("plant");

  const STAGES = [
    { threshold: 0,  emoji: "🌱", label: "seed"   },
    { threshold: 40, emoji: "🌿", label: "sprout" },
    { threshold: 80, emoji: "🌸", label: "flower" },
  ];
  const MAX = 100;
  let growth = 0;

  function getStage() {
    for (let i = STAGES.length - 1; i >= 0; i--) {
      if (growth >= STAGES[i].threshold) return STAGES[i];
    }
    return STAGES[0];
  }

  function render() {
    el.innerHTML = getStage().emoji;
  }

  function water(amount) {
    if (growth >= MAX) return;
    growth = Math.min(MAX, growth + amount);
    render();
  }

  function init() { render(); }

  return { init, water, getGrowth: () => growth, getStage };
})();

/* ─────────────────────────────────────────────
   GrowthBar
   Owns: progress bar DOM update only
   Reads from PlantController — no own state
───────────────────────────────────────────── */
const GrowthBar = (() => {
  const fill = document.getElementById("growth-fill");

  function update() {
    const pct = Math.min(PlantController.getGrowth(), 100);
    fill.style.width = pct + "%";
    fill.setAttribute("aria-valuenow", pct);
  }

  return { update };
})();


/* ─────────────────────────────────────────────
   RainEngine
   Owns: drop creation, physics loop, hit detection
   Depends on: CloudController, PlantController, GrowthBar
───────────────────────────────────────────── */
const RainEngine = (() => {
  const container = document.getElementById("rain-container");
  const plantEl   = document.getElementById("plant");

  const INTERVAL_MS  = 200;
  const FALL_SPEED   = 2;
  const WATER_AMOUNT = 2;

  let intervalId = null;

  function createDrop() {
    const drop = document.createElement("div");
    drop.classList.add("rain-drop");
    drop.setAttribute("aria-hidden", "true");
    drop.innerHTML = "💧";

    let dropX = CloudController.getX() + 20;
    let dropY = CloudController.getY() + 40;

    drop.style.left = dropX + "px";
    drop.style.top  = dropY + "px";
    container.appendChild(drop);

    function fall() {
      dropY += FALL_SPEED;
      drop.style.top = dropY + "px";

      if (dropY > window.innerHeight - 80) {
        const rect = plantEl.getBoundingClientRect();
        if (dropX > rect.left && dropX < rect.right) {
          PlantController.water(WATER_AMOUNT);
          GrowthBar.update();
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
    intervalId = setInterval(createDrop, INTERVAL_MS);
  }

  function stop() {
    clearInterval(intervalId);
    intervalId = null;
  }

  function init() { start(); }

  return { init, start, stop };
})();


/* ─────────────────────────────────────────────
   Game — top-level orchestrator
───────────────────────────────────────────── */
const Game = (() => {
  function init() {
    CloudController.init();
    PlantController.init();
    GrowthBar.update();
    RainEngine.init();
  }
  return { init };
})();

document.addEventListener("DOMContentLoaded", () => Game.init());