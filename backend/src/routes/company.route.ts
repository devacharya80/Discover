import express from "express";
const companyRouter = express.Router();

import {createCompanyController, getCompanyController,updateCompanyController} from "../controller/company.controller.js"
import { authenticate } from "../middleware/auth.middleware.js";

companyRouter.post("/",authenticate,createCompanyController)
companyRouter.get("/:id",getCompanyController)
companyRouter.patch("/:id",authenticate,updateCompanyController)

export default companyRouter;