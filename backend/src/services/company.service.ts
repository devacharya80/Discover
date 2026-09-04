import prisma from "../lib/prisma.js";
import type { CreateCompanyType, updateCompanyType, CreateCompanyLocationType, UpdateCompanyLocationType } from "../types/company.schema.js";
import { generateSlug } from "../helper.js";

export const createCompanyService = async (userId: string, companyData: CreateCompanyType) => {
  const slugName = generateSlug(companyData.name);
  return await prisma.$transaction(async (tx) => {
    const company = await tx.company.create({ data: { ...companyData, slug: slugName, createdSource: "COMPANY_CREATED" } });
    await tx.companyMember.create({ data: { userId, companyId: company.id, role: "OWNER" } });
    return company;
  }, { maxWait: 10000, timeout: 10000 });
};

export const getCompanyService = async (companyId: string) => {
  return await prisma.company.findUniqueOrThrow({
    where: { id: companyId },
    omit: { createdAt: true, updatedAt: true },
    include: { companyLocations: true },
  });
};

export const updateCompanyService = async (userId: string, companyId: string, companyData: updateCompanyType) => {
  return await prisma.$transaction(async (tx) => {
    const membership = await tx.companyMember.findUnique({ where: { userId_companyId: { userId, companyId } } });
    if (!membership) throw new Error("You are not a member of this company");
    if (!["OWNER", "ADMIN"].includes(membership.role)) throw new Error("You need authorization");
    return await tx.company.update({ where: { id: companyId }, data: companyData });
  }, { maxWait: 10000, timeout: 10000 });
};

export const createCompanyLocationService = async (userId: string, companyId: string, locationData: CreateCompanyLocationType) => {
  return await prisma.$transaction(async (tx) => {
    const membership = await tx.companyMember.findUnique({ where: { userId_companyId: { userId, companyId } } });
    if (!membership || !["OWNER", "ADMIN"].includes(membership.role)) throw new Error("Unauthorized: Insufficient permissions for this company");
    const existingLocationCount = await tx.companyLocation.count({ where: { companyId } });
    const shouldBePrimary = existingLocationCount === 0 ? true : locationData.isPrimary;
    if (shouldBePrimary && existingLocationCount > 0) {
      await tx.companyLocation.updateMany({ where: { companyId, isPrimary: true }, data: { isPrimary: false } });
    }
    return await tx.companyLocation.create({ data: { ...locationData, companyId, isPrimary: shouldBePrimary } });
  }, { maxWait: 10000, timeout: 10000 });
};

export const getCompanyLocationService = async (companyId: string) => {
  return await prisma.companyLocation.findMany({
    where: { companyId },
    orderBy: [{ isPrimary: "desc" }, { createdAt: "asc" }],
  });
};

export const updateCompanyLocationservice = async (userId: string, companyId: string, locationId: string, locationData: UpdateCompanyLocationType) => {
  return await prisma.$transaction(async (tx) => {
    const membership = await tx.companyMember.findUnique({ where: { userId_companyId: { userId, companyId } } });
    if (!membership || !["OWNER", "ADMIN"].includes(membership.role)) throw new Error("Unauthorized: Insufficient permissions for this company");
    const existingLocation = await tx.companyLocation.findFirst({ where: { id: locationId, companyId } });
    if (!existingLocation) throw new Error("Location not found for this company");
    if (locationData.isPrimary === true) {
      await tx.companyLocation.updateMany({ where: { companyId, id: { not: locationId }, isPrimary: true }, data: { isPrimary: false } });
    }
    return await tx.companyLocation.update({ where: { id: locationId }, data: locationData });
  }, { maxWait: 10000, timeout: 10000 });
};

export const deleteCompanyLocationService = async (userId: string, companyId: string, locationId: string) => {
  return await prisma.$transaction(async (tx) => {
    const membership = await tx.companyMember.findUnique({ where: { userId_companyId: { userId, companyId } } });
    if (!membership || !["OWNER", "ADMIN"].includes(membership.role)) throw new Error("Unauthorized: Insufficient permissions for this company");
    const existingLocation = await tx.companyLocation.findFirst({ where: { id: locationId, companyId } });
    if (!existingLocation) throw new Error("Location not found for this company");
    const deletedLocation = await tx.companyLocation.delete({ where: { id: locationId } });
    if (deletedLocation.isPrimary) {
      const nextLocation = await tx.companyLocation.findFirst({ where: { companyId }, orderBy: { createdAt: "asc" } });
      if (nextLocation) await tx.companyLocation.update({ where: { id: nextLocation.id }, data: { isPrimary: true } });
    }
    return deletedLocation;
  }, { maxWait: 10000, timeout: 10000 });
};
