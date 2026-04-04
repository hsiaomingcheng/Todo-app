import json

from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.exceptions import HTTPException
from app import lifespan, router


app = FastAPI(lifespan=lifespan)
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