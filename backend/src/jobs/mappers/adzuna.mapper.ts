import type { ExperienceLevel } from "../../generated/prisma/client.js";

export const mapAdzunaExperienceLevel = (
  title: string,
): ExperienceLevel => {
  const normalizedTitle = title.toLowerCase();

  if (
    normalizedTitle.includes("chief") ||
    normalizedTitle.includes("cto") ||
    normalizedTitle.includes("ceo")
  ) {
    return "EXECUTIVE";
  }

  if (
    normalizedTitle.includes("principal") ||
    normalizedTitle.includes("staff")
  ) {
    return "LEAD";
  }

  if (
    normalizedTitle.includes("lead") ||
    normalizedTitle.includes("manager")
  ) {
    return "LEAD";
  }

  if (
    normalizedTitle.includes("senior") ||
    normalizedTitle.includes("sr.")
  ) {
    return "SENIOR";
  }

  if (
    normalizedTitle.includes("junior") ||
    normalizedTitle.includes("jr.")
  ) {
    return "JUNIOR";
  }

  return "ENTRYLEVEL";
};