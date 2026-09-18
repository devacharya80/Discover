import express from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { ingestAdzunaJobsController } from "../controller/external-job.controller.js";

const jobsRouter = express.Router();

jobsRouter.post("/ingest/adzuna", authenticate, ingestAdzunaJobsController);

export default jobsRouter;
