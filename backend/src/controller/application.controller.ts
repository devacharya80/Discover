import type { Request, Response } from "express";
import { z } from "zod";
import {
  applyToJobService, getUserApplicationsService, withdrawApplicationService,
  getCompanyApplicationsService, updateApplicationStatusService,
} from "../services/application.service.js";

const statusSchema = z.object({
  status: z.enum(["APPLIED","REVIEWING","SHORTLISTED","REJECTED","HIRED","WITHDRAWN"]),
});

export const applyToJobController = async (req: Request, res: Response) => {
  try {
    const jobId = req.params.jobId;
    if (typeof jobId !== "string") return res.status(400).json({ message: "Invalid job ID" });
    const data = await applyToJobService(req.user.userId, jobId);
    return res.status(201).json({ message: "Application submitted successfully", data });
  } catch (err) {
    const message = err instanceof Error ? err.message : "";
    if (message === "Job not found or no longer active" || message.includes("External jobs")) return res.status(400).json({ message });
    if (message.includes("already applied")) return res.status(409).json({ message });
    return res.status(500).json({ message: "Unable to submit application" });
  }
};

export const getUserApplicationsController = async (req: Request, res: Response) => {
  try { return res.json({ message: "Applications fetched successfully", data: await getUserApplicationsService(req.user.userId) }); }
  catch { return res.status(500).json({ message: "Unable to fetch applications" }); }
};

export const withdrawApplicationController = async (req: Request, res: Response) => {
  try {
    const applicationId = req.params.applicationId;
    if (typeof applicationId !== "string") return res.status(400).json({ message: "Invalid application ID" });
    return res.json({ message: "Application withdrawn", data: await withdrawApplicationService(req.user.userId, applicationId) });
  } catch (err) {
    const message = err instanceof Error ? err.message : "";
    if (message === "Application not found") return res.status(404).json({ message });
    if (message.includes("cannot be withdrawn")) return res.status(400).json({ message });
    return res.status(500).json({ message: "Unable to withdraw application" });
  }
};

export const getCompanyApplicationsController = async (req: Request, res: Response) => {
  try {
    const companyId = req.params.companyId;
    if (typeof companyId !== "string") return res.status(400).json({ message: "Invalid company ID" });
    return res.json({ message: "Company applications fetched successfully", data: await getCompanyApplicationsService(req.user.userId, companyId) });
  } catch (err) {
    const message = err instanceof Error ? err.message : "";
    if (message.includes("not authorized")) return res.status(403).json({ message });
    return res.status(500).json({ message: "Unable to fetch company applications" });
  }
};

export const updateApplicationStatusController = async (req: Request, res: Response) => {
  try {
    const companyId = req.params.companyId;
    const applicationId = req.params.applicationId;
    if (typeof companyId !== "string" || typeof applicationId !== "string") return res.status(400).json({ message: "Invalid ID" });
    const parsed = statusSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: "Invalid application status", errors: parsed.error.flatten().fieldErrors });
    const data = await updateApplicationStatusService(req.user.userId, companyId, applicationId, parsed.data.status);
    return res.json({ message: "Application status updated", data });
  } catch (err) {
    const message = err instanceof Error ? err.message : "";
    if (message.includes("not authorized")) return res.status(403).json({ message });
    if (message === "Application not found") return res.status(404).json({ message });
    return res.status(500).json({ message: "Unable to update application status" });
  }
};
