import express from "express";
const authRouter = express.Router();

import {registerUser,loginUser,logoutUser} from "../controller/auth.controller.js"

authRouter.post("/register",registerUser)
authRouter.post("/login",loginUser)
authRouter.post("/logout",logoutUser)

export default authRouter;