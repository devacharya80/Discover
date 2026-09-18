import { z } from "zod";

export const normalizedExternalJobSchema = z.object({
  externalId: z.string().trim().min(1),
  source: z.string().trim().min(1),
  title: z.string().trim().min(3, "Job title is too short"),
  description: z.string().trim().min(20, "Job description is too short"),
  companyName: z.string().trim().min(1, "Company name is required"),
  location: z.object({
    name: z.string().trim().min(1),
    city: z.string().trim().optional(),
    state: z.string().trim().optional(),
    country: z.string().trim().optional(),
    latitude: z.number().finite().optional(),
    longitude: z.number().finite().optional(),
  }),
  type: z.enum(["FULL_TIME","PART_TIME","CONTRACT","INTERNSHIP","FREELANCE"]),
  mode: z.enum(["REMOTE","HYBRID","ON_SITE"]).optional(),
  experienceLevel: z.enum(["ENTRYLEVEL","JUNIOR","MID_LEVEL","SENIOR","LEAD","EXECUTIVE"]),
  skills: z.array(z.string().trim().min(1)).max(20),
  salaryMin: z.number().int().nonnegative().optional(),
  salaryMax: z.number().int().nonnegative().optional(),
  applicationUrl: z.url(),
  createdAt: z.date(),
}).refine(
  (data) => data.salaryMin === undefined || data.salaryMax === undefined || data.salaryMin <= data.salaryMax,
  { message: "Minimum salary cannot be greater than maximum salary", path: ["salaryMax"] },
);

export type ValidatedExternalJob = z.infer<typeof normalizedExternalJobSchema>;

export const validateExternalJob = (job: unknown): ValidatedExternalJob | null => {
  const result = normalizedExternalJobSchema.safeParse(job);
  if (!result.success) {
    console.warn("External job validation failed:", result.error.flatten().fieldErrors);
    return null;
  }
  return result.data;
};
