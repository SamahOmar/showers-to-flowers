const CONFETTI_COLORS = ["#ff6b9d", "#ffd93d", "#6bcb77", "#4d96ff", "#ff6b6b", "#c77dff"];

export function spawnConfetti() {
  const container = document.getElementById("confetti-container");
  if (!container) return;

  for (let i = 0; i < 65; i++) {
    const piece = document.createElement("div");
    piece.className = "confetti-piece";
    piece.style.cssText = `
      left:${Math.random() * 100}vw;
      background:${CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)]};
      width:${6 + Math.random() * 8}px;
      height:${6 + Math.random() * 8}px;
      border-radius:${Math.random() > 0.5 ? "50%" : "2px"};
      animation-delay:${Math.random() * 0.6}s;
      animation-duration:${1.2 + Math.random() * 1}s;
    `;
    container.appendChild(piece);
    piece.addEventListener("animationend", () => piece.remove());
  }
}
