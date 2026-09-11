import express from "express";
const companyRouter = express.Router();

import {
  createCompanyController,
  getCompanyController,
  getAllCompanyController,
  updateCompanyController,
  createCompanyLocationController,
  getCompanyLocationController,
  updateCompanyLocationController,
  deleteCompanyLocationController,
} from "../controller/company.controller.js";
import { createJobController,getCompanyAllJobsController,getCompanyJobController } from "../controller/job.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

companyRouter.post("/", authenticate, createCompanyController);
companyRouter.get("/:id", getCompanyController);
companyRouter.get("/", getAllCompanyController);
companyRouter.patch("/:id", authenticate, updateCompanyController);

companyRouter.post("/:companyId/locations", authenticate, createCompanyLocationController);
companyRouter.get("/:companyId/locations", getCompanyLocationController);
companyRouter.patch("/:companyId/locations/:locationId", authenticate, updateCompanyLocationController);
companyRouter.delete("/:companyId/locations/:locationId", authenticate, deleteCompanyLocationController);

companyRouter.post("/:companyId/jobs",authenticate,createJobController)
companyRouter.get("/:companyId/jobs",authenticate,getCompanyAllJobsController)
companyRouter.get("/:companyId/job/:jobId",getCompanyJobController)


export default companyRouter;
