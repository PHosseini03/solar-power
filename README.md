# HelioGrid Solar: demo website

**Live-Demo:** https://PHosseini03.github.io/solar-power/ · **Alle Demos:** https://PHosseini03.github.io/website-showcase/

A modern, dark, glassmorphism-style website for a solar installer. React + TypeScript frontend and a FastAPI backend.

**Language:** the whole site is in German (formal "Sie"), including demo data, API error messages, € prices and de-DE number formats. The savings calculator uses German assumptions: 0.35 €/kWh, 1.60 €/W turnkey with 0 % VAT, 75 % of the bill covered by self-consumption plus feed-in tariff, 0.38 kg CO₂/kWh and 2.6–3.2 peak sun hours by region. API field names and routes stay in English.

![Desktop](screenshots/hero.png)

## Features
- Animated hero with a live-production card, count-up company stats
- **Savings calculator** (bill slider, sunshine region, roof type) priced live by the Python API, with an offline fallback
- Financing plans, project gallery with filters, FAQ accordion
- Free-quote form with client and server validation, saved to SQLite
- Fully responsive (360px to 1440px+), keyboard accessible, respects reduced-motion

## Run it
| Part | Port | Command (from this folder) |
|---|---|---|
| API | 8001 | `cd backend; python -m venv .venv; .venv\Scripts\pip install -r requirements.txt; .venv\Scripts\python -m uvicorn app.main:app --port 8001` |
| Web | 5171 | `cd frontend; npm install; npm run dev` |

Open http://localhost:5171. API docs: http://localhost:8001/docs. Or run `..\start-site.ps1 solar-power` from the root folder.

## API
| Method | Path | Purpose |
|---|---|---|
| GET | `/api/health` | Health check |
| GET | `/api/plans` | Financing plans |
| GET | `/api/projects` | Featured installs |
| GET | `/api/stats` | Company stats |
| POST | `/api/savings/estimate` | Savings estimate (120/min) |
| POST | `/api/quotes` | Quote request (10/min) |

All responses use `{ "success": bool, "data": ..., "error": string | null }`.

## Quality
- Backend: `pip install -r requirements-dev.txt; pytest --cov=app`
- Frontend: `npm test`, `npm run lint`, `npm run build`
- Security: strict Pydantic schemas (extra fields rejected), parameterized SQL, rate limiting, body-size limit, CORS allow-list, security headers, no secrets in code.

*Demo only. The company, people, reviews and figures are fictional. Photos: Unsplash (free licence).*
