import json

from fastapi import FastAPI
from app import lifespan, router


app = FastAPI(lifespan=lifespan)
app.include_router(router.api_router, prefix="/api")

# Generate OpenAPI schema and save to file
with open("openapi.json", "w") as f:
    json.dump(app.openapi(), f, indent=4)