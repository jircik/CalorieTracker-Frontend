# CalorieTracker — Frontend

The web client for **CalorieTracker**: log meals from the FatSecret food
database, track macros and water intake, and view daily / weekly / monthly
nutrition summaries.

This is the frontend only. The Spring Boot REST API lives in a separate
repository: [calorietracker-api](https://github.com/jircik/calorietracker-api). <!-- update if your repo URL differs -->

---

## Stack

- **Next.js 16** (App Router) with `output: "export"` — ships as a fully
  static SPA, no Node server required.
- **React 19** + **TypeScript**
- **Tailwind CSS v4** for styling
- **TanStack Query** for server state and caching
- **Zustand** for auth state (token, userId, name) hydrated from localStorage
- **axios** with a 401 interceptor that clears the session and redirects to login
- **React Hook Form** + **Zod** for form validation
- **Sonner** for toast notifications
- **Lucide** for icons
- **Recharts** for the optional history chart

## Project structure

```
src/
├── api/         API call functions, one file per backend domain
├── app/         Next.js App Router pages
│   ├── login, register      Public auth screens
│   └── (app)/               Protected route group (auth-guarded layout)
│       ├── dashboard, diary       Today's data and date-picker view
│       ├── meal                   Meal detail (?id=N) and add-food (?mealId=N)
│       ├── history                Period summaries
│       └── profile                Onboarding setup and settings
├── components/
│   ├── ui/      Generic primitives (Button, Input, Card, Modal)
│   └── features/  Domain widgets (CalorieRing, MacroBar, MealCard, etc.)
├── hooks/       Custom hooks (useDebouncedValue)
├── lib/         API client (axios instance), date/number formatters
├── store/       Zustand auth store
└── types/       TypeScript types matching backend DTOs
```

### A note on routing

This is a fully static export, so dynamic route segments (`[mealId]`)
require `generateStaticParams` at build time and don't work for runtime IDs.
Meal detail and food search use **query strings instead**:

- `/meal?id=42`
- `/meal/add-food?mealId=42`

## Getting started

### Prerequisites
- Node.js 20+
- The backend running locally (default `http://localhost:8080`) or a deployed
  URL you can point at

### Setup

```bash
npm install
cp .env.example .env.local       # then edit if needed (see below)
npm run dev                      # http://localhost:3000
```

### Environment variables

| Variable               | Example                          | Purpose                          |
| ---------------------- | -------------------------------- | -------------------------------- |
| `NEXT_PUBLIC_API_URL`  | `http://localhost:8080`          | Base URL of the backend API      |

Create a `.env.local` for local development. In production these are set in
your deployment platform's env-var UI (Cloudflare Pages, Vercel, etc.).

## Scripts

| Command          | What it does                                   |
| ---------------- | ---------------------------------------------- |
| `npm run dev`    | Start the Next.js dev server with hot reload  |
| `npm run build`  | Build the static site to `out/`                |
| `npm run lint`   | Run ESLint                                     |

## Deployment (Cloudflare Pages)

The app builds to a static site under `out/` and is intended for **Cloudflare
Pages**.

1. Connect this repo in Cloudflare Pages.
2. **Build command:** `npm run build`
3. **Output directory:** `out`
4. **Environment variables:** set `NEXT_PUBLIC_API_URL` to your deployed
   backend URL.
5. **CORS:** the backend must include your Pages origin (e.g.
   `https://<project>.pages.dev` and any custom domain) in its
   `application.security.cors.allowed-origins` config. Without this, every
   API call from the browser fails with a CORS error.

## Authentication

The backend issues JWTs valid for 24 hours. The frontend stores them in
`localStorage`, attaches them via `Authorization: Bearer <token>` on every
request, and clears the session + redirects to `/login` on any `401`. There
are no cookies and no server-side sessions.

## Working against the API

- All endpoints, request/response shapes, error formats, and validation
  rules are documented in [`notes/claude-frontend-brief.md`](notes/claude-frontend-brief.md).
- Every domain has a thin client in `src/api/*.ts` that returns a typed
  response — components never touch axios directly.
- Server-computed values (totals, macros, summaries) are displayed as-is.
  The frontend never recalculates macros.

## License

Private project. All rights reserved.
