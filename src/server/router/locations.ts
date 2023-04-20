import { createTRPCRouter, adminProcedure } from "./context";
import { z } from "zod";
import { TRPCError } from "@trpc/server";


export const locationRouter = createTRPCRouter({
  getLocationsByOrg: adminProcedure.query(async ({ ctx }) => {

    const orgID = await ctx.prisma?.user.findFirst({
      select: { organizationId: true },
      where: { id: ctx.session.user.id },
    });
    if (orgID?.organizationId) {
      return await ctx.prisma?.locations.findMany({
        where: { organizationId: orgID.organizationId },
      });
    }
  }),

  createLocation: adminProcedure.input(z.string()).mutation(async ({ ctx, input }) => {

    const orgID = await ctx.prisma?.user.findFirst({
      select: { organizationId: true },
      where: { id: ctx.session.user.id },
    });
    if (orgID?.organizationId) {
      return await ctx.prisma?.locations.create({
        data: {
          name: input,
          organizationId: orgID?.organizationId,
        },
      });
    }
  }),

  editLocationByID: adminProcedure.input(
    z.object({
      id: z.string(),
      name: z.string(),
    }),
  ).mutation(async ({ ctx, input }) => {
    return await ctx.prisma?.locations.update({
      data: {
        name: input.name,
      },
      where: { id: input.id },
    });
  }),

  deletebyId: adminProcedure.input(z.string()).mutation(async ({ ctx, input }) => {
    return await ctx.prisma?.locations.delete({
      where: { id: input },
    });
  })

})

