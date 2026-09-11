import { z } from "zod";

export const createJobSchema = z
  .object({
    locationId: z.string().uuid().optional(),

    title: z.string().min(2, "Job title should have at least 2 characters"),

    description: z
      .string()
      .min(10, "Job description should have at least 10 characters"),

    type: z
      .enum(["FULL_TIME", "PART_TIME", "CONTRACT", "INTERNSHIP", "FREELANCE"])
      .default("FULL_TIME"),

    mode: z.enum(["REMOTE", "HYBRID", "ON_SITE"]).default("REMOTE"),

    experienceLevel: z
      .enum([
        "ENTRYLEVEL",
        "JUNIOR",
        "MID_LEVEL",
        "SENIOR",
        "LEAD",
        "EXECUTIVE",
      ])
      .default("ENTRYLEVEL"),

    skills: z
      .array(z.string().trim().min(1, "Skill cannot be empty"))
      .min(1, "At least one skill is required")
      .max(20, "Maximum 20 skills allowed"),

    salaryMin: z.number().int().nonnegative().optional(),

    salaryMax: z.number().int().nonnegative().optional(),

    externalLink: z.url().optional(),

    expiresAt: z.coerce.date().optional(),
  })
  .refine(
    (data) =>
      data.salaryMin === undefined ||
      data.salaryMax === undefined ||
      data.salaryMin <= data.salaryMax,
    {
      message: "Minimum salary cannot be greater than maximum salary",
      path: ["salaryMax"],
    },
  );

export const updateJobSchema = z
  .object({
    locationId: z.string().uuid().optional(),

    title: z
      .string()
      .min(2, "Job title should have at least 2 characters")
      .optional(),

    description: z
      .string()
      .min(10, "Job description should have at least 10 characters")
      .optional(),

    type: z
      .enum(["FULL_TIME", "PART_TIME", "CONTRACT", "INTERNSHIP", "FREELANCE"])
      .optional(),

    mode: z.enum(["REMOTE", "HYBRID", "ON_SITE"]).optional(),

    experienceLevel: z
      .enum([
        "ENTRYLEVEL",
        "JUNIOR",
        "MID_LEVEL",
        "SENIOR",
        "LEAD",
        "EXECUTIVE",
      ])
      .optional(),

    skills: z
      .array(z.string().trim().min(1, "Skill cannot be empty"))
      .min(1, "At least one skill is required")
      .max(20, "Maximum 20 skills allowed")
      .optional(),

    salaryMin: z.number().int().nonnegative().optional(),

    salaryMax: z.number().int().nonnegative().optional(),

    externalLink: z.url().optional(),

    expiresAt: z.coerce.date().optional(),
  })
  .refine(
    (data) =>
      data.salaryMin === undefined ||
      data.salaryMax === undefined ||
      data.salaryMin <= data.salaryMax,
    {
      message: "Minimum salary cannot be greater than maximum salary",
      path: ["salaryMax"],
    },
  );

export type CreateJobData = z.infer<typeof createJobSchema>;
export type UpdateJobData = z.infer<typeof updateJobSchema>;
