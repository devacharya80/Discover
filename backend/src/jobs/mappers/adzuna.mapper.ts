import type { ExperienceLevel, WorkMode, WorkType } from "../../generated/prisma/client.js";

const normalize = (value?: string) => value?.toLowerCase().replace(/[_-]/g, " ").trim() ?? "";

export const mapAdzunaWorkType = (
  contractTime?: string,
  contractType?: string,
  title?: string,
): WorkType => {
  const time = normalize(contractTime);
  const contract = normalize(contractType);
  const jobTitle = normalize(title);

  if (jobTitle.includes("intern") || contract.includes("intern")) return "INTERNSHIP";
  if (jobTitle.includes("freelance") || contract.includes("freelance")) return "FREELANCE";
  if (time === "part time") return "PART_TIME";
  if (time === "contract" || contract === "contract") return "CONTRACT";
  return "FULL_TIME";
};

export const mapAdzunaWorkMode = (description?: string): WorkMode | undefined => {
  if (!description) return undefined;
  const text = description.toLowerCase();
  if (/\bremote\b|work[ -]?from[ -]?home|\bwfh\b/i.test(text)) return "REMOTE";
  if (/\bhybrid\b/i.test(text)) return "HYBRID";
  if (/\bon[ -]?site\b/i.test(text)) return "ON_SITE";
  return undefined;
};

export const mapAdzunaExperienceLevel = (title: string): ExperienceLevel => {
  const normalizedTitle = title.toLowerCase();
  if (/\b(chief|cto|ceo|cfo|coo)\b/.test(normalizedTitle)) return "EXECUTIVE";
  if (/\b(principal|staff|lead)\b/.test(normalizedTitle)) return "LEAD";
  if (/\b(senior|sr\.? )\b/.test(normalizedTitle + " ")) return "SENIOR";
  if (/\b(junior|jr\.? )\b/.test(normalizedTitle + " ")) return "JUNIOR";
  return "ENTRYLEVEL";
};

const KNOWN_SKILLS = [
  "javascript","typescript","python","java","c++","c#","go","rust","php",
  "react","next.js","angular","vue","node.js","express","nestjs","fastapi",
  "django","spring boot","mongodb","postgresql","mysql","redis","docker",
  "kubernetes","aws","azure","gcp","graphql","rest api","git","linux",
  "machine learning","tensorflow","pytorch","sql"
];

export const extractAdzunaSkills = (title: string, description: string): string[] => {
  const text = (title + " " + description).toLowerCase();
  return KNOWN_SKILLS.filter((skill) => text.includes(skill.toLowerCase())).slice(0, 20);
};

export const parseAdzunaLocation = (displayName: string, area: string[]) => {
  const parts = displayName.split(",").map((part) => part.trim()).filter(Boolean);
  return {
    name: displayName,
    city: parts[0] || area.at(-1),
    state: parts.length > 1 ? parts[1] : area.at(-2),
    country: "INDIA",
  };
};
