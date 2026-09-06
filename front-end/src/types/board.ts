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
    cards: Card[];
}

export interface Board {
    id: number;
    title: string;
    created_at: string;
    lists: BoardList[];
    labels: BoardLabel[];
}