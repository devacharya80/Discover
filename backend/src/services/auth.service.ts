import prisma from "../lib/prisma.js";
import bcrypt from "bcrypt";
import { createToken } from "../lib/jwt.js";
import type {
  RegisterType,
  AuthResponse,
  LoginType,
} from "../types/auth.schema.js";

export const registerService = async (
  registerData: RegisterType,
): Promise<AuthResponse> => {
  const existingUser = await prisma.user.findUnique({
    where: { email: registerData.email },
  });

  if (existingUser) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(registerData.password, 10);

  const newUser = await prisma.user.create({
    data: {
      name: registerData.name,
      email: registerData.email,
      password: hashedPassword,
      ...(registerData.location && {
        location: {
          create: {
            address: registerData.location.address,
            city: registerData.location.city,
            state: registerData.location.state,
            country: registerData.location.country,
            latitude: registerData.location.latitude ?? null,
            longitude: registerData.location.longitude ?? null,
            pincode: registerData.location.pincode,
          },
        },
      }),
    },
    include: { location: true },
  });

  const token = createToken(newUser.id, newUser.role);

  return {
    user: {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      ...(newUser.location && {
        location: {
          address: newUser.location.address,
          city: newUser.location.city,
          state: newUser.location.state,
          country: newUser.location.country,
          latitude: newUser.location.latitude,
          longitude: newUser.location.longitude,
          pincode: newUser.location.pincode,
        },
      }),
    },
    token,
  };
};

export const loginService = async (
  userData: LoginType,
): Promise<AuthResponse> => {
  const existingUser = await prisma.user.findUnique({
    where: { email: userData.email },
  });

  if (!existingUser || !existingUser.password) {
    throw new Error("User Not Found");
  }

  const isPasswordValid = await bcrypt.compare(
    userData.password,
    existingUser.password,
  );

  if (!isPasswordValid) {
    throw new Error("Invalid credentials");
  }

  const token = createToken(existingUser.id, existingUser.role);

  return {
    user: {
      id: existingUser.id,
      name: existingUser.name,
      email: existingUser.email,
    },
    token,
  };
};