from fastapi import APIRouter
from app.routes import auth, board

api_router = APIRouter()

api_router.include_router(auth.router, tags=["auth"])
api_router.include_router(board.router, tags=["board"])