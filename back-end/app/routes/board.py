from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from app.security import get_current_user
from app.validators import validate_not_blank
import app.db as db

router = APIRouter()

class CreateBoardRequest(BaseModel):
    title: str

class CreateListRequest(BaseModel):
    title: str
    position: int

class UpdateListRequest(BaseModel):
    title: str

class CreateCardRequest(BaseModel):
    title: str
    position: int

class UpdateCardRequest(BaseModel):
    title: str | None = None
    description: str | None = None
    due_date: str | None = None

# Boards
@router.get("/boards")
def get_boards(cursor=Depends(db.get_cursor), current_user = Depends(get_current_user)):
    cursor.execute("SELECT * FROM boards WHERE owner_id = %s AND active = true", (current_user['id'],))
    db_boards = cursor.fetchall()

    return {
        "message": "Successfully fetched boards",
        "data": db_boards
    }

@router.post("/boards")
def create_board(body: CreateBoardRequest, cursor=Depends(db.get_cursor), current_user = Depends(get_current_user)):
    # validate title
    validate_not_blank({
        "title": body.title,
    })

    # Create a new board
    cursor.execute("INSERT INTO boards (owner_id, title) VALUES (%s, %s)", (current_user['id'], body.title.strip()))
    
    return {
        "message": "Successfully create board"
    }

