# Task Management System (Full-stack SaaS)

## Technical Architecture
Frontend: React (Vite) + Axios + Tailwind
Backend: FastAPI + Pydantic
Database: PostgreSQL
DevOps（後面）：Docker + AWS

Install
pip install "fastapi[standard]"

Run App
fastapi dev or uvicorn main:app --reload

Produce requirements dovument
pip freeze > requirements.txt

## Packages
Psycopg2 -- PostgreSQL database adapter(a bridge that allows your Python code to communicate with a PostgreSQL database)    
argon2-cffi -- For hashing

## Application Structure
```
app/
 ├── main.py
 ├── models/        # DB Structure
 ├── schemas/       # Pydantic（Data Format）
 ├── routes/        # API endpoints
 ├── services/      # Business Logic
 ├── db/            # DB Connection
```