import type { Request, Response, NextFunction } from "express";
import { verifyToken } from "../lib/jwt.js";

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies?.token;
  if (!token) return res.status(401).json({ message: "Authentication required" });
  try {
    req.user = verifyToken(token);
    return next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired session" });
  }
};
