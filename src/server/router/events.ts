import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { replaceTime, roundHourDown } from "../utils/dateTimeModifers";
import { createRouter } from "./context";
import { findFutureDates } from "../utils/findFutureDates";

export const eventsRouter = createRouter()
  .query("getUpcomingEventsByOrganization", {
    async resolve({ ctx }) {
      const org = await prisma?.user.findFirst({
        where: { id: ctx.session?.user.id },
        select: { organizationId: true },
      });
      return await prisma?.event.findMany({
        where: {
          organizationId: org?.organizationId,
          datetime: {
            gte: roundHourDown(),
          },
        },
        include: {
          positions: {
            include: {
              Role: true,
            },
          },
        },
        orderBy: {
          datetime: "asc",
        },
      });
    },
  })
  .query("getPastEventsByOrganization", {
    async resolve({ ctx }) {
      const org = await prisma?.user.findFirst({
        where: { id: ctx.session?.user.id },
        select: { organizationId: true },
      });
      return await prisma?.event.findMany({
        where: {
          organizationId: org?.organizationId,
          datetime: {
            lt: roundHourDown(),
          },
        },
        include: {
          positions: {
            include: {
              Role: true,
            },
          },
        },
        orderBy: {
          datetime: "desc",
        },
      });
    },
  })
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
  .mutation("createSingleEvent", {
    input: z.object({
      name: z.string(),
      eventDate: z.date(),
      eventTime: z.date(),
      isRepeating: z.boolean(),
      eventLocation: z.object({
        id: z.string(),
        name: z.string(),
        organizationId: z.string(),
      }),
      positions: z
        .object({
          position: z.object({
            id: z.string(),
            name: z.string(),
            organizationId: z.string().optional(),
          }),
          quantity: z.number(),
        })
        .array(),
    }),

    async resolve({ ctx, input }) {
      console.log(input.positions);
      if (input.isRepeating == false) {
        const org = await prisma?.user.findFirst({
          where: { id: ctx.session?.user.id },
          select: { organizationId: true },
        });

        return await prisma?.event.create({
          data: {
            name: input.name,
            datetime: replaceTime(input.eventDate, input.eventTime),
            organizationId: org?.organizationId,
            locationsId: input.eventLocation.id,
            positions: {
              create: input.positions.map((item) => ({
                roleId: item.position.id,
              })),
            },
          },
        });
      }
    },
  })

  .mutation("createRecurringEvents", {
    input: z.object({
      name: z.string(),
      eventDate: z.date(),
      eventTime: z.date(),
      eventLocation: z.object({
        id: z.string(),
        name: z.string(),
        organizationId: z.string(),
      }),
      isRepeating: z.boolean(),
      repeatFrequency: z
        .object({
          id: z.union([
            z.literal("D"),
            z.literal("W"),
            z.literal("WC"),
            z.literal("M"),
          ]),
          name: z.string(),
        })
        .optional(),
      DEndSelect: z
        .object({
          id: z.union([z.literal("Num"), z.literal("Date")]),
          name: z.string(),
        })
        .optional(),
      DNum: z.number().optional(),
      DDate: z.date().optional(),
      WEndSelect: z
        .object({
          id: z.union([z.literal("Num"), z.literal("Date")]),
          name: z.string(),
        })
        .optional(),
      WNum: z.number().optional(),
      WDate: z.date().optional(),
      WCEndSelect: z
        .object({
          id: z.union([z.literal("Num"), z.literal("Date")]),
          name: z.string(),
        })
        .optional(),
      WCNum: z.number().optional(),
      WCDate: z.date().optional(),
      WCSun: z.boolean().optional(),
      WCMon: z.boolean().optional(),
      WCTues: z.boolean().optional(),
      WCWed: z.boolean().optional(),
      WCThurs: z.boolean().optional(),
      WCFri: z.boolean().optional(),
      WCSat: z.boolean().optional(),
      MEndSelect: z
        .object({
          id: z.union([z.literal("Num"), z.literal("Date")]),
          name: z.string(),
        })
        .optional(),
      MNum: z.number().optional(),
      MDate: z.date().optional(),
      positions: z
        .object({
          position: z.object({
            id: z.string(),
            name: z.string(),
            organizationId: z.string().optional(),
          }),
          quantity: z.number(),
        })
        .array(),
    }),

    async resolve({ ctx, input }) {
      if (input.isRepeating == false) {
        throw new TRPCError({ code: "BAD_REQUEST" });
        return;
      }
      const org = await prisma?.user.findFirst({
        where: { id: ctx.session?.user.id },
        select: { organizationId: true },
      });

      const formatedDate = replaceTime(input.eventDate, input.eventTime);
      const newDates = findFutureDates(input);
      console.log("This is the new dates: ", newDates);

      const events = newDates?.map(async (date) => {
        await prisma?.event.create({
          data: {
            name: input.name,
            datetime: date,
            organizationId: org?.organizationId,
            locationsId: input.eventLocation.id,
            positions: {
              create: input.positions.map((item) => ({
                roleId: item.position.id,
              })),
            },
          },
        });
      });
      console.log("This is the added events", events);
      return events;
    },
  })

  .mutation("deleteEventById", {
    input: z.string(),
    async resolve({ input }) {
      return await prisma?.event.delete({
        where: {
          id: input,
        },
      });
    },
  });
