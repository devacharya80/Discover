import { api } from "./axios";
export interface CompanyMember { id:string; role:"ADMIN"|"OWNER"|"RECRUITER"; createdAt:string; user:{id:string;name:string;email:string}; }
export const getCompanyMembers=async(companyId:string):Promise<CompanyMember[]> => (await api.get("/members/companies/"+companyId)).data.data;
export const addCompanyMember=async(companyId:string,data:{email:string;role:"ADMIN"|"OWNER"|"RECRUITER"})=>(await api.post("/members/companies/"+companyId,data)).data.data;
export const updateCompanyMember=async(companyId:string,id:string,role:"ADMIN"|"OWNER"|"RECRUITER")=>(await api.patch("/members/companies/"+companyId+"/"+id,{role})).data.data;
export const removeCompanyMember=async(companyId:string,id:string)=>(await api.delete("/members/companies/"+companyId+"/"+id)).data.data;
