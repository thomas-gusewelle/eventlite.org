import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { replaceTime, roundHourDown } from "../utils/dateTimeModifers";
import { createRouter } from "./context";
import { findFutureDates } from "../utils/findFutureDates";
import Roles from "../../pages/roles";

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
          Locations: true,
          positions: {
            include: {
              Role: true,
              User: true,
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
  .query("getEventById", {
    input: z.string(),
    async resolve({ input }) {
      return await prisma?.event.findFirst({
        where: { id: input },
        include: {
          Locations: true,
          positions: {
            include: { Role: true },
          },
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
  .query("getEventRecurrance", {
    input: z.string(),
    async resolve({ input }) {
      return await prisma?.eventReccurance.findFirst({
        where: {
          recurringId: input,
        },
      });
    },
  })
  .mutation("createEvent", {
    input: z.object({
      name: z.string(),
      eventDate: z.date(),
      eventTime: z.date(),
      recurringId: z.string().optional(),
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
      const org = await prisma?.user.findFirst({
        where: { id: ctx.session?.user.id },
        select: { organizationId: true },
      });

      return await prisma?.event.create({
        data: {
          name: input.name,
          recurringId: input?.recurringId,
          datetime: replaceTime(input.eventDate, input.eventTime),
          organizationId: org?.organizationId,
          locationsId: input.eventLocation.id,
          positions: {
            create: input.positions.map((item) => ({
              numberNeeded: item.quantity,
              roleId: item.position.id,
            })),
          },
        },
      });
    },
  })
  .mutation("createEventReccurance", {
    input: z.object({
      recurringId: z.string(),
      repeatFrequency: z.object({
        id: z.union([
          z.literal("D"),
          z.literal("W"),
          z.literal("WC"),
          z.literal("M"),
        ]),
        name: z.string(),
      }),

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
    }),
    async resolve({ input }) {
      return await prisma?.eventReccurance.create({
        data: {
          recurringId: input.recurringId,
          repeatFrequecyId: input.repeatFrequency.id,
          repeatFrequencyName: input.repeatFrequency.name,
          DEndSelectId: input.DEndSelect?.id,
          DEndSelectName: input.DEndSelect?.name,
          DNum: input.DNum,
          DDate: input.DDate,
          WCEndSelectId: input.WCEndSelect?.id,
          WEndSelectName: input.WCEndSelect?.name,
          WNum: input.WNum,
          WDate: input.WDate,
          WEndSelectId: input.WCEndSelect?.id,
          WCEndSelectName: input.WCEndSelect?.name,
          WCNum: input.WCNum,
          WCDate: input.WCDate,
          WCSun: input.WCSun,
          WCMon: input.WCMon,
          WCTues: input.WCTues,
          WCWed: input.WCWed,
          WCFri: input.WCFri,
          WCThurs: input.WCThurs,
          WCSat: input.WCSat,
          MEndSelectId: input.MEndSelect?.id,
          MEndSelectName: input.MEndSelect?.name,
          MNum: input.MNum,
          MDate: input.MDate,
        },
      });
    },
  })
  .mutation("editEvent", {
    input: z.object({
      id: z.string(),
      name: z.string(),
      eventDate: z.date(),
      eventTime: z.date(),
      organization: z.string(),
      recurringId: z.string().optional(),
      eventLocation: z.object({
        id: z.string(),
        name: z.string(),
        organizationId: z.string(),
      }),
      newPositions: z
        .object({
          position: z.object({
            roleId: z.string(),
            roleName: z.string(),
            organizationId: z.string().optional(),
          }),
          quantity: z.number(),
        })
        .array(),
      updatePositions: z
        .object({
          eventPositionId: z.string(),
          position: z.object({
            roleId: z.string(),
            roleName: z.string(),
            organizationId: z.string().optional(),
          }),
          quantity: z.number(),
        })
        .array(),
      deletePositions: z.string().array(),
    }),

    async resolve({ ctx, input }) {
      //deletes all connected positions that are not in the posiitons list

      await prisma?.eventPositions.deleteMany({
        where: {
          id: {
            in: input.deletePositions,
          },
        },
      });
      await Promise.all(
        input.updatePositions.map(async (item) => {
          await prisma?.eventPositions.update({
            where: {
              id: item.eventPositionId,
            },
            data: {
              numberNeeded: item.quantity,
              Role: {
                connect: {
                  id: item.position.roleId,
                },
              },
            },
          });
        })
      );

      const event = await prisma?.event.update({
        data: {
          name: input.name,
          recurringId: input?.recurringId,
          datetime: replaceTime(input.eventDate, input.eventTime),
          organizationId: input.organization,
          locationsId: input.eventLocation.id,
          positions: {
            create: input.newPositions.map((item) => ({
              numberNeeded: item.quantity,
              roleId: item.position.roleId,
            })),
          },
        },
        where: {
          id: input.id,
        },
      });
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
