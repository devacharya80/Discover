export type ClaimStatus = "PENDING"|"APPROVED"|"REJECTED";
export interface CompanyClaim { id:string; userId:string; companyId:string; status:ClaimStatus; requestedAt:string; updatedAt:string; company?:{id:string;name:string;logoUrl:string|null;verificationStatus:string}; }
