// Wheel.ts
export class Wheel {
    constructor(canvasId, options, colors, onResult, onUpdateList) {
        this.optionen = [];
        this.farben = ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40", "#E7E9ED"];
        this.aktuellerWinkel = 0;
        this.drehGeschwindigkeit = 0;
        this.istAmDrehen = false;
        this.animationFrameId = null; // Um die Animation sauber stoppen zu können
        // Callbacks, um Änderungen an der UI zu melden (z.B. das Ergebnis)
        this.onResult = () => { };
        this.onUpdateList = () => { };
        const canvasElement = document.getElementById(canvasId);
        if (!canvasElement) {
            throw new Error(`Element with ID "${canvasId}" not found.`);
        }
        this.canvas = canvasElement;
        this.ctx = this.canvas.getContext("2d");
        this.optionen = [...options]; // Kopiere die Optionen
        this.farben = colors.length > 0 ? colors : this.farben; // Verwende übergebene Farben, sonst Defaults
        this.breite = this.canvas.width;
        this.hoehe = this.canvas.height;
        this.zentrumX = this.breite / 2;
        this.zentrumY = this.hoehe / 2;
        this.radius = this.breite / 2 - 10;
        this.onResult = onResult;
        this.onUpdateList = onUpdateList;
        this.zeichneRad(); // Initial das leere Rad zeichnen
    }
    // =========================================================================
    // ZEICHEN-LOGIK
    // =========================================================================
    zeichneRad() {
        this.ctx.clearRect(0, 0, this.breite, this.hoehe);
        if (this.optionen.length === 0) {
            this.ctx.fillStyle = "#edf2f7";
            this.ctx.beginPath();
            this.ctx.arc(this.zentrumX, this.zentrumY, this.radius, 0, 2 * Math.PI);
            this.ctx.fill();
            this.ctx.fillStyle = "#718096";
            this.ctx.font = "bold 16px Arial";
            this.ctx.textAlign = "center";
            this.ctx.fillText("Keine Optionen", this.zentrumX, this.zentrumY + 5);
            return;
        }
        const stueckWinkel = (2 * Math.PI) / this.optionen.length;
        for (let i = 0; i < this.optionen.length; i++) {
            const startWinkel = this.aktuellerWinkel + i * stueckWinkel;
            const endWinkel = startWinkel + stueckWinkel;
            this.ctx.fillStyle = this.farben[i % this.farben.length];
            this.ctx.beginPath();
            this.ctx.moveTo(this.zentrumX, this.zentrumY);
            this.ctx.arc(this.zentrumX, this.zentrumY, this.radius, startWinkel, endWinkel);
            this.ctx.lineTo(this.zentrumX, this.zentrumY);
            this.ctx.fill();
            this.ctx.save();
            this.ctx.translate(this.zentrumX, this.zentrumY);
            this.ctx.rotate(startWinkel + stueckWinkel / 2);
            this.ctx.fillStyle = "#ffffff";
            this.ctx.font = "bold 14px Arial";
            this.ctx.textAlign = "right";
            this.ctx.shadowColor = "rgba(0,0,0,0.3)";
            this.ctx.shadowBlur = 4;
            const text = this.optionen[i].length > 12 ? this.optionen[i].substring(0, 10) + ".." : this.optionen[i];
            this.ctx.fillText(text, this.radius - 15, 5);
            this.ctx.restore();
        }
    }
    // =========================================================================
    // LOGIK: OPTIONEN HINZUFÜGEN, BEARBEITEN, LÖSCHEN
    // =========================================================================
    addOption(option) {
        const wert = option.trim();
        if (wert !== "" && !this.istAmDrehen) {
            this.optionen.push(wert);
            this.onUpdateList(); // UI informieren, dass sich die Liste geändert hat
            this.zeichneRad();
        }
    }
    editOption(index, neuerWert) {
        if (this.istAmDrehen || index < 0 || index >= this.optionen.length)
            return;
        const wert = neuerWert.trim();
        if (wert !== "") {
            this.optionen[index] = wert;
            this.onUpdateList();
            this.zeichneRad();
        }
    }
    removeOption(index) {
        if (this.istAmDrehen || index < 0 || index >= this.optionen.length)
            return;
        this.optionen.splice(index, 1);
        this.onUpdateList();
        this.zeichneRad();
        if (this.optionen.length === 0) {
            this.onResult("Füge Optionen hinzu!");
        }
    }
    // =========================================================================
    // PHYSIKALISCHE ANIMATION
    // =========================================================================
    animiereRad() {
        if (this.drehGeschwindigkeit > 0.002) {
            this.drehGeschwindigkeit *= 0.97;
            this.aktuellerWinkel += this.drehGeschwindigkeit;
            this.zeichneRad();
            this.animationFrameId = requestAnimationFrame(() => this.animiereRad());
        }
        else {
            this.istAmDrehen = false;
            this.drehGeschwindigkeit = 0;
            const totalArc = 2 * Math.PI;
            const normalisierterWinkel = (this.aktuellerWinkel + Math.PI / 2) % totalArc;
            const stueckWinkel = totalArc / this.optionen.length;
            const ErgebnisIndex = this.optionen.length - 1 - Math.floor(normalisierterWinkel / stueckWinkel) % this.optionen.length;
            this.onResult(this.optionen[ErgebnisIndex]);
        }
    }
    startDrehen() {
        if (this.optionen.length < 2) {
            alert("Bitte gib mindestens 2 Optionen ein!");
            return;
        }
        if (this.istAmDrehen)
            return;
        // Stoppe eine eventuell laufende Animation, bevor eine neue startet
        if (this.animationFrameId !== null) {
            cancelAnimationFrame(this.animationFrameId);
        }
        this.istAmDrehen = true;
        this.onResult("🔄 Rad dreht sich...");
        this.drehGeschwindigkeit = Math.random() * 0.4 + 0.3;
        this.animiereRad();
    }
}
