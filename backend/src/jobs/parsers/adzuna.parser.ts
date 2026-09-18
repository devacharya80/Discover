import type { AdzunaJob } from "../../types/adzuna.types.js";
import type { NormalizedExternalJob } from "../../types/normalized.job.types.js";
import {
  extractAdzunaSkills,
  mapAdzunaExperienceLevel,
  mapAdzunaWorkMode,
  mapAdzunaWorkType,
  parseAdzunaLocation,
} from "../mappers/adzuna.mapper.js";

export const parseAdzunaJob = (job: AdzunaJob): NormalizedExternalJob => {
  const mode = mapAdzunaWorkMode(job.description);
  const location = parseAdzunaLocation(job.location.display_name, job.location.area);

  return {
    externalId: job.id,
    source: "ADZUNA",
    title: job.title.trim(),
    description: job.description.trim(),
    companyName: job.company.display_name.trim(),
    location: {
      ...location,
      ...(job.latitude !== undefined && { latitude: job.latitude }),
      ...(job.longitude !== undefined && { longitude: job.longitude }),
    },
    type: mapAdzunaWorkType(job.contract_time, job.contract_type, job.title),
    ...(mode !== undefined && { mode }),
    experienceLevel: mapAdzunaExperienceLevel(job.title),
    skills: extractAdzunaSkills(job.title, job.description),
    ...(job.salary_min !== undefined && { salaryMin: job.salary_min }),
    ...(job.salary_max !== undefined && { salaryMax: job.salary_max }),
    applicationUrl: job.redirect_url,
    createdAt: new Date(job.created),
  };
};
