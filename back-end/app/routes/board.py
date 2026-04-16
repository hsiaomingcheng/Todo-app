from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from app.security import get_current_user
from app.validators import validate_not_blank
import app.db as db

router = APIRouter()

class CreateListRequest(BaseModel):                                                                                       
    title: str                                                                                                            
    position: int

# Boards
@router.get("/boards")
def get_boards(cursor=Depends(db.get_cursor), current_user = Depends(get_current_user)):
    cursor.execute("SELECT * FROM boards WHERE owner_id = %s AND active = true", (current_user['id'],))
    db_boards = cursor.fetchall()

    return {
        "message": "Successfully fetched boards",
        "data": db_boards
    }

@router.delete("/boards/{board_id}")
def delete_boards(board_id: int, cursor=Depends(db.get_cursor), current_user = Depends(get_current_user)):
    # Verify the board exists AND belongs to the current user
    cursor.execute("SELECT * FROM boards WHERE id = %s AND owner_id = %s AND active = true", (board_id, current_user['id']))
    board = cursor.fetchone()

    if board is None:
        raise HTTPException(status_code=404, detail="Board not found")

    # Set the board status to false
    cursor.execute("UPDATE boards SET active = false WHERE id = %s", (board_id,))
    
    return {
        "message": "Successfully deleted board",
        "data": board
    }


# Lists
@router.get("/board-lists/{board_id}")
def get_board_lists(board_id: int, cursor=Depends(db.get_cursor), current_user = Depends(get_current_user)):
    # Verify the board exists AND belongs to the current user
    cursor.execute("SELECT * FROM boards WHERE id = %s AND owner_id = %s", (board_id, current_user['id']))
    board = cursor.fetchone()

    if board is None:
        raise HTTPException(status_code=404, detail="Board not found")

    # Fetch all lists in the board
    cursor.execute("SELECT * FROM lists WHERE board_id = %s AND active = true ORDER BY created_at ASC", (board_id,))
    db_lists = cursor.fetchall()
    
    return {
        "message": "Successfully fetched lists",
        "data": db_lists
    }

@router.post("/board-lists/{board_id}")
def create_board_list(board_id: int, body: CreateListRequest, cursor=Depends(db.get_cursor), current_user = Depends(get_current_user)):
    # validate title
    validate_not_blank({
        "title": body.title,
    })

    # Verify the board exists AND belongs to the current user
    cursor.execute("SELECT * FROM boards WHERE id = %s AND owner_id = %s", (board_id, current_user['id']))
    board = cursor.fetchone()

    if board is None:
        raise HTTPException(status_code=404, detail="Board not found")

    # Create a new list
    cursor.execute("""
        INSERT INTO lists (board_id, title, position) VALUES (%s, %s, %s)
    """, (board_id, body.title.strip(), body.position))
    
    return {
        "message": "Successfully create list"
    }

@router.put("/board-lists/{list_id}")
def update_board_list(list_id: int, cursor=Depends(db.get_cursor), current_user = Depends(get_current_user)):
    # Verify the board exists AND belongs to the current user
    cursor.execute("""
        SELECT lists.* FROM lists
        JOIN boards ON lists.board_id = boards.id
        WHERE lists.id = %s AND boards.owner_id = %s AND lists.active = true
    """, (list_id, current_user['id']))
    list_item = cursor.fetchone()

    if list_item is None:
        raise HTTPException(status_code=404, detail="List not found")

    # Update the list
    # cursor.execute("UPDATE lists SET title = %s WHERE id = %s", (new_title, list_id))

    return {
        "message": "Successfully update list"
    }

@router.delete("/board-lists/{list_id}")
def delete_board_list(list_id: int, cursor=Depends(db.get_cursor), current_user = Depends(get_current_user)):
    # Verify the board exists AND belongs to the current user
    cursor.execute("""
        SELECT lists.* FROM lists
        JOIN boards ON lists.board_id = boards.id
        WHERE lists.id = %s AND boards.owner_id = %s AND lists.active = true
    """, (list_id, current_user['id']))
    list_item = cursor.fetchone()

    if list_item is None:
        raise HTTPException(status_code=404, detail="List not found")


    # Safe to soft delete
    cursor.execute("UPDATE lists SET active = false WHERE id = %s", (list_id,))

    return {
        "message": "Successfully delete list"
    }