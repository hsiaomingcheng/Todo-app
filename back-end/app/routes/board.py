from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from app.security import get_current_user
import app.db as db

router = APIRouter()

@router.get("/boards")
def get_boards(cursor=Depends(db.get_cursor), current_user = Depends(get_current_user)):
    cursor.execute("SELECT * FROM boards WHERE owner_id = %s", (current_user['id'],))
    db_boards = cursor.fetchall()

    return {
        "message": "Successfully fetched boards",
        "data": db_boards
    }

@router.get("/boards/{board_id}")
def get_board(board_id: int, cursor=Depends(db.get_cursor), current_user = Depends(get_current_user)):
    # Verify the board exists AND belongs to the current user
    cursor.execute("SELECT * FROM boards WHERE id = %s AND owner_id = %s", (board_id, current_user['id']))
    board = cursor.fetchone()

    if board is None:
        raise HTTPException(status_code=404, detail="Board not found")

    # Fetch all lists in the board
    cursor.execute("SELECT * FROM lists WHERE board_id = %s ORDER BY created_at ASC", (board_id,))
    db_lists = cursor.fetchall()
    
    return {
        "message": "Successfully fetched lists",
        "data": db_lists
    }

@router.delete("/boards/{board_id}")
def delete_boards(board_id: int, cursor=Depends(db.get_cursor), current_user = Depends(get_current_user)):
    # Verify the board exists AND belongs to the current user
    cursor.execute("SELECT * FROM boards WHERE id = %s AND owner_id = %s", (board_id, current_user['id']))
    board = cursor.fetchone()

    if board is None:
        raise HTTPException(status_code=404, detail="Board not found")

    # Set the board status to false
    cursor.execute("UPDATE boards SET active = false WHERE id = %s", (board_id,))
    
    return {
        "message": "Successfully deleted board",
        "data": board
    }