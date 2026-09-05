# Frontend (React + Vite)

TodoFlow's frontend: React 18 + TypeScript, Vite, Tailwind CSS v4, shadcn/ui (Radix UI primitives).

## Setup

Requires Node.js 18+.

```bash
cd front-end
npm install
```

## Run

```bash
npm run dev
# App at http://localhost:5173
```

```bash
npm run build   # production build
```

## How API calls reach the backend

```
React (Vite dev server, :5173)
   ↓  api.get('/boards')  →  /api/boards
   ↓  (Vite dev-server proxy)
FastAPI backend (:8000)  →  /api/boards
```

`vite.config.ts` proxies `/api/*` → `http://localhost:8000`, so the frontend never talks to a different origin in dev — no CORS handling needed. `host: true` is also set so the dev server is reachable from other devices on the same LAN (e.g. testing on a phone) — see [BACKEND.md](BACKEND.md) for how the backend itself is started.

## Architecture (`front-end/src/`)

- `api/client.ts` — Axios instance, base URL `/api`. Request interceptor attaches `Authorization: Bearer <token>` from `localStorage`; response interceptor clears the token and redirects to `/login` on a `401`.
- `api/apis.ts` — every API call function, centralised in one file (not spread across components).
- `context/AuthContext.tsx` — holds `token` and `userDetails` in React state. `login()` saves the token to `localStorage`; `logout()` removes it and navigates to `/login`.
- `components/common/ProtectedRoute.tsx` — gatekeeper for authenticated routes. A user visiting e.g. `/board-lists/:id` hits this first; if not logged in, they're redirected to `/login` before the real page ever renders.
- `App.tsx` — route definitions; authenticated routes are wrapped in `<ProtectedRoute>`.
- `components/ui/` — shadcn/ui primitives (Button, Dialog, Input, …). Add new ones with `npx shadcn@latest add <component>` rather than hand-rolling them.
- `components/common/` — app-specific reusable pieces built on top of `ui/` (modals, cards, list headers/footers, etc).
- `types/board.ts` — shared TypeScript interfaces for `User`, `Board`, `BoardList`, `Card`.

## UI improvement rule

When improving the style of a page or component:
- Only improve styling — do not change existing logic or behaviour.
- If a new UI element needs logic that isn't implemented yet, build the shell and leave a comment describing what it should do, e.g. `{/* TODO: Add a card — calls POST /lists/:id/cards */}`.
