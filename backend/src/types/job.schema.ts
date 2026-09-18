import { z } from "zod";

const salaryFields = {
  salaryMin: z.number().int().nonnegative().optional(),
  salaryMax: z.number().int().nonnegative().optional(),
};

const base = z.object({
  locationId: z.union([z.string().uuid(), z.null()]).optional(),
  title: z.string().trim().min(2).max(160),
  description: z.string().trim().min(10).max(20000),
  type: z.enum(["FULL_TIME","PART_TIME","CONTRACT","INTERNSHIP","FREELANCE"]).default("FULL_TIME"),
  mode: z.enum(["REMOTE","HYBRID","ON_SITE"]).default("REMOTE"),
  experienceLevel: z.enum(["ENTRYLEVEL","JUNIOR","MID_LEVEL","SENIOR","LEAD","EXECUTIVE"]).default("ENTRYLEVEL"),
  skills: z.array(z.string().trim().min(1).max(60)).min(1).max(20),
  ...salaryFields,
  externalLink: z.url().optional(),
  expiresAt: z.coerce.date().refine((date) => date.getTime() > Date.now(), "Expiry must be in the future").optional(),
});

export const createJobSchema = base.refine(
  (data) => data.salaryMin === undefined || data.salaryMax === undefined || data.salaryMin <= data.salaryMax,
  { message: "Minimum salary cannot be greater than maximum salary", path: ["salaryMax"] },
);

export const updateJobSchema = base.partial().extend({
  status: z.enum(["DRAFT","ACTIVE","PAUSED","CLOSED","ARCHIVED"]).optional(),
}).refine(
  (data) => data.salaryMin === undefined || data.salaryMax === undefined || data.salaryMin <= data.salaryMax,
  { message: "Minimum salary cannot be greater than maximum salary", path: ["salaryMax"] },
);

export type CreateJobData = z.infer<typeof createJobSchema>;
export type UpdateJobData = z.infer<typeof updateJobSchema>;
