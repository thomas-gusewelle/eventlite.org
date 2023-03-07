import { createClient } from "@supabase/supabase-js";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import sendMail from "../../emails";
import SendBetaInvite from "../../emails/beta/SendInvite";
import { createSupaServerClient } from "../../utils/serverSupaClient";
import { createRouter } from "./context";

export const AdminRouter = createRouter()
  .middleware(async ({ ctx, next }) => {
    const user = await prisma?.user.findFirst({
      where: { id: ctx.data?.user?.id },
      select: {
        email: true,
      },
    });
    if (user?.email != "tgusewelle@eventlite.org") {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }
    return next();
  })
  .query("getBetaRequests", {
    async resolve() {
      return await prisma?.betaInterest.findMany();
    },
  })
  .mutation("sendBetaInvite", {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ input }) {
      const betaRequest = await prisma?.betaInterest.findFirst({
        where: {
          id: input.id,
        },
      });
      if (!betaRequest) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Beta Interest does not exist",
        });
      }

      try {
        sendMail({
          to: betaRequest.email,
          component: (
            <SendBetaInvite
              link={`https://eventlite.org/create-account?code=${encodeURIComponent(
                betaRequest.id
              )}&firstName=${betaRequest.firstName}&lastName=${betaRequest.lastName
                }&email=${betaRequest.email}&orgName=${betaRequest.orgName}`}
              name={betaRequest.firstName}
            />
          ),
        });
      } catch (err) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Unable to send invite",
        });
      }

      return await prisma?.betaInterest.update({
        where: {
          id: betaRequest.id,
        },
        data: {
          inviteSent: true,
        },
      });
    },
  })
  .mutation("deleteBetaRegister", {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ input }) {
      return await prisma?.betaInterest.delete({
        where: {
          id: input.id,
        },
      });
    },
  })
  .query("getOrgs", {
    async resolve() {
      return await prisma?.organization.findMany();
    },
  })
  .mutation("deleteOrg", {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ input }) {
      const org = await prisma?.organization.findFirst({
        where: {
          id: input.id,
        },
        select: {
          id: true,
        },
      });

      if (org == undefined || org == null) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Organization does not exist",
        });
      }

      const users = await prisma?.user.findMany({
        where: {
          organizationId: org?.id,
        },
      });

      const Deletedusers = await prisma?.user.deleteMany({
        where: {
          organizationId: org?.id,
        },
      });

      const organization = await prisma?.organization.delete({
        where: {
          id: org?.id ?? "",
        },
      });
      //Delete all logins for org
      const _supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_PRIVATE!
      );

      users
        ?.filter((user) => user.hasLogin)
        .forEach(async (user) => {
          await _supabase.auth.admin.deleteUser(user.id);
        });

      return;
    },
  })
  .query("getLoginUsers", {
    async resolve() {
      const supabase = createSupaServerClient();
      return await supabase.auth.admin.listUsers();
    },
  });
