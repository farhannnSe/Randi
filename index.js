// src/index.ts
import { Wheel } from './Wheel.js';
import { FingerPicker } from './Finger.js'; // NEU
import { FARBEN_PALETTE } from './utils.js';
// =========================================================================
// HTML BILDCHIRME (SCREENS) HOLEN
// =========================================================================
const homeScreen = document.getElementById("homeScreen");
const wheelScreen = document.getElementById("wheelScreen");
const fingerScreen = document.getElementById("fingerScreen");
// =========================================================================
// NAVIGATION BUTTONS HOLEN
// =========================================================================
const navToWheelBtn = document.getElementById("navToWheelBtn");
const navToFingerBtn = document.getElementById("navToFingerBtn");
const backFromWheelBtn = document.getElementById("backFromWheelBtn");
const backFromFingerBtn = document.getElementById("backFromFingerBtn");
// =========================================================================
// SPIEL-ELEMENTE (DREHRAD) HOLEN
// =========================================================================
const inputFeld = document.getElementById("optionInput");
const listeElement = document.getElementById("optionsListe");
const ergebnisText = document.getElementById("ergebnis");
const addBtn = document.getElementById("addBtn");
const drehBtn = document.getElementById("drehBtn");
// =========================================================================
// SPIEL-ELEMENTE (FINGER-AUSWAHL) HOLEN
// =========================================================================
const fingerErgebnisText = document.getElementById("fingerErgebnis");
// =========================================================================
// INITIALISIERUNG DER KLASSEN
// =========================================================================
// 1. Drehrad initialisieren
const wheelInstance = new Wheel("wheelCanvas", [], FARBEN_PALETTE, (ergebnis) => { ergebnisText.textContent = ergebnis; }, () => { listeAktualisieren(); });
// 2. Finger-Auswahl initialisieren (NEU)
const fingerInstance = new FingerPicker("fingerCanvas", (status) => { fingerErgebnisText.textContent = status; });
// =========================================================================
// SCREEN-NAVIGATION (BILDCHIRME UMSTELLEN)
// =========================================================================
// Klick auf "Drehrad-Simulator" im Menü
navToWheelBtn.addEventListener("click", () => {
    homeScreen.classList.add("hidden");
    wheelScreen.classList.remove("hidden");
});
// Klick auf "Finger-Auswahl" im Menü
navToFingerBtn.addEventListener("click", () => {
    homeScreen.classList.add("hidden");
    fingerScreen.classList.remove("hidden");
    fingerInstance.reset(); // Setzt das Spielfeld zurück
});
// Zurück-Buttons
backFromWheelBtn.addEventListener("click", () => {
    wheelScreen.classList.add("hidden");
    homeScreen.classList.remove("hidden");
});
backFromFingerBtn.addEventListener("click", () => {
    fingerScreen.classList.add("hidden");
    homeScreen.classList.remove("hidden");
    fingerInstance.reset();
});
// =========================================================================
// DREHRAD UI-LOGIK
// =========================================================================
function listeAktualisieren() {
    listeElement.innerHTML = "";
    wheelInstance.optionen.forEach((option, index) => {
        const li = document.createElement("li");
        li.className = "option-item";
        const textSpan = document.createElement("span");
        textSpan.className = "option-text";
        textSpan.textContent = `✅ ${option}`;
        li.appendChild(textSpan);
        const btnGroup = document.createElement("div");
        btnGroup.className = "btn-group";
        const editBtn = document.createElement("button");
        editBtn.className = "list-btn";
        editBtn.textContent = "✏️";
        editBtn.title = "Option bearbeiten";
        editBtn.addEventListener("click", () => {
            if (!wheelInstance.istAmDrehen)
                bearbeiteOption(index);
        });
        btnGroup.appendChild(editBtn);
        const deleteBtn = document.createElement("button");
        deleteBtn.className = "list-btn";
        deleteBtn.textContent = "❌";
        deleteBtn.title = "Option löschen";
        deleteBtn.addEventListener("click", () => {
            if (!wheelInstance.istAmDrehen)
                loescheOption(index);
        });
        btnGroup.appendChild(deleteBtn);
        li.appendChild(btnGroup);
        listeElement.appendChild(li);
    });
    if (wheelInstance.optionen.length === 0) {
        ergebnisText.textContent = "Füge Optionen hinzu!";
    }
}
function bearbeiteOption(index) {
    const alterWert = wheelInstance.optionen[index];
    const neuerWert = prompt("Option bearbeiten:", alterWert);
    if (neuerWert !== null && neuerWert.trim() !== "") {
        wheelInstance.editOption(index, neuerWert);
    }
}
function loescheOption(index) {
    wheelInstance.removeOption(index);
}
addBtn.addEventListener("click", () => {
    const wert = inputFeld.value;
    wheelInstance.addOption(wert);
    inputFeld.value = "";
});
drehBtn.addEventListener("click", () => {
    wheelInstance.startDrehen();
});
inputFeld.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        wheelInstance.addOption(inputFeld.value);
        inputFeld.value = "";
    }
});
listeAktualisieren();
