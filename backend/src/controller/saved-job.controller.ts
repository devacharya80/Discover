import type { Request, Response } from "express";
import { getSavedJobIdsService, getSavedJobsService, saveJobService, unsaveJobService } from "../services/saved-job.service.js";

export const saveJobController = async (req: Request, res: Response) => {
  try {
    const jobId = req.params.jobId;
    if (typeof jobId !== "string") return res.status(400).json({ message: "Invalid job ID" });
    return res.status(201).json({ message: "Job saved", data: await saveJobService(req.user.userId, jobId) });
  } catch (err) {
    const message = err instanceof Error ? err.message : "";
    if (message.includes("not found")) return res.status(404).json({ message });
    return res.status(500).json({ message: "Unable to save job" });
  }
};

export const unsaveJobController = async (req: Request, res: Response) => {
  try {
    const jobId = req.params.jobId;
    if (typeof jobId !== "string") return res.status(400).json({ message: "Invalid job ID" });
    return res.json({ message: "Job removed from saved jobs", data: await unsaveJobService(req.user.userId, jobId) });
  } catch (err) {
    const message = err instanceof Error ? err.message : "";
    if (message === "Saved job not found") return res.status(404).json({ message });
    return res.status(500).json({ message: "Unable to unsave job" });
  }
};

export const getSavedJobsController = async (req: Request, res: Response) => {
  try { return res.json({ message: "Saved jobs fetched successfully", data: await getSavedJobsService(req.user.userId) }); }
  catch { return res.status(500).json({ message: "Unable to fetch saved jobs" }); }
};

export const getSavedJobIdsController = async (req: Request, res: Response) => {
  try {
    const ids = typeof req.query.ids === "string" ? req.query.ids.split(",").filter(Boolean).slice(0,100) : [];
    return res.json({ message: "Saved job IDs fetched successfully", data: await getSavedJobIdsService(req.user.userId, ids) });
  } catch { return res.status(500).json({ message: "Unable to fetch saved job IDs" }); }
};
