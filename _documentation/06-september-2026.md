# Daily Log: September 06, 2026

## 🎯 What I Did Today

### 1. Built the Labels System End-to-End
- **Backend**: Added label CRUD (`POST`/`PATCH`/`DELETE /labels`), scoped to a board via `labels.board_id`. Extended `GET /boards/{id}` to return the board's full label list — each annotated with `card_count` (active cards currently using it) — plus each card's own attached labels, so the frontend never needs a separate round trip for either.
- **Frontend**: Built `ManageLabelsModal` for board-level label management (create/rename/recolor/delete), a label picker inside the Card Detail Modal, and label chips on the card face — all using the fixed 8-color palette from `todo-app-spec.md` §2.3 instead of a free color picker.
- **Delete-with-warning**: Deleting a label that's still attached to cards shows exactly how many cards will lose it, reusing the existing `DeletingModal` confirmation pattern with the `card_count` already available from the board fetch.

### 2. Refactored Card-Label Sync from N Requests to One
- The Card Detail Modal originally diffed which labels were added/removed and fired a `POST`/`DELETE` per label via `Promise.all`. Recognized this wasn't the best practice for "sync a set" operations — added `PUT /cards/{card_id}/labels` (takes the full `label_ids` array, replaces the set in one call) and switched the modal to use it. Kept the single-label attach/detach endpoints as-is for any future single-action UI (e.g. a quick-toggle context menu), rather than removing them.

### 3. Removed Dead, Unauthenticated Code
- Found `task.py` had zero real logic (its handlers never touched the database) and zero auth checks on three of its four routes — confirmed via `curl` that `POST`/`PUT`/`DELETE /api/tasks` worked with no token at all. Verified nothing in the frontend or rest of the backend referenced it, then deleted the file and its registration in `router.py`.

### 4. Consolidated Scattered Documentation
- Replaced three separate, partly-outdated README files (root, `back-end/`, `front-end/`) with `BACKEND.md` and `FRONTEND.md` at the project root, folding in accurate details that had drifted into `CLAUDE.md`/`AGENTS.md` instead.
- Added `DATABASE.md`: a Mermaid ER diagram plus a table-by-table reference that explicitly marks which tables the backend actually queries today versus schema built ahead of a feature (`board_members`, `card_assignees`, `tasks`, `labels`, `card_labels` — the last two now flipped to "yes" after today's work).
- Turned `AGENTS.md` into a one-line pointer at `CLAUDE.md`, so AI tooling guidance has a single source of truth instead of two files that quietly drift apart.

***

## 🧠 What I Learned Today

### 1. Unmounting a Focused Element Fires `blur` First
- Closing a Radix Dialog unmounts its content — and if a rename `<input>` still had focus at that moment, the browser fires a native `blur` event on it just before removal. That's why a label rename appeared to "always save" regardless of whether Enter worked: closing the modal itself was silently completing the save.

### 2. Defer, Don't Fire Immediately, Inside a Multi-Field Modal
- Label selection is kept in local state and only sent on Save, rather than calling attach/detach the instant a chip is clicked. An immediate call would trigger a board refetch while the modal is still open, handing it a new `card` prop — which the resync `useEffect` would use to overwrite whatever the user was still mid-typing in the title/description fields.

### 3. `ON DELETE CASCADE` Grants Deletion, It Doesn't Block It
- Caught my own wrong assumption that `CASCADE` protects a label from being deleted while in use. It does the opposite — it's what *lets* the delete succeed by silently removing every `card_labels` row that pointed to it. Documented a related edge case in `DATABASE.md`: since `card_count` excludes soft-deleted cards, deleting a label only attached to a soft-deleted card looks safe but permanently detaches it anyway.

### 4. Tell Tooling Artifacts Apart from Real Bugs by Cross-Checking
- A synthetic `key` press (Backspace, Enter) in the browser-automation tool didn't reliably trigger the same native event chain a real keyboard does, even though `type` always worked — confirmed by testing the identical action manually in a real browser before concluding whether something was actually broken. Applied the same discipline to a stale console error: re-ran the exact sequence that supposedly caused it and confirmed it didn't reproduce, rather than trusting an error log accumulated across an entire long testing session.
