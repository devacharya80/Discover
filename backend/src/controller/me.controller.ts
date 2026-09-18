import type { Request, Response } from "express";
import { meService } from "../services/me.service.js";
export const meController = async (req: Request, res: Response) => {
  try { const user=await meService(req.user.userId); if(!user)return res.status(404).json({message:"User not found"}); return res.json({data:user}); }
  catch { return res.status(500).json({message:"Error while getting user data"}); }
};
