import express from "express";
import { meController } from "../controller/me.controller.js";
import {authenticate}  from "../middleware/auth.middleware.js";

const meRouter = express.Router();

// Fixed route parameter syntax: /me/:id
meRouter.get("/me/:id", authenticate,meController);

export default meRouter;