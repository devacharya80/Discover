import { api } from "./axios";
export interface PendingClaim { id:string; requestedAt:string; user:{id:string;name:string;email:string}; company:{id:string;name:string;logoUrl:string|null;verificationStatus:string}; }
export const getPendingClaims=async():Promise<PendingClaim[]> => (await api.get("/claims/admin/pending")).data.data;
export const reviewClaim=async(id:string,status:"APPROVED"|"REJECTED") => (await api.patch("/claims/"+id,{status})).data;
export const ingestAdzuna=async(data:{what:string;where?:string;pages:number}) => (await api.post("/jobs/ingest/adzuna",{...data,country:"in",page:1})).data;
