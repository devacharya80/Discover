import type { CreateJobData, UpdateJobData } from "../types/job.schema.js";
import prisma from "../lib/prisma.js";
import type {
  ExperienceLevel,
  WorkType,
  WorkMode,
} from "../generated/prisma/enums.js";
import type { JobQueryData } from "../types/job.query.schema.js";

export const createJobService = async (
  userId: string,
  companyId: string,
  jobData: CreateJobData,
) => {
  return await prisma.$transaction(
    async (tx) => {
      // 1. Check whether the user belongs to the company
      const companyMember = await tx.companyMember.findUnique({
        where: {
          userId_companyId: {
            userId,
            companyId,
          },
        },
      });

      // 2. Check authorization
      if (
        !companyMember ||
        !["ADMIN", "OWNER", "RECRUITER"].includes(companyMember.role)
      ) {
        throw new Error("User is not authorized to create a job");
      }

      // 3. Validate the location belongs to this company
      if (jobData.locationId) {
        const location = await tx.companyLocation.findFirst({
          where: {
            id: jobData.locationId,
            companyId,
          },
        });

        if (!location) {
          throw new Error("Location does not belong to this company");
        }
      }

      // 4. Separate relation field from normal job fields
      const { locationId, ...jobFields } = jobData;

      // 5. Create the job
      const newJob = await tx.job.create({
        data: {
          ...jobFields,

          company: {
            connect: {
              id: companyId,
            },
          },

          ...(locationId
            ? {
                location: {
                  connect: {
                    id: locationId,
                  },
                },
              }
            : {}),

          source: "PLATFORM",
          status: "ACTIVE",
        },
      });

      return newJob;
    },
    { maxWait: 10000, timeout: 10000 },
  );
};

export const getCompanyAllJobService = async (
  companyId: string,
  query: JobQueryData,
) => {
  const {
    page,
    limit,
    type,
    mode,
    experienceLevel,
    sortBy,
    sortOrder,
    search,
  } = query;

  const skip = (page - 1) * limit;

  // 1. Verify company exists
  const company = await prisma.company.findUnique({
    where: {
      id: companyId,
    },
    select: {
      id: true,
    },
  });

  if (!company) {
    throw new Error("Company not found");
  }

  // 2. Build dynamic filters
  const where = {
    companyId,

    ...(type && {
      type,
    }),

    ...(mode && {
      mode,
    }),

    ...(experienceLevel && {
      experienceLevel,
    }),

    ...(search && {
      OR: [
        {
          title: {
            contains: search,
            mode: "insensitive" as const,
          },
        },
        {
          description: {
            contains: search,
            mode: "insensitive" as const,
          },
        },
      ],
    }),
  };

  // 3. Fetch jobs + total count concurrently
  const [jobs, totalCount] = await Promise.all([
    prisma.job.findMany({
      where,

      select: {
        id: true,
        title: true,
        description: true,
        type: true,
        mode: true,
        experienceLevel: true,
        skills: true,
        salaryMin: true,
        salaryMax: true,
        externalLink: true,
        status: true,
        expiresAt: true,
        createdAt: true,

        location: {
          select: {
            id: true,
            name: true,
            address: true,
            city: true,
            state: true,
            pincode: true,
          },
        },
      },

      orderBy: {
        [sortBy]: sortOrder,
      },

      skip,
      take: limit,
    }),

    prisma.job.count({
      where,
    }),
  ]);

  const totalPages = Math.ceil(totalCount / limit);

  return {
    jobs,

    pagination: {
      total: totalCount,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
  };
};

export const getCompanyJobService = async (
  companyId: string,
  jobId: string,
) => {
  const companyJob = await prisma.job.findUnique({
    where: {
      id: jobId,
      companyId: companyId,
    },
    include: {
      location: true,
    },
  });
  if (!companyJob) {
    throw new Error("No Jobs found");
  }
  return companyJob;
};

export const updateCompanyJobService = async (
  userId: string,
  companyId: string,
  jobId: string,
  jobData: UpdateJobData,
) => {
  // 1. Check company exists
  const company = await prisma.company.findUnique({
    where: {
      id: companyId,
    },
    select: {
      id: true,
    },
  });

  if (!company) {
    throw new Error("Company not found");
  }

  // 2. Check job exists and belongs to this company
  const job = await prisma.job.findFirst({
    where: {
      id: jobId,
      companyId,
    },
    select: {
      id: true,
      salaryMin: true,
      salaryMax: true,
    },
  });

  if (!job) {
    throw new Error("Job not found");
  }

  // 3. Check user's company membership
  const companyMember = await prisma.companyMember.findUnique({
    where: {
      userId_companyId: {
        userId,
        companyId,
      },
    },
    select: {
      role: true,
    },
  });

  if (
    !companyMember ||
    !["ADMIN", "OWNER", "RECRUITER"].includes(companyMember.role)
  ) {
    throw new Error("Unauthorized");
  }

  // 4. If location is being changed, verify it belongs to this company
  if (jobData.locationId) {
    const location = await prisma.companyLocation.findFirst({
      where: {
        id: jobData.locationId,
        companyId,
      },
      select: {
        id: true,
      },
    });

    if (!location) {
      throw new Error("Location does not belong to this company");
    }
  }

  // 5. Validate final salary range
  const finalSalaryMin =
    jobData.salaryMin !== undefined
      ? jobData.salaryMin
      : job.salaryMin;

  const finalSalaryMax =
    jobData.salaryMax !== undefined
      ? jobData.salaryMax
      : job.salaryMax;

  if (
    finalSalaryMin !== null &&
    finalSalaryMax !== null &&
    finalSalaryMin > finalSalaryMax
  ) {
    throw new Error(
      "Minimum salary cannot be greater than maximum salary",
    );
  }

  // 6. Update job
  const updatedJob = await prisma.job.update({
    where: {
      id: jobId,
    },
    data: jobData,
  });

  return updatedJob;
};