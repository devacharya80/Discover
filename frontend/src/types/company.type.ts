export type CompanySize = "1-10" | "11-50" | "51-200" | "201-500" | "501-1000" | "1000+";
export type CompanyStatus = "ACTIVE" | "INACTIVE" | "PENDING";
export type VerificationStatus = "VERIFIED" | "UNVERIFIED" | "REJECTED";
export type CreatedSource = "MANUAL" | "IMPORT" | "API";

export interface CompanyLocation {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  latitude: number | null;
  longitude: number | null;
  isPrimary: boolean;
  companyId: string;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface Company {
  id: string;
  name: string;
  industry: string;
  description: string;
  website: string | null;
  logoUrl: string | null;
  foundedYear: number | null;
  companySize: CompanySize;
  slug: string;
  status: CompanyStatus;
  verificationStatus: VerificationStatus;
  createdSource: CreatedSource;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface CompanyWithLocations extends Company {
  companyLocations: CompanyLocation[];
}

export interface ApiResponse<T> {
  message: string;
  data: T;
}

// Request Payload Types
export type CreateCompanyType = {
  name: string;
  industry: string;
  description: string;
  website?: string | null;
  logoUrl?: string | null;
  foundedYear?: number | null;
  companySize?: CompanySize;
};

export type UpdateCompanyType = Partial<CreateCompanyType>;

export type CreateCompanyLocationType = {
  name: string;
  address: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  latitude?: number | null;
  longitude?: number | null;
  isPrimary?: boolean;
};

export type UpdateCompanyLocationType = Partial<CreateCompanyLocationType>;