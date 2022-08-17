import { createRouter } from "./context";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { Event } from "@prisma/client";

export const scheduleRouter = createRouter()
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
  .query("infiniteSchedule", {
    input: z.object({
      limit: z.number().min(1).max(100).nullish(),
      cursor: z.string().nullish(),
    }),
    async resolve({ input }) {
      const firstEvent = await prisma?.event.findFirst({
        where: {
          datetime: {
            gte: new Date(),
          },
        },
        orderBy: {
          datetime: "asc",
        },
      });

      const limit = input.limit ?? 50;
      const { cursor } = input ?? firstEvent?.id;
      const items = await prisma?.event.findMany({
        take: limit + 1,
        where: {
          datetime: {
            gte: new Date(),
          },
        },
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: {
          datetime: "asc",
        },
      });
      let nextCursor: typeof cursor | undefined = undefined;
      if (items == undefined) {
        throw new TRPCError({ code: "BAD_REQUEST" });
      }
      if (items?.length > limit) {
        const nextitem = items?.pop();
        nextCursor = nextitem!.id;
      }
      return { items, nextCursor };
    },
  })
  .query("getSchedule", {
    input: z.object({
      limit: z.number().min(1).max(100).nullish(),
      cursor: z.string().nullish(),
    }),
    async resolve({ input, ctx }) {
      const firstEvent = await prisma?.event.findFirst({
        where: {
          datetime: {
            gte: new Date(),
          },
        },
        orderBy: {
          datetime: "asc",
        },
      });

      const limit = input.limit ?? 50;
      const { cursor } = input ?? firstEvent?.id;
      const items = await prisma?.event.findMany({
        take: limit + 1,
        where: {
          datetime: {
            gte: new Date(),
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
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: {
          datetime: "asc",
        },
      });

      const lastItems = await prisma?.event.findMany({
        take: -limit - 1,
        where: {
          datetime: {
            gte: new Date(),
          },
        },
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: {
          datetime: "asc",
        },
      });

      let nextCursor: Event | undefined = undefined;
      let lastCursor: Event | undefined = undefined;
      if (items == undefined) {
        throw new TRPCError({ code: "BAD_REQUEST" });
      }
      if (items?.length > limit) {
        const nextitem = items?.pop();
        nextCursor = nextitem;
      }
      if (lastItems) {
        if (lastItems[0]?.datetime && nextCursor?.datetime) {
          if (
            lastItems[0]?.datetime.getTime() < nextCursor?.datetime.getTime()
          ) {
            lastCursor = lastItems[0];
          } else {
            lastCursor = undefined;
          }
        }
        if (nextCursor == undefined) {
          lastCursor = lastItems[0];
        }
      }
      const org = await prisma?.user.findFirst({
        where: {
          id: ctx.session?.user.id,
        },
        select: {
          organizationId: true,
        },
      });
      const users = await prisma?.user.findMany({
        where: {
          organizationId: org?.organizationId,
        },
      });

      return { items, users, nextCursor, lastCursor };
    },
  });
