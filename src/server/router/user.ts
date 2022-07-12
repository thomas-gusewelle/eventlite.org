import { createRouter } from "./context";
import { z } from "zod";
import { roleRouter } from "./role";

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
      status: z.any(),
    }),

    async resolve({ ctx, input }) {
      const orgID = await prisma?.user.findFirst({
        where: { id: ctx.session?.user.id },
        select: { organizationId: true },
      });

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
          status: input.status,
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
