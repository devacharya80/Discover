import { z } from "zod";

export const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z
      .string()
      .min(6, "Password must be at least 6 characters"),

    location: z
      .object({
        address: z.string(),
        city: z.string(),
        state: z.string(),
        country: z.string().default("INDIA"),
        latitude: z.number().optional(),
        longitude: z.number().optional(),
        pincode: z.string(),
      })
      .optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });


export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
export type RegisterType = z.infer<typeof registerSchema>;
export type LoginType = z.infer<typeof loginSchema>;

const UserLocationSchema = z.object({
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  latitude: z.number().min(-90).max(90).nullable().optional(),
  longitude: z.number().min(-180).max(180).nullable().optional(),
  pincode: z.string().optional(),
});

export type UserLocation = z.infer<typeof UserLocationSchema>;

export interface AuthResponse {
  user: { id: string; name: string; email: string; location?: UserLocation };
  token: string;
}

export const updateProfileSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters").optional(),
    location: UserLocationSchema.optional(),
  })
  .refine((data) => data.name !== undefined || data.location !== undefined, {
    message: "At least one field must be provided",
  });
export type UpdateProfileType = z.infer<typeof updateProfileSchema>;
