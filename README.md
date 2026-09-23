# CANTENEX — Modern Campus Dining & Express Pre-Order Platform

> **A production-ready campus dining pre-order platform, real-time kitchen queue dispatch system, and relational database management architecture built with FastAPI, PostgreSQL, semantic HTML5, pure modular CSS3, and reactive JavaScript.**

---

## 🌟 Overview

**CANTENEX** bridges the gap between busy lecture schedules and campus canteen kitchen queues. Built with a production **FastAPI REST backend**, **PostgreSQL / SQLite dual-engine**, and a frontend featuring **Syne & Cormorant Garamond typography**, **3D mouse-tilt food parallax**, **synthesized Web Audio chimes**, **Web Speech announcements**, and **SVG QR receipts**, CANTENEX delivers a premium dining experience for universities.

Students can schedule pickups for designated break slots, generate deterministic QR token passes, and track cooking progress in real time. Kitchen staff manage active orders on a live dispatch board, while cafeteria television monitors run in full-screen Kiosk mode.

---

## 🏛️ Production Architecture

```
                    INTERNET (Public Users & Canteen Displays)
                                    │
                                    │ HTTPS
                                    ▼
       ┌────────────────────────────────────────────────────────┐
       │             CANTENEX Frontend (Vercel)                 │
       │  • Semantic HTML5 + Pure CSS Design System             │
       │  • Dynamic API URL Config (window.CANTENEX_API_URL)    │
       │  • Live Polling Engine for Kitchen Board & TV Kiosk    │
       │  • Web Audio Synthesis & Speech TTS                    │
       │  • Offline / LocalStorage Graceful Fallback            │
       └────────────────────────────┬───────────────────────────┘
                                    │
                                    │ HTTPS (CORS Protected)
                                    ▼
       ┌────────────────────────────────────────────────────────┐
       │             Production API (FastAPI / Render)          │
       │  • Pydantic Request Validation                         │
       │  • Server-Side Order Price Recalculation               │
       │  • Concurrency & Atomic Stock Management               │
       │  • Admin Secret Protection (Bearer / Header Auth)      │
       │  • Health Check & Live Aggregated Metrics              │
       └────────────────────────────┬───────────────────────────┘
                                    │
                                    │ Connection Pool (psycopg2 / sqlite3)
                                    ▼
       ┌────────────────────────────────────────────────────────┐
       │        Persistent Database (PostgreSQL / SQLite)       │
       │  • Schema Auto-Migration & Idempotent Seeding          │
       │  • Tables: students, menu_items, orders,               │
       │            order_items, dish_reviews                   │
       └────────────────────────────────────────────────────────┘
```

---

## ✨ Key Features

- **Asymmetric Editorial Art Direction**: 
  - Typography: Syne Display + Cormorant Garamond Serif + Plus Jakarta Sans UI.
  - Curated palettes: Deep obsidian hero, saffron/terracotta chef's spotlight, warm cream daily menu.
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
  - Live token lookup search engine (`CX-1021`, `CX-1022`, etc.).
- **Student Community Dish Reviews & Ratings**:
  - Live 5-star interactive rating picker and community reviews.
  - Server-side recalculation of dish average rating in real-time.
- **Central Kitchen Queue & Dispatch Portal**:
  - Passcode-protected administrative dashboard (`admin123` default demo passcode).
  - Single-click order status progression.
  - Live inventory controller (instant In-Stock / Sold-Out toggles and price editing).
  - Live queue and revenue metrics.
- **Canteen TV Kiosk Monitor**:
  - Fullscreen high-contrast display designed for overhead canteen television screens (`?mode=kiosk`).
- **Interactive Database Studio**:
  - Admin-protected in-browser SQL query editor with preset queries and safe execution.
  - 1-click **Export to CSV** and **Export to JSON** data downloads.
- **Micro-Interaction Sound & Speech Engine**:
  - Synthesized Web Audio chimes for button interactions and orders (zero external audio assets).
  - Web Speech voice announcements calling out ready tokens over canteen speakers.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Frontend Hosting** | Vercel (Static Web Application) |
