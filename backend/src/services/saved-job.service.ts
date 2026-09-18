import prisma from "../lib/prisma.js";

const activeJobWhere = {
  status: "ACTIVE" as const,
  OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
};

export const saveJobService = async (userId: string, jobId: string) => {
  const job = await prisma.job.findFirst({ where: { id: jobId, ...activeJobWhere }, select: { id: true } });
  if (!job) throw new Error("Job not found or no longer active");
  return prisma.savedJob.upsert({
    where: { userId_jobId: { userId, jobId } },
    create: { userId, jobId },
    update: {},
    include: { job: { include: { company: true, location: true, externalJob: true } } },
  });
};

export const unsaveJobService = async (userId: string, jobId: string) => {
  const saved = await prisma.savedJob.findUnique({ where: { userId_jobId: { userId, jobId } } });
  if (!saved) throw new Error("Saved job not found");
  return prisma.savedJob.delete({ where: { id: saved.id } });
};

export const getSavedJobsService = async (userId: string) =>
  prisma.savedJob.findMany({
    where: { userId, job: { ...activeJobWhere } },
    orderBy: { createdAt: "desc" },
    include: {
      job: {
        include: {
          company: { select: { id: true, name: true, logoUrl: true, verificationStatus: true } },
          location: true,
          externalJob: true,
        },
      },
    },
  });

export const getSavedJobIdsService = async (userId: string, jobIds: string[]) => {
  if (!jobIds.length) return [];
  const rows = await prisma.savedJob.findMany({
    where: { userId, jobId: { in: jobIds } },
    select: { jobId: true },
  });
  return rows.map((row) => row.jobId);
};
