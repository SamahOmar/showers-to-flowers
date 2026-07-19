import { RAIN_SETTINGS, GLAMOUR_COLORS } from './constants.js';

export class RainEngine {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
    }

    // Initialize or generate sparkling magic rain particles
    createRaindrop(cloudX, cloudWidth) {
        if (this.particles.length < RAIN_SETTINGS.MAX_DROPS) {
            this.particles.push({
                x: cloudX + Math.random() * cloudWidth,
                y: 120, // Starting right below our pink cloud
                speed: Math.random() * (RAIN_SETTINGS.DROP_SPEED_MAX - RAIN_SETTINGS.DROP_SPEED_MIN) + RAIN_SETTINGS.DROP_SPEED_MIN,
                size: Math.random() * 3 + 2,
                glowColor: Math.random() > 0.5 ? GLAMOUR_COLORS.NEON_PINK : GLAMOUR_COLORS.PASTEL_PINK
            });
        }
    }

    // Render the glitter stars instead of standard lines
    draw() {
        this.particles.forEach((drop) => {
            this.ctx.save();
            this.ctx.fillStyle = drop.glowColor;

            // Adding high-shine neon reflections to each magic drop
            this.ctx.shadowBlur = RAIN_SETTINGS.GLITTER_GLOW_RADIUS;
            this.ctx.shadowColor = GLAMOUR_COLORS.NEON_PINK;

            // Drawing a beautiful small diamond/star vector shape
            this.ctx.beginPath();
            this.ctx.moveTo(drop.x, drop.y - drop.size);
            this.ctx.lineTo(drop.x + drop.size, drop.y);
            this.ctx.lineTo(drop.x, drop.y + drop.size);
            this.ctx.lineTo(drop.x - drop.size, drop.y);
            this.ctx.closePath();
            this.ctx.fill();
            this.ctx.restore();
        });
    }

    // Handle updates and screen boundary checks
    update(cloudX, cloudWidth, plantTopY) {
        this.createRaindrop(cloudX, cloudWidth);

        for (let i = this.particles.length - 1; i >= 0; i--) {
            let drop = this.particles[i];
            drop.y += drop.speed;

            // Check collision with the gorgeous blooming plant
            if (drop.y >= plantTopY) {
                this.particles.splice(i, 1);
            } else if (drop.y > this.canvas.height) {
                this.particles.splice(i, 1);
            }
        }
    }
}
