import { RainEngine } from './rain-engine.js';
import { PlantController } from './plant-controller.js';
import { CloudController } from './cloud-controller.js';
import { GLAMOUR_COLORS } from './constants.js';

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    // Initialize our luxury upgraded application controllers
    const rainEngine = new RainEngine(canvas);
    const plantController = new PlantController(canvas);
    const cloudController = new CloudController(canvas);

    let currentGrowth = 0;
    const growthBar = document.getElementById('growthBar');
    const growthProgress = document.getElementById('growthProgress');
    const glamPointsValue = document.getElementById('glam-points-value');
    const stageBadge = document.getElementById('stage-badge');

    // Sync initial growth from DOM attributes rendered by Django template
    if (growthBar) {
        currentGrowth = parseInt(growthBar.getAttribute('aria-valuenow')) || 0;
        plantController.setGrowth(currentGrowth);
    }

    // Mindful dynamic UI updater pipeline to avoid full screen reloads
    function updateAestheticUI(growth, glamPoints) {
        if (growthBar && growthProgress) {
            growthBar.setAttribute('aria-valuenow', growth);
            growthProgress.style.width = `${Math.min(growth, 100)}%`;
        }
        if (glamPointsValue) {
            glamPointsValue.innerText = glamPoints;
        }
        if (stageBadge) {
            if (growth < 40) stageBadge.innerText = "Seed Phase";
            else if (growth < 100) stageBadge.innerText = "Sprout Phase";
            else if (growth < 110) stageBadge.innerText = "Bloom Unlocked 🌸";
            else stageBadge.innerText = "Drama Queen 🕶️";
        }
    }

    // Async engine to broadcast soft life progress directly to Django DB layers
    function saveProgressToDB(growthIncrement) {
        // Simple async telemetry pipeline keeping backend and frontend coupled
        fetch('#', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]')?.value || ''
            },
            body: JSON.stringify({ increment: growthIncrement })
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                updateAestheticUI(data.current_growth, data.glam_points);
            }
        }).catch(() => {
            // Fallback soft validation logic for smooth standalone client experience
            currentGrowth = Math.min(currentGrowth + growthIncrement, 120);
            plantController.setGrowth(currentGrowth);
            const calculatedGlam = Math.floor(currentGrowth * 1.5);
            updateAestheticUI(currentGrowth, calculatedGlam);
        });
    }

    // Custom pipeline to render our glorious sparkling pink cloud vector
    function drawLuxuryCloud(x, width) {
        ctx.save();
        ctx.fillStyle = GLAMOUR_COLORS.PASTEL_PINK;
        ctx.shadowBlur = 20;
        ctx.shadowColor = GLAMOUR_COLORS.NEON_PINK;

        ctx.beginPath();
        ctx.arc(x + width * 0.25, 70, 35, 0, Math.PI * 2);
        ctx.arc(x + width * 0.5, 55, 45, 0, Math.PI * 2);
        ctx.arc(x + width * 0.75, 70, 35, 0, Math.PI * 2);
        ctx.rect(x + width * 0.25, 50, width * 0.5, 55);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }

    // 🌊 Infinite High-Shine Animation Loop Pipeline
    function gameLoop() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const cloudX = cloudController.getX ? cloudController.getX() : cloudController.x;
        const cloudWidth = cloudController.width || 160;

        // Dynamic plant head calculation for accurate collision bounds
        const plantTopY = plantController.currentGrowth >= 40 ? plantController.y - 120 : plantController.y - 10;

        rainEngine.update(cloudX, cloudWidth, plantTopY);

        // Core interactive collision handler between glitter drops and the plant target
        rainEngine.particles.forEach((drop, index) => {
            const plantX = plantController.x;
            if (drop.y >= plantTopY - 10 && Math.abs(drop.x - plantX) < 40) {
                rainEngine.particles.splice(index, 1);
                saveProgressToDB(1); // Increment growth and trigger high-shine UI feedback
            }
        });

        // Repaint all aesthetic layout vectors onto HTML5 canvas framework
        drawLuxuryCloud(cloudX, cloudWidth);
        rainEngine.draw();
        plantController.draw();

        requestAnimationFrame(gameLoop);
    }

    gameLoop();
});
