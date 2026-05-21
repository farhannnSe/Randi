// src/utils.ts
export const FARBEN_PALETTE = ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40", "#E7E9ED"];
// Später könnten hier weitere Hilfsfunktionen rein, z.B. für mathematische Berechnungen
function berechneStueckWinkel(anzahlOptionen) {
    return (2 * Math.PI) / anzahlOptionen;
}
