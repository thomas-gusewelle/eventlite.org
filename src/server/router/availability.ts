import { createRouter } from "./context";
import { z } from "zod";

export const avalibiltyRouter = createRouter()
  .query("getUserAvalibility", {
    async resolve({ ctx }) {
      return await prisma?.availability.findMany({
        where: {
          userId: ctx.data?.user?.id,
          date: {
            gte: new Date(),
          },
        },
      });
    },
  })
  .query("getUserAvalibilityByID", {
    input: z.string(),
    async resolve({ input }) {
      return await prisma?.availability.findMany({
        where: {
          userId: input,
          date: {
            gte: new Date(),
          },
        },
      });
    },
  })
  .mutation("updateUserAvalibility", {
    input: z.object({
      userId: z.string(),
      newDates: z.date().array(),
      deleteDates: z.date().array(),
    }),
    async resolve({ input }) {
      const newDates = await prisma?.availability.createMany({
        data: input.newDates.map((date) => ({
          userId: input.userId,
          date: date,
        })),
      });

      // find dates user has responsed to and set the response to be DENY
      if (input.newDates.length > 0) {
        const schedule = await prisma?.eventPositions.findMany({
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

        await prisma?.eventPositions.updateMany({
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

      const deleteDates = await prisma?.availability.deleteMany({
        where: {
          userId: input.userId,
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
