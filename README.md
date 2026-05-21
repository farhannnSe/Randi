# 🎯 Randi - Multi-Decision Web App

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

**Randi** is a modern, high-performance, and mobile-optimized multi-game web application designed to make decision-making interactive and fun. Built with pure **TypeScript (ES6 Modules)**, **HTML5 Canvas**, and **CSS3**, it showcases clean code, modular architecture, and rich animations.

🚀 **[LIVE DEMO: Play Randi Now!](https://farhannnse.github.io/Randi/)**

---

## 🎮 Key Features

### 1. 🎯 Randi (Spin-the-Wheel)
*   **Physics-Based Deceleration:** Realistic deceleration algorithm simulating friction (decay of angular velocity over time) for an exciting, unpredictable spin.
*   **Dynamic Canvas Rendering:** Trigonometric rendering (`Math.PI`, `arc`, `save/restore` matrices) that dynamically draws custom slices and rotates text labels based on the number of active options.
*   **Interactive CRUD List:** Live responsive adding, editing (via modal prompts), and deleting of options with automatic canvas redraws.

### 2. 🖐️ Chooser (Finger Picker)
*   **Native Multi-Touch Support:** Captures and tracks multiple touch coordinates (`touchstart`, `touchmove`, `touchend`) simultaneously on mobile viewports.
*   **Circular Progress Ring Animation:** Features an interactive loading circle that animates around each finger in real-time during the 2-second selection countdown.
*   **Haptic Feedback Integration:** Uses the native Mobile Vibration API (`navigator.vibrate`) to provide physical feedback to the user once the random winner is selected.
*   **Automatic State Reset:** High-end UX design that automatically resets the playground as soon as all players lift their fingers, allowing seamless consecutive rounds.

---

## 🛠️ Tech Stack & Architecture

This project was built from scratch without bloated frameworks to demonstrate a strong grasp of vanilla web technologies and software engineering principles:

*   **TypeScript (Strict Mode):** Used for static typing, compile-time error checking, and code safety.
*   **Object-Oriented Programming (OOP):** Encapsulated into clean, reusable classes (`Wheel` and `FingerPicker`) to ensure scalability for future games.
*   **Data-Driven Rendering:** Changes to the option array automatically trigger reactive DOM updates and canvas redraws, keeping state and UI in perfect sync.
*   **Modern ES6 Modules:** Developed using modular `import`/`export` architecture for cleaner file organization and maintainability.

---

## 📂 Project Structure

```text
.
├── public/                 # Static assets served by the local server
│   ├── index.html          # Main entry HTML file (multi-screen navigation)
│   ├── styles.css          # Customized responsive CSS UI layout
│   ├── index.js            # Compiled entry JS script
│   ├── Wheel.js            # Compiled Wheel class
│   ├── Finger.js           # Compiled FingerPicker class
│   └── utils.js            # Compiled helper constants/functions
├── src/                    # TypeScript Source Code
│   ├── index.ts            # App Controller (handles DOM routing)
│   ├── Wheel.ts            # Object-Oriented Wheel Engine
│   ├── Finger.ts           #
