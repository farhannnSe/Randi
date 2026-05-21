// src/Finger.ts
import { FARBEN_PALETTE } from './utils.js';
export class FingerPicker {
    constructor(canvasId, onStatusUpdate) {
        this.activeTouches = new Map();
        this.isSelecting = false;
        this.winnerId = null;
        this.countdownTimer = null;
        this.timerStartTime = 0; // Merkt sich den Startpunkt der Auswahl für den Ladebalken
        this.pulseAngle = 0;
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext("2d");
        this.onStatusUpdate = onStatusUpdate;
        this.setupTouchListeners();
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
        // AUTO-RESET: Wenn bereits ein Gewinner feststand, alle Finger weggenommen wurden,
        // und jetzt wieder neue Finger aufgesetzt werden -> Reset!
        if (this.isSelecting && this.winnerId !== null && this.activeTouches.size === 0) {
            this.reset();
        }
        if (this.isSelecting)
            return;
        for (let i = 0; i < e.changedTouches.length; i++) {
            const touch = e.changedTouches[i];
            const rect = this.canvas.getBoundingClientRect();
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
        // === NEU: AUTOMATISCHER RESET BEIM ANHEBEN ALLER FINGER ===
        // Wenn ein Gewinner ausgewählt ist und ALLE Spieler ihre Finger wegnehmen:
        if (this.isSelecting && this.activeTouches.size === 0) {
            this.reset(); // Zurücksetzen für eine neue Runde!
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
            this.timerStartTime = Date.now(); // Startzeit merken!
            this.countdownTimer = window.setTimeout(() => {
                this.pickWinner();
            }, 2000);
            this.animateProgress(); // Startet den flüssigen Ladekreis-Zeichner
        }
        else if (this.activeTouches.size < 2 && this.countdownTimer) {
            clearTimeout(this.countdownTimer);
            this.countdownTimer = null;
            this.timerStartTime = 0;
            this.onStatusUpdate("Warte auf Finger...");
        }
    }
    // Schleife, die während der 2 Sekunden Wartezeit den Ladekreis um die Finger animiert
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
        this.onStatusUpdate("👑 Gewinner! (Hebe alle Finger für neue Runde)");
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
    draw() {
        const w = this.canvas.width;
        const h = this.canvas.height;
        this.ctx.clearRect(0, 0, w, h);
        // Spielfeld
        this.ctx.fillStyle = "#edf2f7";
        this.ctx.beginPath();
        this.ctx.arc(w / 2, h / 2, w / 2 - 10, 0, 2 * Math.PI);
        this.ctx.fill();
        // Gewinner-Modus
        if (this.isSelecting && this.winnerId !== null) {
            this.activeTouches.forEach((touch, id) => {
                if (id === this.winnerId) {
                    const pulseRadius = 50 + Math.sin(this.pulseAngle) * 6;
                    // Schicker, pulsierender Leucht-Effekt um den Gewinner-Finger
                    this.ctx.fillStyle = touch.color;
                    this.ctx.shadowColor = touch.color;
                    this.ctx.shadowBlur = 20;
                    this.ctx.beginPath();
                    this.ctx.arc(touch.x, touch.y, pulseRadius, 0, 2 * Math.PI);
                    this.ctx.fill();
                    // Schatten zurücksetzen für andere Elemente
                    this.ctx.shadowBlur = 0;
                    this.ctx.strokeStyle = "#FFD700";
                    this.ctx.lineWidth = 6;
                    this.ctx.stroke();
                }
                else {
                    // Verlierer ausgrauen
                    this.ctx.fillStyle = "rgba(113, 128, 150, 0.15)";
                    this.ctx.beginPath();
                    this.ctx.arc(touch.x, touch.y, 40, 0, 2 * Math.PI);
                    this.ctx.fill();
                }
            });
        }
        // Normalmodus (Finger liegen auf dem Feld)
        else {
            const jetzt = Date.now();
            // Fortschritt berechnen (Wert von 0.0 bis 1.0)
            const progress = this.timerStartTime > 0 ? Math.min((jetzt - this.timerStartTime) / 2000, 1.0) : 0;
            this.activeTouches.forEach((touch) => {
                // 1. Sanfte, halbtransparente Außen-Aura
                this.ctx.fillStyle = touch.color;
                this.ctx.globalAlpha = 0.25;
                this.ctx.beginPath();
                this.ctx.arc(touch.x, touch.y, 52, 0, 2 * Math.PI);
                this.ctx.fill();
                this.ctx.globalAlpha = 1.0; // Alpha zurücksetzen
                // 2. Der Hauptkreis für den Finger
                this.ctx.fillStyle = touch.color;
                this.ctx.beginPath();
                this.ctx.arc(touch.x, touch.y, 40, 0, 2 * Math.PI);
                this.ctx.fill();
                // 3. Innerer weißer Design-Kreis
                this.ctx.fillStyle = "#ffffff";
                this.ctx.beginPath();
                this.ctx.arc(touch.x, touch.y, 16, 0, 2 * Math.PI);
                this.ctx.fill();
                // 4. ANIMIERTER LADEKREIS (Schnittstelle zu 2s Timer)
                if (progress > 0) {
                    this.ctx.strokeStyle = "#ffffff";
                    this.ctx.lineWidth = 4;
                    this.ctx.beginPath();
                    // Wir zeichnen einen Bogen basierend auf dem Fortschritt des Timers
                    this.ctx.arc(touch.x, touch.y, 46, -Math.PI / 2, -Math.PI / 2 + progress * 2 * Math.PI);
                    this.ctx.stroke();
                }
            });
        }
    }
}
