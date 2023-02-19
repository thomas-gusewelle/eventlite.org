import { createRouter } from "./context";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { Event, EventPositions, Locations, Role, User } from "@prisma/client";
import { zeroTime } from "../utils/dateTimeModifers";

export const scheduleRouter = createRouter()
  .middleware(async ({ ctx, next }) => {
    const user = await prisma?.user.findFirst({
      where: { id: ctx.data?.user?.id },
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
      console.log("here 26");
      const limit: number = input.limit ?? 50;
      const { cursor } = input;

      const org = await prisma?.user.findFirst({
        where: {
          id: ctx.data?.user?.id,
        },
        select: {
          organizationId: true,
        },
      });
      console.log(org);

      let items:
        | (Event & {
            Locations: Locations | null;
            positions: (EventPositions & {
              User: User | null;
              Role: Role;
            })[];
          })[]
        | undefined = undefined;

      try {
        items = await prisma?.event.findMany({
          take: limit + 1,
          where: {
            organizationId: org?.organizationId,
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
      } catch (err) {
        return { items };
      }
      console.log(items);

      const lastItems = await prisma?.event.findMany({
        take: -limit - 1,
        where: {
          organizationId: org?.organizationId,
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

      // This json parsing is a dirty way of deep cloning the array to keep a mutation from happening on line 130
      let gteTime = JSON.parse(JSON.stringify(items));

      const users = await prisma?.user.findMany({
        where: {
          organizationId: org?.organizationId,
        },
        include: {
          roles: {},
          availability: {
            where: {
              date: {
                // new Date() is required because of the JSON parse/stringify hack
                gte: zeroTime(new Date(gteTime[0]?.datetime)),
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
          userId: ctx.data?.user?.id,
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
          userResponse: null,
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
            disconnect: true,
          },
        },
      });
    },
  });
