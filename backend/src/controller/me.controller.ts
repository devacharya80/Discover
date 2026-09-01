import type { Request, Response } from "express";
import { meService } from "../services/me.service.js";

export const meController = async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

    if (!id) {
      return res.status(400).json({
        message: "User ID is required",
      });
    }

    const user = await meService(id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      data: user,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Error while getting user data",
    });
  }
};