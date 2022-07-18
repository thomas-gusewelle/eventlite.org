import { truncate } from "fs";
import { resolve } from "path";
import { z } from "zod";
import { createRouter } from "./context";

export const roleRouter = createRouter()
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
      return await prisma?.role.findMany({
        where: { organizationId: org?.organizationId },
      });
    },
  })
  .mutation("addRole", {
    input: z.string(),
    async resolve({ ctx, input }) {
      const org = await prisma?.user.findFirst({
        select: { organizationId: true },
        where: { id: ctx.session?.user.id },
      });
      return await prisma?.role.create({
        data: {
          name: input,
          organizationId: org?.organizationId,
        },
      });
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
