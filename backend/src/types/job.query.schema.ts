import { z } from "zod";

export const jobQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),

  limit: z.coerce.number().int().min(1).max(50).default(10),

  type: z
    .enum(["FULL_TIME", "PART_TIME", "CONTRACT", "INTERNSHIP", "FREELANCE"])
    .optional(),

  mode: z.enum(["REMOTE", "HYBRID", "ON_SITE"]).optional(),

  experienceLevel: z
    .enum(["ENTRYLEVEL", "JUNIOR", "MID_LEVEL", "SENIOR", "LEAD", "EXECUTIVE"])
    .optional(),

  sortBy: z
    .enum(["createdAt", "salaryMin", "salaryMax", "title"])
    .default("createdAt"),

  sortOrder: z.enum(["asc", "desc"]).default("desc"),

  search : z.string().min(2,"Can't search").optional()
});

export type JobQueryData = z.infer<typeof jobQuerySchema>;

export const search =  z
  .string()
  .trim()
  .min(1)
  .max(100)
  .optional()