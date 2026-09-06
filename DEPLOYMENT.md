# Deployment

TodoFlow is not deployed anywhere yet. This doc lays out a deployment plan optimised for two constraints: **$0 budget** (student, no card commitments beyond free tiers) and **low latency from New Zealand** (this is a portfolio piece for NZ job applications — a demo that feels snappy to a Wellington/Auckland-based interviewer matters more than raw spec).

## Recommended stack

| Layer | Service | Free tier | Why this one |
|---|---|---|---|
| Frontend (`front-end/`) | **Vercel** | Unlimited personal projects, 100GB bandwidth/mo | Global edge CDN — static assets are fast from NZ automatically, no region picking needed. Zero-config for Vite. |
| Backend (`back-end/`) | **Render**, Singapore region | 750 instance-hours/mo, 512MB RAM | Of the mainstream free-tier PaaS options, Render is the only one with an APAC region (Singapore) on the free plan. No Sydney option exists on Render, but Singapore → NZ (~100–150ms) beats a US region (~200–260ms) by a wide margin. |
| Database | **Neon** or **Supabase**, Sydney region (`ap-southeast-2`) | Neon: 0.5GB storage, 100 compute-hrs/mo. Supabase: 500MB storage | Both offer an actual Sydney region — the closest a free database gets to NZ. Both are also meaningfully more durable than Render's free Postgres, which **auto-deletes 30 days after creation** — don't use it for this reason. Neon/Supabase aren't permanent either (see below), just on a much longer clock, and a free uptime pinger closes the gap either way. |

This is three separate free accounts (Vercel, Render, Neon/Supabase) rather than one all-in-one platform, because no single free tier currently covers frontend + backend + a persistent database without one of those catches. Total ongoing cost: **$0/month**, indefinitely, as long as usage stays within the limits above (fine for a demo/portfolio app with light traffic).

### Platforms deliberately not used
- **Railway** — genuinely free tier exists again (0.5GB RAM/storage) but has no APAC region (US/EU only), so no latency advantage over Render Singapore, and it's more fiddly to keep on the free plan than Render.
- **Fly.io** — no longer has a free allowance as of 2026; requires a card and bills usage from the start.
- **Render Postgres (free)** — expires after 30 days, 14-day grace period, then deleted. Fine for a throwaway demo, wrong for something you'll link on a CV.

### Known trade-off: cold starts
Render's free web service **spins down after 15 minutes of no traffic** and takes ~30–60s to wake up on the next request. For a portfolio project this is usually acceptable (mention it if an interviewer is watching live: "first load may take a moment, it's a free-tier cold start"), but it's worth knowing about before demo day.

### Known trade-off: database inactivity
Free databases aren't left running forever untouched, and the two candidates behave differently:

