from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError

# initialize PasswordHasher
ph = PasswordHasher()

def hash_password(password: str) -> str:
    """hash the password using Argon2 algorithm"""
    return ph.hash(password)

def verify_password(hashed_password: str, plain_password: str) -> bool:
    """verify if the plain password matches the hashed password in the database"""
    try:
        return ph.verify(hashed_password, plain_password)
    except VerifyMismatchError:
        return False