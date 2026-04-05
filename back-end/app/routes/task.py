from fastapi import APIRouter, Depends
from pydantic import BaseModel
from app.security import get_current_user
import app.db as db

router = APIRouter()

class Task(BaseModel):
    id: int
    title: str
    completed: bool = False

@router.get("/tasks")
def get_tasks(cursor=Depends(db.get_cursor), current_user = Depends(get_current_user)):
    # cursor → use it to query the DB
    cursor.execute("SELECT * FROM tasks WHERE user_id = %s", (current_user["id"],))
    tasks = cursor.fetchall()

    # current_user → a dict of the logged-in user's row from DB
    # e.g. current_user["id"], current_user["user_account"], current_user["email"]

    return {
        "message": "歡迎光臨你大爺的任務列表！",
        "task_list": [
            {"id": 1, "title": "買牛奶", "completed": False},
            {"id": 2, "title": "寫程式", "completed": True},
            {"id": 3, "title": "吃飯", "completed": False},
        ]
    }

@router.post("/tasks")
def create_task(task: Task):
    return {
        "message": "任務已創建！",
        "task": task
    }

@router.delete("/tasks/{task_id}")
def delete_task(task_id: int):
    return {
        "message": f"任務 {task_id} 已刪除！"
    }

@router.put("/tasks/{task_id}")
def update_task(task_id: int, task: Task):
    return {
        "message": f"任務 {task_id} 已更新！",
        "task": task
    }