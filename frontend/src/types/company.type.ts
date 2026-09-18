export type CompanySize = "SEED_1_10" | "SMALL_11_50" | "MEDIUM_51_200" | "MIDMARKET_201_500" | "LARGE_501_1000" | "ENTERPRISE_1000_PLUS";
export type CompanyStatus = "ACTIVE" | "INACTIVE" | "SUSPENDED" | "ARCHIVED";
export type VerificationStatus = "VERIFIED" | "PENDING" | "REJECTED";
export type CreatedSource = "DISCOVERED" | "COMPANY_CREATED" | "ADMIN_CREATED";

export interface CompanyLocation {
  id: string; name: string; address: string; city: string; state: string; country: string;
  pincode: string; latitude: number | null; longitude: number | null; isPrimary: boolean;
  companyId: string; createdAt: string | Date; updatedAt: string | Date;
}

export interface Company {
  id: string; name: string; industry: string; description: string;
  website: string | null; logoUrl: string | null; foundedYear: number | null;
  companySize: CompanySize; slug: string; status: CompanyStatus;
  verificationStatus: VerificationStatus; createdSource: CreatedSource;
  createdAt: string | Date; updatedAt: string | Date;
}

export interface CompanyWithLocations extends Company {
  companyLocations: CompanyLocation[];
}

export interface ApiResponse<T> { message: string; data: T; }

export type CreateCompanyType = {
  name: string; industry: string; description: string;
  website?: string | null; logoUrl?: string | null; foundedYear?: number | null;
  companySize?: CompanySize;
};

export type UpdateCompanyType = Partial<CreateCompanyType>;

export type CreateCompanyLocationType = {
  name: string; address: string; city: string; state: string; country: string;
  pincode: string; latitude?: number | null; longitude?: number | null; isPrimary?: boolean;
};

export type UpdateCompanyLocationType = Partial<CreateCompanyLocationType>;
