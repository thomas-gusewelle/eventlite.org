import { createTRPCRouter, loggedInProcedure } from "./context";
import { z } from "zod";


export const avalibiltyRouter = createTRPCRouter({
    
getUserAvalibility: loggedInProcedure.query(async ({ctx}) => {
    
      return await ctx.prisma?.availability.findMany({
        where: {
          userId: ctx.session.id,
          date: {
            gte: new Date(),
          },
        },
      });
  }),

  
getUserAvalibilityByID: loggedInProcedure.input(
    z.string()
  ).query(async ({ctx, input}) => {
    
      return await ctx.prisma?.availability.findMany({
        where: {
          userId: input,
          date: {
            gte: new Date(),
          },
        },
      });
  }),

  updateUserAvalibility: loggedInProcedure.input(
         z.object({
      userId: z.string(),
      newDates: z.date().array(),
      deleteDates: z.date().array(),
    }),
  ).mutation(async ({ctx, input}) => {
    
      const newDates = await ctx.prisma?.availability.createMany({
        data: input.newDates.map((date) => ({
          userId: input.userId,
          date: date,
        })),
      });

      // find dates user has responsed to and set the response to be DENY
      if (input.newDates.length > 0) {
        const schedule = await ctx.prisma?.eventPositions.findMany({
          where: {
            userId: input.userId,
          },
          select: {
            id: true,
            userResponse: true,
            Event: {
              select: {
                datetime: true,
              },
            },
          },
        });

        const changeDates = schedule?.filter((item) =>
          input.newDates
            .map((date) => date.getTime())
            .includes(
              new Date(item.Event.datetime.getTime()).setHours(0, 0, 0, 0)
            )
        );

        await ctx.prisma?.eventPositions.updateMany({
          where: {
            id: {
              in: changeDates?.map((item) => item.id),
            },
          },
          data: {
            userResponse: false,
          },
        });
      }

      const deleteDates = await ctx.prisma?.availability.deleteMany({
        where: {
          userId: input.userId,
          date: {
            in: input.deleteDates,
          },
        },
      });
      return { newDates: newDates, deletedDates: deleteDates };
  }),

  deleteDate: loggedInProcedure.input(z.string()).mutation(async ({ctx, input}) => {
    
      return await ctx.prisma?.availability.delete({
        where: {
          id: input,
        },
      });
  })  

})
