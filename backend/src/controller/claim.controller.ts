import type { Request, Response } from "express";
import { z } from "zod";
import { createClaimService, getCompanyClaimsService, getPendingClaimsAdminService, getUserClaimsService, reviewClaimService } from "../services/claim.service.js";

const reviewSchema = z.object({ status: z.enum(["APPROVED", "REJECTED"]) });

export const getPendingClaimsAdminController = async (req: Request, res: Response) => {
  try { return res.json({ message: "Pending claims fetched successfully", data: await getPendingClaimsAdminService(req.user.userId) }); }
  catch (err) { const message=err instanceof Error?err.message:""; if(message==="Admin access required") return res.status(403).json({message}); return res.status(500).json({message:"Unable to fetch pending claims"}); }
};

export const createClaimController = async (req: Request, res: Response) => {
  try {
    const companyId = req.params.companyId;
    if (typeof companyId !== "string") return res.status(400).json({ message: "Invalid company ID" });
    const data = await createClaimService(req.user.userId, companyId);
    return res.status(201).json({ message: "Claim request submitted", data });
  } catch (err) {
    const message = err instanceof Error ? err.message : "";
    if (message === "Company not found") return res.status(404).json({ message });
    if (message.includes("already a member")) return res.status(409).json({ message });
    return res.status(500).json({ message: "Unable to submit claim" });
  }
};

export const getUserClaimsController = async (req: Request, res: Response) => {
  try { return res.json({ message: "Claims fetched successfully", data: await getUserClaimsService(req.user.userId) }); }
  catch { return res.status(500).json({ message: "Unable to fetch claims" }); }
};

export const getCompanyClaimsController = async (req: Request, res: Response) => {
  try {
    const companyId = req.params.companyId;
    if (typeof companyId !== "string") return res.status(400).json({ message: "Invalid company ID" });
    return res.json({ message: "Claims fetched successfully", data: await getCompanyClaimsService(req.user.userId, companyId) });
  } catch (err) {
    const message = err instanceof Error ? err.message : "";
    if (message.includes("not authorized")) return res.status(403).json({ message });
    return res.status(500).json({ message: "Unable to fetch claims" });
  }
};

export const reviewClaimController = async (req: Request, res: Response) => {
  try {
    const claimId = req.params.claimId;
    if (typeof claimId !== "string") return res.status(400).json({ message: "Invalid claim ID" });
    const parsed = reviewSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: "Invalid review status" });
    const data = await reviewClaimService(req.user.userId, claimId, parsed.data.status);
    return res.json({ message: "Claim reviewed", data });
  } catch (err) {
    const message = err instanceof Error ? err.message : "";
    if (message === "Admin access required") return res.status(403).json({ message });
    if (message === "Claim not found") return res.status(404).json({ message });
    if (message.includes("already been reviewed")) return res.status(409).json({ message });
    return res.status(500).json({ message: "Unable to review claim" });
  }
};
