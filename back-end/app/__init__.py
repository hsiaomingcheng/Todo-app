from contextlib import asynccontextmanager
from fastapi import FastAPI

# ── Database ──────────────────────────────────────────────────────────────────
from app import connect
from app import db

@asynccontextmanager
async def lifespan(app: FastAPI):
    db.init_db(
        connect.dbuser,
        connect.dbpass,
        connect.dbhost,
        connect.dbname,
        connect.dbport
    )
    yield

# ── Routes ──────────────────────────────────────────────────────────────────
from app import routes