import { RAIN_SETTINGS } from './constants.js';

export class CloudController {
    constructor(canvas) {
        this.canvas = canvas;
        this.width = 160;
        this.x = (canvas.width - this.width) / 2; // Perfectly centered at start
        this.speed = 8; // Smooth luxury movement speed
        this.keys = {};

        // Bind keyboard listeners for seamless high-shine control
        this.initEventListeners();
    }

    initEventListeners() {
        window.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
                this.keys[e.key] = true;
            }
        });

        window.addEventListener('keyup', (e) => {
            if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
                this.keys[e.key] = false;
            }
        });
    }

    // Return current position dynamic tracking pipeline
    getX() {
        this.updatePosition();
        return this.x;
    }

    // Process movements and ensure strict screen boundary caps
    updatePosition() {
        if (this.keys['ArrowLeft'] && this.x > 0) {
            this.x -= this.speed;
        }
        if (this.keys['ArrowRight'] && this.x < (this.canvas.width - this.width)) {
            this.x += this.speed;
        }
    }
}
