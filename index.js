// src/index.ts
import { Wheel } from './Wheel.js';
import { FingerPicker } from './Finger.js';
import { FARBEN_PALETTE } from './utils.js';
const homeScreen = document.getElementById("homeScreen");
const wheelScreen = document.getElementById("wheelScreen");
const fingerScreen = document.getElementById("fingerScreen");
const navToWheelBtn = document.getElementById("navToWheelBtn");
const navToFingerBtn = document.getElementById("navToFingerBtn");
const backFromWheelBtn = document.getElementById("backFromWheelBtn");
const backFromFingerBtn = document.getElementById("backFromFingerBtn");
const inputFeld = document.getElementById("optionInput");
const listeElement = document.getElementById("optionsListe");
const ergebnisText = document.getElementById("ergebnis");
const addBtn = document.getElementById("addBtn");
const drehBtn = document.getElementById("drehBtn");
const fingerErgebnisText = document.getElementById("fingerErgebnis");
const resultModal = document.getElementById("resultModal");
const modalResultText = document.getElementById("modalResultText");
const closeModalBtn = document.getElementById("closeModalBtn");
const modalOkBtn = document.getElementById("modalOkBtn");
// =========================================================================
// INITIALISIERUNG
// =========================================================================
const wheelInstance = new Wheel("wheelCanvas", [], FARBEN_PALETTE, (ergebnis) => {
    ergebnisText.textContent = ergebnis;
    // POPUP & KONFETTI ANZEIGEN
    if (ergebnis.startsWith("🎯")) {
        const gewinnerName = ergebnis.substring(2);
        modalResultText.textContent = gewinnerName;
        resultModal.classList.remove("hidden");
        document.body.classList.add("modal-active"); // Hintergrund unscharf machen!
        // === DIE RECHTE & LINKE KONFETTI-KANONE ZÜNDEN! ===
        // Linke Kanone (unten links, schießt nach rechts oben)
        confetti({
            particleCount: 80,
            angle: 60,
            spread: 55,
            origin: { x: 0, y: 0.8 }
        });
        // Rechte Kanone (unten rechts, schießt nach links oben)
        confetti({
            particleCount: 80,
            angle: 120,
            spread: 55,
            origin: { x: 1, y: 0.8 }
        });
    }
}, () => { listeAktualisieren(); });
const fingerInstance = new FingerPicker("fingerCanvas", (status) => { fingerErgebnisText.textContent = status; });
// =========================================================================
// POPUP SCHLIESSEN EVENTS
// =========================================================================
function schliessePopup() {
    resultModal.classList.add("hidden");
    document.body.classList.remove("modal-active"); // Hintergrund wieder scharf machen!
    ergebnisText.textContent = "Bereit zum Drehen...";
}
closeModalBtn.addEventListener("click", schliessePopup);
modalOkBtn.addEventListener("click", schliessePopup);
window.addEventListener("click", (event) => {
    if (event.target === resultModal) {
        schliessePopup();
    }
});
// =========================================================================
// NAVIGATION
// =========================================================================
navToWheelBtn.addEventListener("click", () => {
    homeScreen.classList.add("hidden");
    wheelScreen.classList.remove("hidden");
});
navToFingerBtn.addEventListener("click", () => {
    homeScreen.classList.add("hidden");
    fingerScreen.classList.remove("hidden");
    fingerInstance.reset();
});
backFromWheelBtn.addEventListener("click", () => {
    wheelScreen.classList.add("hidden");
    homeScreen.classList.remove("hidden");
    schliessePopup();
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
        textSpan.textContent = `✓ ${option}`;
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
        deleteBtn.title = "Option loeschen";
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
