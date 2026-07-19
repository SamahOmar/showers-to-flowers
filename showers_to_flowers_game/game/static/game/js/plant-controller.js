import { GROWTH_STAGES, GLAMOUR_COLORS } from './constants.js';

export class PlantController {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.currentGrowth = 0;
        this.x = canvas.width / 2;
        this.y = canvas.height - 50; // Anchored beautifully at the bottom
    }

    // Synchronize the local engine growth state with backend data
    setGrowth(value) {
        this.currentGrowth = value;
    }

    // Draw luxury black sunglasses for our overwatered Drama Queen phase
    drawSunglasses(centerX, centerY, size) {
        this.ctx.fillStyle = GLAMOUR_COLORS.DRAMA_SHADES;

        // Left glam lens
        this.ctx.beginPath();
        this.ctx.arc(centerX - size * 0.4, centerY, size * 0.3, 0, Math.PI * 2);
        this.ctx.fill();

        // Right glam lens
        this.ctx.beginPath();
        this.ctx.arc(centerX + size * 0.4, centerY, size * 0.3, 0, Math.PI * 2);
        this.ctx.fill();

        // Elegant frame bridge connecting the lenses
        this.ctx.lineWidth = 4;
        this.ctx.strokeStyle = GLAMOUR_COLORS.DRAMA_SHADES;
        this.ctx.beginPath();
        this.ctx.moveTo(centerX - size * 0.1, centerY - size * 0.1);
        this.ctx.lineTo(centerX + size * 0.1, centerY - size * 0.1);
        this.ctx.stroke();
    }

    // Render the beautiful blooming pink Peony flower head
    drawPeony(centerX, centerY, size) {
        this.ctx.save();
        this.ctx.shadowBlur = 15;
        this.ctx.shadowColor = GLAMOUR_COLORS.NEON_PINK;
        this.ctx.fillStyle = GLAMOUR_COLORS.PASTEL_PINK;

        // Render overlapping circular petals to create a rich texture
        const petalCount = 6;
        for (let i = 0; i < petalCount; i++) {
            const angle = (i * Math.PI * 2) / petalCount;
            const petalX = centerX + Math.cos(angle) * (size * 0.4);
            const petalY = centerY + Math.sin(angle) * (size * 0.4);

            this.ctx.beginPath();
            this.ctx.arc(petalX, petalY, size * 0.5, 0, Math.PI * 2);
            this.ctx.fill();
        }

        // Luxurious golden glowing centerpiece core
        this.ctx.fillStyle = GLAMOUR_COLORS.GOLDEN_HOUR;
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, size * 0.3, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.restore();
    }

    // Main render engine pipeline managing the plant visual transitions
    draw() {
        this.ctx.save();

        if (this.currentGrowth >= GROWTH_STAGES.SEED && this.currentGrowth < GROWTH_STAGES.SPROUT) {
            // Stage 1: A sparkling neon seed embedded safely in the soil
            this.ctx.fillStyle = GLAMOUR_COLORS.NEON_PINK;
            this.ctx.shadowBlur = 10;
            this.ctx.shadowColor = GLAMOUR_COLORS.NEON_PINK;
            this.ctx.beginPath();
            this.ctx.arc(this.x, this.y, 8, 0, Math.PI * 2);
            this.ctx.fill();

        } else if (this.currentGrowth >= GROWTH_STAGES.SPROUT && this.currentGrowth < GROWTH_STAGES.BLOOM) {
            // Stage 2: A slender glowing stem rising elegantly upwards
            this.ctx.strokeStyle = '#32CD32'; // Fresh lime green accent
            this.ctx.lineWidth = 6;
            this.ctx.beginPath();
            this.ctx.moveTo(this.x, this.y);
            this.ctx.lineTo(this.x, this.y - 60);
            this.ctx.stroke();

            // Tiny budding top ready to embrace the high-shine life
            this.ctx.fillStyle = GLAMOUR_COLORS.PASTEL_PINK;
            this.ctx.beginPath();
            this.ctx.arc(this.x, this.y - 65, 12, 0, Math.PI * 2);
            this.ctx.fill();

        } else if (this.currentGrowth >= GROWTH_STAGES.BLOOM && this.currentGrowth < GROWTH_STAGES.DRAMA_QUEEN) {
            // Stage 3: The ultimate Soft Life blooming Peony phase
            this.ctx.strokeStyle = '#32CD32';
            this.ctx.lineWidth = 8;
            this.ctx.beginPath();
            this.ctx.moveTo(this.x, this.y);
            this.ctx.lineTo(this.x, this.y - 120);
            this.ctx.stroke();

            this.drawPeony(this.x, this.y - 120, 40);

        } else if (this.currentGrowth >= GROWTH_STAGES.DRAMA_QUEEN) {
            // Stage 4: High-stress overwatered state transformed into a Drama Queen
            this.ctx.strokeStyle = '#228B22'; // Darker distressed green stem
            this.ctx.lineWidth = 8;
            this.ctx.beginPath();
            this.ctx.moveTo(this.x, this.y);
            this.ctx.lineTo(this.x, this.y - 120);
            this.ctx.stroke();

            // Bloomed peony wears iconic dark sunglasses
            this.drawPeony(this.x, this.y - 120, 40);
            this.drawSunglasses(this.x, this.y - 120, 40);
        }

        this.ctx.restore();
    }
}

