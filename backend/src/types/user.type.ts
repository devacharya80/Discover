import type {
  CompanyRole,
  CompanySize,
  CompanyStatus,
  VerificationStatus,
} from "../generated/prisma/enums.js";

export interface CompanyLocationType {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  country: string;
  latitude: number | null;
  longitude: number | null;
  pincode: string;
  isPrimary: boolean;
}

export interface CompanySummaryType {
  id: string;
  name: string;
  slug: string;
  industry: string;
  description: string;
  website: string | null;
  logoUrl: string | null;
  foundedYear: number | null;
  companySize: CompanySize;
  status: CompanyStatus;
  verificationStatus: VerificationStatus;
  companyLocations: CompanyLocationType[];
}

export interface CompanyMemberType {
  role: CompanyRole;
  company: CompanySummaryType;
}

export interface UserLocationType {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  address: string;
  city: string;
  state: string;
  country: string;
  latitude: number | null;
  longitude: number | null;
  pincode: string;
  userId: string;
}

export interface UserType {
  id: string;
  email: string;
  name: string;
  location: UserLocationType | null;
  companyMembers: CompanyMemberType[];
}