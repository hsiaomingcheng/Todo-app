from fastapi import APIRouter, Depends
from pydantic import BaseModel
from app.security import hash_password
import app.db as db

router = APIRouter()

class User(BaseModel):
    email: str
    name: str
    user_account: str
    password: str


@router.get("/users")
def get_users(cursor = Depends(db.get_cursor)):
    cursor.execute("SELECT * FROM users")
    users = cursor.fetchall()
    return {"message": "Fetching all users", "users": users}

@router.post("/auth/login")
def login_user(user: User, cursor = Depends(db.get_cursor)):
    # Implementation for user login
    cursor.execute("SELECT * FROM users WHERE user_account = %s", (user.user_account,))
    db_user = cursor.fetchone()

    if not db_user:
        return {"message": "User not found"}
    
    if hash_password(user.password) != db_user[4]:  # Assuming password_hash is the 5th column
        return {"message": "Invalid password"}
    
    return {"message": "Login successful", "user": db_user}

@router.get("/auth/test-register")
def test_register_user(cursor = Depends(db.get_cursor)):

    test_data = {
        "email": "test@example.com",
        "name": "Test User",
        "user_account": "testuser",
        "password": "password123"
    }

    user = User(**test_data)
    register_user(user, cursor)

    return {
        "message": "This is a test registration endpoint. Please use /auth/register to register a user!"
    }

@router.post("/auth/register")
def register_user(user: User, cursor = Depends(db.get_cursor)):
    # 1. Verify if the user account already exists in the database
    cursor.execute("SELECT * FROM users WHERE user_account = %s", (user.user_account,))
    if cursor.fetchone():
        return {"message": "User account already exists"}

    # 2. If not, hash the password and insert the new user into the database
    cursor.execute("""
        INSERT INTO users (email, name, user_account, password_hash)
        VALUES (%s, %s, %s, %s)""", 
        (user.email, user.name, user.user_account, hash_password(user.password))
    )

    return {
        "message": f"User {user.user_account} has been registered successfully!"
    }