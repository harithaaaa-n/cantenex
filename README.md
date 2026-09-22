# CANTENEX — Campus Dining & Express Pre-Order Platform

> **GOOD FOOD. ZERO WAIT.**  
> An editorial, Dribbble/Awwwards-level college canteen pre-order web application and SQLite database architecture built for modern university dining.

---

## 🌟 Overview

**CANTENEX** solves campus rush-hour canteen congestion through a pre-order workflow mapped directly to lecture breaks. Students explore authentic specialties, customize orders, pick a break slot, pay seamlessly via simulated UPI or Cash, and receive an instant digital QR token with thermal receipt printing.

Meanwhile, canteen operators manage orders in real time via an **Admin Kitchen Queue** and a full-screen **Canteen TV Kiosk Monitor**.

---

## 🚀 Key Features

### 🎓 Student Experience
- **Editorial Art Direction**: Asymmetric hero layout, massive display typography (`Syne`), serif italic subtitles (`Cormorant Garamond`), and warm cream-to-charcoal palette shifts.
- **Mouse-Reactive 3D Tilt Parallax**: Interactive food visuals with dynamic soft glare and layered badge depths.
- **Campus Break Slots**:
  - ⚡ *Ready in 10-12 Mins* (Immediate Queue)
  - 🕒 *11:15 AM — Morning Break* (15 mins)
  - 🍛 *01:15 PM — Lunch Break* (Main Lunch Hour)
  - ☕ *03:45 PM — Evening Snack* (Post-Lecture Tea)
  - 🌙 *05:30 PM — After Hours* (Lab & Study Slot)
- **Dish Spotlight Modal**: Detailed macronutrient breakdown (Energy, Protein, Carbs, Prep Time) with an interactive **5-Star Rating & Student Community Review System**.
- **Slide-Out Food Tray & Split Checkout**: Instant subtotal calculation with student profile presets and multiple payment modes (Verified Campus UPI QR Simulator / Cash at Counter).
- **Zero-Wait QR Tokens & Live Stepper**: Real-time progress tracker (`PLACED` → `ACCEPTED` → `PREPARING` → `READY` → `COMPLETED`) with printable POS-style thermal receipts.
- **Audio Feedback Engine**: Web Audio synthesis micro-interactions and Web Speech voice announcements.

### 🍳 Kitchen Operations & Staff
- **Central Kitchen Queue**: 1-click status progression (`Accept` → `Start Cooking` → `Mark Ready` → `Complete`).
- **Live Menu Stock & Price Controller**: Instantly mark items Sold-Out or adjust prices.
- **Canteen Live TV Kiosk Board**: Full-screen split monitor for overhead canteen displays showing *🔥 Preparing in Kitchen* and *✅ Ready for Pickup*.

### 🗄️ Backend & Database Architecture
- **SQLite Database (`cantenex.db`)**: Relational database schema with foreign key constraints, check clauses, and seed records:
  - `students`: College registration records, names, departments
  - `menu_items`: 16 Indian canteen specialties, nutrition, stock, pricing, spice levels
  - `orders`: Unique tokens, totals, break pickup slots, counter dispatches, timestamps
  - `order_items`: Line-item junction records with quantities and unit prices
  - `dish_reviews`: Student ratings (1-5 stars) and feedback comments
- **Python SQLite REST API (`database.py`)**: Built-in HTTP server exposing endpoints for menu, orders, metrics, stock toggles, prices, and reviews without requiring heavy frameworks.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Structure** | Semantic HTML5 (W3C standard, ARIA attributes) |
| **Styling** | Pure Vanilla CSS3 (Custom Design Tokens, Syne & Cormorant Typography, No Frameworks) |
| **Logic & Motion** | Vanilla JavaScript ES6+ (Event Bus, 3D Parallax Tilt, Dynamic SVG QR Generator) |
| **Sound & Voice** | Web Audio API Oscillator Synthesis + Web Speech Synthesis |
| **Database** | SQLite3 (`schema.sql` + `database.py`) |
| **Portability** | Standalone zero-dependency runtime (runs directly in browser or with Python) |

---

## 📂 Project Structure

```
cantenex/
├── css/
│   ├── style.css           # Design tokens, editorial typography, themes & modals
│   └── responsive.css      # Art-directed responsive layouts (375px to 1440px+)
├── js/
│   ├── data.js             # 16 canteen dishes, nutrition macros, pickup slots, departments
│   ├── store.js            # State store, localStorage persistence, QR generator
│   ├── audio.js            # Web Audio synthesis micro-interactions & voice engine
│   ├── depth3d.js          # Mouse-reactive 3D parallax tilt & dynamic light glare
│   ├── app.js              # Main application controller & DOM event orchestrator
│   └── bundle.js           # Universal standalone bundle for zero-config file:/// execution
├── schema.sql              # Complete SQLite DDL schema and initial seed data
├── database.py             # Python SQLite backend server & REST API controller
├── index.html              # Main application HTML entry point
└── README.md               # Project documentation
```

---

## 💻 How to Run

### Option 1: Direct File Launch (No setup required)
Double-click [`index.html`](./index.html) or open it in any browser:
```
file:///c:/projects/cantenex/index.html
```

### Option 2: Python SQLite Server
Run the built-in SQLite server:
```bash
python database.py 8000
```
Then visit [http://localhost:8000](http://localhost:8000).

---

## 📜 License
Developed as a Web Essentials Mini Project. Built with clean HTML5, CSS3, JavaScript, and SQLite.
