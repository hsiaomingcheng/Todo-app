import { isAxiosError } from "axios";
import api from "@/api/client";

export async function getUserDetails(userId: number) {
    try {
        const response = await api.get(`/users/${userId}`);
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