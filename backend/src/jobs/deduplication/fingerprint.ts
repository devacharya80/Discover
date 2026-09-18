import crypto from "node:crypto";
import type { NormalizedExternalJob } from "../../types/normalized.job.types.js";

const normalizeText = (value: string) => {
  return value
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ");
};

export const generateJobFingerprint = (
  job: NormalizedExternalJob,
): string => {
  const raw = [
    normalizeText(job.title),
    normalizeText(job.companyName),
    normalizeText(job.location.name),
  ].join("|");

  return crypto
    .createHash("sha256")
    .update(raw)
    .digest("hex");
};