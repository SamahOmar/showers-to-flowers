export const INITIAL_LIVES = 3;

const state = {
  lives: INITIAL_LIVES,
  level: 1,
  status: "playing",
};

function advanceLevel() {
  state.level += 1;
  console.log("LEVEL NOW =", state.level);
  return state.level;
}

function loseLife() {
  if (state.lives <= 0) return state.lives;
  state.lives -= 1;
  if (state.lives === 0) {
    state.status = "game-over";
  }
  return state.lives;
}

// full reset, only on game over.
function resetGame() {
  state.lives = INITIAL_LIVES;
  state.level = state.getLevel();
  state.status = "playing";
}
// resets only the round, keeping level and lives intact.
function resetRound() {
  // Only reset the round-specific state
  state.status = "playing";
  // lives are handled by loseLife()
}

export const GameState = {
  advanceLevel,
  loseLife,
  resetGame,
  resetRound,
  getAttempt: () => INITIAL_LIVES - state.lives + 1,
  getLevel: () => state.level,
  getLives: () => state.lives,
  getStatus: () => state.status,
  isGameOver: () => state.status === "game-over",
};
