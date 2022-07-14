import { createRouter } from "./context";
import { z } from "zod";
import { roleRouter } from "./role";
import { UserStatus } from "@prisma/client";

export const userRouter = createRouter()
  .query("getUser", {
    async resolve({ ctx }) {
      return await prisma?.user.findFirst({
        where: {
          id: ctx.session?.user.id,
        },
      });
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
        where: {
          organizationId: orgID?.organizationId,
        },
        include: {
          roles: true,
        },
      });
    },
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
      name: z.string(),
      email: z.string(),
      role: z.object({ id: z.string(), name: z.string() }).array(),
      status: z.string(),
    }),

    async resolve({ ctx, input }) {
      const orgID = await prisma?.user.findFirst({
        where: { id: ctx.session?.user.id },
        select: { organizationId: true },
      });
      console.log(input.status);
      await prisma?.user.create({
        data: {
          name: input.name,
          email: input.email,
          organizationId: orgID?.organizationId,
          roles: {
            connect: input.role.map((role) => ({
              id: role.id,
            })),
          },
          status: input.status as UserStatus,
        },
      });
    },
  })
  .mutation("deleteUserByID", {
    input: z.string(),
    async resolve({ input }) {
      await prisma?.user.delete({
        where: { id: input },
      });
    },
  });
