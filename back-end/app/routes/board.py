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

class UpdateListTitleRequest(BaseModel):
    title: str

class UpdateListPositionRequest(BaseModel):
    position: int

class CreateCardRequest(BaseModel):
    title: str
    position: int

class UpdateCardRequest(BaseModel):
    title: str | None = None
    description: str | None = None
    due_date: str | None = None
    position: int | None = None
    list_id: int | None = None
    completed: bool | None = None

class CreateLabelRequest(BaseModel):
    name: str
    color: str

class UpdateLabelRequest(BaseModel):
    name: str | None = None
    color: str | None = None

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

    # Fetch every label attached to any card on this board, so each card can
    # get its own "labels" list below
    cursor.execute("""
        SELECT card_labels.card_id, labels.id, labels.name, labels.color
        FROM card_labels
        JOIN labels ON labels.id = card_labels.label_id
        JOIN cards ON cards.id = card_labels.card_id
        JOIN lists ON lists.id = cards.list_id
        WHERE lists.board_id = %s AND lists.active = true AND cards.active = true
    """, (board_id,))
    db_card_labels = cursor.fetchall()

    labels_by_card = {}
    for row in db_card_labels:
        labels_by_card.setdefault(row['card_id'], []).append({
            "id": row['id'],
            "name": row['name'],
            "color": row['color'],
        })

    # Group cards by list_id and nest them into each list
    cards_by_list = {}
    for card in db_cards:
        list_id = card['list_id']
        card_dict = dict(card)
        card_dict['labels'] = labels_by_card.get(card_dict['id'], [])
        cards_by_list.setdefault(list_id, []).append(card_dict)

    lists_with_cards = []
    for lst in db_lists:
        lst_dict = dict(lst)
        lst_dict['cards'] = cards_by_list.get(lst_dict['id'], [])
        lists_with_cards.append(lst_dict)

    # Fetch this board's labels, each annotated with how many active cards
    # currently have it attached (used by the frontend to warn before delete)
    cursor.execute("""
        SELECT labels.*, COUNT(cards.id) AS card_count
        FROM labels
        LEFT JOIN card_labels ON card_labels.label_id = labels.id
        LEFT JOIN cards ON cards.id = card_labels.card_id AND cards.active = true
        WHERE labels.board_id = %s
        GROUP BY labels.id
        ORDER BY labels.id ASC
    """, (board_id,))
    db_labels = cursor.fetchall()

    return {
        "message": "Successfully fetched board",
        "data": {
            **dict(board),
            "lists": lists_with_cards,
            "labels": db_labels
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

@router.patch("/board-list/{list_id}/title")
def update_board_list_title(list_id: int, body: UpdateListTitleRequest, cursor=Depends(db.get_cursor), current_user = Depends(get_current_user)):
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
    
    # Update the list title
    cursor.execute("UPDATE lists SET title = %s WHERE id = %s", (body.title.strip(), list_id))

    return {
        "message": "Successfully update list title"
    }

@router.patch("/board-list/{list_id}/position")
def update_board_list_position(list_id: int, body: UpdateListPositionRequest, cursor=Depends(db.get_cursor), current_user = Depends(get_current_user)):

    # Verify the list exists AND belongs to the current user
    cursor.execute("""
        SELECT lists.* FROM lists
        JOIN boards ON lists.board_id = boards.id
        WHERE lists.id = %s AND boards.owner_id = %s AND lists.active = true
    """, (list_id, current_user['id']))
    list_item = cursor.fetchone()

    if list_item is None:
        raise HTTPException(status_code=404, detail="List not found")

    # Update the list position
    cursor.execute("UPDATE lists SET position = %s WHERE id = %s", (body.position, list_id))

    return {
        "message": "Successfully update list position"
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

    if body.position is not None:
        cursor.execute("UPDATE cards SET position = %s WHERE id = %s", (body.position, card_id))

    if body.list_id is not None:
        cursor.execute("UPDATE cards SET list_id = %s WHERE id = %s", (body.list_id, card_id))

    if body.completed is not None:
        cursor.execute("UPDATE cards SET completed = %s WHERE id = %s", (body.completed, card_id))

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


# Labels
@router.post("/boards/{board_id}/labels")
def create_label(board_id: int, body: CreateLabelRequest, cursor=Depends(db.get_cursor), current_user=Depends(get_current_user)):
    validate_not_blank({"name": body.name, "color": body.color})

    # Verify the board exists AND belongs to the current user
    cursor.execute("SELECT * FROM boards WHERE id = %s AND owner_id = %s AND active = true", (board_id, current_user['id']))
    board = cursor.fetchone()

    if board is None:
        raise HTTPException(status_code=404, detail="Board not found")

    cursor.execute(
        "INSERT INTO labels (board_id, name, color) VALUES (%s, %s, %s)",
        (board_id, body.name.strip(), body.color.strip())
    )

    return {
        "message": "Successfully created label"
    }

@router.patch("/labels/{label_id}")
def update_label(label_id: int, body: UpdateLabelRequest, cursor=Depends(db.get_cursor), current_user=Depends(get_current_user)):
    # Verify the label exists AND belongs to the current user
    cursor.execute("""
        SELECT labels.* FROM labels
        JOIN boards ON labels.board_id = boards.id
        WHERE labels.id = %s AND boards.owner_id = %s AND boards.active = true
    """, (label_id, current_user['id']))
    label = cursor.fetchone()

    if label is None:
        raise HTTPException(status_code=404, detail="Label not found")

    if body.name is not None:
        validate_not_blank({"name": body.name})
        cursor.execute("UPDATE labels SET name = %s WHERE id = %s", (body.name.strip(), label_id))

    if body.color is not None:
        validate_not_blank({"color": body.color})
        cursor.execute("UPDATE labels SET color = %s WHERE id = %s", (body.color.strip(), label_id))

    return {
        "message": "Successfully updated label"
    }

@router.delete("/labels/{label_id}")
def delete_label(label_id: int, cursor=Depends(db.get_cursor), current_user=Depends(get_current_user)):
    # Verify the label exists AND belongs to the current user
    cursor.execute("""
        SELECT labels.* FROM labels
        JOIN boards ON labels.board_id = boards.id
        WHERE labels.id = %s AND boards.owner_id = %s AND boards.active = true
    """, (label_id, current_user['id']))
    label = cursor.fetchone()

    if label is None:
        raise HTTPException(status_code=404, detail="Label not found")

    # Labels have no `active` column — cascades to card_labels via ON DELETE CASCADE
    cursor.execute("DELETE FROM labels WHERE id = %s", (label_id,))

    return {
        "message": "Successfully deleted label"
    }

@router.post("/cards/{card_id}/labels/{label_id}")
def attach_label_to_card(card_id: int, label_id: int, cursor=Depends(db.get_cursor), current_user=Depends(get_current_user)):
    # Verify the card exists AND belongs to the current user, and get its board_id
    cursor.execute("""
        SELECT cards.id, lists.board_id FROM cards
        JOIN lists ON cards.list_id = lists.id
        JOIN boards ON lists.board_id = boards.id
        WHERE cards.id = %s AND boards.owner_id = %s AND lists.active = true AND cards.active = true
    """, (card_id, current_user['id']))
    card = cursor.fetchone()

    if card is None:
        raise HTTPException(status_code=404, detail="Card not found")

    # Verify the label exists, belongs to the current user, AND belongs to the same board as the card
    cursor.execute("""
        SELECT labels.* FROM labels
        JOIN boards ON labels.board_id = boards.id
        WHERE labels.id = %s AND boards.owner_id = %s AND boards.active = true
    """, (label_id, current_user['id']))
    label = cursor.fetchone()

    if label is None or label['board_id'] != card['board_id']:
        raise HTTPException(status_code=404, detail="Label not found")

    cursor.execute(
        "INSERT INTO card_labels (card_id, label_id) VALUES (%s, %s) ON CONFLICT DO NOTHING",
        (card_id, label_id)
    )

    return {
        "message": "Successfully attached label to card"
    }

@router.delete("/cards/{card_id}/labels/{label_id}")
def detach_label_from_card(card_id: int, label_id: int, cursor=Depends(db.get_cursor), current_user=Depends(get_current_user)):
    # Verify the card exists AND belongs to the current user
    cursor.execute("""
        SELECT cards.id FROM cards
        JOIN lists ON cards.list_id = lists.id
        JOIN boards ON lists.board_id = boards.id
        WHERE cards.id = %s AND boards.owner_id = %s AND lists.active = true AND cards.active = true
    """, (card_id, current_user['id']))
    card = cursor.fetchone()

    if card is None:
        raise HTTPException(status_code=404, detail="Card not found")

    cursor.execute(
        "DELETE FROM card_labels WHERE card_id = %s AND label_id = %s",
        (card_id, label_id)
    )

    return {
        "message": "Successfully detached label from card"
    }