from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()

class Task(BaseModel):
    id: int
    title: str
    completed: bool = False

@router.get("/tasks")
def get_tasks():
    return {
        "message": "歡迎光臨你大爺的任務列表！",
        "task_list": [
            {"id": 1, "title": "買牛奶", "completed": False},
            {"id": 2, "title": "寫程式", "completed": True},
            {"id": 3, "title": "吃飯", "completed": False},
        ]
    }

@router.post("/tasks")
def create_task(task: Task = {"id": 3, "title": "吃飯", "completed": False}):
    return {
        "message": "任務已創建！",
        "task": task
    }

@router.delete("/tasks/{task_id}")
def delete_task(task_id: int):
    return {
        "message": f"任務 {task_id} 已刪除！"
    }