@router.get("/boards/{board_id}")
def get_board(board_id: int, cursor=Depends(db.get_cursor), current_user=Depends(get_current_user)):
    # Verify the board exists AND belongs to the current user
    cursor.execute("SELECT * FROM boards WHERE id = %s AND owner_id = %s AND active = true", (board_id, current_user['id']))
    board = cursor.fetchone()

    if board is None:
        raise HTTPException(status_code=404, detail="Board not found")

    # Fetch all active lists for this board
    cursor.execute("SELECT * FROM lists WHERE board_id = %s AND active = true ORDER BY position ASC", (board_id,))
    db_lists = cursor.fetchall()

    # Fetch all active cards for this board in one query
    cursor.execute("""
        SELECT cards.* FROM cards
        JOIN lists ON cards.list_id = lists.id
        WHERE lists.board_id = %s AND lists.active = true AND cards.active = true
        ORDER BY cards.position ASC
    """, (board_id,))
    db_cards = cursor.fetchall()

    # Group cards by list_id and nest them into each list
    cards_by_list = {}
    for card in db_cards:
        list_id = card['list_id']
        if list_id not in cards_by_list:
            cards_by_list[list_id] = []
        cards_by_list[list_id].append(dict(card))

    lists_with_cards = []
    for lst in db_lists:
        lst_dict = dict(lst)
        lst_dict['cards'] = cards_by_list.get(lst_dict['id'], [])
        lists_with_cards.append(lst_dict)

    return {
        "message": "Successfully fetched board",
        "data": {
            **dict(board),
            "lists": lists_with_cards
        }
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
@router.post("/board-lists/{board_id}")
def create_board_list(board_id: int, body: CreateListRequest, cursor=Depends(db.get_cursor), current_user = Depends(get_current_user)):
    # validate title
    validate_not_blank({
        "title": body.title,
    })

    # Verify the board exists AND belongs to the current user
    cursor.execute("SELECT * FROM boards WHERE id = %s AND owner_id = %s AND active = true", (board_id, current_user['id']))
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

@router.patch("/board-lists/{list_id}")
def update_board_list(list_id: int, body: UpdateListRequest, cursor=Depends(db.get_cursor), current_user = Depends(get_current_user)):
    validate_not_blank({"title": body.title})

    # Verify the list exists AND belongs to the current user
    cursor.execute("""
        SELECT lists.* FROM lists
        JOIN boards ON lists.board_id = boards.id
        WHERE lists.id = %s AND boards.owner_id = %s AND lists.active = true
    """, (list_id, current_user['id']))
    list_item = cursor.fetchone()

    if list_item is None:
        raise HTTPException(status_code=404, detail="List not found")

    # Update the list
    cursor.execute("UPDATE lists SET title = %s WHERE id = %s", (body.title.strip(), list_id))

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


# Cards
@router.get("/cards/{list_id}")
def get_cards(list_id: int, cursor=Depends(db.get_cursor), current_user=Depends(get_current_user)):
    # Verify the list exists AND belongs to the current user
    cursor.execute("""
        SELECT lists.* FROM lists
        JOIN boards ON lists.board_id = boards.id
        WHERE lists.id = %s AND boards.owner_id = %s AND lists.active = true
    """, (list_id, current_user['id']))
    list_item = cursor.fetchone()

    if list_item is None:
        raise HTTPException(status_code=404, detail="List not found")

    cursor.execute("SELECT * FROM cards WHERE list_id = %s AND active = true ORDER BY position ASC", (list_id,))
    db_cards = cursor.fetchall()

    return {
        "message": "Successfully fetched cards",
        "data": db_cards
    }

@router.post("/cards/{list_id}")
def create_card(list_id: int, body: CreateCardRequest, cursor=Depends(db.get_cursor), current_user=Depends(get_current_user)):
    validate_not_blank({"title": body.title})

    # Verify the list exists AND belongs to the current user
    cursor.execute("""
        SELECT lists.* FROM lists
        JOIN boards ON lists.board_id = boards.id
        WHERE lists.id = %s AND boards.owner_id = %s AND lists.active = true
    """, (list_id, current_user['id']))
    list_item = cursor.fetchone()

    if list_item is None:
        raise HTTPException(status_code=404, detail="List not found")

    cursor.execute(
        "INSERT INTO cards (list_id, title, position) VALUES (%s, %s, %s)",
        (list_id, body.title.strip(), body.position)
    )

    return {
        "message": "Successfully created card"
    }

@router.patch("/cards/{card_id}")
def update_card(card_id: int, body: UpdateCardRequest, cursor=Depends(db.get_cursor), current_user=Depends(get_current_user)):
    # Verify the card exists AND belongs to the current user
    cursor.execute("""
        SELECT cards.* FROM cards
        JOIN lists ON cards.list_id = lists.id
        JOIN boards ON lists.board_id = boards.id
        WHERE cards.id = %s AND boards.owner_id = %s AND lists.active = true AND cards.active = true
    """, (card_id, current_user['id']))
    card = cursor.fetchone()

    if card is None:
        raise HTTPException(status_code=404, detail="Card not found")

    # Only update fields that were provided
    if body.title is not None:
        validate_not_blank({"title": body.title})
        cursor.execute("UPDATE cards SET title = %s WHERE id = %s", (body.title.strip(), card_id))

    if body.description is not None:
        cursor.execute("UPDATE cards SET description = %s WHERE id = %s", (body.description, card_id))

    if body.due_date is not None:
        cursor.execute("UPDATE cards SET due_date = %s WHERE id = %s", (body.due_date, card_id))

    return {
        "message": "Successfully updated card"
    }

@router.delete("/cards/{card_id}")
def delete_card(card_id: int, cursor=Depends(db.get_cursor), current_user=Depends(get_current_user)):
    # Verify the card exists AND belongs to the current user
    cursor.execute("""
        SELECT cards.* FROM cards
        JOIN lists ON cards.list_id = lists.id
        JOIN boards ON lists.board_id = boards.id
        WHERE cards.id = %s AND boards.owner_id = %s AND lists.active = true AND cards.active = true
    """, (card_id, current_user['id']))
    card = cursor.fetchone()

    if card is None:
        raise HTTPException(status_code=404, detail="Card not found")

    # Soft delete
    cursor.execute("UPDATE cards SET active = false WHERE id = %s", (card_id,))

    return {
        "message": "Successfully deleted card"
    }