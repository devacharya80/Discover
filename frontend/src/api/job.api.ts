import { api } from "./axios";
import type { Job, JobsResponse, JobQuery } from "../types/job.type";

export const getCompanyJobs = async (
  companyId: string,
  params: JobQuery = {},
): Promise<JobsResponse> => {
  const response = await api.get<JobsResponse>("/company/" + companyId + "/jobs", { params });
  return response.data;
};

export const getCompanyJob = async (
  companyId: string,
  jobId: string,
): Promise<{ message: string; data: Job }> => {
  const response = await api.get<{ message: string; data: Job }>(
    "/company/" + companyId + "/job/" + jobId,
  );
  return response.data;
};
