import type { Request, Response, NextFunction } from "express";
import { verifyToken } from "../lib/jwt.js";

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  // Read the token cookie set during login/registration
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({
      message: "Authentication required. No token provided.",
    });
  }

  try {
    const decoded = verifyToken(token);
    req.user = decoded; 
    return next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token.",
    });
  }
};