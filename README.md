# CalorieTracker — Frontend

The web client for **CalorieTracker**: register, configure your profile,
log meals from the FatSecret food database, track macros and water, and
view daily / weekly / monthly nutrition summaries.

The Spring Boot REST API lives in a separate repository:
[CalorieTracker-Backend](https://github.com/jircik/CalorieTracker-Backend).

---

## Live

* **Web app:** [https://calorietracker.jircik.dev](https://calorietracker.jircik.dev)
* **Backend repo:** [CalorieTracker-Backend](https://github.com/jircik/CalorieTracker-Backend)

Deployed on **Cloudflare Pages** (static export). The app talks to the
Railway-hosted backend over HTTPS using a JWT pulled from `localStorage`.

---

## Stack

- **Next.js 16** (App Router) with `output: "export"` — ships as a fully
  static SPA, no Node server required.
- **React 19** + **TypeScript**
- **Tailwind CSS v4** for styling
- **TanStack Query** for server state and caching
- **Zustand** for auth state (token, userId, name) hydrated from `localStorage`
- **axios** with a 401 interceptor that clears the session and redirects to login
- **React Hook Form** + **Zod** for form validation
- **Sonner** for toasts
- **Lucide** for icons
- **Recharts** for the history chart

---

## Features

- **Auth** — register / login flows backed by JWT (24h), with form
  validation (RHF + Zod), 8-character password rule, and graceful
  error surfacing via a shared `extractApiError` helper.
- **4-step onboarding wizard** — captures age, gender, height, weight,
  weight goal, calorie goal, water goal, and activity level after
  registration. Every step is skippable; progress dots and Back / Next.
- **Dashboard / diary** — calorie ring, macro bar, water widget, and
  one card per meal slot (BREAKFAST / LUNCH / DINNER / SNACKS). Diary
  adds a date-picker for navigating past days; dashboard is always today.
- **Tap-to-create meal flow** — tapping an empty meal slot creates the
  meal immediately with a smart default time (now if today, otherwise a
  per-type default of 08:00 / 12:00 / 19:00 / 15:00) and routes straight
  to food search.
- **One meal per type per day** — if the backend returns `409` because
  a meal of that type already exists, the UI surfaces a friendly toast
  and redirects to the existing meal.
- **Inline meal-time editing** — the date / time on the meal detail
  page is an inline-editable field that calls `PATCH /meals/{id}`,
  with the same `409` handling when moving to an occupied day.
- **Error banner with retry** — when any of the dashboard's queries
  fail (offline, backend down), a single banner names the failed
  resources and offers a one-click retry instead of silent breakage.
- **Brand + PWA scaffolding** — custom logo SVGs, full favicon set,
  `site.webmanifest` for "Add to Home Screen" on iOS / Android.

---

## Project structure

```
src/
├── api/         API call functions, one file per backend domain
├── app/         Next.js App Router pages
│   ├── favicon.ico, apple-icon.png    Auto-served by Next 16
│   ├── login, register                Public auth screens
│   └── (app)/                         Protected route group (auth-guarded layout)
│       ├── dashboard, diary           Today's data and date-picker view
│       ├── meal                       Meal detail (?id=N) and add-food (?mealId=N)
│       ├── history                    Period summaries
│       └── profile                    Onboarding wizard and settings
├── components/
│   ├── ui/        Generic primitives (Button, Input, Card, Modal)
│   └── features/  Domain widgets (CalorieRing, MacroBar, MealCard, DayView…)
├── hooks/         Custom hooks (useDebouncedValue)
├── lib/           API client (axios), date/number formatters, error helpers
├── store/         Zustand auth store with localStorage hydration
└── types/         TypeScript types matching backend DTOs
```

### A note on routing

This is a fully static export, so dynamic route segments (`[mealId]`)
require `generateStaticParams` at build time and don't work for runtime
IDs. Meal detail and food search use **query strings instead**:

- `/meal?id=42`
- `/meal/add-food?mealId=42`

---

## Getting started

### Prerequisites
- Node.js 20+
- The backend running locally (default `http://localhost:8080`) or a
  deployed URL you can point at.

### Setup

```bash
npm install
cp .env.example .env.local       # then edit if needed (see below)
npm run dev                      # http://localhost:3000
```

### Environment variables

| Variable | Example | Purpose |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | `http://localhost:8080` | Base URL of the backend API |

Notes:
- The variable is **inlined at build time** by Next.js. Changing it in
  Cloudflare Pages requires a fresh deploy for the live bundle to pick
  up the new value.
- No trailing slash, include the scheme (`https://…`), no path.

Create a `.env.local` for local development. In production the value
is set in the Cloudflare Pages dashboard under Variables and Secrets.

---

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start the Next.js dev server with hot reload |
| `npm run build` | Build the static site to `out/` |
| `npm run lint` | Run ESLint |

---

## Deployment (Cloudflare Pages)

The app builds to a static site under `out/` and ships on **Cloudflare
Pages**.

1. Connect this repo in Cloudflare Pages.
2. **Framework preset:** Next.js (Static HTML Export).
3. **Build command:** `npm run build`.
4. **Build output directory:** `out`.
5. **Root directory:** leave blank — this repo is already the project root.
6. **Environment variables:** set `NEXT_PUBLIC_API_URL` to your deployed
   backend URL (e.g. `https://calorietracker-api.jircik.dev`) for both
   Production and Preview.
7. **CORS on the backend:** the backend's `CORS_ALLOWED_ORIGINS` env var
   must include every Pages origin you serve from, comma-separated. For
   this project that's:
   `https://calorietracker.jircik.dev,https://www.calorietracker.jircik.dev,http://localhost:3000`
   plus any `*.pages.dev` preview origin. Without this, every API call
   fails with a CORS error.

A `public/_headers` file sets long cache lifetimes on `/_next/static/*`
so browsers and Cloudflare's edge can cache hashed assets aggressively.

---

## Authentication

The backend issues JWTs valid for 24 hours. The frontend stores them in
`localStorage`, attaches `Authorization: Bearer <token>` on every
request, and clears the session + redirects to `/login` on any `401`.
There are no cookies and no server-side sessions — the app is a static
SPA.

---

## Working against the API

- Every backend domain has a thin client in `src/api/*.ts` that returns
  a typed response — components never touch axios directly.
- Server-computed values (totals, macros, summaries) are displayed
  as-is. The frontend never recalculates macros.
- Errors are normalised through `extractApiError(err)` (in `src/lib/api.ts`),
  which reads `{ message, errors[] }` from the backend's
  `@RestControllerAdvice` and falls back to friendly defaults for 401/503.
- Duplicate-meal `409` responses include `existingMealId`; use
  `getDuplicateMealId(err)` to extract it and route to the existing meal
  rather than treating it as a hard error.
- Detailed brief and design notes live under `notes/`.

---

## What's next

- **Recent / favorite foods** with one-tap quick-add on the food search
  screen.
- **Auto-calculate calorie + water goals** from profile fields, with a
  "Calculate for me" button on the onboarding wizard and settings.
- **Streaks** widget on the dashboard.
- **Weight tracking time series** on the history page.
- **PWA install + offline read** (the manifest is already in place).

---

## License

Private project. All rights reserved.
