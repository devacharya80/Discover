import { z } from "zod";

const locationSchema = z.object({
  address: z.string().trim().min(2).max(200),
  city: z.string().trim().min(2).max(80),
  state: z.string().trim().min(2).max(80),
  country: z.string().trim().min(2).max(80).default("INDIA"),
  latitude: z.number().min(-90).max(90).nullable().optional(),
  longitude: z.number().min(-180).max(180).nullable().optional(),
  pincode: z.string().trim().min(3).max(12),
});

export const registerSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(8, "Password must be at least 8 characters").max(128),
  confirmPassword: z.string().min(8).max(128),
  location: locationSchema.optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(6).max(128),
});

export type RegisterType = z.infer<typeof registerSchema>;
export type LoginType = z.infer<typeof loginSchema>;
export type UserLocation = z.infer<typeof locationSchema>;

export interface AuthResponse {
  user: { id: string; name: string; email: string; role: "USER" | "ADMIN"; location?: UserLocation };
  token: string;
}

export const updateProfileSchema = z.object({
  name: z.string().trim().min(2).max(80).optional(),
  location: locationSchema.partial().optional(),
}).refine((data) => data.name !== undefined || data.location !== undefined, {
  message: "At least one field must be provided",
});
export type UpdateProfileType = z.infer<typeof updateProfileSchema>;
