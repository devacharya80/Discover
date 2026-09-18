import { api } from "./axios";
import type { CompanyClaim } from "../types/claim.type";
export const createCompanyClaim = async (companyId:string):Promise<CompanyClaim> => (await api.post(`/claims/companies/${companyId}`)).data.data;
export const getMyClaims = async ():Promise<CompanyClaim[]> => (await api.get("/claims/user")).data.data;
