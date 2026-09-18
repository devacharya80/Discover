import { api } from "./axios";
export interface CompanyMember { id:string; role:"ADMIN"|"OWNER"|"RECRUITER"; createdAt:string; user:{id:string;name:string}; }
export const getCompanyMembers=async(companyId:string):Promise<CompanyMember[]> => (await api.get("/members/companies/"+companyId)).data.data;
