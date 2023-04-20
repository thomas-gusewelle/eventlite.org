import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, adminProcedure } from "./context";


export const roleRouter = createTRPCRouter({

  getRolesByOrganization: adminProcedure.query(async ({ ctx }) => {

    const org = await ctx.prisma?.user.findFirst({
      select: {
        organizationId: true,
      },
      where: {
        id: ctx.session.user.id,
      },
    });
    if (org?.organizationId) {
      return await ctx.prisma?.role.findMany({
        where: { organizationId: org?.organizationId },
      });
    }
  }),

  addRole: adminProcedure.input(z.string()).mutation(async ({ ctx, input }) => {

    const org = await ctx.prisma?.user.findFirst({
      select: { organizationId: true },
      where: { id: ctx.session.user.id },
    });
    if (org?.organizationId) {
      return await ctx.prisma?.role.create({
        data: {
          name: input,
          organizationId: org?.organizationId,
        },
      });
    }
  }),

  editRoleById: adminProcedure.input(
    z.object({
      id: z.string(),
      name: z.string(),
    }),
  ).mutation(async ({ ctx, input }) => {

    return await ctx.prisma?.role.update({
      data: {
        name: input.name,
      },
      where: { id: input.id },
    });
  }),

  deleteRolebyId: adminProcedure.input(z.string()).mutation(async ({ ctx, input }) => {

    return await ctx.prisma?.role.delete({
      where: {
        id: input,
      },
    });
  })

})

