# 🎯 Randi - Spin the Wheel & Multi-Touch Chooser

Hey! Welcome to **Randi**, a simple, clean, and interactive web app to help you and your friends make quick decisions. 

I wanted to build a lightweight decision-maker that is fully mobile-optimized, fast, and completely free of heavy frameworks. So, I built this using pure **TypeScript**, **HTML5 Canvas**, and some smooth **CSS animations**.

🚀 **[Click here to play Randi in your browser!](https://farhannnse.github.io/Randi/)**

---

## 🎮 What does it do?

### 1. 🎯 Randi (Spin-the-Wheel)
*   **Realistic Physics:** The wheel doesn't just stop. It slows down naturally with friction and has a subtle, satisfying **bounce-back effect** at the end before stopping.
*   **Instant Popup & Confetti:** When a winner is selected, the background blurs, a clean modal pops up, and **confetti cannons explode** from the bottom-left and bottom-right of your screen!
*   **Quick Managing:** You can easily add options, edit them with a click (✏️), or delete them (❌). The wheel redraws itself instantly.

### 2. 🖐️ Chooser (Finger Picker)
*   **Fullscreen Playground:** When you enter the Chooser, the white card disappears, and your whole phone screen turns into a massive orange touch-field.
*   **Smooth Animations:** Put your fingers on the screen to see glowing yellow circles with thick white rings. 
*   **The Selection:** If 2 or more fingers are held down, an animated loading circle winds around your fingers. After 2 seconds, your phone vibrates, and a random winner starts flashing while the others fade out.
*   **Auto-Reset:** Once a winner is picked and everyone lifts their fingers, the game automatically resets. You can play 100 rounds without going back to the menu!

---

## 🛠️ How it's built (Under the Hood)

I wanted to practice good coding habits, so I structured the app like a pro:
*   **TypeScript:** Keeps the code safe, typed, and helps catch bugs early.
*   **Modular OOP:** The app is split into independent classes (`Wheel.ts` and `Finger.ts`). This makes it super easy to add new games later (like a coin flipper 🪙).
*   **Responsive Canvas:** The canvases use modern CSS (`aspect-ratio`) to scale down nicely on narrow mobile screens while staying perfectly centered.
*   **No Server Needed:** The app runs entirely in your browser (Client-Side). No databases, no hosting costs, loads instantly.

---

## 💻 Running it Locally

If you want to play around with the code on your machine:

1.  **Clone the project:**
    ```bash
    git clone https://github.com/farhannnSe/Randi.git
    ```
2.  **Compile the TypeScript:**
    ```bash
    npx tsc
    ```
3.  **Start a local server:**
    Since the app uses modern ES modules, browsers block local file loading for security. Start a quick dev server:
    ```bash
    npx serve public
    ```
    Open the link (usually `http://localhost:3000`) and you are good to go!

---

*Made with ☕ by Farhan Seifaldeen.*
