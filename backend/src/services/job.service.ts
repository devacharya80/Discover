import type { CreateJobData, UpdateJobData } from "../types/job.schema.js";
import prisma from "../lib/prisma.js";
import type { JobQueryData } from "../types/job.query.schema.js";

export const createJobService = async (userId: string, companyId: string, jobData: CreateJobData) => {
  return prisma.$transaction(async (tx) => {
    const companyMember = await tx.companyMember.findUnique({ where: { userId_companyId: { userId, companyId } } });
    if (!companyMember || !["ADMIN", "OWNER", "RECRUITER"].includes(companyMember.role)) {
      throw new Error("User is not authorized to create a job");
    }

    if (jobData.locationId) {
      const location = await tx.companyLocation.findFirst({ where: { id: jobData.locationId, companyId } });
      if (!location) throw new Error("Location does not belong to this company");
    }

    const { locationId, ...jobFields } = jobData;
    return tx.job.create({
      data: {
        ...jobFields,
        salaryMin: jobData.salaryMin ?? null,
        salaryMax: jobData.salaryMax ?? null,
        company: { connect: { id: companyId } },
        ...(locationId ? { location: { connect: { id: locationId } } } : {}),
        source: "PLATFORM",
        status: "ACTIVE",
      },
    });
  }, { maxWait: 10000, timeout: 10000 });
};

const activeJobFilter = {
  status: "ACTIVE" as const,
  OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
};

export const getCompanyAllJobService = async (companyId: string, query: JobQueryData) => {
  const { page, limit, type, mode, experienceLevel, sortBy, sortOrder, search } = query;
  const skip = (page - 1) * limit;

  const company = await prisma.company.findUnique({ where: { id: companyId }, select: { id: true } });
  if (!company) throw new Error("Company not found");

  const where = {
    companyId,
    ...activeJobFilter,
    ...(type && { type }),
    ...(mode && { mode }),
    ...(experienceLevel && { experienceLevel }),
    ...(search && {
      AND: [
        {
          OR: [
            { title: { contains: search, mode: "insensitive" as const } },
            { description: { contains: search, mode: "insensitive" as const } },
          ],
        },
      ],
    }),
  };

  const [jobs, totalCount] = await Promise.all([
    prisma.job.findMany({
      where,
      select: {
        id: true, title: true, description: true, type: true, mode: true,
        experienceLevel: true, skills: true, salaryMin: true, salaryMax: true,
        externalLink: true, source: true, status: true, expiresAt: true,
        createdAt: true, updatedAt: true,
        location: {
          select: { id: true, name: true, address: true, city: true, state: true, pincode: true },
        },
      },
      orderBy: { [sortBy]: sortOrder },
      skip,
      take: limit,
    }),
    prisma.job.count({ where }),
  ]);

  const totalPages = Math.ceil(totalCount / limit);
  return {
    jobs,
    pagination: {
      total: totalCount, page, limit, totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
  };
};

export const getCompanyJobService = async (companyId: string, jobId: string) => {
  const companyJob = await prisma.job.findFirst({
    where: { id: jobId, companyId, ...activeJobFilter },
    include: { location: true },
  });
  if (!companyJob) throw new Error("Job not found");
  return companyJob;
};

export const updateCompanyJobService = async (
  userId: string, companyId: string, jobId: string, jobData: UpdateJobData,
) => {
  const company = await prisma.company.findUnique({ where: { id: companyId }, select: { id: true } });
  if (!company) throw new Error("Company not found");

  const job = await prisma.job.findFirst({
    where: { id: jobId, companyId },
    select: { id: true, salaryMin: true, salaryMax: true },
  });
  if (!job) throw new Error("Job not found");

  const companyMember = await prisma.companyMember.findUnique({
    where: { userId_companyId: { userId, companyId } },
    select: { role: true },
  });
  if (!companyMember || !["ADMIN", "OWNER", "RECRUITER"].includes(companyMember.role)) {
    throw new Error("Unauthorized");
  }

  if (jobData.locationId) {
    const location = await prisma.companyLocation.findFirst({
      where: { id: jobData.locationId, companyId }, select: { id: true },
    });
    if (!location) throw new Error("Location does not belong to this company");
  }

  const finalSalaryMin = jobData.salaryMin !== undefined ? jobData.salaryMin : job.salaryMin;
  const finalSalaryMax = jobData.salaryMax !== undefined ? jobData.salaryMax : job.salaryMax;
  if (finalSalaryMin !== null && finalSalaryMax !== null && finalSalaryMin > finalSalaryMax) {
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
    },
  });
};
