# app/validators.py
from fastapi import HTTPException

def validate_not_blank(fields: dict[str, str]) -> None:
    """
    Validate that all given fields are not empty or whitespace.
    Raises an HTTPException (422) if any field fails.

    Usage:
        validate_not_blank({
            "user_account": user.user_account,
            "password": user.password,
        })
    """
    for field_name, value in fields.items():
        if not value or not value.strip():
            raise HTTPException(
                status_code=422,
                detail=f"{field_name} must not be empty"
            )
