import prisma from "../../lib/prisma.js";
import { searchAdzunaJobs } from "../providers/adzuna.provider.js";
import { parseAdzunaJob } from "../parsers/adzuna.parser.js";
import { validateExternalJob } from "../validators/external-job.validator.js";
import { checkDuplicateExternalJob } from "../deduplication/job.deduplication.js";
import { resolveExternalCompany } from "../resolution/company.resolver.js";

export interface AdzunaIngestionOptions {
  country?: string; page?: number; pages?: number; what?: string; where?: string;
}

export const ingestAdzunaJobs = async ({
  country = "in", page = 1, pages = 1, what = "software engineer", where,
}: AdzunaIngestionOptions = {}) => {
  const stats = { fetched: 0, inserted: 0, updated: 0, skipped: 0, invalid: 0 };
  const externalExpiry = () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

  for (let currentPage = page; currentPage < page + pages; currentPage++) {
    const response = await searchAdzunaJobs({ country, page: currentPage, what, where });
    stats.fetched += response.results.length;

    for (const rawJob of response.results) {
      const validated = validateExternalJob(parseAdzunaJob(rawJob));
      if (!validated) { stats.invalid++; continue; }

      const duplicate = await checkDuplicateExternalJob(validated);
      if (duplicate.isDuplicate) {
        if (duplicate.reason === "EXACT_MATCH") {
          await prisma.$transaction(async (tx) => {
            const external = await tx.externalJob.update({
              where: { jobId: duplicate.jobId },
              data: {
                lastSeenAt: new Date(),
                fingerprint: duplicate.fingerprint ?? undefined,
                externalLocationName: validated.location.name,
                externalCity: validated.location.city ?? null,
                externalState: validated.location.state ?? null,
                externalCountry: validated.location.country ?? null,
                externalLatitude: validated.location.latitude ?? null,
                externalLongitude: validated.location.longitude ?? null,
              },
            });

            const existingJob = await tx.job.findUnique({
              where: { id: external.jobId },
              select: { companyId: true },
            });

            let locationId: string | null = null;

            if (existingJob && validated.location.latitude !== undefined && validated.location.longitude !== undefined) {
              const existingLocation = await tx.companyLocation.findFirst({
                where: {
                  companyId: existingJob.companyId,
                  latitude: validated.location.latitude,
                  longitude: validated.location.longitude,
                },
                select: { id: true },
              });

              if (existingLocation) {
                locationId = existingLocation.id;
              } else {
                const hasPrimary = await tx.companyLocation.findFirst({
                  where: { companyId: existingJob.companyId },
                  select: { id: true },
                });
                const city = validated.location.city ?? validated.location.name;
                const state = validated.location.state ?? INDIA_STATE_BY_CITY[normalizeCity(validated.location.city)] ?? "Karnataka";
                const locationCountry = validated.location.country ?? (country === "in" ? "INDIA" : country.toUpperCase());

                const createdLocation = await tx.companyLocation.create({
                  data: {
                    companyId: existingJob.companyId,
                    name: validated.location.name,
                    address: validated.location.name,
                    city,
                    state,
                    country: locationCountry,
                    latitude: validated.location.latitude,
                    longitude: validated.location.longitude,
                    pincode: "000000",
                    isPrimary: !hasPrimary,
                  },
                  select: { id: true },
                });
                locationId = createdLocation.id;
              }
            }

            await tx.job.update({
              where: { id: external.jobId },
              data: {
                ...(locationId ? { locationId } : {}),
                title: validated.title,
                description: validated.description,
                type: validated.type,
                mode: validated.mode ?? "REMOTE",
                experienceLevel: validated.experienceLevel,
                skills: validated.skills,
                salaryMin: validated.salaryMin ?? null,
                salaryMax: validated.salaryMax ?? null,
                externalLink: validated.applicationUrl,
                status: "ACTIVE",
                expiresAt: externalExpiry(),
              },
            });
          });
          stats.updated++;
        } else {
          stats.skipped++;
        }
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
            skills: validated.skills,
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
            externalLocationName: validated.location.name,
            externalCity: validated.location.city ?? null,
            externalState: validated.location.state ?? null,
            externalCountry: validated.location.country ?? null,
            externalLatitude: validated.location.latitude ?? null,
            externalLongitude: validated.location.longitude ?? null,
            jobId: createdJob.id,
          },
        });
      });
      stats.inserted++;
    }
  }
  return stats;
};
