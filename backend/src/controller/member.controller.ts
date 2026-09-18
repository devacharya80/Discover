import type { Request, Response } from "express";
import { z } from "zod";
import { addCompanyMemberService, getCompanyMembersService, getManageCompanyMembersService, removeCompanyMemberService, updateCompanyMemberService } from "../services/member.service.js";

const memberSchema = z.object({
  email: z.string().email(),
  role: z.enum(["ADMIN","OWNER","RECRUITER"]).default("RECRUITER"),
});

export const getCompanyMembersController = async (req: Request, res: Response) => {
  try {
    const companyId = req.params.companyId;
    if (typeof companyId !== "string") return res.status(400).json({ message: "Invalid company ID" });
    return res.json({ message: "Company members fetched successfully", data: await getCompanyMembersService(companyId) });
  } catch { return res.status(500).json({ message: "Unable to fetch company members" }); }
};

export const getManageCompanyMembersController = async (req: Request, res: Response) => {
  try { const companyId=req.params.companyId; if(typeof companyId!=="string") return res.status(400).json({message:"Invalid company ID"}); return res.json({message:"Company members fetched successfully",data:await getManageCompanyMembersService(req.user.userId,companyId)}); }
  catch(err){ const message=err instanceof Error?err.message:""; if(message.includes("not authorized")) return res.status(403).json({message}); return res.status(500).json({message:"Unable to fetch company members"}); }
};

export const addCompanyMemberController = async (req: Request, res: Response) => {
  try {
    const companyId = req.params.companyId;
    if (typeof companyId !== "string") return res.status(400).json({ message: "Invalid company ID" });
    const parsed = memberSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: "Invalid member data", errors: parsed.error.flatten().fieldErrors });
    return res.status(201).json({ message: "Member added", data: await addCompanyMemberService(req.user.userId, companyId, parsed.data.email, parsed.data.role) });
  } catch (err) {
    const message = err instanceof Error ? err.message : "";
    if (message.includes("not authorized") || message.includes("Only an owner")) return res.status(403).json({ message });
    if (message === "User not found") return res.status(404).json({ message });
    return res.status(500).json({ message: "Unable to add member" });
  }
};

export const updateCompanyMemberController = async (req: Request, res: Response) => {
  try {
    const companyId = req.params.companyId;
    const memberId = req.params.memberId;
    if (typeof companyId !== "string" || typeof memberId !== "string") return res.status(400).json({ message: "Invalid ID" });
    const parsed = z.object({ role: z.enum(["ADMIN","OWNER","RECRUITER"]) }).safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: "Invalid role" });
    return res.json({ message: "Member updated", data: await updateCompanyMemberService(req.user.userId, companyId, memberId, parsed.data.role) });
  } catch (err) {
    const message = err instanceof Error ? err.message : "";
    if (message.includes("not authorized") || message.includes("Only an owner")) return res.status(403).json({ message });
    if (message === "Member not found") return res.status(404).json({ message });
    return res.status(500).json({ message: "Unable to update member" });
  }
};

export const removeCompanyMemberController = async (req: Request, res: Response) => {
  try {
    const companyId = req.params.companyId;
    const memberId = req.params.memberId;
    if (typeof companyId !== "string" || typeof memberId !== "string") return res.status(400).json({ message: "Invalid ID" });
    return res.json({ message: "Member removed", data: await removeCompanyMemberService(req.user.userId, companyId, memberId) });
  } catch (err) {
    const message = err instanceof Error ? err.message : "";
    if (message.includes("not authorized") || message.includes("must have at least one owner")) return res.status(403).json({ message });
    if (message === "Member not found") return res.status(404).json({ message });
    return res.status(500).json({ message: "Unable to remove member" });
  }
};
