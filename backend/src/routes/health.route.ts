import express from "express";
const route = express.Router();

import {testHealth} from "../controller/health.controller.js"

route.get("/health",testHealth)

export default route;