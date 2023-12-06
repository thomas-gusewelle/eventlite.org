import { Client } from "@upstash/qstash";
import superjson from "superjson";
import { z } from "zod";
import { createTRPCRouter, adminProcedure } from "./context";

export const eventEmailsRouter = createTRPCRouter({
  upcomingSchedule: adminProcedure
    .input(
      z.object({
        startingDate: z.date(),
        endingDate: z.date(),
        includedUsers: z
          .object({
            id: z.string(),
            email: z.string().email(),
            firstName: z.string(),
            orgId: z.string(),
          })
          .array(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      type reqData = {
        userId: string;
        email: string;
        firstName: string;
        orgId: string;
        startingDate: Date;
        endingDate: Date;
      };

      const qstashClient = new Client({
        token: process.env.QSTASH_TOKEN!,
      });

      const messages = Promise.all(
        input.includedUsers.map((user) => {
          let resData: reqData = {
            userId: user.id,
            email: user.email,
            firstName: user.firstName,
            orgId: user.orgId,
            startingDate: input.startingDate,
            endingDate: input.endingDate,
          };

          return qstashClient.publishJSON({
            url: `https://${ctx.req.headers.host}/api/messaging/emailUserEvents`,
            body: superjson.stringify(resData),
          });
        })
      );
      return messages;
    }),
});
