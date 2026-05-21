// src/Finger.ts
import { FARBEN_PALETTE } from './utils.js';
export class FingerPicker {
    constructor(canvasId, onStatusUpdate) {
        // Eine Map speichert Key-Value Paare (Touch-ID -> Finger-Position und Farbe)
        this.activeTouches = new Map();
        this.isSelecting = false;
        this.winnerId = null;
        this.countdownTimer = null;
        this.pulseAngle = 0; // Für den blinkenden Puls-Effekt des Gewinners
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext("2d");
        this.onStatusUpdate = onStatusUpdate;
        this.setupTouchListeners();
        this.draw();
    }
    // =========================================================================
    // TOUCH LISTENERS (FÜR MULTI-TOUCH AUF SMARTPHONES)
    // =========================================================================
    setupTouchListeners() {
        // Finger berührt das Display
        this.canvas.addEventListener("touchstart", (e) => this.handleTouchStart(e));
        // Finger bewegt sich auf dem Display
        this.canvas.addEventListener("touchmove", (e) => this.handleTouchMove(e));
        // Finger wird angehoben
        this.canvas.addEventListener("touchend", (e) => this.handleTouchEnd(e));
        this.canvas.addEventListener("touchcancel", (e) => this.handleTouchEnd(e));
    }
    handleTouchStart(e) {
        e.preventDefault(); // Verhindert das Scrollen der Webseite beim Touchen
        if (this.isSelecting)
            return;
        // Schleife durch alle neu hinzugekommenen Finger
        for (let i = 0; i < e.changedTouches.length; i++) {
            const touch = e.changedTouches[i];
            const rect = this.canvas.getBoundingClientRect();
            // Umrechnung der Touch-Koordinaten relativ zum Canvas-Kreis
            const x = touch.clientX - rect.left;
            const y = touch.clientY - rect.top;
            // Dem Finger eine eindeutige Farbe aus unserer Palette zuweisen
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
        if (this.isSelecting)
            return;
        for (let i = 0; i < e.changedTouches.length; i++) {
            const touch = e.changedTouches[i];
            this.activeTouches.delete(touch.identifier); // Finger entfernen
        }
        this.checkSelectionTimer();
        this.draw();
    }
    // =========================================================================
    // TIMER & ZUFALLS-AUSWAHL (LOGIK)
    // =========================================================================
    checkSelectionTimer() {
        // Wenn 2 oder mehr Finger drauf liegen und wir noch keinen Timer haben:
        if (this.activeTouches.size >= 2 && !this.countdownTimer && !this.isSelecting) {
            this.onStatusUpdate("⏱️ Auswahl startet in 2s...");
            this.countdownTimer = window.setTimeout(() => {
                this.pickWinner();
            }, 2000); // Nach 2 Sekunden gedrückt halten wird ausgelöst
        }
        // Falls ein Finger angehoben wurde und weniger als 2 Finger übrig sind:
        else if (this.activeTouches.size < 2 && this.countdownTimer) {
            clearTimeout(this.countdownTimer);
            this.countdownTimer = null;
            this.onStatusUpdate("Warte auf Finger...");
        }
    }
    pickWinner() {
        if (this.activeTouches.size < 2)
            return;
        this.isSelecting = true;
        this.countdownTimer = null;
        // Alle aktiven Touch-IDs in ein Array umwandeln
        const keys = Array.from(this.activeTouches.keys());
        // Zufälligen Gewinner-Key auswählen
        const randomKey = keys[Math.floor(Math.random() * keys.length)];
        this.winnerId = randomKey;
        // VIBRATION: Das Handy vibrieren lassen (geht nur auf Android/Smartphones)
        if (navigator.vibrate) {
            navigator.vibrate([100, 50, 150]); // Kurzes rhythmisches Vibrieren
        }
        const gewinner = this.activeTouches.get(this.winnerId);
        this.onStatusUpdate("👑 Gewinner ausgewählt!");
        this.animateWinner();
    }
    // Schicke Blink-Animation für den Gewinner-Finger
    animateWinner() {
        if (this.winnerId !== null && this.activeTouches.has(this.winnerId)) {
            this.pulseAngle += 0.1;
            this.draw();
            requestAnimationFrame(() => this.animateWinner());
        }
        else {
            // Wenn der Gewinner seinen Finger anhebt, alles zurücksetzen
            this.reset();
        }
    }
    reset() {
        this.isSelecting = false;
        this.winnerId = null;
        if (this.countdownTimer) {
            clearTimeout(this.countdownTimer);
            this.countdownTimer = null;
        }
        this.activeTouches.clear();
        this.onStatusUpdate("Warte auf Finger...");
        this.draw();
    }
    // =========================================================================
    // ZEICHEN-LOGIK FÜR DAS FINGER-SPIEL
    // =========================================================================
    draw() {
        const w = this.canvas.width;
        const h = this.canvas.height;
        this.ctx.clearRect(0, 0, w, h);
        // Einen großen grauen Kreis als "Spielfeld" im Hintergrund zeichnen
        this.ctx.fillStyle = "#edf2f7";
        this.ctx.beginPath();
        this.ctx.arc(w / 2, h / 2, w / 2 - 10, 0, 2 * Math.PI);
        this.ctx.fill();
        // Wenn wir bereits einen Gewinner haben:
        if (this.isSelecting && this.winnerId !== null) {
            this.activeTouches.forEach((touch, id) => {
                if (id === this.winnerId) {
                    // Pulsierenden, großen Kreis für den Gewinner zeichnen
                    const pulseRadius = 45 + Math.sin(this.pulseAngle) * 8;
                    this.ctx.fillStyle = touch.color;
                    this.ctx.beginPath();
                    this.ctx.arc(touch.x, touch.y, pulseRadius, 0, 2 * Math.PI);
                    this.ctx.fill();
                    // Goldene Krone oder Umrandung
                    this.ctx.strokeStyle = "#FFD700";
                    this.ctx.lineWidth = 6;
                    this.ctx.stroke();
                }
                else {
                    // Verlierer-Finger werden ausgegraut
                    this.ctx.fillStyle = "rgba(113, 128, 150, 0.2)";
                    this.ctx.beginPath();
                    this.ctx.arc(touch.x, touch.y, 35, 0, 2 * Math.PI);
                    this.ctx.fill();
                }
            });
        }
        // Normalzustand (Finger auflegen)
        else {
            this.activeTouches.forEach((touch) => {
                // Zeichne einen schönen Kreis für jeden Finger
                this.ctx.fillStyle = touch.color;
                this.ctx.beginPath();
                this.ctx.arc(touch.x, touch.y, 40, 0, 2 * Math.PI);
                this.ctx.fill();
                // Innerer kleiner weißer Kreis für einen edlen Look
                this.ctx.fillStyle = "#ffffff";
                this.ctx.beginPath();
                this.ctx.arc(touch.x, touch.y, 15, 0, 2 * Math.PI);
                this.ctx.fill();
            });
        }
    }
}
