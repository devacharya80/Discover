import { api } from "./axios";
import type { UserRegisterData,UserLoginData } from "../types/user.type";

export const registerUser = async (data : UserRegisterData) => {
    const response = await api.post("/auth/register",data);
    return response.data;
}

export const loginUser = async (data : UserLoginData) => {
    const response = await api.post("/auth/login",data);
    return response.data;
}

export const logOutUser = async () => {
    const response = await api.post("/auth/logout");
    return response.data;
}