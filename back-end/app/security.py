from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from datetime import datetime, timedelta, timezone
from jose import jwt, JWTError
from dotenv import load_dotenv
import app.db as db
import os


# ── Password Hashing ────────────────────────────────────────────────────────
# initialize PasswordHasher
ph = PasswordHasher()

def hash_password(password: str) -> str:
    """hash the password using Argon2 algorithm"""
    return ph.hash(password)

def verify_password(hashed_password: str, plain_password: str) -> bool:
    """verify if the plain password matches the hashed password in the database"""
    try:
        ph.verify(hashed_password, plain_password)
        return True
    except VerifyMismatchError:
        return False


# ── JWT ────────────────────────────────────────────────────────────────
# JWT Config
load_dotenv()  # loads .env file into environment variables
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

def create_access_token(data: dict) -> str:
    """Generate a JWT token containing the given data."""
    payload = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    payload["exp"] = expire
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


def decode_access_token(token: str) -> dict:
    """Decode and verify a JWT token. Raises JWTError if invalid."""
    return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])


# ── HTTPBearer ──────────────────────────────────────────────────────────────
# HTTPBearer is used to extract the token from the Authorization header
bearer_scheme = HTTPBearer()

def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme), # Extract the raw JWT token string from the Authorization: Bearer <token> header
    cursor=Depends(db.get_cursor)
):
    """Dependency that extracts and validates the JWT from the request header."""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid or expired token",
        headers={"WWW-Authenticate": "Bearer"},
    )

    token = credentials.credentials
    try:
        payload = decode_access_token(token) # Decode & verify the token using SECRET_KEY
        raw_sub = payload.get("sub") # Pull out sub from the decoded payload (the user ID stored at login)
        if raw_sub is None:
            raise credentials_exception
        user_id = int(raw_sub) # Convert the user ID to an integer for DB query later
    except JWTError:
        raise credentials_exception

    cursor.execute("SELECT * FROM users WHERE id = %s", (user_id,))
    user = cursor.fetchone()
    if user is None:
        raise credentials_exception
    return user