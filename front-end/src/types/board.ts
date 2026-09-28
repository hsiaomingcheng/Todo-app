export interface UserDetails {
    id: number;
    user_account: string;
    email: string;
    first_name: string;
    last_name: string;
    avatar_url?: string;
}

export interface Label {
    id: number;
    name: string;
    color: string;
}

// The board-level label list additionally carries how many active cards
// currently use each label (see GET /boards/{id} in board.py) — used to
// warn before deleting a label that's still in use.
export interface BoardLabel extends Label {
    board_id: number;
    card_count: number;
}

export interface Card {
    id: number;
    list_id: number;
    title: string;
    created_at: string;
    position: number;
    description: string | null;
    due_date: string | null;
    completed: boolean;
    labels: Label[];
}

export interface BoardList {
    id: number;
    board_id: number;
    title: string;
    created_at: string;
    position: number;
    archived: boolean;
    cards: Card[];
}

// A row from GET /boards/{id}/archived-lists — just the list itself, no
// nested cards (unlike BoardList, which comes from GET /boards/{id}).
export interface ArchivedBoardList {
    id: number;
    board_id: number;
    title: string;
    created_at: string;
    position: number;
    archived: boolean;
}

export interface Board {
    id: number;
    title: string;
    background: string | null;
    created_at: string;
    lists: BoardList[];
    labels: BoardLabel[];
}

// One row from GET /search — a card match plus enough context (which list,
// which board) to make sense of a result found outside its own board.
export interface SearchResult {
    id: number;
    title: string;
    list_title: string;
    board_id: number;
    board_title: string;
}