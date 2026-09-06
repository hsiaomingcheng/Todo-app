# Deployment

TodoFlow is deployed as a live demo, on a $0/month stack chosen for low latency from New Zealand (this is a portfolio piece for NZ job applications).

- **Frontend**: https://todo-app-two-olive-85.vercel.app
- **Backend**: https://todo-app-bnwv.onrender.com (Swagger UI at `/docs`)

## Stack

| Layer | Service | Region | Why |
|---|---|---|---|
| Frontend (`front-end/`) | Vercel | Global edge (no region setting) | Zero-config for Vite, static assets served fast from NZ automatically. |
| Backend (`back-end/`) | Render, free web service | Singapore | Closest free-tier APAC region to NZ (no Sydney option on Render). |
| Database | Neon, free tier | Sydney (`ap-southeast-2`) | Closest free Postgres region to NZ; more durable than Render's free Postgres, which auto-deletes after 30 days. |

Three separate free accounts rather than one all-in-one platform, since no single free tier covers frontend + backend + a persistent database without a catch.

## Code changes made to support this

The app assumed frontend and backend shared an origin (Vite's dev proxy forwards `/api/*` → `localhost:8000` locally, so no cross-origin handling existed). Deployed, Vercel and Render are separate origins, so:

1. **CORS**: `back-end/app/main.py` adds `CORSMiddleware`, allowed origin read from the `FRONTEND_ORIGIN` env var (falls back to `http://localhost:5173` for local dev).
2. **Configurable API URL**: `front-end/src/api/client.ts` reads the API base URL from `VITE_API_URL` (falls back to `/api`, so local dev via the Vite proxy is unaffected). Needed `front-end/src/vite-env.d.ts` added alongside it — TypeScript doesn't know about `import.meta.env` without it.
3. **SPA routing on Vercel**: `front-end/vercel.json` rewrites every path to `/index.html`. Without it, Vercel served the app as static files with no fallback — any direct hit on a client-side route (e.g. `/login`, a page refresh, a shared link) 404'd, since only `/` maps to a real file.
4. **Health check**: `GET /health` in `main.py`, outside the `/api` prefix and unauthenticated (uptime monitors can't hold a JWT). Runs `SELECT 1` so a hit counts as real database activity, not just backend activity.

None of these touch existing app logic — all additive plumbing.

## Environment variables

**Render** (backend):
| Variable | Value |
|---|---|
| `SECRET_KEY` | random string, generated for this deployment |
| `DB_USER`, `DB_PASS`, `DB_HOST`, `DB_PORT`, `DB_NAME` | split from Neon's pooled connection string (the host with `-pooler` in it) |
| `FRONTEND_ORIGIN` | `https://todo-app-two-olive-85.vercel.app` |

**Vercel** (frontend):
| Variable | Value |
|---|---|
| `VITE_API_URL` | `https://todo-app-bnwv.onrender.com/api` |

**Build/start commands (Render)**: build `pip install -r requirements.txt`, start `uvicorn app.main:app --host 0.0.0.0 --port $PORT`.

## Database

`back-end/sql/create_tables.sql` and `back-end/sql/population.sql` (seed/demo data) were run against the Neon database via Neon's SQL Editor. No `sslmode` override was needed in `db.py` — psycopg2's default (`prefer`) negotiates SSL and works against Neon as-is.

## Keeping the free tier alive

Two free-tier behaviors that would otherwise break the demo between visits:
- Render's free web service sleeps after 15 minutes of no traffic (~30–60s cold start on the next request).
- Neon's free compute suspends after 5 minutes of database inactivity (data isn't lost, just a brief resume delay on the next query).

**UptimeRobot** (free) runs an HTTP monitor against `https://todo-app-bnwv.onrender.com/health` every 10 minutes — under Render's 15-minute threshold, so the backend never actually sleeps, and each hit queries the database so Neon never sees 5 minutes of silence either.

Trade-off worth knowing: pinging often enough to prevent sleep means the backend runs continuously, which uses close to Render's full 750 free instance-hours/month (a 31-day month at 24/7 is 744 hours — about 6 hours of margin). If the demo ever goes down unexpectedly, check Render's instance-hours usage for the month before assuming the code broke.
