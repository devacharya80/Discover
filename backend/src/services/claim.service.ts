import prisma from "../lib/prisma.js";

export const createClaimService = async (userId: string, companyId: string) => {
  const company = await prisma.company.findUnique({ where: { id: companyId }, select: { id: true, verificationStatus: true } });
  if (!company) throw new Error("Company not found");

  const membership = await prisma.companyMember.findUnique({
    where: { userId_companyId: { userId, companyId } },
    select: { id: true },
  });
  if (membership) throw new Error("You are already a member of this company");

  const pending = await prisma.companyClaimRequest.findFirst({
    where: { userId, companyId, status: "PENDING" },
  });
  if (pending) return pending;

  return prisma.companyClaimRequest.create({ data: { userId, companyId } });
};

export const getUserClaimsService = async (userId: string) =>
  prisma.companyClaimRequest.findMany({
    where: { userId },
    orderBy: { requestedAt: "desc" },
    include: { company: { select: { id: true, name: true, logoUrl: true, verificationStatus: true } } },
  });

export const getCompanyClaimsService = async (userId: string, companyId: string) => {
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { role: true } });
  const membership = await prisma.companyMember.findUnique({
    where: { userId_companyId: { userId, companyId } },
    select: { role: true },
  });
  if (user?.role !== "ADMIN" && (!membership || !["OWNER", "ADMIN"].includes(membership.role))) {
    throw new Error("You are not authorized to review claims");
  }
  return prisma.companyClaimRequest.findMany({
    where: { companyId },
    orderBy: { requestedAt: "asc" },
    include: { user: { select: { id: true, name: true, email: true } } },
  });
};

export const reviewClaimService = async (
  reviewerId: string,
  claimId: string,
  status: "APPROVED" | "REJECTED",
) => {
  const reviewer = await prisma.user.findUnique({ where: { id: reviewerId }, select: { role: true } });
  if (reviewer?.role !== "ADMIN") throw new Error("Admin access required");

  return prisma.$transaction(async (tx) => {
    const claim = await tx.companyClaimRequest.findUnique({ where: { id: claimId } });
    if (!claim) throw new Error("Claim not found");
    if (claim.status !== "PENDING") throw new Error("Claim has already been reviewed");

    const updated = await tx.companyClaimRequest.update({
      where: { id: claimId },
      data: { status },
    });

    if (status === "APPROVED") {
      await tx.companyMember.upsert({
        where: { userId_companyId: { userId: claim.userId, companyId: claim.companyId } },
        create: { userId: claim.userId, companyId: claim.companyId, role: "OWNER" },
        update: { role: "OWNER" },
      });
      await tx.company.update({
        where: { id: claim.companyId },
        data: { verificationStatus: "VERIFIED" },
      });
    }

    return updated;
  });
};

export const getPendingClaimsAdminService = async (userId: string) => { const user = await prisma.user.findUnique({ where:{id:userId}, select:{role:true} }); if(user?.role!=="ADMIN") throw new Error("Admin access required"); return prisma.companyClaimRequest.findMany({ where:{status:"PENDING"}, orderBy:{requestedAt:"asc"}, include:{ user:{select:{id:true,name:true,email:true}}, company:{select:{id:true,name:true,logoUrl:true,verificationStatus:true}} } }); };
