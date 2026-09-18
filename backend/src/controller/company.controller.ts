import type { Request, Response } from "express";
import {
  createCompanyService, getCompanyService, getAllCompaniesService, updateCompanyService,
  createCompanyLocationService, getCompanyLocationService, updateCompanyLocationservice, deleteCompanyLocationService,
} from "../services/company.service.js";
import { createCompanySchema, updateCompanySchema, createCompanyLocationSchema, updateCompanyLocationSchema } from "../types/company.schema.js";

export const createCompanyController = async (req: Request, res: Response) => {
  try {
    const parsed = createCompanySchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: "Invalid company data", errors: parsed.error.flatten().fieldErrors });
    return res.status(201).json({ message: "Company created successfully", data: await createCompanyService(req.user.userId, parsed.data) });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Unable to create company" });
  }
};

export const getCompanyController = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    if (typeof id !== "string") return res.status(400).json({ message: "Invalid company ID" });
    return res.json({ message: "Company fetched successfully", data: await getCompanyService(id) });
  } catch (err) {
    if (err instanceof Error && err.message.includes("No Company found")) return res.status(404).json({ message: "Company not found" });
    return res.status(500).json({ message: "Unable to fetch company" });
  }
};

export const getAllCompanyController = async (req: Request, res: Response) => {
  try {
    const search = typeof req.query.search === "string" ? req.query.search.trim().slice(0,100) : undefined;
    const city = typeof req.query.city === "string" ? req.query.city.trim().slice(0,80) : undefined;
    const industry = typeof req.query.industry === "string" ? req.query.industry.trim().slice(0,80) : undefined;
    return res.json({ message: "Companies fetched successfully", data: await getAllCompaniesService({ search, city, industry }) });
  } catch {
    return res.status(500).json({ message: "Unable to fetch companies" });
  }
};

export const updateCompanyController = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    if (typeof id !== "string") return res.status(400).json({ message: "Invalid company ID" });
    const parsed = updateCompanySchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: "Invalid company data", errors: parsed.error.flatten().fieldErrors });
    return res.json({ message: "Company updated successfully", data: await updateCompanyService(req.user.userId, id, parsed.data) });
  } catch (err) {
    const message = err instanceof Error ? err.message : "";
    if (message.includes("not a member") || message.includes("authorization")) return res.status(403).json({ message });
    return res.status(500).json({ message: "Unable to update company" });
  }
};

export const createCompanyLocationController = async (req: Request, res: Response) => {
  try {
    const companyId = req.params.companyId;
    if (typeof companyId !== "string") return res.status(400).json({ message: "Invalid company ID" });
    const parsed = createCompanyLocationSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: "Invalid location", errors: parsed.error.flatten().fieldErrors });
    return res.status(201).json({ message: "Company location created successfully", data: await createCompanyLocationService(req.user.userId, companyId, parsed.data) });
  } catch (err) {
    const message = err instanceof Error ? err.message : "";
    if (message.startsWith("Unauthorized")) return res.status(403).json({ message });
    return res.status(500).json({ message: "Unable to create company location" });
  }
};

export const getCompanyLocationController = async (req: Request, res: Response) => {
  try {
    const companyId = req.params.companyId;
    if (typeof companyId !== "string") return res.status(400).json({ message: "Invalid company ID" });
    return res.json({ message: "Company locations fetched successfully", data: await getCompanyLocationService(companyId) });
  } catch { return res.status(500).json({ message: "Unable to fetch company locations" }); }
};

export const updateCompanyLocationController = async (req: Request, res: Response) => {
  try {
    const companyId = req.params.companyId;
    const locationId = req.params.locationId;
    if (typeof companyId !== "string" || typeof locationId !== "string") return res.status(400).json({ message: "Invalid ID" });
    const parsed = updateCompanyLocationSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: "Invalid location", errors: parsed.error.flatten().fieldErrors });
    return res.json({ message: "Location updated successfully", data: await updateCompanyLocationservice(req.user.userId, companyId, locationId, parsed.data) });
  } catch (err) {
    const message = err instanceof Error ? err.message : "";
    if (message.startsWith("Unauthorized")) return res.status(403).json({ message });
    if (message === "Location not found for this company") return res.status(404).json({ message });
    return res.status(500).json({ message: "Unable to update company location" });
  }
};

export const deleteCompanyLocationController = async (req: Request, res: Response) => {
  try {
    const companyId = req.params.companyId;
    const locationId = req.params.locationId;
    if (typeof companyId !== "string" || typeof locationId !== "string") return res.status(400).json({ message: "Invalid ID" });
    return res.json({ message: "Company location deleted successfully", data: await deleteCompanyLocationService(req.user.userId, companyId, locationId) });
  } catch (err) {
    const message = err instanceof Error ? err.message : "";
    if (message.startsWith("Unauthorized")) return res.status(403).json({ message });
    if (message === "Location not found for this company") return res.status(404).json({ message });
    return res.status(500).json({ message: "Unable to delete company location" });
  }
};