- **Supabase** (confirmed from their own docs): a project pauses after **7 days** with no database activity. Data is kept, but resuming it means going into the dashboard and clicking "Resume project" by hand — not something you want to discover for the first time while a recruiter is looking at your demo.
- **Neon**: officially, a free-plan compute suspends after 5 minutes of inactivity but data is *not* deleted for being idle — Neon's own docs and FAQ don't currently document any inactivity-based project deletion. (Note: an earlier draft of this doc claimed a specific 90-day auto-deletion policy taking effect 2026-10-05 — I could not confirm that from Neon's official docs, pricing page, or 2026 changelogs, so I've left it out rather than stating it as fact. If you have a source for it — an email from Neon, a support thread — send it over and I'll fold it back in with a citation.)

Either way, the fix is the same and cheap: a free uptime pinger (cron-job.org or UptimeRobot, free plans) hitting a backend health endpoint **at least once a week** keeps both Render and the database ticking over, so a demo opened months after you stop actively working on it still just works. This is step 9 below — don't skip it for a CV project.

## Code changes required before deploying

The app currently assumes frontend and backend share an origin (Vite's dev proxy forwards `/api/*` → `localhost:8000`, so no CORS handling exists — see [FRONTEND.md](FRONTEND.md)). In production, Vercel and Render are different origins, so two changes are needed:

1. **Backend: add CORS middleware** in `back-end/app/main.py` (FastAPI's `CORSMiddleware`), allowing the deployed Vercel origin (and `localhost:5173` for local dev).
2. **Frontend: make the API base URL configurable** in `front-end/src/api/client.ts` — read it from a Vite env var (e.g. `VITE_API_URL`), falling back to `/api` so local dev via the proxy keeps working unchanged. Then set `VITE_API_URL=https://<your-render-app>.onrender.com/api` in Vercel's project environment variables.

Neither change touches existing logic or UI — they're additive plumbing, not behaviour changes.

## Setup steps

### 1. Database tables (Neon, Sydney)
Create the free Neon project first (region `Asia Pacific (Sydney) — aws-ap-southeast-2`), then run `back-end/sql/create_tables.sql` against it via the Neon SQL Editor or `psql`, and optionally `population.sql` for demo data. Enter the connection string directly in Neon's own interface — don't paste it into chat.

`back-end/app/connect.py` reads `DB_USER` / `DB_PASS` / `DB_HOST` / `DB_PORT` (defaults to `5432`) / `DB_NAME` — split Neon's pooled connection string (the one with `-pooler` in the host) into those five values when it's time to set env vars in step 5.

`back-end/app/db.py` calls `psycopg2.connect()` without an explicit `sslmode`. psycopg2's default is `sslmode='prefer'`, which negotiates SSL first and should satisfy Neon's requirement without any code change. **Fallback if you hit a connection error after deploying:** add `sslmode='require'` to both `psycopg2.connect(...)` calls in `db.py` (in `get_db()` and `get_cursor()`).

*(Supabase is a fine alternative if you'd rather have a dashboard/table editor UI — same region availability, slightly smaller storage cap, but see the pausing note above.)*

### 2. Backend: add CORS middleware
In `back-end/app/main.py`, add FastAPI's `CORSMiddleware`. Allow `http://localhost:5173` (local dev) now; leave the production Vercel origin as a placeholder — you won't have that URL until step 6, and you'll come back to fill it in at step 7.

### 3. Frontend: make the API URL configurable
In `front-end/src/api/client.ts`, read the API base URL from a Vite env var (`VITE_API_URL`), falling back to `/api` so local dev through the Vite proxy is unaffected. Neither this nor step 2 touches existing logic or UI — both are additive plumbing.

### 4. Commit and push
Push the changes from steps 2–3 to `main` on GitHub.

### 5. Backend (Render, Singapore)
1. New Web Service on Render → connect the repo → root directory `back-end/`.
2. Region: **Singapore**.
3. Build command: `pip install -r requirements.txt`. Start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`.
4. Environment variables: `SECRET_KEY` (generate a random value) plus the five `DB_*` values from step 1 — enter these directly in Render's dashboard, not in chat or logs.
5. Confirm `https://<your-app>.onrender.com/docs` loads Swagger UI.

### 6. Frontend (Vercel)
1. New Project on Vercel → import the repo → root directory `front-end/` (Vite auto-detected).
2. Environment variable: `VITE_API_URL=https://<your-render-app>.onrender.com/api`, using the real URL from step 5.
3. Deploy — Vercel gives you a `*.vercel.app` URL on the global edge network by default, no region choice needed.

### 7. Go back and fix the CORS origin
Replace the placeholder from step 2 with the real Vercel URL from step 6, commit, push — Render redeploys automatically. Easy to forget, and if you do, the frontend will look broken (API calls blocked by CORS) even though everything else is configured correctly.

### 8. End-to-end test
Open the Vercel URL and actually use the app — log in, create a board, confirm data round-trips through Render to Neon and back. The first request being slow (30–60s) is the Render cold start, not a bug.

### 9. Keep it alive
Set up a free schedule on cron-job.org or UptimeRobot hitting a safe backend `GET` endpoint (a health check, or something read-only) **at least weekly**, to stop Render sleeping for good and to keep the database showing activity (see the inactivity note above).

### Optional: a real domain (free, via student status)
The GitHub Student Developer Pack includes a free `.me` domain (1 year, via Namecheap) plus a free SSL cert. `chrishsiao.me` (or similar) on your CV reads better than a `.vercel.app`/`.onrender.com` URL and costs nothing while your student status is verified. Not required to ship — worth doing once the app is live and you're polishing what goes on applications.

## When you'd outgrow this
The likely first ceiling is Neon/Supabase's ~0.5GB storage or Render's 512MB RAM — both far beyond what a demo/portfolio Todo app with a handful of seeded boards needs. If it ever needs to survive real concurrent users, the cheapest upgrade path is Render's $7/mo starter web service (removes the sleep/cold-start) before touching the database tier.
