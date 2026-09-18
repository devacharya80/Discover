import express from "express";
import { meController } from "../controller/me.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
const meRouter=express.Router();
meRouter.get("/me",authenticate,meController);
export default meRouter;
