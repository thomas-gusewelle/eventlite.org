import { createRouter } from "./context";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { Event } from "@prisma/client";
import { zeroTime } from "../utils/dateTimeModifers";

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
  .query("getSchedule", {
    input: z.object({
      limit: z.number().min(1).max(100).nullish(),
      cursor: z.string().nullish(),
    }),
    async resolve({ input, ctx }) {
      const limit = input.limit ?? 50;
      const { cursor } = input;
      const testItems = await prisma?.event.findMany({
        where: {
          datetime: { gte: new Date() },
        },
        take: 4,
        orderBy: {
          datetime: "asc",
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
      });
      // console.log("this is the test: ", testItems);

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
      console.log("this is items at beginning: ", items);

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

      // Map creates a copy of the arrary to avoid mutation of the original
      let gteTime = items.map((item) => item);

      const users = await prisma?.user.findMany({
        where: {
          organizationId: org?.organizationId,
        },
        include: {
          roles: {},
          availability: {
            where: {
              date: {
                gte: zeroTime(gteTime[0]?.datetime),
                lte: zeroTime(nextCursor?.datetime),
              },
            },
          },
        },
      });
      return { items, users, nextCursor, lastCursor };
    },
  })
  .mutation("updateShowLimit", {
    input: z.number(),
    async resolve({ ctx, input }) {
      return await prisma?.userSettings.update({
        where: {
          userId: ctx.session?.user.id,
        },
        data: {
          scheduleShowAmount: input,
        },
      });
    },
  })
  .mutation("updateUserRole", {
    input: z.object({
      posisitionId: z.string(),
      userId: z.string(),
    }),
    async resolve({ input }) {
      const position = await prisma?.eventPositions.findFirst({
        where: {
          id: input.posisitionId,
        },
        select: {
          numberNeeded: true,
          User: true,
          Event: {
            select: {
              positions: {
                select: {
                  User: true,
                },
              },
            },
          },
        },
      });
      if (position?.User.length == position?.numberNeeded) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Maxiumum number of users for posisition already scheduled.",
        });
      }

      let eventUsers: string[] = [];
      position?.Event?.positions.map((pos) =>
        pos.User.map((user) => {
          eventUsers.push(user.id);
        })
      );
      if (eventUsers.includes(input.userId)) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "User is already schedule for this position",
        });
      }
      return await prisma?.eventPositions.update({
        where: {
          id: input.posisitionId,
        },
        data: {
          User: {
            connect: {
              id: input.userId,
            },
          },
        },
      });
    },
  })
  .mutation("removerUserfromPosition", {
    input: z.object({
      eventPositionId: z.string(),
      userId: z.string(),
    }),
    async resolve({ input }) {
      return await prisma?.eventPositions.update({
        where: {
          id: input.eventPositionId,
        },
        data: {
          User: {
            disconnect: {
              id: input.userId,
            },
          },
        },
      });
    },
  });
