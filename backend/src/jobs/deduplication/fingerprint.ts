import crypto from "node:crypto";
import type { NormalizedExternalJob } from "../../types/normalized.job.types.js";

const normalizeText = (value: string) => value.toLowerCase().trim().replace(/\s+/g, " ");

export const generateJobFingerprint = (job: NormalizedExternalJob): string => {
  const raw = [
    normalizeText(job.title),
    normalizeText(job.companyName),
    normalizeText(job.location.name),
    normalizeText(job.description).slice(0, 400),
  ].join("|");
  return crypto.createHash("sha256").update(raw).digest("hex");
};
