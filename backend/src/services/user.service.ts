import prisma from "../lib/prisma.js";
import type { UserType } from "../types/user.type.js";
import type { UpdateProfileType } from "../types/auth.schema.js";

const userProfileSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  location: true,
  companyMembers: {
    select: {
      role: true,
      company: { include: { companyLocations: true } },
    },
  },
} as const;

export const getUserService = async (userId: string): Promise<UserType> => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: userProfileSelect,
  });

  if (!user) throw new Error("User not found");

  return user;
};

export const updateUserService = async (
  userId: string,
  userData: UpdateProfileType,
): Promise<UserType> => {
  return await prisma.$transaction(
    async (tx) => {
      if (userData.name !== undefined) {
        await tx.user.update({
          where: { id: userId },
          data: { name: userData.name },
        });
      }

      if (userData.location !== undefined) {
        const location = userData.location;
        const existingLocation = await tx.userLocation.findUnique({
          where: { userId },
        });

        if (existingLocation) {
          await tx.userLocation.update({
            where: { userId },
            data: {
              ...(location.address !== undefined && {
                address: location.address,
              }),
              ...(location.city !== undefined && { city: location.city }),
              ...(location.state !== undefined && { state: location.state }),
              ...(location.country !== undefined && {
                country: location.country,
              }),
              ...(location.latitude !== undefined && {
                latitude: location.latitude,
              }),
              ...(location.longitude !== undefined && {
                longitude: location.longitude,
              }),
              ...(location.pincode !== undefined && {
                pincode: location.pincode,
              }),
            },
          });
        } else {
          if (
            location.address === undefined ||
            location.city === undefined ||
            location.state === undefined ||
            location.pincode === undefined
          ) {
            throw new Error(
              "Address, city, state and pincode are required",
            );
          }

          await tx.userLocation.create({
            data: {
              address: location.address,
              city: location.city,
              state: location.state,
              country: location.country ?? "INDIA",
              latitude: location.latitude ?? null,
              longitude: location.longitude ?? null,
              pincode: location.pincode,
              userId,
            },
          });
        }
      }

      return await tx.user.findUniqueOrThrow({
        where: { id: userId },
        select: userProfileSelect,
      });
    },
    { maxWait: 10000, timeout: 10000 },
  );
};
