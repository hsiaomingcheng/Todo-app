# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A full-stack Trello-like Todo app with a separated React frontend and FastAPI backend.

## Commands

### Backend (`back-end/`)
```bash
# Activate virtual environment first
source venv/bin/activate

# Run development server (port 8000)
fastapi dev
# or
uvicorn app.main:app --reload --port 8000

# Install dependencies
pip install -r requirements.txt

# Update requirements after installing new packages
pip freeze > requirements.txt
```

### Frontend (`front-end/`)
```bash
# Run development server (port 5173)
npm run dev

# Build for production
npm run build
```

### Database
```bash
# Schema is in back-end/sql/create_tables.sql (WARNING: drops all tables)
# Sample data in back-end/sql/population.sql
# To add a column to an existing table use ALTER TABLE, not recreating the table
```

## Architecture

### Backend (`back-end/app/`)
- `main.py` — FastAPI app entry point; mounts `api_router` under `/api` prefix; generates `openapi.json` on startup
- `__init__.py` — lifespan handler that initialises the DB connection
- `connect.py` — reads DB credentials from `.env` (`DB_USER`, `DB_PASS`, `DB_HOST`, `DB_PORT`, `DB_NAME`)
- `db.py` — provides `get_cursor()` dependency (RealDictCursor — rows are dicts keyed by column name)
- `router.py` — aggregates all route modules; tags them for Swagger UI (`auth`, `board`, `task`)
- `security.py` — `HTTPBearer` token extraction + `get_current_user` dependency that decodes JWT and returns the user row
- `validators.py` — `validate_not_blank()` utility for field validation

Routes live in `app/routes/`: `auth.py`, `board.py`, `task.py`. Each file creates its own `APIRouter` and is registered in `router.py`.

### Auth Flow
- Login returns a JWT signed with `SECRET_KEY` (HS256, 60 min expiry), with `sub` set to the user's integer ID
- All protected endpoints use `Depends(get_current_user)`, which validates the token and returns the full user row from the DB
- `SECRET_KEY` must be set in `back-end/.env`

### Soft Deletes
Both `users` and `boards` and `lists` tables have an `active BOOLEAN NOT NULL DEFAULT TRUE` column. Deletion sets `active = false` — never hard deletes.

### UI Components
shadcn/ui is used as the component library, built on top of Radix UI primitives and Tailwind CSS v4. Components live in `front-end/src/components/ui/`. Add new components via `npx shadcn@latest add <component>`.

### Frontend (`front-end/src/`)
- `api/client.ts` — Axios instance with base URL `/api`; request interceptor attaches `Authorization: Bearer <token>` from localStorage; response interceptor clears token and redirects to `/login` on 401
- `api/apis.ts` — all API call functions; centralised in one file
- `context/AuthContext.tsx` — stores `token` and `userDetails` in React state; `login()` saves token to localStorage; `logout()` removes it and navigates to `/login`
- `App.tsx` — route definitions; protected routes wrapped in `<ProtectedRoute>` which checks token existence

### Vite Proxy
The frontend dev server proxies `/api/*` → `http://localhost:8000`, so frontend calls like `api.get('/boards')` hit the backend at `http://localhost:8000/api/boards`.

### Database Schema
PostgreSQL. Key tables: `users`, `boards`, `board_members`, `lists`, `cards`, `card_assignees`, `tasks`, `labels`, `card_labels`. Full schema in `back-end/sql/create_tables.sql`.
