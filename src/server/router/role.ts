import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createRouter } from "./context";

export const roleRouter = createRouter()
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
  .query("getRolesByOrganization", {
    async resolve({ ctx }) {
      const org = await prisma?.user.findFirst({
        select: {
          organizationId: true,
        },
        where: {
          id: ctx.session?.user.id,
        },
      });
      if (org?.organizationId) {
        return await prisma?.role.findMany({
          where: { organizationId: org?.organizationId },
        });
      }
    },
  })
  .mutation("addRole", {
    input: z.string(),
    async resolve({ ctx, input }) {
      const org = await prisma?.user.findFirst({
        select: { organizationId: true },
        where: { id: ctx.session?.user.id },
      });
      if (org?.organizationId) {
        return await prisma?.role.create({
          data: {
            name: input,
            organizationId: org?.organizationId,
          },
        });
      }
    },
  })
  .mutation("editRoleById", {
    input: z.object({
      id: z.string(),
      name: z.string(),
    }),
    async resolve({ input }) {
      return await prisma?.role.update({
        data: {
          name: input.name,
        },
        where: { id: input.id },
      });
    },
  })
  .mutation("deleteRoleById", {
    input: z.string(),
    async resolve({ input }) {
      return await prisma?.role.delete({
        where: {
          id: input,
        },
      });
    },
  });
