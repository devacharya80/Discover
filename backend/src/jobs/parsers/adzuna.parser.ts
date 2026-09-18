import type { AdzunaJob } from "../../types/adzuna.types.js";
import type { NormalizedExternalJob } from "../../types/normalized.job.types.js";

import {
  mapAdzunaExperienceLevel,
  mapAdzunaWorkMode,
  mapAdzunaWorkType,
} from "../mappers/adzuna.mapper.js";

export const parseAdzunaJob = (job: AdzunaJob): NormalizedExternalJob => {
  const mode = mapAdzunaWorkMode(job.description);

  return {
    externalId: job.id,
    source: "ADZUNA",

    title: job.title,
    description: job.description,

    companyName: job.company.display_name,

    location: {
      name: job.location.display_name,

      ...(job.latitude !== undefined && {
        latitude: job.latitude,
      }),

      ...(job.longitude !== undefined && {
        longitude: job.longitude,
      }),
    },

    type: mapAdzunaWorkType(job.contract_time),

    ...(mode !== undefined && {
      mode,
    }),

    experienceLevel: mapAdzunaExperienceLevel(job.title),

    skills: [],

    ...(job.salary_min !== undefined && {
      salaryMin: job.salary_min,
    }),

    ...(job.salary_max !== undefined && {
      salaryMax: job.salary_max,
    }),

    applicationUrl: job.redirect_url,

    createdAt: new Date(job.created),
  };
};