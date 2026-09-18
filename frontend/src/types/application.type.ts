import type { Job } from "./job.type";
export type ApplicationStatus = "APPLIED"|"REVIEWING"|"SHORTLISTED"|"REJECTED"|"HIRED"|"WITHDRAWN";
export interface Application { id:string; userId:string; jobId:string; status:ApplicationStatus; appliedAt:string; updatedAt:string; job:Job; }
