import prisma from "../lib/prisma.js";

export const meService = async (userId: string) => {
  const me = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  });

  return me;
};