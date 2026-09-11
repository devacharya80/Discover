import type { Request, Response } from "express";

import { createJobSchema } from "../types/job.schema.js";
import {
  createJobService,
  getAllCompanyJobService,
  getCompanyJobService
} from "../services/job.service.js";

export const createJobController = async (req: Request, res: Response) => {
  try {
    const { companyId } = req.params;

    if (typeof companyId !== "string") {
      return res.status(400).json({
        message: "Invalid company ID",
      });
    }

    const userId = req.user.userId;

    const validatedJobData = createJobSchema.safeParse(req.body);

    if (!validatedJobData.success) {
      return res.status(400).json({
        message: "Invalid job data",
        errors: validatedJobData.error.flatten().fieldErrors,
      });
    }

    const newJob = await createJobService(
      userId,
      companyId,
      validatedJobData.data,
    );

    return res.status(201).json({
      message: "Job created successfully",
      data: newJob,
    });
  } catch (err: unknown) {
    console.error(err);

    if (err instanceof Error) {
      if (err.message === "User is not authorized to create a job") {
        return res.status(403).json({
          message: err.message,
        });
      }

      if (err.message === "Location does not belong to this company") {
        return res.status(400).json({
          message: err.message,
        });
      }
    }

    return res.status(500).json({
      message: "Error while creating job. Please try again later.",
    });
  }
};

export const getAllCompanyJobsController = async (
  req: Request,
  res: Response,
) => {
  try {
    const { companyId } = req.params;
    if (typeof companyId !== "string") {
      return res.status(400).json({
        message: "Invalid company ID",
      });
    }
    const companyJobs = await getAllCompanyJobService(companyId);
    return res.status(200).json({
      message: "company's all jobs data fetched successfully",
      data: companyJobs,
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({
        message: "Error while getting company job, Please try again later",
      });
  }
};

export const getCompanyJobController = async (
  req: Request,
  res: Response,
) => {
    try {
    const { companyId,jobId } = req.params;
    if (typeof jobId !== "string" || typeof companyId !== "string") {
      return res.status(400).json({
        message: "Invalid job ID",
      });
    }
    const companyJob = await getCompanyJobService(companyId,jobId);
    return res.status(200).json({
      message: "company job data fetched successfully",
      data: companyJob,
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({
        message: "Error while getting company job, Please try again later",
      });
  }
}