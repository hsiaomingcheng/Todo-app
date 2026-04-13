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

export async function postUserLogin(form: { accountName: string, password: string }) {
    try {
        const response = await api.post("/auth/login", {
            user_account: form.accountName,
            password: form.password,
        });
        return response.data;
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message);
        } else {
            throw new Error("An unexpected error occurred");
        }
    }
}