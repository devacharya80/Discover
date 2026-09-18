import type { Request, Response } from "express";
import { getUserService, updateUserService } from "../services/user.service.js";
import { updateProfileSchema } from "../types/auth.schema.js";
import type { UserType } from "../types/user.type.js";

export const getUserController = async (req: Request, res: Response) => {
  try {
    const user: UserType = await getUserService(req.user.userId);
    return res.status(200).json({ message: "User Profile fetched successfully", data: user });
  } catch (error) {
    console.error(error);
    if (error instanceof Error && error.message === "User not found") {
      return res.status(404).json({ message: error.message });
    }
    return res.status(500).json({ message: "Error while getting user details" });
  }
};

export const updateUserController = async (req: Request, res: Response) => {
  try {
    const validated = updateProfileSchema.safeParse(req.body);
    if (!validated.success) {
      return res.status(400).json({
        message: "Enter valid input",
        errors: validated.error.flatten().fieldErrors,
      });
    }
    const updatedUser: UserType = await updateUserService(req.user.userId, validated.data);
    return res.status(200).json({ message: "User updated successfully", data: updatedUser });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error while updating user details" });
  }
};
