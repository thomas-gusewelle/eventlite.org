import { createRouter } from "./context";
import { z } from "zod";

import { UserStatus } from "@prisma/client";
import { TRPCError } from "@trpc/server";

export const userRouter = createRouter()
  .query("getUser", {
    async resolve({ ctx }) {
      const userInfo = await prisma?.user.findFirst({
        where: {
          id: ctx.session?.user.id,
        },
        include: {
          UserSettings: true,
        },
      });

      return userInfo;
    },
  })
  .query("getUserByID", {
    input: z.string(),
    async resolve({ input }) {
      return await prisma?.user.findFirst({
        where: {
          id: input,
        },
        include: { roles: true },
      });
    },
  })
  .query("getUsersByOrganization", {
    async resolve({ ctx }) {
      const orgID = await prisma?.user.findFirst({
        where: { id: ctx.session?.user.id },
        select: { organizationId: true },
      });

      return await prisma?.user.findMany({
        orderBy: [{ lastName: "asc" }, { firstName: "asc" }],
        where: {
          organizationId: orgID?.organizationId,
        },
        include: {
          roles: true,
        },
      });
    },
  })
  .middleware(async ({ ctx, next }) => {
    const user = await prisma?.user.findFirst({
      where: { id: ctx.session?.user.id },
      select: {
        status: true,
      },
    });
    if (user?.status != "ADMIN") {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }
    return next();
  })
  .query("getAmdminCount", {
    async resolve({ ctx }) {
      const orgID = await prisma?.user.findFirst({
        where: { id: ctx.session?.user.id },
        select: { organizationId: true },
      });
      return await prisma?.user.count({
        where: { status: "ADMIN" },
      });
    },
  })

  .mutation("addUser", {
    input: z.object({
      firstName: z.string(),
      lastName: z.string(),
      email: z.string(),
      phone: z.string().optional(),
      role: z.object({ id: z.string(), name: z.string() }).array(),
      status: z.string(),
    }),

    async resolve({ ctx, input }) {
      const orgID = await prisma?.user.findFirst({
        where: { id: ctx.session?.user.id },
        select: { organizationId: true },
      });

      return await prisma?.user.create({
        data: {
          firstName: input.firstName,
          lastName: input.lastName,
          email: input.email,
          phoneNumber: input.phone,
          organizationId: orgID?.organizationId,
          roles: {
            connect: input.role.map((role) => ({
              id: role.id,
            })),
          },
          status: input.status as UserStatus,
          UserSettings: {
            create: {},
          },
        },
      });
    },
  })
  .mutation("updateUserByID", {
    input: z.object({
      id: z.string(),
      firstName: z.string(),
      lastName: z.string(),
      email: z.string(),
      phone: z.string().length(10).optional(),
      role: z.object({ id: z.string(), name: z.string() }).array(),
      status: z.string(),
    }),

    async resolve({ input }) {
      const allRoles = await prisma?.role.findMany({});
      const disconnectRoles = allRoles?.filter((role) =>
        input.role.every((i) => i.id !== role.id)
      );

      return await prisma?.user.update({
        data: {
          firstName: input.firstName,
          lastName: input.lastName,
          email: input.email,
          phoneNumber: input.phone,
          roles: {
            connect: input.role.map((role) => ({
              id: role.id,
            })),
            disconnect: disconnectRoles?.map((role) => ({ id: role.id })),
          },
          status: input.status as UserStatus,
        },
        where: { id: input.id },
      });
    },
  })
  .mutation("deleteUserByID", {
    input: z.string(),
    async resolve({ input }) {
      return await prisma?.user.delete({
        where: { id: input },
      });
    },
  });
