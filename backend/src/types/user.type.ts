export enum CompanyRole {
  ADMIN = "ADMIN",
  OWNER = "OWNER",
  RECRUITER = "RECRUITER",
}

export enum CompanySize {
  SEED_1_10 = "SEED_1_10",
  SMALL_11_50 = "SMALL_11_50",
  MEDIUM_51_200 = "MEDIUM_51_200",
  MIDMARKET_201_500 = "MIDMARKET_201_500",
  LARGE_501_1000 = "LARGE_501_1000",
  ENTERPRISE_1000_PLUS = "ENTERPRISE_1000_PLUS",
}

export enum CompanyStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  SUSPENDED = "SUSPENDED",
  ARCHIVED = "ARCHIVED",
}

export enum VerificationStatus {
  VERIFIED = "VERIFIED",
  PENDING = "PENDING",
  REJECTED = "REJECTED",
}

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
