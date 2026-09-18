import type { Request, Response } from "express";
import prisma from "../lib/prisma.js";
import { ingestAdzunaJobs } from "../jobs/ingestion/adzuna.ingestion.js";

export const ingestAdzunaJobsController = async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: { role: true },
    });

    if (!user || user.role !== "ADMIN") {
      return res.status(403).json({ message: "Admin access required" });
    }

    const result = await ingestAdzunaJobs({
      country: typeof req.body?.country === "string" ? req.body.country : "in",
      page: typeof req.body?.page === "number" ? req.body.page : 1,
      pages: typeof req.body?.pages === "number" ? Math.min(req.body.pages, 5) : 1,
      what: typeof req.body?.what === "string" ? req.body.what : "software engineer",
      where: typeof req.body?.where === "string" ? req.body.where : undefined,
    });

    return res.status(200).json({
      message: "Adzuna ingestion completed",
      data: result,
    });
  } catch (error) {
    console.error("Adzuna ingestion failed:", error);
    return res.status(500).json({ message: "Adzuna ingestion failed" });
  }
};
