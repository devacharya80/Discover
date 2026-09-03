import prisma from "../lib/prisma.js";
import type { CreateCompanyType,updateCompanyType } from "../types/company.schema.js";
import { generateSlug } from "../helper.js";

export const createCompanyService = async (
  userId: string,
  companyData: CreateCompanyType,
) => {
  const slugName: string = generateSlug(companyData.name);
  const result = await prisma.$transaction(
    async (tx) => {
      const company = await tx.company.create({
        data: {
          ...companyData,
          slug: slugName,
          createdSource : "COMPANY_CREATED"
        },
      });
      await tx.companyMember.create({
        data: {
          userId: userId,
          companyId: company.id,
          role: "OWNER",
        },
      });
      return company;
    },
    {
      maxWait: 10000,
      timeout: 10000,
    },
  );
  return result;
};

export const getCompanyService = async (companyId:any) => {
  const companyData = await prisma.company.findUniqueOrThrow({
    where : {
      id : companyId
    },
    omit : {
      createdAt : true,
      updatedAt : true
    }
  })
  return companyData;
}

export const updateCompanyService = async (
  userId: string,
  companyId: string,
  companyData: updateCompanyType
) => {
  const company = await prisma.$transaction(async (tx) => {

    const membership = await tx.companyMember.findFirst({
      where: {
        userId: userId,
        companyId: companyId,
      },
    });

    if (!membership) {
      throw new Error("You are not a member of this company");
    }

    if (membership.role !== "OWNER") {
      throw new Error("You need authorization");
    }

    const updatedCompany = await tx.company.update({
      where: {
        id: companyId,
      },
      data: {
        ...companyData,
      },
    });

    return updatedCompany;
  },
{
  maxWait : 10000,
  timeout : 10000
});

  return company;
};