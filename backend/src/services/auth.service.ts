import prisma from "../lib/prisma.js";
import bcrypt from "bcrypt";
import { createToken } from "../lib/jwt.js";
import type { RegisterType, AuthResponse, LoginType } from "../types/auth.schema.js";

const publicUser = (user: {
  id: string; name: string; email: string; role: "USER" | "ADMIN";
  location?: { address: string; city: string; state: string; country: string; latitude: number | null; longitude: number | null; pincode: string } | null;
}) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
  ...(user.location ? { location: user.location } : {}),
});

export const registerService = async (data: RegisterType): Promise<AuthResponse> => {
  const email = data.email.trim().toLowerCase();
  const existing = await prisma.user.findUnique({ where: { email }, select: { id: true } });
  if (existing) throw new Error("User already exists");

  const hashedPassword = await bcrypt.hash(data.password, 12);
  const user = await prisma.user.create({
    data: {
      name: data.name.trim(),
      email,
      password: hashedPassword,
      ...(data.location ? { location: { create: data.location } } : {}),
    },
    include: { location: true },
  });

  return { user: publicUser(user), token: createToken(user.id, user.role) };
};

export const loginService = async (data: LoginType): Promise<AuthResponse> => {
  const user = await prisma.user.findUnique({ where: { email: data.email.trim().toLowerCase() }, include: { location: true } });
  if (!user?.password) throw new Error("Invalid credentials");
  if (!(await bcrypt.compare(data.password, user.password))) throw new Error("Invalid credentials");
  return { user: publicUser(user), token: createToken(user.id, user.role) };
};