| **Backend API** | FastAPI (Python 3.11+ / Uvicorn ASGI Server) |
| **Production Database** | PostgreSQL 13+ (Supabase, Neon, Render, Railway) |
| **Local Offline Database**| SQLite 3 (Automatic fallback when `DATABASE_URL` is unset) |
| **Request Validation** | Pydantic v2 |
| **Styling** | Pure CSS3 (Design Tokens, Grid, Flexbox, Keyframes) |
| **Audio & Speech** | Web Audio API Oscillator synthesis + Web Speech API |

---

## 🗄️ Relational Database Schema

The database consists of 5 relational tables:
1. **`students`** — Register number (`reg_no` PK), student name, department.
2. **`menu_items`** — Dish codes, pricing, diet (veg/non-veg), preparation time, calories, nutritional macros, stock status, ratings.
3. **`orders`** — Unique token IDs (`CX-XXXX`), student details, break slots, payment methods, status, counter assignments.
4. **`order_items`** — Junction table mapping items and quantities to orders.
5. **`dish_reviews`** — Student ratings (1-5) and community feedback.

---

## 🔌 API Endpoints Reference

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/health` | Service health status & database type | No |
| `GET` | `/api/menu` | Full 36-dish campus menu catalogue | No |
| `GET` | `/api/orders` | List of orders with line items | No |
| `POST` | `/api/orders` | Create order with price & stock check | No |
| `POST` | `/api/orders/update-status` | Progress order stage (`PLACED` ➔ `COMPLETED`) | **Admin** (`X-Admin-Key`) |
| `POST` | `/api/menu/toggle-stock` | Toggle dish between In-Stock / Sold-Out | **Admin** (`X-Admin-Key`) |
| `POST` | `/api/menu/update-price` | Update dish price | **Admin** (`X-Admin-Key`) |
| `GET` | `/api/reviews` | Fetch reviews for menu items | No |
| `POST` | `/api/reviews` | Submit new dish review | No |
| `GET` | `/api/metrics` | Operational queue counts and total revenue | No |
| `POST` | `/api/admin/verify` | Verify admin / staff secret passcode | No |
| `GET` / `POST` | `/api/sql` | Execute parameterized queries in Database Studio | **Admin** (`X-Admin-Key`) |

---

## 🚀 Local Development Setup

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Start the FastAPI Server
```bash
python database.py
# or
uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload
```

Visit **`http://localhost:8000`** in your browser. The SQLite database `cantenex.db` will automatically initialize with all 36 dishes, initial orders, and student profiles.

---

## 🌐 Production Deployment Guide

### 1. Database Deployment (PostgreSQL)
Create a managed PostgreSQL database on **Neon**, **Supabase**, **Render**, or **Railway**:
- Copy the provided `schema_postgres.sql` into your database's SQL query editor, or let the FastAPI backend auto-initialize on first connection.

### 2. Backend Deployment (Render / Railway)
1. Push your repository to GitHub.
2. In **Render** or **Railway**, create a new **Web Service** pointing to the repository:
   - **Environment**: Python 3
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn backend.main:app --host 0.0.0.0 --port $PORT`
3. Set Environment Variables:
   - `DATABASE_URL`: `postgresql://<user>:<password>@<host>:<port>/<dbname>`
   - `ADMIN_SECRET`: Your secure staff passcode (e.g. `cantenex_staff_2026`)
   - `CORS_ORIGINS`: `https://cantenex.vercel.app` (or `*`)
   - `ENVIRONMENT`: `production`

### 3. Frontend Deployment (Vercel)
1. In **Vercel**, import the repository as a **Static Project**.
2. Edit `config.js` or set `window.CANTENEX_API_URL` to your live Render backend URL:
   ```javascript
   window.CANTENEX_API_URL = "https://cantenex-api.onrender.com";
   ```
3. Deploy! Vercel will host the frontend with automatic HTTPS and edge CDN caching.

---

## 🧪 Testing

Run the automated test suite:
```bash
python -m pytest backend/test_api.py -v
```

---

## 👨‍🎓 Project Credits

- **Developer**: Dinesh C
- **Course**: Web Essentials Mini Project
- **License**: MIT
