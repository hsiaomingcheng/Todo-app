import { isAxiosError } from "axios";
import api from "@/api/client";

export async function getUserDetails() {
    try {
        const response = await api.get(`/user/detail`);
        return response.data;
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message);
        } else {
            throw new Error("An unexpected error occurred");
        }
    }
}

export async function userLogin(parameters: { user_account: string, password: string }) {
    try {
        const response = await api.post("/auth/login", parameters);
        return response.data;
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message);
        } else {
            throw new Error("An unexpected error occurred");
        }
    }
}

export async function userRegister(parameters: {
    user_account: string,
    password: string,
    first_name: string,
    last_name: string,
    email: string
}) {
    try {
        const response = await api.post("/auth/register", parameters);
        return response.data;
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message);
        } else {
            throw new Error("An unexpected error occurred");
        }
    }
}

// Boards
export async function getBoards() {
    try {
        const response = await api.get("/boards");
        return response.data;
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message);
        } else {
            throw new Error("An unexpected error occurred");
        }
    }
}

export async function createBoard(title: string) {
    try {
        const response = await api.post(`/boards`, { title });
        return response.data;
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message);
        } else {
            throw new Error("An unexpected error occurred");
        }
    }
}

export async function deleteBoard(board_id: number) {
    try {
        const response = await api.delete(`/boards/${board_id}`);
        console.log('response', response)
        return response.data;
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message);
        } else {
            throw new Error("An unexpected error occurred");
        }
    }
}

export async function getBoard(board_id: number) {
    try {
        const response = await api.get(`/boards/${board_id}`);
        return response.data;
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message);
        } else {
            throw new Error("An unexpected error occurred");
        }
    }
}


// Board Lists
export async function createBoardList(board_id: number, title: string, position: number) {
    try {
        const response = await api.post(`/board-lists/${board_id}`, { title, position });
        return response.data;
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message);
        } else {
            throw new Error("An unexpected error occurred");
        }
    }
}

export async function updateBoardListTitle(list_id: number, title: string) {
    try {
        const response = await api.patch(`/board-list/${list_id}/title`, { title });
        return response.data;
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message);
        } else {
            throw new Error("An unexpected error occurred");
        }
    }
}

export async function updateBoardListPosition(list_id: number, position: number) {
    try {
        const response = await api.patch(`/board-list/${list_id}/position`, { position });
        return response.data;
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message);
        } else {
            throw new Error("An unexpected error occurred");
        }
    }
}

export async function deleteBoardList(list_id: number) {
    try {
        const response = await api.delete(`/board-lists/${list_id}`);
        return response.data;
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message);
        } else {
            throw new Error("An unexpected error occurred");
        }
    }
}

// Cards
export async function getCards(list_id: number) {
    try {
        const response = await api.get(`/cards/${list_id}`);
        return response.data;
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message);
        } else {
            throw new Error("An unexpected error occurred");
        }
    }
}

export async function updateCardPosition(card_id: number, position: number, list_id?: number) {
    try {
        const response = await api.patch(`/cards/${card_id}`, { position, ...(list_id !== undefined && { list_id }) });
        return response.data;
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message);
        } else {
            throw new Error("An unexpected error occurred");
        }
    }
}

export async function createCard(list_id: number, title: string, position: number) {
    try {
        const response = await api.post(`/cards/${list_id}`, { title, position });
        return response.data;
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message);
        } else {
            throw new Error("An unexpected error occurred");
        }
    }
}

export async function updateCard(card_id: number, updates: {
    title?: string,
    description?: string,
    due_date?: string,
    completed?: boolean
}) {
    try {
        const response = await api.patch(`/cards/${card_id}`, updates);
        return response.data;
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message);
        } else {
            throw new Error("An unexpected error occurred");
        }
    }
}

export async function deleteCard(card_id: number) {
    try {
        const response = await api.delete(`/cards/${card_id}`);
        return response.data;
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message);
        } else {
            throw new Error("An unexpected error occurred");
        }
    }
}


// User Profile
export async function updateProfile(id: number, email: string, first_name: string, last_name: string) {
    try {
        const response = await api.put(`/user/profile`, { id, email, first_name, last_name });
        return response.data;
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message);
        } else {
            throw new Error("An unexpected error occurred");
        }
    }
}

export async function updatePassword(current_password: string, new_password: string, new_password_confirmation: string) {
    try {
        const response = await api.patch(`/user/password`, { current_password, new_password, new_password_confirmation });
        return response.data;
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message);
        } else {
            throw new Error("An unexpected error occurred");
        }
    }
}