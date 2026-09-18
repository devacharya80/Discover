import { api } from "./axios";
import type { Job } from "../types/job.type";
export const getSavedJobs = async ():Promise<Job[]> => (await api.get("/saved-jobs")).data.data.map((item:{job:Job})=>item.job);
