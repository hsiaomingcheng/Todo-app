# Todo-app
A Todo-list app practice

---

user's password are all `password123`

---

## Backend Setup

### RESTful
RESTful API is a convention for how your API communicates with clients (e.g. the frontend). It covers response format, status codes, and consistency.

**Response Format**

Keep a consistent JSON shape for both success and error responses. A clean format is:

```json
// Success
{ "message": "Login successful", "data": { ... } }

// Error
{ "message": "User not found" }
```

This way, the frontend always reads `response.message` regardless of whether the request succeeded or failed.

**HTTP Status Codes**

Use the correct status code for each situation:

| Code | Meaning | When to use |
|------|---------|-------------|
| `200` | OK | Successful GET or action (e.g. login) |
| `201` | Created | Successfully created a resource (e.g. register) |
| `401` | Unauthorized | Wrong password / not authenticated |
| `404` | Not Found | Resource doesn't exist |
| `409` | Conflict | Duplicate resource (e.g. account already exists) |
| `422` | Unprocessable Entity | Validation failed (e.g. blank field) |

In FastAPI, set the status code on the decorator:
```python
@router.post("/auth/register", status_code=201)
```

**Validation**

Pydantic `field_validator` runs before FastAPI and only understands `ValueError` — you cannot raise `HTTPException` inside it. Instead, do manual validation inside the route function where `HTTPException` is valid.

A reusable helper pattern:
```python
# validators.py
def validate_not_blank(fields: dict[str, str]) -> None:
    for field_name, value in fields.items():
        if not value or not value.strip():
            raise HTTPException(status_code=422, detail=f"{field_name} must not be empty")
```

**Normalizing Error Responses**

FastAPI's default `HTTPException` returns `{"detail": "..."}`, which is inconsistent with a `{"message": "..."}` success format. Use a custom exception handler in `main.py` to remap it:

```python
@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"message": exc.detail}  # remap "detail" → "message"
    )
```

This intercepts every `HTTPException` across the entire app and reformats it automatically.

### Password hashing

### Identiry Verification

### JWT (JSON Web Token)
1. User sends username + password
2. Backend verifies credentials
3. Backend generates a JWT token and sends it back
4. Frontend stores the token
5. Frontend sends the token in every future request header
6. Backend verifies the token on protected routes

### .env
A file that stores environment variables, and it is not recommended to commit to version control.
Need to make sure that `python-dotenv` has been installed.

---

## Frontend Setup

### Prerequisites
- Node.js 18+

### 1. Install dependencies
```bash
cd front-end
npm install
```

### 2. Start the dev server
```bash
npm run dev
# App at http://localhost:5173
```

Vite proxies `/api/*` to `http://localhost:8000` automatically — no CORS issues in dev.

### Protected Route
A `ProtectedRoute` component is created to protect the routes that require authentication.
It works like a **gatekeeper**. When a user tries to visit `/boards`, instead of going directly to the page, they hit the gatekeeper first. The gatekeeper asks: "Are you logged in?". If yes → let them through. If no → redirect to `/login`.

---

## The process of calling APIs

```
React (Vite)
   ↓
/api/auth/register
   ↓ (proxy)
http://localhost:XXXX
   ↓
Backend (FastAPI)
```

---

### Login/Register Page

Frontend
* All inputs have required attributes to avoid blank input value

Backend
* Add field_validator, this can check the value of input is blank or not
* Security.py response for password hashing and verify (using argon2 package)

---

## What I learned?

---