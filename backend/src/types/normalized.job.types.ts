import type {
  WorkMode,
  WorkType,
  ExperienceLevel,
} from "../generated/prisma/client.js";

export interface NormalizedExternalJob {
  externalId: string;
  source: string;

  title: string;
  description: string;

  companyName: string;

  location: {
    name: string;
    city?: string;
    state?: string;
    country?: string;
    latitude?: number;
    longitude?: number;
  };

  type: WorkType;
  mode?: WorkMode;
  experienceLevel: ExperienceLevel;

  skills: string[];

  salaryMin?: number;
  salaryMax?: number;

  applicationUrl: string;

  createdAt: Date;
}