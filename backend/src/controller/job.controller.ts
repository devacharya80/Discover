import type { Request, Response } from "express";
import { createJobSchema,updateJobSchema } from "../types/job.schema.js";
import {
  createJobService,
  getCompanyAllJobService,
  getCompanyJobService,
  updateCompanyJobService
} from "../services/job.service.js";
import { jobQuerySchema } from "../types/job.query.schema.js";

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

export const getCompanyAllJobsController = async (
  req: Request,
  res: Response,
) => {
  try {
    const { companyId } = req.params;

    // Validate company ID
    if (!companyId || typeof companyId !== "string") {
      return res.status(400).json({
        message: "Invalid company ID",
      });
    }

    // Validate query parameters
    const validatedQuery = jobQuerySchema.safeParse(req.query);

    if (!validatedQuery.success) {
      return res.status(400).json({
        message: "Invalid job query parameters",
        errors: validatedQuery.error.flatten().fieldErrors,
      });
    }

    const query = {
      ...validatedQuery.data,
      skip:
        (validatedQuery.data.page - 1) *
        validatedQuery.data.limit,
    };

    const result = await getCompanyAllJobService(
      companyId,
      query,
    );

    return res.status(200).json({
      message: "Company jobs fetched successfully",
      data: result.jobs,
      pagination: result.pagination,
    });
  } catch (err: unknown) {
    console.error(err);

    if (err instanceof Error && err.message === "Company not found") {
      return res.status(404).json({
        message: err.message,
      });
    }

    return res.status(500).json({
      message:
        "Error while getting company jobs. Please try again later.",
    });
  }
};

export const getCompanyJobController = async (req: Request, res: Response) => {
  try {
    const { companyId, jobId } = req.params;
    if (typeof jobId !== "string" || typeof companyId !== "string") {
      return res.status(400).json({
        message: "Invalid company or job ID",
      });
    }
    const companyJob = await getCompanyJobService(companyId, jobId);
    return res.status(200).json({
      message: "company job data fetched successfully",
      data: companyJob,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Error while getting company job, Please try again later",
    });
  }
};


export const updateCompanyJobController = async(req: Request, res: Response) => {
  try{
    const userId:string = req.user.userId;
    const { companyId, jobId } = req.params;
    if (typeof jobId !== "string" || typeof companyId !== "string") {
      return res.status(400).json({
        message: "Invalid company or job ID",
      });
    }

    const validatedUpdateJobData = updateJobSchema.safeParse(req.body);
    if (!validatedUpdateJobData.success) {
      return res.status(400).json({
        message: "Please enter valid inputs to updated",
        errors: validatedUpdateJobData.error.flatten().fieldErrors,
      });
    }

    const updatedJob = await updateCompanyJobService(userId,companyId,jobId,validatedUpdateJobData.data);
    return res.status(200).json({
      message: "Job updated successfully",
      data: updatedJob,
    });
  }catch (err:any) {
    console.error(err);
    if (err instanceof Error) {
  if (err.message === "Job not found") {
    return res.status(404).json({
      message: err.message,
    });
  }

  if (err.message === "Company not found") {
    return res.status(404).json({
      message: err.message,
    });
  }

  if (err.message === "Unauthorized") {
    return res.status(403).json({
      message: err.message,
    });
  }

  if (err.message === "Location does not belong to this company") {
    return res.status(400).json({
      message: err.message,
    });
  }

  if (
    err.message ===
    "Minimum salary cannot be greater than maximum salary"
  ) {
    return res.status(400).json({
      message: err.message,
    });
  }
}
    return res.status(500).json({
      message: "Error while updating company job, Please try again later",
    });
  }
}