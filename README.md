# CANTENEX — Modern Campus Dining & Express Pre-Order Platform

> **An editorial Dribbble / Awwwards-level campus pre-order web application and relational database management system designed for university food courts.**

---

## 🌟 Overview

**CANTENEX** bridges the gap between busy lecture schedules and canteen kitchen queues. Built with semantic HTML5, pure modular CSS3, vanilla JavaScript, and an SQLite database architecture, CANTENEX allows students to schedule pick-ups for designated class breaks, generate digital QR token passes, track kitchen preparation live, and provides kitchen staff with an administrative dispatch board and TV monitor mode.

---

## ✨ Key Features

- **Asymmetric Editorial Art Direction**: 
  - Typography: Syne Display + Cormorant Garamond Serif + Plus Jakarta Sans UI.
  - Palette shifts: Deep charcoal hero, terracotta chef's spotlight, warm cream daily menu, and olive forest operations timeline.
- **Interactive 3D Food Parallax**:
  - Physics-based mouse-tilt depth engine with dynamic specular glare and floating layered Z-depth badges.
- **Campus Class-Break Scheduling**:
  - Pre-order for immediate pickup (10–12 mins) or scheduled break slots (11:15 AM Morning Break, 1:15 PM Lunch Break, 3:45 PM Evening Snack).
- **Split-Screen Student Checkout**:
  - Fast student profiles for instant verification.
  - Simulated UPI Dynamic QR Code and Cash at Counter payment flows.
  - Instant thermal printable receipt with deterministic SVG QR code token.
- **Real-Time Order Tracking**:
  - 5-stage live kitchen stepper: `PLACED` ➔ `ACCEPTED` ➔ `PREPARING` ➔ `READY` ➔ `COMPLETED`.
  - Token search engine (`CX-1021`, `CX-1022`, etc.).
- **Student Community Dish Reviews & Ratings**:
  - Live 5-star interactive rating picker and student community reviews.
  - Dynamic recalculation of dish average star rating in real-time.
- **Central Kitchen Queue & Dispatch Portal**:
  - Single-click order status progression.
  - Live inventory controller (instant In-Stock / Sold-Out toggles and price editing).
  - Derived live revenue and queue statistics.
- **Canteen TV Kiosk Monitor**:
  - Fullscreen high-contrast display designed for overhead canteen television screens with live cooking & pickup token callout columns.
- **Interactive Database Studio**:
  - In-browser SQL query editor with preset queries.
  - 1-click **Export to CSV** and **Export to JSON** data downloads.
  - Live schema inspector for `students`, `menu_items`, `orders`, `order_items`, and `dish_reviews`.
- **Micro-Interaction Sound & Speech Engine**:
  - Synthesized Web Audio chimes for button interactions and orders (zero external audio assets).
  - Web Speech voice announcements calling out ready tokens.
  - Header audio toggle switch (`[Audio: ON / MUTED]`).

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Structure** | Semantic HTML5 with accessible ARIA landmarks |
| **Styling** | Pure CSS3 (Design Tokens, CSS Grid, Flexbox, Custom Keyframes) |
| **Logic & Motion** | Modular JavaScript (ES6+ / Universal Standalone Engine) |
| **Audio** | Web Audio API Oscillator synthesis + Web Speech Synthesis |
| **Relational Database** | SQLite (`schema.sql` DDL + Python REST server `database.py`) |
| **Execution** | Universal dual-mode: direct double-click `file:///` or Python server |

---

## 🚀 Getting Started

### 1. Zero-Config Direct Browser Mode
Double click `index.html` or open directly in any modern web browser:
```bash
file:///path/to/cantenex/index.html
```

### 2. Full SQLite REST Backend (Optional)
Run the built-in Python SQLite server:
```bash
python database.py 8000
```
Then visit `http://localhost:8000`.

---

## 🗄️ Database Schema

The database consists of 5 relational tables:
1. **`students`** — Register number, student name, department.
2. **`menu_items`** — Dish codes, pricing, diet (veg/non-veg), preparation time, calories, stock status, ratings.
3. **`orders`** — Unique token IDs, student details, break slots, payment methods, status, counter assignments.
4. **`order_items`** — Junction table mapping items and quantities to orders.
5. **`dish_reviews`** — Student ratings and community feedback.

---

## 👨‍🎓 Project Credits

- **Developer**: Dinesh C
- **Course**: Web Essentials Mini Project
- **License**: MIT
