# Backend (FastAPI)

TodoFlow's backend: FastAPI + PostgreSQL, JWT auth, no ORM (raw SQL via `psycopg2`).

## Setup

```bash
cd back-end
python3 -m venv venv
source venv/bin/activate       # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

Create `back-end/.env` (see `.env.example`) with `SECRET_KEY` and the DB credentials `connect.py` expects (`DB_USER`, `DB_PASS`, `DB_HOST`, `DB_PORT`, `DB_NAME`).

## Run

```bash
fastapi dev
# or
uvicorn app.main:app --reload --port 8000
```

- App: `http://localhost:8000`
- Swagger UI: `http://localhost:8000/docs`
- `openapi.json` is regenerated automatically on every startup (see `main.py`) — it's a generated artifact, not hand-edited.

After installing a new package:
```bash
pip freeze > requirements.txt
```

## Architecture (`back-end/app/`)

- `main.py` — FastAPI app entry point; mounts `api_router` under the `/api` prefix; regenerates `openapi.json` on startup
- `__init__.py` — lifespan handler that initialises the DB connection pool
- `connect.py` — reads DB credentials from `.env` (gitignored, not committed)
- `db.py` — provides the `get_cursor()` dependency (`psycopg2.extras.RealDictCursor` — rows come back as dicts keyed by column name, not tuples)
- `router.py` — aggregates all route modules and tags them for Swagger UI
- `security.py` — `HTTPBearer` token extraction + `get_current_user` dependency that decodes the JWT and returns the full user row
- `validators.py` — `validate_not_blank()` helper for manual field validation inside routes

Routes live in `app/routes/` (`auth.py`, `board.py`); each file owns its own `APIRouter` and is registered in `router.py`.

## Auth flow

1. Client sends `user_account` + `password` to `POST /api/auth/login`.
2. Backend verifies the password hash (argon2, via `argon2-cffi`) and issues a JWT (HS256, 60 min expiry, `sub` = user's integer ID).
3. Client stores the token and sends it as `Authorization: Bearer <token>` on every subsequent request.
4. Protected routes use `Depends(get_current_user)`, which decodes the token and returns the full user row from the DB — routes get `current_user` as a dict, not just an ID.

`SECRET_KEY` must be set in `back-end/.env`.

## API response conventions

Keep a consistent JSON shape for both success and error responses so the frontend can always read `response.message`:

```json
// Success
{ "message": "Login successful", "data": { ... } }

// Error
{ "message": "User not found" }
```

FastAPI's default `HTTPException` returns `{"detail": "..."}`, which doesn't match this shape — `main.py` registers a custom exception handler that remaps `detail` → `message` for every `HTTPException` raised anywhere in the app.

| Status | Meaning | When |
|---|---|---|
| `200` | OK | Successful GET or action (e.g. login) |
| `201` | Created | Successfully created a resource (e.g. register) |
| `401` | Unauthorized | Wrong password / missing or invalid token |
| `404` | Not Found | Resource doesn't exist (or doesn't belong to the current user) |
| `409` | Conflict | Duplicate resource (e.g. account already exists) |
| `422` | Unprocessable Entity | Validation failed (e.g. blank field) |

### Validation

Pydantic's `field_validator` runs before FastAPI does and only understands `ValueError` — you cannot raise `HTTPException` inside one. For validation that needs a proper HTTP status/message, validate manually inside the route function instead, using `validate_not_blank()` from `validators.py`:

```python
def validate_not_blank(fields: dict[str, str]) -> None:
    for field_name, value in fields.items():
        if not value or not value.strip():
            raise HTTPException(status_code=422, detail=f"{field_name} must not be empty")
```

## Soft deletes

`users`, `boards`, `lists`, and `cards` all have an `active BOOLEAN NOT NULL DEFAULT TRUE` column. Deletion sets `active = false` — the app never hard-deletes these rows. See [DATABASE.md](DATABASE.md) for the full schema and table relationships.

## Database

- Schema: `back-end/sql/create_tables.sql` (⚠️ drops and recreates every table — do not run against data you want to keep)
- Sample/seed data: `back-end/sql/population.sql`
- **To add a column to an existing table, write an `ALTER TABLE` migration — do not edit `create_tables.sql` and rerun it against a live database.**
- Full table-by-table reference: [DATABASE.md](DATABASE.md)

### Seeded test accounts (from `population.sql`)

| user_account | password |
|---|---|
| `alicesmith` | `password123` |
| `bobjones` | `password123` |
| `charlieb` | `password123` |
