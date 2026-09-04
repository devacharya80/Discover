import { z } from "zod";

export const createCompanySchema = z.object({
  name: z.string().min(2, "Company name must be at least 2 characters"),
  industry: z.string().min(2, "Industry name must be at least 2 characters"),
  description: z.string().min(10, "Describe more about your company"),
  website: z.string().url("Invalid website URL").optional(),
  logoUrl: z.string().url("Invalid logo URL").optional(),
  foundedYear: z.number().int().min(1800).max(new Date().getFullYear()).optional(),
  companySize: z.enum(["SEED_1_10", "SMALL_11_50", "MEDIUM_51_200", "MIDMARKET_201_500", "LARGE_501_1000", "ENTERPRISE_1000_PLUS"]).optional(),
});
export type CreateCompanyType = z.infer<typeof createCompanySchema>;

export const updateCompanySchema = z.object({
  name: z.string().min(2, "Company name must be at least 2 characters").optional(),
  industry: z.string().min(2, "Industry name must be at least 2 characters").optional(),
  description: z.string().min(10, "Describe more about your company").optional(),
  website: z.string().url("Invalid website URL").optional(),
  logoUrl: z.string().url("Invalid logo URL").optional(),
  foundedYear: z.number().int().min(1800).max(new Date().getFullYear()).optional(),
  companySize: z.enum(["SEED_1_10", "SMALL_11_50", "MEDIUM_51_200", "MIDMARKET_201_500", "LARGE_501_1000", "ENTERPRISE_1000_PLUS"]).optional(),
}).refine((data) => Object.keys(data).length > 0, { message: "At least one field must be provided" });
export type UpdateCompanyType = z.infer<typeof updateCompanySchema>;

export const createCompanyLocationSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  address: z.string().min(10, "Address must be at least 10 characters"),
  city: z.string().min(2, "City must be at least 2 characters"),
  state: z.string().min(2, "State must be at least 2 characters"),
  country: z.string().min(2, "Country must be at least 2 characters").default("INDIA"),
  latitude: z.number().min(-90).max(90).nullable().optional(),
  longitude: z.number().min(-180).max(180).nullable().optional(),
  pincode: z.string().regex(/^[1-9][0-9]{5}$/, "Enter a valid 6-digit postal pincode"),
  isPrimary: z.boolean().default(false),
});
export type CreateCompanyLocationType = z.infer<typeof createCompanyLocationSchema>;

export const updateCompanyLocationSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
  address: z.string().min(10, "Address must be at least 10 characters").optional(),
  city: z.string().min(2, "City must be at least 2 characters").optional(),
  state: z.string().min(2, "State must be at least 2 characters").optional(),
  country: z.string().min(2, "Country must be at least 2 characters").optional(),
  latitude: z.number().min(-90).max(90).nullable().optional(),
  longitude: z.number().min(-180).max(180).nullable().optional(),
  pincode: z.string().regex(/^[1-9][0-9]{5}$/, "Enter a valid 6-digit postal pincode").optional(),
  isPrimary: z.boolean().optional(),
});
export type UpdateCompanyLocationType = z.infer<typeof updateCompanyLocationSchema>;
