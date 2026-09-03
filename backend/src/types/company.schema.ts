import { z } from "zod";

export const createCompanySchema = z.object({
  name: z.string().min(2, "Company name must be at least 2 characters"),

  industry: z.string().min(2, "Industry name must be at least 2 characters"),

  description: z.string().min(10, "Describe more about your company"),

  website: z.string().url("Invalid website URL").optional(),

  logoUrl: z.string().url("Invalid logo URL").optional(),

  foundedYear: z
    .number()
    .int()
    .min(1800)
    .max(new Date().getFullYear())
    .optional(),

  companySize: z
    .enum([
      "SEED_1_10",
      "SMALL_11_50",
      "MEDIUM_51_200",
      "MIDMARKET_201_500",
      "LARGE_501_1000",
      "ENTERPRISE_1000_PLUS",
    ])
    .optional(),
});

export type CreateCompanyType = z.infer<typeof createCompanySchema>;

export const updateCompanySchema = z.object({
  name: z.string().min(2, "Company name must be at least 2 characters").optional(),

  industry: z.string().min(2, "Industry name must be at least 2 characters").optional(),

  description: z.string().min(10, "Describe more about your company").optional(),

  website: z.string().url("Invalid website URL").optional(),

  logoUrl: z.string().url("Invalid logo URL").optional(),

  foundedYear: z
    .number()
    .int()
    .min(1800)
    .max(new Date().getFullYear())
    .optional(),

  companySize: z
    .enum([
      "SEED_1_10",
      "SMALL_11_50",
      "MEDIUM_51_200",
      "MIDMARKET_201_500",
      "LARGE_501_1000",
      "ENTERPRISE_1000_PLUS",
    ])
    .optional(),
});

export type UpdateCompanyType = z.infer<typeof updateCompanySchema>;