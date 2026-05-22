// src/Finger.ts
import { FARBEN_PALETTE } from './utils.js';
export class FingerPicker {
    constructor(canvasId, onStatusUpdate) {
        this.activeTouches = new Map();
        this.isSelecting = false;
        this.winnerId = null;
        this.countdownTimer = null;
        this.timerStartTime = 0;
        this.pulseAngle = 0;
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext("2d");
        this.onStatusUpdate = onStatusUpdate;
        this.setupTouchListeners();
        // === NEU: GRÖSSE AN SMARTPHONE ANPASSEN ===
        this.resizeCanvas();
        window.addEventListener("resize", () => this.resizeCanvas());
    }
    // Passt das Zeichenbrett dynamisch an die echte Bildschirmgröße des Handys an
    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.draw();
    }
    setupTouchListeners() {
        this.canvas.addEventListener("touchstart", (e) => this.handleTouchStart(e));
        this.canvas.addEventListener("touchmove", (e) => this.handleTouchMove(e));
        this.canvas.addEventListener("touchend", (e) => this.handleTouchEnd(e));
        this.canvas.addEventListener("touchcancel", (e) => this.handleTouchEnd(e));
    }
    handleTouchStart(e) {
        e.preventDefault();
        if (this.isSelecting && this.winnerId !== null && this.activeTouches.size === 0) {
            this.reset();
        }
        if (this.isSelecting)
            return;
        for (let i = 0; i < e.changedTouches.length; i++) {
            const touch = e.changedTouches[i];
            const rect = this.canvas.getBoundingClientRect();
            // Da das Canvas jetzt Fullscreen ist, stimmen die Touch-Koordinaten perfekt überein
            const x = touch.clientX - rect.left;
            const y = touch.clientY - rect.top;
            const color = FARBEN_PALETTE[touch.identifier % FARBEN_PALETTE.length];
            this.activeTouches.set(touch.identifier, { x, y, color });
        }
        this.checkSelectionTimer();
        this.draw();
    }
    handleTouchMove(e) {
        e.preventDefault();
        if (this.isSelecting)
            return;
        for (let i = 0; i < e.changedTouches.length; i++) {
            const touch = e.changedTouches[i];
            const rect = this.canvas.getBoundingClientRect();
            const x = touch.clientX - rect.left;
            const y = touch.clientY - rect.top;
            const existing = this.activeTouches.get(touch.identifier);
            if (existing) {
                existing.x = x;
                existing.y = y;
            }
        }
        this.draw();
    }
    handleTouchEnd(e) {
        e.preventDefault();
        for (let i = 0; i < e.changedTouches.length; i++) {
            const touch = e.changedTouches[i];
            this.activeTouches.delete(touch.identifier);
        }
        if (this.isSelecting && this.activeTouches.size === 0) {
            this.reset();
            return;
        }
        if (this.isSelecting)
            return;
        this.checkSelectionTimer();
        this.draw();
    }
    checkSelectionTimer() {
        if (this.activeTouches.size >= 2 && !this.countdownTimer && !this.isSelecting) {
            this.onStatusUpdate("⏱️ Auswahl startet...");
            this.timerStartTime = Date.now();
            this.countdownTimer = window.setTimeout(() => {
                this.pickWinner();
            }, 2000);
            this.animateProgress();
        }
        else if (this.activeTouches.size < 2 && this.countdownTimer) {
            clearTimeout(this.countdownTimer);
            this.countdownTimer = null;
            this.timerStartTime = 0;
            this.onStatusUpdate("Warte auf Finger...");
        }
    }
    animateProgress() {
        if (this.countdownTimer && !this.isSelecting) {
            this.draw();
            requestAnimationFrame(() => this.animateProgress());
        }
    }
    pickWinner() {
        if (this.activeTouches.size < 2)
            return;
        this.isSelecting = true;
        this.countdownTimer = null;
        this.timerStartTime = 0;
        const keys = Array.from(this.activeTouches.keys());
        const randomKey = keys[Math.floor(Math.random() * keys.length)];
        this.winnerId = randomKey;
        if (navigator.vibrate) {
            navigator.vibrate([100, 50, 150]);
        }
        this.onStatusUpdate("👑 Gewinner! (Hebe alle Finger an)");
        this.animateWinner();
    }
    animateWinner() {
        if (this.winnerId !== null && this.activeTouches.has(this.winnerId)) {
            this.pulseAngle += 0.15;
            this.draw();
            requestAnimationFrame(() => this.animateWinner());
        }
    }
    reset() {
        this.isSelecting = false;
        this.winnerId = null;
        this.timerStartTime = 0;
        if (this.countdownTimer) {
            clearTimeout(this.countdownTimer);
            this.countdownTimer = null;
        }
        this.activeTouches.clear();
        this.onStatusUpdate("Warte auf Finger...");
        this.draw();
    }
    // =========================================================================
    // ZEICHEN-LOGIK (Echtes Orange im Hintergrund & gelb-weiße Finger)
    // =========================================================================
    draw() {
        const w = this.canvas.width;
        const h = this.canvas.height;
        // Canvas säubern. Wir zeichnen KEINEN grauen Kreis mehr!
        // Der Hintergrund ist jetzt das wunderschöne, unendliche CSS-Orange des Screens.
        this.ctx.clearRect(0, 0, w, h);
        // Gewinner-Modus aktiv
        if (this.isSelecting && this.winnerId !== null) {
            this.activeTouches.forEach((touch, id) => {
                if (id === this.winnerId) {
                    const pulseRadius = 52 + Math.sin(this.pulseAngle) * 6;
                    // 1. Gewaltiger, pulsierender Leuchteffekt in Weiß für den Gewinner
                    this.ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
                    this.ctx.shadowColor = "#ffffff";
                    this.ctx.shadowBlur = 30;
                    this.ctx.beginPath();
                    this.ctx.arc(touch.x, touch.y, pulseRadius + 15, 0, 2 * Math.PI);
                    this.ctx.fill();
                    this.ctx.shadowBlur = 0; // Schatten direkt wieder aus
                    // 2. Dicker, weißer Gewinner-Ring
                    this.ctx.strokeStyle = "#ffffff";
                    this.ctx.lineWidth = 10;
                    this.ctx.beginPath();
                    this.ctx.arc(touch.x, touch.y, pulseRadius, 0, 2 * Math.PI);
                    this.ctx.stroke();
                    // 3. Goldgelbes Gewinner-Innere
                    this.ctx.fillStyle = "#FFD700";
                    this.ctx.beginPath();
                    this.ctx.arc(touch.x, touch.y, pulseRadius - 5, 0, 2 * Math.PI);
                    this.ctx.fill();
                }
                else {
                    // Verlierer-Finger werden abgedunkelt im Orange ausgeblendet
                    this.ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
                    this.ctx.beginPath();
                    this.ctx.arc(touch.x, touch.y, 35, 0, 2 * Math.PI);
                    this.ctx.fill();
                }
            });
        }
        // Normaler Modus (Finger liegen auf dem Feld)
        else {
            const jetzt = Date.now();
            const progress = this.timerStartTime > 0 ? Math.min((jetzt - this.timerStartTime) / 2000, 1.0) : 0;
            this.activeTouches.forEach((touch) => {
                // === DEINE NEUE GELB-WEISSE WUNSCH-ZEICHNUNG ===
                // 1. Sanfte, weiße Leucht-Aura im Hintergrund
                this.ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
                this.ctx.beginPath();
                this.ctx.arc(touch.x, touch.y, 55, 0, 2 * Math.PI);
                this.ctx.fill();
                // 2. Dicker, deutlicher WEISSER Ring
                this.ctx.strokeStyle = "#ffffff";
                this.ctx.lineWidth = 8; // Knallhart gezogener 8px dicker Ring!
                this.ctx.beginPath();
                this.ctx.arc(touch.x, touch.y, 40, 0, 2 * Math.PI);
                this.ctx.stroke();
                // 3. Sattes, strahlendes GELB im Inneren
                this.ctx.fillStyle = "#FFEA00"; // Reines, helles Goldgelb
                this.ctx.beginPath();
                this.ctx.arc(touch.x, touch.y, 36, 0, 2 * Math.PI);
                this.ctx.fill();
                // 4. ANIMIERTER WEISSER LADEKREIS (Fortschritt der 2s Auswahl)
                if (progress > 0) {
                    this.ctx.strokeStyle = "#ffffff";
                    this.ctx.lineWidth = 5;
                    this.ctx.beginPath();
                    this.ctx.arc(touch.x, touch.y, 48, -Math.PI / 2, -Math.PI / 2 + progress * 2 * Math.PI);
                    this.ctx.stroke();
                }
            });
        }
    }
}
