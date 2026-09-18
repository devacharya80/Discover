import prisma from "../lib/prisma.js";

const canManage = (role: string) => role === "OWNER" || role === "ADMIN";

export const getCompanyMembersService = async (companyId: string) =>
  prisma.companyMember.findMany({
    where: { companyId },
    orderBy: { createdAt: "asc" },
    select: {
      id: true, role: true, createdAt: true,
      user: { select: { id: true, name: true } },
    },
  });

export const addCompanyMemberService = async (
  actorId: string,
  companyId: string,
  userEmail: string,
  role: "ADMIN" | "OWNER" | "RECRUITER",
) => {
  const actor = await prisma.companyMember.findUnique({
    where: { userId_companyId: { userId: actorId, companyId } },
    select: { role: true },
  });
  if (!actor || !canManage(actor.role)) throw new Error("You are not authorized to manage members");

  const user = await prisma.user.findUnique({ where: { email: userEmail.toLowerCase().trim() }, select: { id: true, name: true, email: true } });
  if (!user) throw new Error("User not found");

  if (role === "OWNER" && actor.role !== "OWNER") throw new Error("Only an owner can assign owner role");

  return prisma.companyMember.upsert({
    where: { userId_companyId: { userId: user.id, companyId } },
    create: { userId: user.id, companyId, role },
    update: { role },
    include: { user: { select: { id: true, name: true, email: true } } },
  });
};

export const updateCompanyMemberService = async (
  actorId: string,
  companyId: string,
  memberId: string,
  role: "ADMIN" | "OWNER" | "RECRUITER",
) => {
  const actor = await prisma.companyMember.findUnique({ where: { userId_companyId: { userId: actorId, companyId } }, select: { role: true } });
  if (!actor || !canManage(actor.role)) throw new Error("You are not authorized to manage members");

  const member = await prisma.companyMember.findFirst({ where: { id: memberId, companyId } });
  if (!member) throw new Error("Member not found");
  if (role === "OWNER" && actor.role !== "OWNER") throw new Error("Only an owner can assign owner role");
  if (member.role === "OWNER" && role !== "OWNER") {
    const ownerCount = await prisma.companyMember.count({ where: { companyId, role: "OWNER" } });
    if (ownerCount <= 1) throw new Error("A company must have at least one owner");
  }

  return prisma.companyMember.update({ where: { id: memberId }, data: { role } });
};

export const removeCompanyMemberService = async (actorId: string, companyId: string, memberId: string) => {
  const actor = await prisma.companyMember.findUnique({ where: { userId_companyId: { userId: actorId, companyId } }, select: { role: true } });
  if (!actor || !canManage(actor.role)) throw new Error("You are not authorized to manage members");

  const member = await prisma.companyMember.findFirst({ where: { id: memberId, companyId } });
  if (!member) throw new Error("Member not found");
  if (member.role === "OWNER") {
    const ownerCount = await prisma.companyMember.count({ where: { companyId, role: "OWNER" } });
    if (ownerCount <= 1) throw new Error("A company must have at least one owner");
  }
  return prisma.companyMember.delete({ where: { id: memberId } });
};
