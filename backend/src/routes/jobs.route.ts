import express from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { ingestAdzunaJobsController } from "../controller/external-job.controller.js";
import { getGlobalJobsController, getJobByIdController } from "../controller/job.controller.js";
import { applyToJobController } from "../controller/application.controller.js";
import { saveJobController, unsaveJobController } from "../controller/saved-job.controller.js";

const jobsRouter = express.Router();
jobsRouter.get("/", getGlobalJobsController);
jobsRouter.get("/:jobId", getJobByIdController);
jobsRouter.post("/:jobId/apply", authenticate, applyToJobController);
jobsRouter.post("/:jobId/save", authenticate, saveJobController);
jobsRouter.delete("/:jobId/save", authenticate, unsaveJobController);
jobsRouter.post("/ingest/adzuna", authenticate, ingestAdzunaJobsController);
export default jobsRouter;
