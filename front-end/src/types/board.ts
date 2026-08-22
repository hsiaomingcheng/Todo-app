export interface UserDetails {
    id: number;
    user_account: string;
    email: string;
    first_name: string;
    last_name: string;
    avatar_url?: string;
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
}