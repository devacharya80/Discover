import prisma from "../../lib/prisma.js";

import type { NormalizedExternalJob } from "../../types/normalized.job.types.js";

import { generateJobFingerprint } from "./fingerprint.js";

export const checkDuplicateExternalJob = async (
  job: NormalizedExternalJob,
) => {
  // 1. Exact provider + external ID check
  const existingExternalJob = await prisma.externalJob.findUnique({
    where: {
      provider_externalId: {
        provider: job.source,
        externalId: job.externalId,
      },
    },
    select: {
      id: true,
      jobId: true,
    },
  });

  if (existingExternalJob) {
    return {
      isDuplicate: true,
      reason: "EXACT_MATCH",
      jobId: existingExternalJob.jobId,
    };
  }

  // 2. Cross-provider fingerprint check
  const fingerprint = generateJobFingerprint(job);

  const existingFingerprint = await prisma.externalJob.findFirst({
    where: {
      fingerprint,
    },
    select: {
      id: true,
      jobId: true,
    },
  });

  if (existingFingerprint) {
    return {
      isDuplicate: true,
      reason: "FINGERPRINT_MATCH",
      jobId: existingFingerprint.jobId,
    };
  }

  return {
    isDuplicate: false,
    fingerprint,
  };
};