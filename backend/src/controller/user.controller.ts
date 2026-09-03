import type { Request, Response } from "express";
import { getUserService, updateUserService } from "../services/user.service.js";
import type { UserType,UserLocationType } from "../types/user.type.js";
import {
  updateProfileSchema,
  type UpdateProfileType,
} from "../types/auth.schema.js";

export const getUserController = async (req: Request, res: Response) => {
  try {
    const userId: string = req.user.userId;

    const user: UserType = await getUserService(userId);

    return res.status(200).json({
      message: "User Profile fetched successfully",
      data: user,
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      message: "Error while getting user details",
    });
  }
};

export const updateUserController = async (req: Request, res: Response) => {
  try {
    const userId: string = req.user.userId;

    const validatedUserDetails = updateProfileSchema.safeParse(req.body);

    if (!validatedUserDetails.success) {
      return res.status(400).json({
        message: "Enter valid input",
        errors: validatedUserDetails.error.flatten().fieldErrors,
      });
    }

    const updatedUser: UserType = await updateUserService(
      userId,
      validatedUserDetails.data,
    );

    return res.status(200).json({
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (err:any) {
    console.error(err);

    return res.status(500).json({
      message: "Error while updating user details",
    });
  }
};
