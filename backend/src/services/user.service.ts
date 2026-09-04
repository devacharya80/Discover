import prisma from "../lib/prisma.js";
import type { UserType } from "../types/user.type.js";
import type { UpdateProfileType } from "../types/auth.schema.js";

const userProfileSelect = {
  id: true,
  name: true,
  email: true,
  location: true,
  companyMembers: { select: { role: true, company: { include: { companyLocations: true } } } },
} as const;

export const getUserService = async (userId: string): Promise<UserType> => {
  const user = await prisma.user.findUnique({ where: { id: userId }, select: userProfileSelect });
  if (!user) throw new Error("User not found");
  return user;
};

export const updateUserService = async (userId: string, userData: UpdateProfileType): Promise<UserType> => {
  return await prisma.$transaction(async (tx) => {
    if (userData.name !== undefined) {
      await tx.user.update({ where: { id: userId }, data: { name: userData.name } });
    }
    if (userData.location !== undefined) {
      const existingLocation = await tx.userLocation.findUnique({ where: { userId } });
      if (existingLocation) {
        await tx.userLocation.update({ where: { userId }, data: userData.location });
      } else {
        if (userData.location.address === undefined || userData.location.city === undefined || userData.location.state === undefined || userData.location.pincode === undefined) {
          throw new Error("Address, city, state and pincode are required");
        }
        await tx.userLocation.create({ data: {
          address: userData.location.address,
          city: userData.location.city,
          state: userData.location.state,
          country: userData.location.country ?? "INDIA",
          latitude: userData.location.latitude,
          longitude: userData.location.longitude,
          pincode: userData.location.pincode,
          userId,
        } });
      }
    }
    return await tx.user.findUniqueOrThrow({ where: { id: userId }, select: userProfileSelect });
  }, { maxWait: 10000, timeout: 10000 });
};
