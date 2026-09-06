import json
import os

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import HTTPException
from app import lifespan, router


app = FastAPI(lifespan=lifespan)

# Frontend and backend share an origin in dev (Vite proxies /api -> here), so
# no CORS handling was needed. In production they're deployed as separate
# origins (see DEPLOYMENT.md) — FRONTEND_ORIGIN lets that be configured
# without touching code, defaulting to the local Vite dev server.
app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.getenv("FRONTEND_ORIGIN", "http://localhost:5173")],
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE"],
    allow_headers=["*"],
)

app.include_router(router.api_router, prefix="/api")

# Custom format for HTTP exceptions
@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"message": exc.detail}  # remap "detail" → "message"
    )

# Generate OpenAPI schema and save to file
with open("openapi.json", "w") as f:
    json.dump(app.openapi(), f, indent=4)