from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, field_validator
from app.security import hash_password, verify_password, create_access_token
from app.validators import validate_not_blank
import app.db as db

router = APIRouter()

class LoginUser(BaseModel):
    user_account: str
    password: str

class RegisterUser(LoginUser):
    email: str
    first_name: str
    last_name: str

class UserId(BaseModel):
    user_id: int


# Get user details
@router.get("/users/{user_id}")
def get_user_details(user_id: int, cursor = Depends(db.get_cursor)):
    cursor.execute("SELECT * FROM users WHERE id = %s", (user_id,))
    user = cursor.fetchone()
    return {
        "data": {
            "user_account": user['user_account'],
            "email": user['email'],
            "first_name": user['first_name'],
            "last_name": user['last_name'],
        }
    }

# User login
@router.post("/auth/login", status_code=200)
def login_user(user: LoginUser, cursor = Depends(db.get_cursor)):
    # validate user_account and password
    validate_not_blank({
        "user_account": user.user_account,
        "password": user.password,
    })

    # Implementation for user login
    cursor.execute("SELECT * FROM users WHERE user_account = %s", (user.user_account,))
    db_user = cursor.fetchone()

    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if not verify_password(db_user['password_hash'], user.password):
        raise HTTPException(status_code=401, detail="Invalid password")

    # Generate JWT token with user ID inside
    token = create_access_token({"sub": str(db_user["id"])})
    
    return {
        "access_token": token,
        "token_type": "bearer",
        "message": "Login successful",
        "data": {
            "id": db_user['id'],
            "user_account": db_user['user_account'],
            "email": db_user['email'],
            "first_name": db_user['first_name'],
            "last_name": db_user['last_name'],
        }
    }

# User registration
@router.post("/auth/register", status_code=201)
def register_user(user: RegisterUser, cursor = Depends(db.get_cursor)):
    # validate user_account, password, email, first_name and last_name
    validate_not_blank({
        "user_account": user.user_account,
        "password": user.password,
        "email": user.email,
        "first_name": user.first_name,
        "last_name": user.last_name,
    })

    # 1. Verify if the user account already exists in the database
    cursor.execute("SELECT * FROM users WHERE user_account = %s", (user.user_account,))
    if cursor.fetchone():
        raise HTTPException(status_code=409, detail="User account already exists")

    # 2. If not, hash the password and insert the new user into the database
    cursor.execute("""
        INSERT INTO users (email, first_name, last_name, user_account, password_hash)
        VALUES (%s, %s, %s, %s, %s)""", 
        (user.email, user.first_name, user.last_name, user.user_account, hash_password(user.password))
    )

    return {
        "message": f"User {user.user_account} has been registered successfully!"
    }