let cloud = document.getElementById("cloud");
let rainContainer = document.getElementById("rain-container");
let plant = document.getElementById("plant");
let growthFill = document.getElementById("growth-fill");

let x = 200;
let y = 100;

let growth = 0;

// 🌤️ move cloud
document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") x -= 15;
    if (e.key === "ArrowRight") x += 15;

    x = Math.max(0, Math.min(window.innerWidth - 60, x));

    cloud.style.left = x + "px";
});

// 🌧️ create rain drop
function createRain() {
    let drop = document.createElement("div");
    drop.classList.add("rain-drop");
    drop.innerHTML = "💧";

    let dropX = x + 20;
    let dropY = y + 40;

    drop.style.left = dropX + "px";
    drop.style.top = dropY + "px";

    rainContainer.appendChild(drop);

    let fallSpeed = 2;

    function fall() {
        dropY += fallSpeed;
        drop.style.top = dropY + "px";

        // 🌱 when reaching ground
        if (dropY > window.innerHeight - 80) {

            let plantRect = plant.getBoundingClientRect();

            // 💧 check if drop is above plant
            if (dropX > plantRect.left && dropX < plantRect.right) {
                growth += 2;
                updateGrowth();
            }

            drop.remove();
            return;
        }

        requestAnimationFrame(fall);
    }

    fall();
}

// 🌱 update plant + bar
function updateGrowth() {

    if (growth < 40) {
        plant.innerHTML = "🌱";
    }
    else if (growth < 80) {
        plant.innerHTML = "🌿";
    }
    else if (growth >= 100) {
        plant.innerHTML = "🌸";
    }

    let percent = Math.min(growth, 100);
    growthFill.style.width = percent + "%";
}

// 🌧️ continuous rain
setInterval(() => {
    createRain();
}, 200);