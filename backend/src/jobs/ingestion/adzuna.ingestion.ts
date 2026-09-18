import prisma from "../../lib/prisma.js";
import { searchAdzunaJobs } from "../providers/adzuna.provider.js";
import { parseAdzunaJob } from "../parsers/adzuna.parser.js";
import { validateExternalJob } from "../validators/external-job.validator.js";
import { checkDuplicateExternalJob } from "../deduplication/job.deduplication.js";
import { resolveExternalCompany } from "../resolution/company.resolver.js";

export interface AdzunaIngestionOptions {
  country?: string;
  page?: number;
  pages?: number;
  what?: string;
  where?: string;
}

export const ingestAdzunaJobs = async ({
  country = "in",
  page = 1,
  pages = 1,
  what = "software engineer",
  where,
}: AdzunaIngestionOptions = {}) => {
  const stats = { fetched: 0, inserted: 0, updated: 0, skipped: 0, invalid: 0 };

  for (let currentPage = page; currentPage < page + pages; currentPage++) {
    const response = await searchAdzunaJobs({ country, page: currentPage, what, where });
    stats.fetched += response.results.length;

    for (const rawJob of response.results) {
      const validated = validateExternalJob(parseAdzunaJob(rawJob));

      if (!validated) {
        stats.invalid++;
        continue;
      }

      const duplicate = await checkDuplicateExternalJob(validated);

      if (duplicate.isDuplicate) {
        await prisma.externalJob.update({
          where: { jobId: duplicate.jobId },
          data: { lastSeenAt: new Date() },
        }).catch(() => undefined);
        stats.updated++;
        continue;
      }

      const company = await resolveExternalCompany(validated);

      await prisma.$transaction(async (tx) => {
        const createdJob = await tx.job.create({
          data: {
            companyId: company.id,
            title: validated.title,
            description: validated.description,
            type: validated.type,
            mode: validated.mode ?? "REMOTE",
            experienceLevel: validated.experienceLevel,
            skills: validated.skills.length ? validated.skills : ["Software Engineering"],
            salaryMin: validated.salaryMin ?? null,
            salaryMax: validated.salaryMax ?? null,
            externalLink: validated.applicationUrl,
            source: "EXTERNAL",
            status: "ACTIVE",
            createdAt: validated.createdAt,
          },
        });

        await tx.externalJob.create({
          data: {
            provider: validated.source,
            externalId: validated.externalId,
            fingerprint: duplicate.fingerprint,
            jobId: createdJob.id,
          },
        });
      });

      stats.inserted++;
    }
  }

  return stats;
};
