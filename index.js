import { Wheel } from './Wheel.js';
import { FARBEN_PALETTE } from './utils.js';
// src/index.ts
// =========================================================================
// HTML ELEMENTE HOLEN
// =========================================================================
const inputFeld = document.getElementById("optionInput");
const listeElement = document.getElementById("optionsListe");
const ergebnisText = document.getElementById("ergebnis");
const addBtn = document.getElementById("addBtn");
const drehBtn = document.getElementById("drehBtn");
// =========================================================================
// WICHTIG: DIE WHEEL KLASSE INITIALISIEREN
// =========================================================================
// Wir übergeben IDs, die Anfangsoptionen, die Farben und die Callback-Funktionen
const wheelInstance = new Wheel("wheelCanvas", // ID des Canvas-Elements
[], // Anfangs ist die Liste leer
FARBEN_PALETTE, // Unsere schöne Farbpalette
(ergebnis) => {
    ergebnisText.textContent = ergebnis;
}, () => {
    listeAktualisieren(); // Wir müssen die Liste im HTML neu rendern lassen
});
// =========================================================================
// HELFER-FUNKTIONEN (UI-LOGIK)
// =========================================================================
// Diese Funktion wird von der Wheel-Klasse aufgerufen, wenn sich die Optionen ändern.
// Sie baut die HTML-Liste jedes Mal komplett neu auf.
function listeAktualisieren() {
    listeElement.innerHTML = ""; // Liste im HTML leeren
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
            if (!wheelInstance.istAmDrehen) { // Nur bearbeiten, wenn Rad nicht dreht
                bearbeiteOption(index);
            }
        });
        btnGroup.appendChild(editBtn);
        const deleteBtn = document.createElement("button");
        deleteBtn.className = "list-btn";
        deleteBtn.textContent = "❌";
        deleteBtn.title = "Option löschen";
        deleteBtn.addEventListener("click", () => {
            if (!wheelInstance.istAmDrehen) { // Nur löschen, wenn Rad nicht dreht
                loescheOption(index);
            }
        });
        btnGroup.appendChild(deleteBtn);
        li.appendChild(btnGroup);
        listeElement.appendChild(li);
    });
    // Wenn keine Optionen mehr da sind, zeigen wir den Start-Text an
    if (wheelInstance.optionen.length === 0) {
        ergebnisText.textContent = "Füge Optionen hinzu!";
    }
}
// Funktion, um die Bearbeitungs-Logik auszulösen
function bearbeiteOption(index) {
    const alterWert = wheelInstance.optionen[index]; // Zugriff auf die Optionen der Wheel-Instanz
    const neuerWert = prompt("Option bearbeiten:", alterWert);
    if (neuerWert !== null && neuerWert.trim() !== "") {
        wheelInstance.editOption(index, neuerWert); // Rufe die editOption-Methode der Klasse auf
    }
}
// Funktion, um die Lösch-Logik auszulösen
function loescheOption(index) {
    wheelInstance.removeOption(index); // Rufe die removeOption-Methode der Klasse auf
}
// =========================================================================
// EVENT LISTENER
// =========================================================================
// Hinzufügen-Button
addBtn.addEventListener("click", () => {
    const wert = inputFeld.value;
    wheelInstance.addOption(wert); // Nutze die addOption-Methode der Klasse
    inputFeld.value = ""; // Eingabefeld leeren, nachdem die Option übergeben wurde
});
// Drehen-Button
drehBtn.addEventListener("click", () => {
    wheelInstance.startDrehen(); // Rufe die Start-Dreh-Methode der Klasse auf
});
// Enter-Taste im Eingabefeld
inputFeld.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        wheelInstance.addOption(inputFeld.value); // Nutze die addOption-Methode der Klasse
        inputFeld.value = ""; // Eingabefeld leeren
    }
});
// Initialisierung: Rufe die Funktion auf, um die Liste beim ersten Start zu rendern
// (Sie ist zwar leer, aber die Funktion bereitet alles vor)
listeAktualisieren();
