from fastapi import APIRouter
from app.routes import auth, task, board

api_router = APIRouter()

api_router.include_router(auth.router)
api_router.include_router(board.router)
api_router.include_router(task.router)