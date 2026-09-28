# TodoFlow

A full-stack, Trello-like Kanban/todo app — boards, lists, and cards with drag-and-drop, labels, search, and more. Built as a portfolio piece with a separated React frontend and FastAPI backend.

## Demo

- **Live app**: https://todo-app-two-olive-85.vercel.app
- **API docs (Swagger)**: https://todo-app-bnwv.onrender.com/docs

> The backend is on Render's free tier and may take ~30–60s to wake up on first load if it's been idle.

## Features

- Auth (register / login / JWT sessions)
- Board create, rename, delete, and per-board background color
- Lists: create, rename, reorder, delete, and archive (hide without deleting, restore anytime)
- Cards: create, edit (description, due date), mark complete, delete
- Drag-and-drop reordering — cards within/across lists, and lists within a board
- Labels: create, recolor, attach/detach from cards
- Filter cards by label or completion status
- Global search across all boards' cards
- Responsive layout (desktop + mobile)

## Tech stack

| Layer | Tech |
|---|---|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS v4, shadcn/ui (Radix UI) |
| Backend | FastAPI, raw SQL via `psycopg2` (no ORM), JWT auth (argon2 password hashing) |
| Database | PostgreSQL |
| Deployment | Vercel (frontend) · Render (backend) · Neon (Postgres) |

## Quick start

```bash
# Backend
cd back-end
python3 -m venv venv && source venv/bin/activate
pip install -r requirements.txt
# create back-end/.env — see BACKEND.md
fastapi dev

# Frontend (separate terminal)
cd front-end
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`, backend at `http://localhost:8000`. Full setup details (env vars, DB seeding) are in [BACKEND.md](BACKEND.md) and [FRONTEND.md](FRONTEND.md).

## Project structure

```
back-end/
  app/            FastAPI app — routes, auth, DB access
  sql/            Schema (create_tables.sql) and seed data (population.sql)
front-end/
  src/
    api/          Axios client + all API call functions
    components/   UI primitives (shadcn) and app-specific components
    pages/        Route-level pages
    context/      Auth state
```

## Documentation

- [BACKEND.md](BACKEND.md) — backend architecture, auth flow, API conventions
- [FRONTEND.md](FRONTEND.md) — frontend architecture, dev proxy setup
- [DATABASE.md](DATABASE.md) — full schema reference, table relationships
- [DEPLOYMENT.md](DEPLOYMENT.md) — how the live demo is deployed and kept alive on free tiers
- [todo-app-spec.md](todo-app-spec.md) — original product spec
