import type { CreateJobData, UpdateJobData } from "../types/job.schema.js";
import prisma from "../lib/prisma.js";
import type { JobQueryData } from "../types/job.query.schema.js";

const publicActiveFilter = {
  status: "ACTIVE" as const,
  OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
};

const publicJobInclude = {
  company: {
    select: { id: true, name: true, logoUrl: true, verificationStatus: true, industry: true },
  },
  location: true,
  externalJob: true,
};

const buildWhere = (query: JobQueryData, companyId?: string) => ({
  ...(companyId ? { companyId } : {}),
  ...(query.companyId ? { companyId: query.companyId } : {}),
  ...(query.status ? { status: query.status } : publicActiveFilter),
  ...(query.type ? { type: query.type } : {}),
  ...(query.mode ? { mode: query.mode } : {}),
  ...(query.experienceLevel ? { experienceLevel: query.experienceLevel } : {}),
  ...(query.city ? { location: { city: { contains: query.city, mode: "insensitive" as const } } } : {}),
  ...(query.search ? {
    AND: [{
      OR: [
        { title: { contains: query.search, mode: "insensitive" as const } },
        { description: { contains: query.search, mode: "insensitive" as const } },
        { company: { name: { contains: query.search, mode: "insensitive" as const } } },
      ],
    }],
  } : {}),
});

export const createJobService = async (userId: string, companyId: string, jobData: CreateJobData) =>
  prisma.$transaction(async (tx) => {
    const member = await tx.companyMember.findUnique({
      where: { userId_companyId: { userId, companyId } },
      select: { role: true },
    });
    if (!member || !["ADMIN","OWNER","RECRUITER"].includes(member.role)) {
      throw new Error("User is not authorized to create a job");
    }

    if (jobData.locationId) {
      const location = await tx.companyLocation.findFirst({ where: { id: jobData.locationId, companyId }, select: { id: true } });
      if (!location) throw new Error("Location does not belong to this company");
    }

    const { locationId, ...fields } = jobData;
    return tx.job.create({
      data: {
        ...fields,
        salaryMin: jobData.salaryMin ?? null,
        salaryMax: jobData.salaryMax ?? null,
        company: { connect: { id: companyId } },
        ...(locationId ? { location: { connect: { id: locationId } } } : {}),
        source: "PLATFORM",
        status: "ACTIVE",
      },
      include: { company: true, location: true },
    });
  });

export const getCompanyAllJobService = async (companyId: string, query: JobQueryData) => {
  const company = await prisma.company.findUnique({ where: { id: companyId }, select: { id: true } });
  if (!company) throw new Error("Company not found");

  const where = buildWhere(query, companyId);
  const skip = (query.page - 1) * query.limit;
  const [jobs, total] = await Promise.all([
    prisma.job.findMany({
      where,
      include: { location: true, externalJob: true },
      orderBy: { [query.sortBy]: query.sortOrder },
      skip,
      take: query.limit,
    }),
    prisma.job.count({ where }),
  ]);
  const totalPages = Math.ceil(total / query.limit);
  return {
    jobs,
    pagination: { total, page: query.page, limit: query.limit, totalPages, hasNextPage: query.page < totalPages, hasPreviousPage: query.page > 1 },
  };
};

export const getCompanyJobService = async (companyId: string, jobId: string) => {
  const job = await prisma.job.findFirst({
    where: { id: jobId, companyId, ...publicActiveFilter },
    include: publicJobInclude,
  });
  if (!job) throw new Error("Job not found");
  return job;
};

export const getGlobalJobsService = async (query: JobQueryData) => {
  const where = buildWhere(query);
  const skip = (query.page - 1) * query.limit;
  const [jobs, total] = await Promise.all([
    prisma.job.findMany({
      where,
      include: publicJobInclude,
      orderBy: { [query.sortBy]: query.sortOrder },
      skip,
      take: query.limit,
    }),
    prisma.job.count({ where }),
  ]);
  const totalPages = Math.ceil(total / query.limit);
  return {
    jobs,
    pagination: { total, page: query.page, limit: query.limit, totalPages, hasNextPage: query.page < totalPages, hasPreviousPage: query.page > 1 },
  };
};

export const getJobByIdService = async (jobId: string) => {
  const job = await prisma.job.findFirst({
    where: { id: jobId, ...publicActiveFilter },
    include: publicJobInclude,
  });
  if (!job) throw new Error("Job not found");
  return job;
};

export const updateCompanyJobService = async (
  userId: string, companyId: string, jobId: string, jobData: UpdateJobData,
) => {
  const job = await prisma.job.findFirst({ where: { id: jobId, companyId }, select: { id: true, salaryMin: true, salaryMax: true, source: true } });
  if (!job) throw new Error("Job not found");
  if (job.source !== "PLATFORM") throw new Error("External jobs cannot be edited from the company dashboard");

  const member = await prisma.companyMember.findUnique({ where: { userId_companyId: { userId, companyId } }, select: { role: true } });
  if (!member || !["ADMIN","OWNER","RECRUITER"].includes(member.role)) throw new Error("Unauthorized");

  if (jobData.locationId) {
    const location = await prisma.companyLocation.findFirst({ where: { id: jobData.locationId, companyId }, select: { id: true } });
    if (!location) throw new Error("Location does not belong to this company");
  }

  const min = jobData.salaryMin !== undefined ? jobData.salaryMin : job.salaryMin;
  const max = jobData.salaryMax !== undefined ? jobData.salaryMax : job.salaryMax;
  if (min !== null && min !== undefined && max !== null && max !== undefined && min > max) {
    throw new Error("Minimum salary cannot be greater than maximum salary");
  }

  return prisma.job.update({
    where: { id: jobId },
    data: {
      ...(jobData.locationId !== undefined && { locationId: jobData.locationId }),
      ...(jobData.title !== undefined && { title: jobData.title }),
      ...(jobData.description !== undefined && { description: jobData.description }),
      ...(jobData.type !== undefined && { type: jobData.type }),
      ...(jobData.mode !== undefined && { mode: jobData.mode }),
      ...(jobData.experienceLevel !== undefined && { experienceLevel: jobData.experienceLevel }),
      ...(jobData.skills !== undefined && { skills: jobData.skills }),
      ...(jobData.salaryMin !== undefined && { salaryMin: jobData.salaryMin }),
      ...(jobData.salaryMax !== undefined && { salaryMax: jobData.salaryMax }),
      ...(jobData.externalLink !== undefined && { externalLink: jobData.externalLink }),
      ...(jobData.expiresAt !== undefined && { expiresAt: jobData.expiresAt }),
      ...(jobData.status !== undefined && { status: jobData.status }),
    },
    include: { location: true },
  });
};
