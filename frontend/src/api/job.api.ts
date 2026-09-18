import { api } from "./axios";
import type { Job, JobsResponse, JobQuery } from "../types/job.type";
export const getJobs = async (params:JobQuery={}):Promise<JobsResponse> => (await api.get<JobsResponse>("/jobs",{params})).data;
export const getJob = async (jobId:string):Promise<{message:string;data:Job}> => (await api.get(`/jobs/${jobId}`)).data;
export const getCompanyJobs = async (companyId:string,params:JobQuery={}):Promise<JobsResponse> => (await api.get(`/company/${companyId}/jobs`,{params})).data;
export const getCompanyJob = async (companyId:string,jobId:string):Promise<{message:string;data:Job}> => (await api.get(`/company/${companyId}/job/${jobId}`)).data;
export const applyToJob = async (jobId:string) => (await api.post(`/jobs/${jobId}/apply`)).data;
export const saveJob = async (jobId:string) => (await api.post(`/jobs/${jobId}/save`)).data;
export const unsaveJob = async (jobId:string) => (await api.delete(`/jobs/${jobId}/save`)).data;

export interface CreateJobInput { locationId?:string|null; title:string; description:string; type:"FULL_TIME"|"PART_TIME"|"CONTRACT"|"INTERNSHIP"|"FREELANCE"; mode:"REMOTE"|"HYBRID"|"ON_SITE"; experienceLevel:"ENTRYLEVEL"|"JUNIOR"|"MID_LEVEL"|"SENIOR"|"LEAD"|"EXECUTIVE"; skills:string[]; salaryMin?:number; salaryMax?:number; externalLink?:string; expiresAt?:string; }
export const createCompanyJob = async (companyId:string,data:CreateJobInput) => (await api.post("/company/"+companyId+"/jobs",data)).data;
export const updateCompanyJob = async (companyId:string,jobId:string,data:Partial<CreateJobInput>&{status?:"DRAFT"|"ACTIVE"|"PAUSED"|"CLOSED"|"ARCHIVED"}) => (await api.patch("/company/"+companyId+"/job/"+jobId,data)).data;
