from fastapi import APIRouter, Depends
from pydantic import BaseModel
from app.security import get_current_user
import app.db as db

router = APIRouter()

@router.get("/boards")
def get_boards(cursor=Depends(db.get_cursor), current_user = Depends(get_current_user)):
    return {
        "message": "Successfully fetched boards",
        "board_list": []
    }
