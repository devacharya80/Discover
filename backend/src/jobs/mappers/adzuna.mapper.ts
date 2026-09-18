import type { ExperienceLevel, WorkType } from "../../generated/prisma/client.js";

export const mapAdzunaWorkType = (contractTime?: string): WorkType => {
  switch (contractTime?.toLowerCase()) {
    case "full_time":
      return "FULL_TIME";
    case "part_time":
      return "PART_TIME";
    case "contract":
      return "CONTRACT";
    default:
      return "FULL_TIME";
  }
};

export const mapAdzunaWorkMode = (
  description?: string,
): "REMOTE" | "HYBRID" | "ON_SITE" | undefined => {
  if (!description) return undefined;

  const text = description.toLowerCase();

  if (text.includes("remote") || text.includes("work from home")) {
    return "REMOTE";
  }

  if (text.includes("hybrid")) {
    return "HYBRID";
  }

  return undefined;
};

export const mapAdzunaExperienceLevel = (
  title: string,
): ExperienceLevel => {
  const normalizedTitle = title.toLowerCase();

  if (
    normalizedTitle.includes("chief") ||
    normalizedTitle.includes("cto") ||
    normalizedTitle.includes("ceo")
  ) return "EXECUTIVE";

  if (
    normalizedTitle.includes("principal") ||
    normalizedTitle.includes("staff") ||
    normalizedTitle.includes("lead") ||
    normalizedTitle.includes("manager")
  ) return "LEAD";

  if (
    normalizedTitle.includes("senior") ||
    normalizedTitle.includes("sr.")
  ) return "SENIOR";

  if (
    normalizedTitle.includes("junior") ||
    normalizedTitle.includes("jr.")
  ) return "JUNIOR";

  return "ENTRYLEVEL";
};