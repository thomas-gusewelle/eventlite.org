import { z } from "zod";
import { replaceTime } from "../utils/dateTimeModifers";
import { createRouter } from "./context";

export const eventsRouter = createRouter()
  .query("getEventsByOrganization", {
    async resolve({ ctx }) {
      const org = await prisma?.user.findFirst({
        where: { id: ctx.session?.user.id },
        select: { organizationId: true },
      });
      return await prisma?.event.findMany({
        where: { organizationId: org?.organizationId },
      });
    },
  })
  .mutation("createEvents", {
    input: z
      .object({
        name: z.string(),
        eventDate: z.date(),
        eventTime: z.date(),
        isRepeating: z.boolean(),
        repeatFrequency: z
          .object({ id: z.string(), name: z.string() })
          .optional(),
        DEndSelect: z.object({ id: z.string(), name: z.string() }).optional(),
        DNum: z.number().optional(),
        DDate: z.date().optional(),
        WEndSelect: z.object({ id: z.string(), name: z.string() }).optional(),
        WNum: z.number().optional(),
        WDate: z.date().optional(),
        WCEndSelect: z.object({ id: z.string(), name: z.string() }).optional(),
        WCNum: z.number().optional(),
        WCDate: z.date().optional(),
        WCSun: z.boolean().optional(),
        WCMon: z.boolean().optional(),
        WCTues: z.boolean().optional(),
        WCWed: z.boolean().optional(),
        WCThurs: z.boolean().optional(),
        WCFri: z.boolean().optional(),
        WCSat: z.boolean().optional(),
        MEndSelect: z.object({ id: z.string(), name: z.string() }).optional(),
        MNum: z.number().optional(),
        MDate: z.date().optional(),
      })
      .array(),
    async resolve({ ctx, input }) {
      const org = await prisma?.user.findFirst({
        where: { id: ctx.session?.user.id },
        select: { organizationId: true },
      });

      const posts = input.map(async (event) => {
        return await prisma?.event.create({
          data: {
            name: event.name,
            datetime: replaceTime(event.eventDate, event.eventTime),
            organizationId: org?.organizationId,
          },
        });
      });
      return posts;
    },
  });
