import json

from fastapi import FastAPI
from app import lifespan
from app.routes import common, task

app = FastAPI(lifespan=lifespan)
app.include_router(common.router, prefix="/api")
app.include_router(task.router, prefix="/api")

# Generate OpenAPI schema and save to file
with open("openapi.json", "w") as f:
    json.dump(app.openapi(), f, indent=4)