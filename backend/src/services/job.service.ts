import type { CreateJobData } from "../types/job.schema.js";
import prisma from "../lib/prisma.js";

export const createJobService = async (
  userId: string,
  companyId: string,
  jobData: CreateJobData,
) => {
  return await prisma.$transaction(async (tx) => {
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
  }, { maxWait: 10000, timeout: 10000 });
};


export const getCompanyAllJobService = async (
  companyId: string,
  page: number,
  limit: number,
  skip: number
) => {
  // 1. Verify company exists
  const company = await prisma.company.findUnique({
    where: { id: companyId },
    select: { id: true },
  });

  if (!company) {
    throw new Error("Company not found");
  }

  // 2. Fetch jobs and total count concurrently
  const [jobs, totalCount] = await Promise.all([
    prisma.job.findMany({
      where: { companyId },
      include: {
        location: true, // includes location details if needed
      },
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: limit,
    }),
    prisma.job.count({
      where: { companyId },
    }),
  ]);

  return {
    jobs,
    pagination: {
      total: totalCount,
      page,
      limit,
      totalPages: Math.ceil(totalCount / limit),
    },
  };
};

export const getCompanyJobService = async (companyId: string, jobId: string) => {
  const companyJob = await prisma.job.findUnique({
      where : {
        id : jobId,
        companyId : companyId
      },
      include : {
        location : true
      }
    })
    if(!companyJob){
      throw new Error("No Jobs found");
    }
    return companyJob
}