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

export async function deleteBoards(board_id: number) {
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


// Board Lists
export async function getBoardLists(board_id: number) {
    try {
        const response = await api.get(`/board-lists/${board_id}`);
        return response.data;
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message);
        } else {
            throw new Error("An unexpected error occurred");
        }
    }
}

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