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

export async function updateBoardList(list_id: number, data: { title?: string, position?: number }) {
    try {
        const response = await api.patch(`/board-lists/${list_id}`, data);
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