# Todo-app
A Todo-list app practice

---

user's password are all `password123`

---

## Backend Setup

### RESTful

### Password hashing

### JWT

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