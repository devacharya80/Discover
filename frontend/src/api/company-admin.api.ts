import { api } from "./axios";
export interface CompanyApplication { id:string; status:"APPLIED"|"REVIEWING"|"SHORTLISTED"|"REJECTED"|"HIRED"|"WITHDRAWN"; appliedAt:string; user:{id:string;name:string;email:string}; job:{id:string;title:string;companyId:string}; }
export const getCompanyApplications=async(companyId:string):Promise<CompanyApplication[]> => (await api.get("/applications/companies/"+companyId+"/applications")).data.data;
export const updateCompanyApplication=async(companyId:string,id:string,status:CompanyApplication["status"]) => (await api.patch("/applications/companies/"+companyId+"/applications/"+id,{status})).data;
