# Task Management System (Full-stack SaaS)

## Backend Setup
### 2. Create & activate virtual environment
```bash
cd backend
python3 -m venv venv
source venv/bin/activate       # Windows: venv\Scripts\activate
```

### 3. Install dependencies
```bash
pip install -r requirements.txt
```

```
default port is 8000

SWAGGER API doc: http://localhost:8000/docs
```

## Technical Architecture
Frontend: React (Vite) + Axios + Tailwind
Backend: FastAPI + Pydantic
Database: PostgreSQL
DevOps：Docker + AWS

Install
pip install "fastapi[standard]"

Run App - two options
1. fastapi dev
2. uvicorn main:app --reload (uvicorn app.main:app --reload --port 8000)

Produce requirements dovument
pip freeze > requirements.txt

## Packages
Psycopg2 -- PostgreSQL database adapter(a bridge that allows your Python code to communicate with a PostgreSQL database)    
argon2-cffi -- For hashing

## Hashing
User password is hashed by using argon2

## JWT auth

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