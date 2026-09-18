import { api } from "./axios";
import type { Job, JobsResponse, JobQuery } from "../types/job.type";
export const getJobs = async (params:JobQuery={}):Promise<JobsResponse> => (await api.get<JobsResponse>("/jobs",{params})).data;
export const getJob = async (jobId:string):Promise<{message:string;data:Job}> => (await api.get(`/jobs/${jobId}`)).data;
export const getCompanyJobs = async (companyId:string,params:JobQuery={}):Promise<JobsResponse> => (await api.get(`/company/${companyId}/jobs`,{params})).data;
export const getCompanyJob = async (companyId:string,jobId:string):Promise<{message:string;data:Job}> => (await api.get(`/company/${companyId}/job/${jobId}`)).data;
export const applyToJob = async (jobId:string) => (await api.post(`/jobs/${jobId}/apply`)).data;
export const saveJob = async (jobId:string) => (await api.post(`/jobs/${jobId}/save`)).data;
export const unsaveJob = async (jobId:string) => (await api.delete(`/jobs/${jobId}/save`)).data;
