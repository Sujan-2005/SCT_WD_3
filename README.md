# SKILLCRAFT TECHNOLOGY // QUIZ ENGINE v2.4.1

A retro terminal-themed, fully client-side quiz application built with vanilla HTML, CSS, and JavaScript. No build tools, no dependencies—just open `index.html` in a browser and start hacking your knowledge.

![Preview](https://img.shields.io/badge/status-stable-brightgreen) ![License](https://img.shields.io/badge/license-MIT-blue)

---

## Features

- **4 Question Types**
  - Single Choice
  - Multi-Select
  - True / False
  - Fill in the Blank
- **15 Curated Questions** across Web Basics, JavaScript, CSS, Git, HTTP, Python, and Data Structures
- **Retro CRT Aesthetic**
  - Scanline overlay, glowing monochrome text, ASCII art headers
  - Custom crosshair cursor and typewriter boot sequence
- **Interactive Navigation**
  - Jump between questions via mini progress grid
  - Previous / Next / Submit controls
  - Real-time answer status indicators
- **Instant Feedback**
  - Correct / Incorrect styling on submission
  - Inline feedback messages with expected answers
- **Results Dashboard**
  - Overall score and performance grading
  - Per-category accuracy breakdown with ASCII progress bars
  - Full question review with correct answers
- **Persistent Leaderboard**
  - Top 20 scores saved to `localStorage`
  - Date, score, and percentage tracking
- **Responsive Layout**
  - Adapts to mobile and desktop screens

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Markup | HTML5 |
| Styling | CSS3 (custom properties, animations, media queries) |
| Logic | Vanilla ES6+ JavaScript |
| Storage | Browser `localStorage` |
| Fonts | JetBrains Mono (Google Fonts) |

---

## File Structure

```
skillcraft_quiz/
├── index.html      # Single-page application shell
├── style.css       # Terminal aesthetic, animations, responsive grid
├── script.js       # Quiz data, state management, rendering engine
└── README.md       # You are here
```

---

## Getting Started

1. **Clone or download** the repository.
2. **Open `index.html`** in any modern web browser (Chrome, Firefox, Edge, Safari).
3. Click **\[ START QUIZ \]** on the boot screen to begin.

> No server or build step is required. If you prefer, you can serve the folder with any static file server (e.g., `npx serve`, `python -m http.server`, or VS Code Live Server).

---

## Question Format

Questions are defined as a plain JavaScript array (`QUIZ` in `script.js`). Each object supports:

```javascript
{
  id: 1,
  q: "Question text",
  type: "single" | "multi" | "truefalse" | "fill",
  cat: "Category Name",
  opts: ["Option A", "Option B", ...],  // omit for fill type
  ans: "Correct Answer" | ["A", "B"]    // array for multi-select
}
```

### Customizing the Quiz

- **Add questions:** Append new objects to the `QUIZ` array in `script.js`.
- **Change categories:** Update the `cat` field; the UI dynamically groups them.
- **Adjust styling:** Modify CSS custom properties in `:root` inside `style.css` to swap colors, glow intensity, or fonts.

---

## How It Works

1. **Boot Screen** — A typewriter effect initializes the engine and displays categories.
2. **Quiz Screen** — Renders one question at a time with type-specific input controls.
3. **Submission** — Answers are locked per-question; feedback is shown immediately.
4. **Results Screen** — Computes score, updates the leaderboard, and provides a full review.

All state (`screen`, `qIndex`, `answers`, `submitted`, `leaderboard`) is managed in a single `state` object. Rendering is handled by pure functions that mutate the DOM directly (`renderStart`, `renderQuestion`, `renderResults`).

---

## Keyboard & Accessibility Notes

- The quiz is primarily mouse/touch driven.
- Fill-in-the-blank inputs auto-focus when the question loads.
- Future enhancements could include keyboard navigation (arrow keys, Enter to submit) and ARIA labels for screen readers.

---

## Browser Compatibility

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

`localStorage` must be enabled for leaderboard persistence. Private/Incognito modes that block storage will still allow quiz play, but scores won't be saved between sessions.

---

## License

MIT License — feel free to fork, remix, and deploy.

---

*Built by SKILLCRAFT TECHNOLOGY // Terminal aesthetics for the modern web.*

