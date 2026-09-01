import type { Request, Response } from "express";
import { registerService, loginService } from "../services/auth.service.js";
import { registerSchema, loginSchema } from "../types/auth.schema.js";
import {authCookieOptions} from "../config/coockie.config.js"

export const registerUser = async (req: Request, res: Response) => {
  try {
    const validatedUserData = registerSchema.safeParse(req.body);

    if (!validatedUserData.success) {
      return res.status(400).json({
        message: "Enter valid inputs",
        errors: validatedUserData.error.flatten().fieldErrors,
      });
    }

    const { user, token } = await registerService(validatedUserData.data);

    res.cookie("token", token, authCookieOptions);

    return res.status(201).json({
      message: "User Registered Successfully",
      data: user,
    });
  } catch (err: any) {
    console.error(err);

    if (err.message === "User already exists") {
      return res.status(409).json({
        message: err.message,
      });
    }

    return res.status(500).json({
      message: "Error while Registering, Try again later.",
    });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const validatedUserData = loginSchema.safeParse(req.body);

    if (!validatedUserData.success) {
      return res.status(400).json({
        message: "Enter valid inputs",
        errors: validatedUserData.error.flatten().fieldErrors,
      });
    }

    // 1. Added await (loginService is async)
    const { user, token } = await loginService(validatedUserData.data);

    // 2. Fixed strict to string "strict", changed expires to maxAge
    res.cookie("token", token, authCookieOptions);

    // 3. Added missing return response
    return res.status(200).json({
      message: "Login successful",
      data: user,
    });
  } catch (err: any) {
    console.error(err);

    if (err.message === "User Not Found" || err.message === "Invalid credentials") {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    return res.status(500).json({
      message: "Error while Login, Try again later",
    });
  }
};

export const logoutUser = (req: Request, res: Response) => {
  try {
    res.clearCookie("token", authCookieOptions);

    return res.status(200).json({
      message: "Logged out successfully",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Error while logging out, try again later.",
    });
  }
};