import { z } from "zod";

export const normalizedExternalJobSchema = z.object({
  externalId: z.string().min(1),

  source: z.string().min(1),

  title: z
    .string()
    .trim()
    .min(3, "Job title is too short"),

  description: z
    .string()
    .trim()
    .min(20, "Job description is too short"),

  companyName: z
    .string()
    .trim()
    .min(1, "Company name is required"),

  location: z.object({
    name: z.string().trim().min(1),
    city: z.string().optional(),
    state: z.string().optional(),
    country: z.string().optional(),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
  }),

  type: z.enum([
    "FULL_TIME",
    "PART_TIME",
    "CONTRACT",
    "INTERNSHIP",
    "FREELANCE",
  ]),

  mode: z
    .enum([
      "REMOTE",
      "HYBRID",
      "ON_SITE",
    ])
    .optional(),

  experienceLevel: z.enum([
    "ENTRYLEVEL",
    "JUNIOR",
    "MID_LEVEL",
    "SENIOR",
    "LEAD",
    "EXECUTIVE",
  ]),

  skills: z.array(z.string()),

  salaryMin: z.number().int().nonnegative().optional(),

  salaryMax: z.number().int().nonnegative().optional(),

  applicationUrl: z.url(),

  createdAt: z.date(),
});

export type ValidatedExternalJob = z.infer<
  typeof normalizedExternalJobSchema
>;

export const validateExternalJob = (
  job: unknown,
): ValidatedExternalJob | null => {
  const result = normalizedExternalJobSchema.safeParse(job);

  if (!result.success) {
    console.log(
      "External job validation failed:",
      result.error.flatten().fieldErrors,
    );

    return null;
  }

  return result.data;
};