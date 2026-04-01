from fastapi import APIRouter, Depends
from pydantic import BaseModel, field_validator
from app.security import hash_password, verify_password
import app.db as db

router = APIRouter()

class LoginUser(BaseModel):
    user_account: str
    password: str

    # Validate that user_account and password are not empty or just whitespace
    @field_validator("user_account", "password")
    @classmethod
    def must_not_be_blank(cls, value: str) -> str:
        if not value or not value.strip():
            raise ValueError("must not be empty")
        return value


class RegisterUser(LoginUser):
    email: str
    first_name: str
    last_name: str


@router.get("/users")
def get_users(cursor = Depends(db.get_cursor)):
    cursor.execute("SELECT * FROM users")
    users = cursor.fetchall()
    return {"message": "Fetching all users", "users": users}

@router.post("/auth/login")
def login_user(user: LoginUser, cursor = Depends(db.get_cursor)):
    # Implementation for user login
    cursor.execute("SELECT * FROM users WHERE user_account = %s", (user.user_account,))
    db_user = cursor.fetchone()

    if not db_user:
        print("User not found")
        return {"message": "User not found"}
    
    if not verify_password(db_user['password_hash'], user.password):
        print("Invalid password")
        return {"message": "Invalid password"}
    
    return {"message": "Login successful", "user": db_user}

@router.post("/auth/register")
def register_user(user: RegisterUser, cursor = Depends(db.get_cursor)):
    # 1. Verify if the user account already exists in the database
    cursor.execute("SELECT * FROM users WHERE user_account = %s", (user.user_account,))
    if cursor.fetchone():
        return {"message": "User account already exists"}

    # 2. If not, hash the password and insert the new user into the database
    cursor.execute("""
        INSERT INTO users (email, first_name, last_name, user_account, password_hash)
        VALUES (%s, %s, %s, %s, %s)""", 
        (user.email, user.first_name, user.last_name, user.user_account, hash_password(user.password))
    )

    return {
        "message": f"User {user.user_account} has been registered successfully!"
    }