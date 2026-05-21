const AMBIENT_CLOUDS = ["\u2601\uFE0F", "\u26C5", "\u{1F324}\uFE0F"];

export function spawnAmbientClouds() {
  const sky = document.getElementById("sky-clouds");
  if (!sky) return;

  for (let i = 0; i < 4; i++) {
    const cloud = document.createElement("div");
    cloud.className = "ambient-cloud";
    cloud.textContent = AMBIENT_CLOUDS[i % AMBIENT_CLOUDS.length];

    const duration = 28 + Math.random() * 20;
    const delay = -(Math.random() * duration);
    cloud.style.cssText = `
      top:${20 + Math.random() * 120}px;
      font-size:${32 + Math.random() * 28}px;
      animation-duration:${duration}s;
      animation-delay:${delay}s;
      opacity:${0.3 + Math.random() * 0.25};
    `;
    sky.appendChild(cloud);
  }
}
