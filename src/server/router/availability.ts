import { createRouter } from "./context";
import { date, z } from "zod";

import { UserStatus } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { resolve } from "path";

export const avalibiltyRouter = createRouter()
  .query("getUserAvalibility", {
    async resolve({ ctx }) {
      return await prisma?.availability.findMany({
        where: {
          id: ctx.session?.user.id,
          date: {
            gte: new Date(),
          },
        },
      });
    },
  })
  .mutation("updateUserAvalibility", {
    input: z.object({
      newDates: z.date().array(),
      deleteDates: z.date().array(),
    }),
    async resolve({ ctx, input }) {
      const newDates = await prisma?.availability.createMany({
        data: input.newDates.map((date) => ({
          userId: ctx.session?.user.id,
          date: date,
        })),
      });
      const deleteDates = await prisma?.availability.deleteMany({
        where: {
          userId: ctx.session?.user.id,
          date: {
            in: input.deleteDates,
          },
        },
      });
      return { newDates: newDates, deletedDates: deleteDates };
    },
  })
  .mutation("deleteDate", {
    input: z.string(),
    async resolve({ input }) {
      return await prisma?.availability.delete({
        where: {
          id: input,
        },
      });
    },
  });
