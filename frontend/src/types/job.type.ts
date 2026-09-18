export type WorkType = "FULL_TIME" | "PART_TIME" | "CONTRACT" | "INTERNSHIP" | "FREELANCE";
export type WorkMode = "REMOTE" | "HYBRID" | "ON_SITE";
export type ExperienceLevel = "ENTRYLEVEL" | "JUNIOR" | "MID_LEVEL" | "SENIOR" | "LEAD" | "EXECUTIVE";
export type JobSource = "PLATFORM" | "EXTERNAL";
export type JobStatus = "DRAFT" | "ACTIVE" | "PAUSED" | "CLOSED" | "ARCHIVED";

export interface JobLocation {
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
}

export interface ExternalJobInfo {
  id: string;
  provider: string;
  externalId: string;
  externalLocationName: string | null;
  externalCity: string | null;
  externalState: string | null;
  externalCountry: string | null;
  externalLatitude: number | null;
  externalLongitude: number | null;
  firstSeenAt: string;
  lastSeenAt: string;
}

export interface JobCompany {
  id: string;
  name: string;
  logoUrl: string | null;
  verificationStatus: "VERIFIED" | "PENDING" | "REJECTED";
  industry?: string;
}

export interface Job {
  id: string; companyId: string; title: string; description: string;
  type: WorkType; mode: WorkMode; experienceLevel: ExperienceLevel;
  skills: string[]; salaryMin: number | null; salaryMax: number | null;
  externalLink: string | null; source: JobSource; status: JobStatus;
  expiresAt: string | null; createdAt: string; updatedAt: string;
  company?: JobCompany; location: JobLocation | null; externalJob?: ExternalJobInfo | null;
}

export interface JobsResponse {
  message: string;
  data: Job[];
  pagination: { total: number; page: number; limit: number; totalPages: number; hasNextPage: boolean; hasPreviousPage: boolean };
}
export interface JobQuery {
  page?: number; limit?: number; type?: WorkType; mode?: WorkMode;
  experienceLevel?: ExperienceLevel; search?: string; city?: string;
  sortBy?: "createdAt" | "salaryMin" | "salaryMax" | "title";
  sortOrder?: "asc" | "desc";
}
