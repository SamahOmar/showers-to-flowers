import { GameState, INITIAL_LIVES } from "./game-state.js";

function render() {
  const el = document.getElementById("lives");
  if (!el) return;

  const lives = GameState.getLives();
  const hearts = Array.from({ length: INITIAL_LIVES }, (_, index) => {
    const cls = index < lives ? "heart full" : "heart empty";
    return `<span class="${cls}">\u2665</span>`;
  });

  el.innerHTML = hearts.join("");
  el.setAttribute("aria-label", `${lives} attempts remaining`);
}

export const LivesUI = { render };
