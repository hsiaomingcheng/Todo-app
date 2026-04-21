# TodoFlow — Full Application Specification

**Version:** 1.0  
**Date:** 2026-04-21  
**Stack:** React + TypeScript · FastAPI · PostgreSQL  

---

## Table of Contents

1. [Product Spec](#1-product-spec)
2. [Design Spec](#2-design-spec)
3. [Technical Spec](#3-technical-spec)
4. [API Spec](#4-api-spec)

---

## 1. Product Spec

### 1.1 Overview

TodoFlow is a lightweight, Trello-inspired task management web application focused on simplicity and speed. Users organise their work using **Boards → Lists → Cards** — a familiar kanban-style hierarchy — without the complexity of enterprise project tools.

### 1.2 Goals

- Give individuals and small teams a fast, distraction-free way to manage todo lists.
- Support drag-and-drop organisation across lists and boards.
- Work seamlessly on desktop, tablet, and mobile (RWD).

### 1.3 Non-Goals (v1.0)

- Team collaboration / real-time multiplayer (post-v1)
- File attachments
- Time tracking
- Native mobile apps

### 1.4 User Stories

#### Authentication
- As a user, I can register with a username, email, first name, last name, and password.
- As a user, I can log in and receive a persistent session (JWT).
- As a user, I can log out.

#### Boards
- As a user, I can create, rename, and delete boards.
- As a user, I can see all my boards on a dashboard.
- As a user, I can set a background colour or gradient per board.

#### Lists
- As a user, I can add, rename, reorder, and delete lists within a board.
- As a user, I can archive a list (hides it without deleting).

#### Cards (Todos)
- As a user, I can create a card with a title.
- As a user, I can open a card to add a description, due date, and labels.
- As a user, I can mark a card as complete.
- As a user, I can drag a card to reorder it within a list, or move it to another list.
- As a user, I can delete a card.
- As a user, I can filter cards by label or completion status.

#### Search
- As a user, I can search across all my cards by title keyword.

### 1.5 Feature Priority

| Priority | Feature |
|----------|---------|
| P0 | Auth (register/login/logout) |
| P0 | Board CRUD |
| P0 | List CRUD |
| P0 | Card CRUD + completion toggle |
| P1 | Drag-and-drop reorder |
| P1 | Card detail (description, due date, labels) |
| P1 | RWD layout |
| P2 | Board background customisation |
| P2 | Card filtering & search |
| P3 | Archived lists |

---

## 2. Design Spec

### 2.1 Design Principles

- **Minimal chrome** — the board and cards are the focus; UI controls appear on hover.
- **Fast feedback** — optimistic updates; no loading spinners for inline edits.
- **Accessible** — WCAG 2.1 AA colour contrast; full keyboard navigation.

### 2.2 Responsive Breakpoints

| Breakpoint | Name | Range | Layout |
|---|---|---|---|
| xs | Mobile | < 640px | Single-column; lists stacked vertically; sidebar hidden |
| sm | Tablet | 640–1023px | 2-column lists; compact header |
| md+ | Desktop | ≥ 1024px | Full horizontal kanban scroll |

### 2.3 Colour Palette

| Token | Value | Usage |
|---|---|---|
| `--color-bg` | `#F4F5F7` | App background |
| `--color-surface` | `#FFFFFF` | Cards, modals |
| `--color-list-bg` | `#EBECF0` | List column background |
| `--color-primary` | `#0052CC` | Primary action buttons |
| `--color-primary-hover` | `#003E99` | Button hover |
| `--color-danger` | `#DE350B` | Delete / destructive actions |
| `--color-success` | `#00875A` | Completed card indicator |
| `--color-text` | `#172B4D` | Body text |
| `--color-text-subtle` | `#6B778C` | Placeholder, meta text |

**Label colours (8 options):** Green `#61BD4F`, Yellow `#F2D600`, Orange `#FF9F1A`, Red `#EB5A46`, Purple `#C377E0`, Blue `#0079BF`, Teal `#00C2E0`, Pink `#FF78CB`.

### 2.4 Typography

| Element | Font | Size | Weight |
|---|---|---|---|
| App title / Board name | Inter | 20px | 700 |
| List title | Inter | 16px | 600 |
| Card title | Inter | 14px | 500 |
| Body / description | Inter | 14px | 400 |
| Meta (due date, labels) | Inter | 12px | 400 |

### 2.5 Component Library

**Note:** Using [shadcn/ui](https://ui.shadcn.com/) (Radix UI primitives) for all base components.

#### App Layout (Implemented)
- **Header**: Logo/title (left), search bar (centre), Avatar with DropdownMenu (right)
  - shadcn components: `Avatar`, `DropdownMenu`, `Button`, `Input`
  - Search bar: full width on desktop, collapses to icon on mobile
  - Dropdown items: Profile, Settings, Logout (destructive variant)
  - Avatar fallback shows user initials with primary blue background
- **Main**: Full-width content area with `<Outlet />` for nested routes
- **Footer**: Copyright text with dark blue background

#### Dashboard
- Grid of Board Cards (min 200px, responsive CSS Grid) using shadcn `Card` component.
- "+ New Board" tile at the end of the grid.

#### Board View
- Horizontal scrolling flex container of List Columns.
- Each List Column: fixed width `272px` (desktop), `100%` (mobile).
- "+ Add a list" column appended at the end.

#### List Column
- Header: editable title (click to edit), `⋮` menu (DropdownMenu: rename, archive, delete).
- Body: vertically scrollable card stack.
- Footer: "Add a card" inline `Input` with submit button.

#### Card
- Use shadcn `Card` component as base.
- Default state: title, completion `Checkbox`, label chips (`Badge`), due date `Badge`.
- Hover state: edit (pencil) icon appears top-right.
- Completed state: title strikethrough, green left border.
- Overdue state: red due date badge.

#### Card Detail Modal
- Use shadcn `Dialog` component.
- Full-screen on mobile, centred (600px wide) on desktop.
- Fields: 
  - Title: editable h2
  - Description: markdown `Textarea`
  - Due date: `Popover` + `Calendar` component
  - Labels: multi-select chips using `Badge`
  - Completion: `Switch` or `Checkbox`
- Actions: Delete card (bottom, `Button` with destructive variant).

#### Navigation / Header
- Already implemented in `AppLayout.tsx` with shadcn components.
- Logo "TodoFlow" (left).
- Global search bar (centre, collapses to icon on mobile) using `Input` with `Search` icon.
- User avatar + dropdown (right): displays full name, username, with Profile/Settings/Logout options.

### 2.6 Motion & Interaction

- Drag-and-drop: `@hello-pangea/dnd` (fork of react-beautiful-dnd).
- Card drop shadow increases during drag.
- Card detail modal: fade + slide-up entrance (200ms).
- Toasts for async operations (success / error) using shadcn `Toast` or `Sonner` component.

---

## 3. Technical Spec

### 3.1 Frontend

| Concern | Choice |
|---|---|
| Framework | React 18 + TypeScript |
| Build tool | Vite |
| State management | Zustand (global) + React Query (server state) |
| Routing | React Router v6 |
| Drag-and-drop | @hello-pangea/dnd |
| Forms | React Hook Form + Zod |
| UI components | shadcn/ui (Radix UI primitives) |
| Styling | Tailwind CSS v4 |
| HTTP client | Axios (with interceptors for JWT refresh) |
| Testing | Vitest + React Testing Library |

#### 3.1.0 Required shadcn/ui Components

Install these shadcn components for the application:

```bash
# Core UI components
npx shadcn@latest add button
npx shadcn@latest add input
npx shadcn@latest add textarea
npx shadcn@latest add card
npx shadcn@latest add badge
npx shadcn@latest add avatar
npx shadcn@latest add checkbox
npx shadcn@latest add switch

# Navigation & modals
npx shadcn@latest add dropdown-menu
npx shadcn@latest add dialog

# Date & time
npx shadcn@latest add popover
npx shadcn@latest add calendar

# Feedback
npx shadcn@latest add toast
# OR use Sonner for toast notifications:
npx shadcn@latest add sonner
```

**Component Usage Mapping:**

| App Feature | shadcn Component |
|-------------|------------------|
| Primary actions | `Button` |
| Text input, search | `Input` |
| Card descriptions | `Textarea` |
| Board/card containers | `Card` |
| Labels | `Badge` |
| User profile | `Avatar` |
| Task completion | `Checkbox` |
| Settings toggles | `Switch` |
| User menu | `DropdownMenu` |
| Card detail editor | `Dialog` |
| Due date picker | `Popover` + `Calendar` |
| Success/error messages | `Toast` or `Sonner` |

#### 3.1.1 Folder Structure

```
src/
  api/          # Axios instances and typed API hooks
  components/
    ui/         # Reusable primitives (Button, Input, Modal…)
    board/      # Board-specific components
    card/       # Card-specific components
  hooks/        # Custom hooks
  pages/        # Route-level page components
  store/        # Zustand slices
  types/        # Shared TypeScript interfaces
  utils/        # Helpers (date formatting, colour utils…)
  App.tsx
  main.tsx
```

#### 3.1.2 Tailwind Configuration (Optional)

Add custom colour tokens to `tailwind.config.js` for easier spec compliance:

```javascript
export default {
  theme: {
    extend: {
      colors: {
        'app-bg': '#F4F5F7',
        'app-surface': '#FFFFFF',
        'app-list-bg': '#EBECF0',
        'app-primary': '#0052CC',
        'app-primary-hover': '#003E99',
        'app-danger': '#DE350B',
        'app-success': '#00875A',
        'app-text': '#172B4D',
        'app-text-subtle': '#6B778C',
      }
    }
  }
}
```

Usage: `bg-app-bg`, `text-app-text`, `text-app-danger`, etc.

#### 3.1.3 Key TypeScript Interfaces

```typescript
interface User {
  id: number;
  email: string;
  user_account: string;
  first_name: string;
  last_name: string;
  avatar_url?: string; // Optional profile picture URL
}

interface Board {
  id: string;
  title: string;
  background: string; // CSS colour or gradient string
  createdAt: string;
  updatedAt: string;
}

interface List {
  id: string;
  boardId: string;
  title: string;
  position: number;
  archived: boolean;
}

interface Card {
  id: string;
  listId: string;
  title: string;
  description?: string;
  position: number;
  completed: boolean;
  dueDate?: string; // ISO 8601
  labels: Label[];
  createdAt: string;
  updatedAt: string;
}

interface Label {
  id: string;
  name: string;
  color: string;
}
```

#### 3.1.4 Drag-and-Drop Strategy

- `DragDropContext` wraps the entire board.
- `Droppable` on each list (vertical) and on the list container (horizontal).
- On `onDragEnd`, compute new position with a midpoint fractional index, fire optimistic update via Zustand, then call `PATCH /cards/:id` or `PATCH /lists/:id` to persist.

#### 3.1.5 Auth Flow

1. On login, store access token in memory (Zustand) and refresh token in an `HttpOnly` cookie.
2. Axios request interceptor attaches `Authorization: Bearer <token>`.
3. Axios response interceptor: on 401, call `POST /auth/refresh`, retry original request.
4. On logout, call `POST /auth/logout` (clears cookie server-side), reset Zustand.

---

### 3.2 Backend

| Concern | Choice |
|---|---|
| Framework | FastAPI (Python 3.12) |
| ORM | SQLAlchemy 2.0 (async) |
| Migrations | Alembic |
| Auth | JWT (python-jose) + bcrypt |
| Validation | Pydantic v2 |
| Server | Uvicorn + Gunicorn |
| Testing | pytest + httpx (async test client) |

#### 3.2.1 Project Structure

```
app/
  api/
    v1/
      auth.py
      boards.py
      lists.py
      cards.py
      labels.py
  core/
    config.py     # Settings via pydantic-settings
    security.py   # JWT helpers
    database.py   # Async engine + session
  models/         # SQLAlchemy ORM models
  schemas/        # Pydantic request/response schemas
  services/       # Business logic layer
  main.py
alembic/
tests/
```

#### 3.2.2 Database Schema (PostgreSQL)

```sql
-- Users
CREATE TABLE users (
  id            SERIAL PRIMARY KEY,
  email         TEXT UNIQUE NOT NULL,
  first_name    TEXT NOT NULL,
  last_name     TEXT NOT NULL,
  user_account  TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  active        BOOLEAN NOT NULL DEFAULT TRUE,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Boards
CREATE TABLE boards (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title       TEXT NOT NULL,
  background  TEXT DEFAULT '#0052CC',
  created_at  TIMESTAMPTZ DEFAULT now(),
  updated_at  TIMESTAMPTZ DEFAULT now()
);

-- Lists
CREATE TABLE lists (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  board_id    UUID NOT NULL REFERENCES boards(id) ON DELETE CASCADE,
  title       TEXT NOT NULL,
  position    FLOAT NOT NULL DEFAULT 1.0,
  archived    BOOLEAN DEFAULT FALSE,
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- Cards
CREATE TABLE cards (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  list_id     UUID NOT NULL REFERENCES lists(id) ON DELETE CASCADE,
  title       TEXT NOT NULL,
  description TEXT,
  position    FLOAT NOT NULL DEFAULT 1.0,
  completed   BOOLEAN DEFAULT FALSE,
  due_date    DATE,
  created_at  TIMESTAMPTZ DEFAULT now(),
  updated_at  TIMESTAMPTZ DEFAULT now()
);

-- Labels
CREATE TABLE labels (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  board_id    UUID NOT NULL REFERENCES boards(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  color       TEXT NOT NULL
);

-- Card ↔ Label join
CREATE TABLE card_labels (
  card_id     UUID REFERENCES cards(id) ON DELETE CASCADE,
  label_id    UUID REFERENCES labels(id) ON DELETE CASCADE,
  PRIMARY KEY (card_id, label_id)
);
```

**Position strategy:** Use a float `position` field. When reordering, set `position = (prev_position + next_position) / 2`. Periodically normalise positions (1.0, 2.0, 3.0…) when the gap between floats becomes too small (< 0.001).

#### 3.2.3 Environment Variables

```
DATABASE_URL=postgresql+asyncpg://user:pass@localhost:5432/todoflow
SECRET_KEY=<32-byte random>
ACCESS_TOKEN_EXPIRE_MINUTES=15
REFRESH_TOKEN_EXPIRE_DAYS=30
FRONTEND_ORIGIN=http://localhost:5173
```

#### 3.2.4 CORS

Allow `FRONTEND_ORIGIN` with credentials. Restrict methods to `GET, POST, PUT, PATCH, DELETE`.

---

## 4. API Spec

**Base URL:** `/api/v1`  
**Auth:** `Authorization: Bearer <access_token>` on all protected routes.  
**Content-Type:** `application/json`

---

### 4.1 Authentication

#### `POST /auth/register`
Register a new user.

**Request body:**
```json
{
  "user_account": "janedoe",
  "password": "securepassword",
  "email": "user@example.com",
  "first_name": "Jane",
  "last_name": "Doe"
}
```

**Response `201`:**
```json
{
  "id": 1,
  "user_account": "janedoe",
  "email": "user@example.com",
  "first_name": "Jane",
  "last_name": "Doe"
}
```

**Errors:** `400` email already registered · `422` validation error.

---

#### `POST /auth/login`
Authenticate and receive tokens.

**Request body:**
```json
{
  "user_account": "janedoe",
  "password": "securepassword"
}
```

**Response `200`:**
```json
{
  "access_token": "<jwt>",
  "token_type": "bearer"
}
```
Sets `HttpOnly` cookie: `refresh_token`.

**Errors:** `401` invalid credentials.

---

#### `POST /auth/refresh`
Issue a new access token using the refresh cookie.

**Response `200`:**
```json
{ "access_token": "<new_jwt>", "token_type": "bearer" }
```

**Errors:** `401` missing or expired refresh token.

---

#### `POST /auth/logout`
Revoke refresh token (clears cookie).

**Response `204` No Content.**

---

### 4.2 Boards

#### `GET /boards`
List all boards for the authenticated user.

**Response `200`:**
```json
[
  {
    "id": "uuid",
    "title": "My Board",
    "background": "#0052CC",
    "created_at": "2026-04-01T10:00:00Z",
    "updated_at": "2026-04-21T08:30:00Z"
  }
]
```

---

#### `POST /boards`
Create a board.

**Request body:**
```json
{ "title": "My Board", "background": "#0052CC" }
```

**Response `201`:** Full board object.

---

#### `GET /boards/{board_id}`
Get a single board with all its lists and cards.

**Response `200`:**
```json
{
  "id": "uuid",
  "title": "My Board",
  "background": "#0052CC",
  "lists": [
    {
      "id": "uuid",
      "title": "To Do",
      "position": 1.0,
      "archived": false,
      "cards": [
        {
          "id": "uuid",
          "title": "Write spec",
          "position": 1.0,
          "completed": false,
          "due_date": "2026-04-30",
          "labels": []
        }
      ]
    }
  ]
}
```

---

#### `PATCH /boards/{board_id}`
Update title or background.

**Request body (partial):**
```json
{ "title": "Renamed Board" }
```

**Response `200`:** Updated board object.

---

#### `DELETE /boards/{board_id}`
Delete a board and all its contents.

**Response `204` No Content.**

---

### 4.3 Lists

#### `POST /boards/{board_id}/lists`
Create a list.

**Request body:**
```json
{ "title": "In Progress" }
```

**Response `201`:** List object (without cards).

---

#### `PATCH /lists/{list_id}`
Update title, position, or archived status.

**Request body (partial):**
```json
{ "position": 1.5 }
```

**Response `200`:** Updated list object.

---

#### `DELETE /lists/{list_id}`
Delete a list and all its cards.

**Response `204` No Content.**

---

### 4.4 Cards

#### `POST /lists/{list_id}/cards`
Create a card.

**Request body:**
```json
{ "title": "Design homepage" }
```

**Response `201`:** Card object.

---

#### `GET /cards/{card_id}`
Get card detail.

**Response `200`:**
```json
{
  "id": "uuid",
  "list_id": "uuid",
  "title": "Design homepage",
  "description": "Use Figma. See brief in Drive.",
  "position": 2.0,
  "completed": false,
  "due_date": "2026-05-01",
  "labels": [
    { "id": "uuid", "name": "Design", "color": "#0079BF" }
  ],
  "created_at": "2026-04-10T09:00:00Z",
  "updated_at": "2026-04-20T14:00:00Z"
}
```

---

#### `PATCH /cards/{card_id}`
Update any card field (title, description, position, list_id, completed, due_date).

**Request body (partial):**
```json
{
  "list_id": "new-list-uuid",
  "position": 3.5,
  "completed": true
}
```

**Response `200`:** Updated card object.

---

#### `DELETE /cards/{card_id}`
Delete a card.

**Response `204` No Content.**

---

#### `POST /cards/{card_id}/labels/{label_id}`
Attach a label to a card.

**Response `200`:** Updated card object.

---

#### `DELETE /cards/{card_id}/labels/{label_id}`
Remove a label from a card.

**Response `204` No Content.**

---

### 4.5 Labels

#### `POST /boards/{board_id}/labels`
Create a label for a board.

**Request body:**
```json
{ "name": "Bug", "color": "#EB5A46" }
```

**Response `201`:** Label object.

---

#### `PATCH /labels/{label_id}`
Update label name or colour.

**Response `200`:** Updated label object.

---

#### `DELETE /labels/{label_id}`
Delete a label (removes it from all cards).

**Response `204` No Content.**

---

### 4.6 Search

#### `GET /search?q={query}`
Search cards by title keyword across all user boards.

**Response `200`:**
```json
[
  {
    "id": "uuid",
    "title": "Design homepage",
    "list_title": "In Progress",
    "board_id": "uuid",
    "board_title": "My Board"
  }
]
```

---

### 4.7 Error Format

All errors follow the RFC 7807 problem format:

```json
{
  "detail": "Human-readable error message"
}
```

| HTTP Status | Meaning |
|---|---|
| `400` | Bad request / business rule violation |
| `401` | Not authenticated |
| `403` | Forbidden (resource belongs to another user) |
| `404` | Resource not found |
| `422` | Validation error (Pydantic) |
| `500` | Internal server error |

---

*End of Specification*