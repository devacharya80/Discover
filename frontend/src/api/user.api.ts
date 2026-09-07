import { api } from "./axios";
import type { UpdateUserProfileType } from "../types/user.type";

export const getUserProfile = async () => {
    const response = await api.get("/user/profile");
    return response.data
}

export const updateUserProfile = async (data : UpdateUserProfileType) => {
    const response = await api.patch("/user/profile",data)
    return response.data
}