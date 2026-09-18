import type { Request, Response } from "express";
import { registerService, loginService } from "../services/auth.service.js";
import { registerSchema, loginSchema } from "../types/auth.schema.js";
import { authCookieOptions } from "../config/coockie.config.js";

export const registerUser = async (req: Request, res: Response) => {
  try {
    const validated = registerSchema.safeParse(req.body);
    if (!validated.success) {
      return res.status(400).json({ message: "Enter valid inputs", errors: validated.error.flatten().fieldErrors });
    }
    const { user, token } = await registerService(validated.data);
    res.cookie("token", token, authCookieOptions);
    return res.status(201).json({ message: "User Registered Successfully", data: user });
  } catch (error) {
    console.error(error);
    if (error instanceof Error && error.message === "User already exists") {
      return res.status(409).json({ message: error.message });
    }
    return res.status(500).json({ message: "Error while registering, try again later." });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const validated = loginSchema.safeParse(req.body);
    if (!validated.success) {
      return res.status(400).json({ message: "Enter valid inputs", errors: validated.error.flatten().fieldErrors });
    }
    const { user, token } = await loginService(validated.data);
    res.cookie("token", token, authCookieOptions);
    return res.status(200).json({ message: "Login successful", data: user });
  } catch (error) {
    console.error(error);
    if (error instanceof Error && (error.message === "User Not Found" || error.message === "Invalid credentials")) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    return res.status(500).json({ message: "Error while login, try again later." });
  }
};

export const logoutUser = (_req: Request, res: Response) => {
  res.clearCookie("token", authCookieOptions);
  return res.status(200).json({ message: "Logged out successfully" });
};
