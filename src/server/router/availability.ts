import { createRouter } from "./context";
import { z } from "zod";

import { UserStatus } from "@prisma/client";
import { TRPCError } from "@trpc/server";

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
  .mutation("createUserAvalibility", {
    input: z.date().array(),
    async resolve({ ctx, input }) {
      return await prisma?.availability.createMany({
        data: input.map((date) => ({
          userId: ctx.session?.user.id,
          date: date,
        })),
      });
    },
  });
