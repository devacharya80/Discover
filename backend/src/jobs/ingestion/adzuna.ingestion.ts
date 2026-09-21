import prisma from "../../lib/prisma.js";
import type { Prisma } from "../../generated/prisma/client.js";
import { searchAdzunaJobs } from "../providers/adzuna.provider.js";
import { parseAdzunaJob } from "../parsers/adzuna.parser.js";
import { validateExternalJob } from "../validators/external-job.validator.js";
import { checkDuplicateExternalJob } from "../deduplication/job.deduplication.js";
import { resolveExternalCompany } from "../resolution/company.resolver.js";

export interface AdzunaIngestionOptions {
  country?: string; page?: number; pages?: number; what?: string; where?: string;
}

/**
 * A provider location is only promoted to a map location when the provider
 * supplied coordinates. Text-only locations remain on ExternalJob so we do
 * not fabricate a pin for a company.
 */
const resolveExternalLocation = async (
  tx: Prisma.TransactionClient,
  companyId: string,
  location: { name: string; city?: string; state?: string; country?: string; latitude?: number; longitude?: number },
) => {
  if (location.latitude === undefined || location.longitude === undefined) return null;

  const existing = await tx.companyLocation.findFirst({
    where: { companyId, latitude: location.latitude, longitude: location.longitude },
    select: { id: true },
  });
  if (existing) return existing.id;

  const hasLocation = await tx.companyLocation.findFirst({ where: { companyId }, select: { id: true } });
  const created = await tx.companyLocation.create({
    data: {
      companyId,
      name: location.name,
      address: location.name,
      city: location.city ?? "",
      state: location.state ?? "",
      country: location.country ?? "",
      latitude: location.latitude,
      longitude: location.longitude,
      // External sources do not provide postal codes. An empty value preserves
      // that distinction instead of asserting an invented postal code.
      pincode: "",
      isPrimary: !hasLocation,
    },
    select: { id: true },
  });
  return created.id;
};

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

            const locationId = existingJob
              ? await resolveExternalLocation(tx, existingJob.companyId, validated.location)
              : null;

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
        const locationId = await resolveExternalLocation(tx, company.id, validated.location);
        const createdJob = await tx.job.create({
          data: {
            companyId: company.id,
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
            source: "EXTERNAL",
            status: "ACTIVE",
            createdAt: validated.createdAt,
            expiresAt: externalExpiry(),
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
