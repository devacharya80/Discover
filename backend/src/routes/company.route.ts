import express from "express";
const companyRouter = express.Router();

import {
  createCompanyController,
  getCompanyController,
  updateCompanyController,
  createCompanyLocationController,
  getCompanyLocationController,
  updateCompanyLocationController,
  deleteCompanyLocationController,
} from "../controller/company.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

companyRouter.post("/", authenticate, createCompanyController);
companyRouter.get("/:id", getCompanyController);
companyRouter.patch("/:id", authenticate, updateCompanyController);

companyRouter.post("/:companyId/locations", authenticate, createCompanyLocationController);
companyRouter.get("/:companyId/locations", getCompanyLocationController);
companyRouter.patch("/:companyId/locations/:locationId", authenticate, updateCompanyLocationController);
companyRouter.delete("/:companyId/locations/:locationId", authenticate, deleteCompanyLocationController);

export default companyRouter;
