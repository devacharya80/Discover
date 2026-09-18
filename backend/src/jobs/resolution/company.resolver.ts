import prisma from "../../lib/prisma.js";
import { generateSlug } from "../../helper.js";
import type { ValidatedExternalJob } from "../validators/external-job.validator.js";

const normalizeCompanyName = (value: string) =>
  value.toLowerCase().trim().replace(/\s+/g, " ");

const uniqueSlug = async (name: string) => {
  const base = generateSlug(name) || "company";
  let slug = base;
  let suffix = 2;
  while (await prisma.company.findUnique({ where: { slug }, select: { id: true } })) {
    slug = base + "-" + suffix++;
  }
  return slug;
};

export const resolveExternalCompany = async (job: ValidatedExternalJob) => {
  const normalizedName = normalizeCompanyName(job.companyName);

  const existing = await prisma.company.findFirst({
    where: { name: { equals: normalizedName, mode: "insensitive" } },
    select: { id: true, name: true },
  });

  if (existing) return existing;

  const slug = await uniqueSlug(job.companyName);

  return prisma.company.create({
    data: {
      name: job.companyName,
      slug,
      industry: "Software & Technology",
      description: "Company discovered through " + job.source + " job listings.",
      createdSource: "DISCOVERED",
      verificationStatus: "PENDING",
      status: "ACTIVE",
    },
    select: { id: true, name: true },
  });
};
