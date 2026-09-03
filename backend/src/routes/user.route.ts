import express from "express";
import {
  getUserController,
  updateUserController
} from "../controller/user.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const userRoute = express.Router();

userRoute.get("/profile", authenticate, getUserController);

userRoute.patch("/profile", authenticate, updateUserController);


export default userRoute;