import express from "express";
const healthRouter = express.Router();

import {testHealth} from "../controller/health.controller.js"

healthRouter.get("/health",testHealth)

export default healthRouter;