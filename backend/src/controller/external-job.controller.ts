import type { Request, Response } from "express";
import prisma from "../lib/prisma.js";
import { ingestAdzunaJobs } from "../jobs/ingestion/adzuna.ingestion.js";
import { z } from "zod";

const ingestionSchema = z.object({
  country: z.string().trim().min(2).max(10).default("in"),
  page: z.number().int().min(1).default(1),
  pages: z.number().int().min(1).max(5).default(1),
  what: z.string().trim().min(2).max(100).default("software engineer"),
  where: z.string().trim().max(100).optional(),
});

export const ingestAdzunaJobsController = async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.userId }, select: { role: true } });
    if (!user || user.role !== "ADMIN") return res.status(403).json({ message: "Admin access required" });

    const parsed = ingestionSchema.safeParse(req.body ?? {});
    if (!parsed.success) return res.status(400).json({ message: "Invalid ingestion options", errors: parsed.error.flatten().fieldErrors });

    const result = await ingestAdzunaJobs(parsed.data);
    return res.json({ message: "Adzuna ingestion completed", data: result });
  } catch (error) {
    console.error("Adzuna ingestion failed:", error);
    return res.status(500).json({ message: "Adzuna ingestion failed" });
  }
};
