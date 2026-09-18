import prisma from "../lib/prisma.js";

const activeJobWhere = () => ({ status: "ACTIVE" as const, OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }] });

export const applyToJobService = async (userId: string, jobId: string) => {
  const job = await prisma.job.findFirst({
    where: { id: jobId, ...activeJobWhere() },
    select: { id: true, source: true, externalLink: true },
  });
  if (!job) throw new Error("Job not found or no longer active");
  if (job.source === "EXTERNAL") throw new Error("External jobs must be applied to through the external application link");

  const existing = await prisma.application.findUnique({
    where: { userId_jobId: { userId, jobId } },
  });
  if (existing && existing.status !== "WITHDRAWN") throw new Error("You have already applied to this job");

  if (existing) {
    return prisma.application.update({
      where: { id: existing.id },
      data: { status: "APPLIED", appliedAt: new Date() },
      include: { job: { include: { company: true, location: true } } },
    });
  }

  return prisma.application.create({
    data: { userId, jobId },
    include: { job: { include: { company: true, location: true } } },
  });
};

export const getUserApplicationsService = async (userId: string) =>
  prisma.application.findMany({
    where: { userId },
    orderBy: { appliedAt: "desc" },
    include: {
      job: {
        include: {
          company: { select: { id: true, name: true, logoUrl: true, verificationStatus: true } },
          location: true,
        },
      },
    },
  });

export const withdrawApplicationService = async (userId: string, applicationId: string) => {
  const application = await prisma.application.findFirst({ where: { id: applicationId, userId } });
  if (!application) throw new Error("Application not found");
  if (["REJECTED", "HIRED", "WITHDRAWN"].includes(application.status)) {
    if (application.status === "WITHDRAWN") return application;
    throw new Error("This application cannot be withdrawn");
  }
  return prisma.application.update({ where: { id: applicationId }, data: { status: "WITHDRAWN" } });
};

export const getCompanyApplicationsService = async (userId: string, companyId: string) => {
  const membership = await prisma.companyMember.findUnique({
    where: { userId_companyId: { userId, companyId } },
    select: { role: true },
  });
  if (!membership || !["OWNER", "ADMIN", "RECRUITER"].includes(membership.role)) {
    throw new Error("You are not authorized to view company applications");
  }

  return prisma.application.findMany({
    where: { job: { companyId } },
    orderBy: { appliedAt: "desc" },
    include: {
      user: { select: { id: true, name: true, email: true, location: true } },
      job: { select: { id: true, title: true, companyId: true } },
    },
  });
};

export const updateApplicationStatusService = async (
  userId: string,
  companyId: string,
  applicationId: string,
  status: "APPLIED" | "REVIEWING" | "SHORTLISTED" | "REJECTED" | "HIRED" | "WITHDRAWN",
) => {
  const membership = await prisma.companyMember.findUnique({
    where: { userId_companyId: { userId, companyId } },
    select: { role: true },
  });
  if (!membership || !["OWNER", "ADMIN", "RECRUITER"].includes(membership.role)) {
    throw new Error("You are not authorized to manage applications");
  }

  const application = await prisma.application.findFirst({
    where: { id: applicationId, job: { companyId } },
  });
  if (!application) throw new Error("Application not found");

  return prisma.application.update({ where: { id: applicationId }, data: { status } });
};
