import type { Request, Response } from "express";
import { createJobSchema, updateJobSchema } from "../types/job.schema.js";
import { jobQuerySchema } from "../types/job.query.schema.js";
import {
  createJobService, getCompanyAllJobService, getCompanyJobService,
  getGlobalJobsService, getJobByIdService, updateCompanyJobService,
} from "../services/job.service.js";

export const createJobController = async (req: Request, res: Response) => {
  try {
    const companyId = req.params.companyId;
    if (typeof companyId !== "string") return res.status(400).json({ message: "Invalid company ID" });
    const parsed = createJobSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: "Invalid job data", errors: parsed.error.flatten().fieldErrors });
    return res.status(201).json({ message: "Job created successfully", data: await createJobService(req.user.userId, companyId, parsed.data) });
  } catch (err) {
    const message = err instanceof Error ? err.message : "";
    if (message.includes("not authorized")) return res.status(403).json({ message });
    if (message.includes("Location does not belong")) return res.status(400).json({ message });
    return res.status(500).json({ message: "Unable to create job" });
  }
};

export const getCompanyAllJobsController = async (req: Request, res: Response) => {
  try {
    const companyId = req.params.companyId;
    if (typeof companyId !== "string") return res.status(400).json({ message: "Invalid company ID" });
    const parsed = jobQuerySchema.safeParse(req.query);
    if (!parsed.success) return res.status(400).json({ message: "Invalid job query parameters", errors: parsed.error.flatten().fieldErrors });
    const result = await getCompanyAllJobService(companyId, parsed.data);
    return res.json({ message: "Company jobs fetched successfully", data: result.jobs, pagination: result.pagination });
  } catch (err) {
    if (err instanceof Error && err.message === "Company not found") return res.status(404).json({ message: err.message });
    return res.status(500).json({ message: "Unable to fetch company jobs" });
  }
};

export const getCompanyJobController = async (req: Request, res: Response) => {
  try {
    const companyId = req.params.companyId;
    const jobId = req.params.jobId;
    if (typeof companyId !== "string" || typeof jobId !== "string") return res.status(400).json({ message: "Invalid company or job ID" });
    return res.json({ message: "Company job fetched successfully", data: await getCompanyJobService(companyId, jobId) });
  } catch (err) {
    if (err instanceof Error && err.message === "Job not found") return res.status(404).json({ message: err.message });
    return res.status(500).json({ message: "Unable to fetch company job" });
  }
};

export const getGlobalJobsController = async (req: Request, res: Response) => {
  try {
    const parsed = jobQuerySchema.safeParse(req.query);
    if (!parsed.success) return res.status(400).json({ message: "Invalid job query parameters", errors: parsed.error.flatten().fieldErrors });
    const result = await getGlobalJobsService(parsed.data);
    return res.json({ message: "Jobs fetched successfully", data: result.jobs, pagination: result.pagination });
  } catch { return res.status(500).json({ message: "Unable to fetch jobs" }); }
};

export const getJobByIdController = async (req: Request, res: Response) => {
  try {
    const jobId = req.params.jobId;
    if (typeof jobId !== "string") return res.status(400).json({ message: "Invalid job ID" });
    return res.json({ message: "Job fetched successfully", data: await getJobByIdService(jobId) });
  } catch (err) {
    if (err instanceof Error && err.message === "Job not found") return res.status(404).json({ message: err.message });
    return res.status(500).json({ message: "Unable to fetch job" });
  }
};

export const updateCompanyJobController = async (req: Request, res: Response) => {
  try {
    const companyId = req.params.companyId;
    const jobId = req.params.jobId;
    if (typeof companyId !== "string" || typeof jobId !== "string") return res.status(400).json({ message: "Invalid company or job ID" });
    const parsed = updateJobSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: "Invalid job data", errors: parsed.error.flatten().fieldErrors });
    return res.json({ message: "Job updated successfully", data: await updateCompanyJobService(req.user.userId, companyId, jobId, parsed.data) });
  } catch (err) {
    const message = err instanceof Error ? err.message : "";
    if (["Job not found","Company not found"].includes(message)) return res.status(404).json({ message });
    if (["Unauthorized","External jobs cannot be edited from the company dashboard"].includes(message)) return res.status(403).json({ message });
    if (message.includes("Location does not belong") || message.includes("Minimum salary")) return res.status(400).json({ message });
    return res.status(500).json({ message: "Unable to update job" });
  }
};
