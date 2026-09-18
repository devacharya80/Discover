import prisma from "../lib/prisma.js";
import type { CreateCompanyType, UpdateCompanyType, CreateCompanyLocationType, UpdateCompanyLocationType } from "../types/company.schema.js";
import { generateSlug } from "../helper.js";

const uniqueSlug = async (name: string) => {
  const base = generateSlug(name) || "company";
  let slug = base;
  let suffix = 2;
  while (await prisma.company.findUnique({ where: { slug }, select: { id: true } })) slug = `${base}-${suffix++}`;
  return slug;
};

export const createCompanyService = async (userId: string, companyData: CreateCompanyType) =>
  prisma.$transaction(async (tx) => {
    const slug = await uniqueSlug(companyData.name);
    const company = await tx.company.create({
      data: {
        name: companyData.name.trim(),
        industry: companyData.industry.trim(),
        description: companyData.description.trim(),
        website: companyData.website ?? null,
        logoUrl: companyData.logoUrl ?? null,
        foundedYear: companyData.foundedYear ?? null,
        ...(companyData.companySize !== undefined ? { companySize: companyData.companySize } : {}),
        slug,
        createdSource: "COMPANY_CREATED",
      },
    });
    await tx.companyMember.create({ data: { userId, companyId: company.id, role: "OWNER" } });
    return company;
  });

export const getCompanyService = async (companyId: string) =>
  prisma.company.findUniqueOrThrow({
    where: { id: companyId },
    include: {
      companyLocations: { orderBy: [{ isPrimary: "desc" }, { createdAt: "asc" }] },
      _count: { select: { jobs: true, companyMembers: true } },
    },
  });

export interface CompanyListQuery {
  search?: string;
  city?: string;
  industry?: string;
}

export const getAllCompaniesService = async (query: CompanyListQuery = {}) =>
  prisma.company.findMany({
    where: {
      status: "ACTIVE",
      ...(query.industry ? { industry: { contains: query.industry, mode: "insensitive" as const } } : {}),
      ...(query.search ? {
        OR: [
          { name: { contains: query.search, mode: "insensitive" as const } },
          { description: { contains: query.search, mode: "insensitive" as const } },
        ],
      } : {}),
      ...(query.city ? {
        companyLocations: { some: { city: { contains: query.city, mode: "insensitive" as const } } },
      } : {}),
    },
    include: {
      companyLocations: { orderBy: [{ isPrimary: "desc" }, { createdAt: "asc" }] },
      _count: { select: { jobs: true, companyMembers: true } },
    },
    orderBy: { name: "asc" },
    take: 500,
  });

export const updateCompanyService = async (userId: string, companyId: string, companyData: UpdateCompanyType) =>
  prisma.$transaction(async (tx) => {
    const membership = await tx.companyMember.findUnique({ where: { userId_companyId: { userId, companyId } }, select: { role: true } });
    if (!membership) throw new Error("You are not a member of this company");
    if (!["OWNER","ADMIN"].includes(membership.role)) throw new Error("You need authorization");
    return tx.company.update({
      where: { id: companyId },
      data: {
        ...(companyData.name !== undefined && { name: companyData.name.trim() }),
        ...(companyData.industry !== undefined && { industry: companyData.industry.trim() }),
        ...(companyData.description !== undefined && { description: companyData.description.trim() }),
        ...(companyData.website !== undefined && { website: companyData.website }),
        ...(companyData.logoUrl !== undefined && { logoUrl: companyData.logoUrl }),
        ...(companyData.foundedYear !== undefined && { foundedYear: companyData.foundedYear }),
        ...(companyData.companySize !== undefined && { companySize: companyData.companySize }),
      },
    });
  });

export const createCompanyLocationService = async (userId: string, companyId: string, data: CreateCompanyLocationType) =>
  prisma.$transaction(async (tx) => {
    const membership = await tx.companyMember.findUnique({ where: { userId_companyId: { userId, companyId } }, select: { role: true } });
    if (!membership || !["OWNER","ADMIN"].includes(membership.role)) throw new Error("Unauthorized: Insufficient permissions for this company");

    const count = await tx.companyLocation.count({ where: { companyId } });
    const primary = count === 0 || data.isPrimary === true;
    if (primary && count > 0) await tx.companyLocation.updateMany({ where: { companyId, isPrimary: true }, data: { isPrimary: false } });

    return tx.companyLocation.create({
      data: {
        ...data,
        companyId,
        country: data.country.trim(),
        latitude: data.latitude ?? null,
        longitude: data.longitude ?? null,
        isPrimary: primary,
      },
    });
  });

export const getCompanyLocationService = async (companyId: string) =>
  prisma.companyLocation.findMany({ where: { companyId }, orderBy: [{ isPrimary: "desc" }, { createdAt: "asc" }] });

export const updateCompanyLocationservice = async (userId: string, companyId: string, locationId: string, data: UpdateCompanyLocationType) =>
  prisma.$transaction(async (tx) => {
    const membership = await tx.companyMember.findUnique({ where: { userId_companyId: { userId, companyId } }, select: { role: true } });
    if (!membership || !["OWNER","ADMIN"].includes(membership.role)) throw new Error("Unauthorized: Insufficient permissions for this company");
    const existing = await tx.companyLocation.findFirst({ where: { id: locationId, companyId } });
    if (!existing) throw new Error("Location not found for this company");

    if (data.isPrimary === true) {
      await tx.companyLocation.updateMany({ where: { companyId, id: { not: locationId }, isPrimary: true }, data: { isPrimary: false } });
    }
    return tx.companyLocation.update({
      where: { id: locationId },
      data: {
        ...(data.name !== undefined && { name: data.name }),
        ...(data.address !== undefined && { address: data.address }),
        ...(data.city !== undefined && { city: data.city }),
        ...(data.state !== undefined && { state: data.state }),
        ...(data.country !== undefined && { country: data.country }),
        ...(data.latitude !== undefined && { latitude: data.latitude }),
        ...(data.longitude !== undefined && { longitude: data.longitude }),
        ...(data.pincode !== undefined && { pincode: data.pincode }),
        ...(data.isPrimary !== undefined && { isPrimary: data.isPrimary }),
      },
    });
  });

export const deleteCompanyLocationService = async (userId: string, companyId: string, locationId: string) =>
  prisma.$transaction(async (tx) => {
    const membership = await tx.companyMember.findUnique({ where: { userId_companyId: { userId, companyId } }, select: { role: true } });
    if (!membership || !["OWNER","ADMIN"].includes(membership.role)) throw new Error("Unauthorized: Insufficient permissions for this company");

    const existing = await tx.companyLocation.findFirst({ where: { id: locationId, companyId } });
    if (!existing) throw new Error("Location not found for this company");

    const deleted = await tx.companyLocation.delete({ where: { id: locationId } });
    if (deleted.isPrimary) {
      const next = await tx.companyLocation.findFirst({ where: { companyId }, orderBy: { createdAt: "asc" } });
      if (next) await tx.companyLocation.update({ where: { id: next.id }, data: { isPrimary: true } });
    }
    return deleted;
  });
