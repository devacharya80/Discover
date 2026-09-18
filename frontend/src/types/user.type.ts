export interface UserRegisterData { name:string; email:string; password:string; confirmPassword:string; location?:UserLocationType; }
export interface UserLoginData { email:string; password:string; }
export interface UserCompanyMembership { role:"ADMIN"|"OWNER"|"RECRUITER"; company:{id:string;name:string;slug:string;industry:string;description:string;website:string|null;logoUrl:string|null;foundedYear:number|null;companySize:string;status:string;verificationStatus:string;companyLocations:unknown[]}; }
export interface User { id:string; name:string; email:string; role:"USER"|"ADMIN"; location?:UserLocationType; companyMembers?:UserCompanyMembership[]; }
export interface UserLocationType { address:string; city:string; state:string; country:string; latitude?:number|null; longitude?:number|null; pincode:string; }
export interface UserUpdateDataType { name?:string; location?:Partial<UserLocationType>; }
export type UserUpdateDataTyep = UserUpdateDataType;
