import { createClient } from "@supabase/supabase-js";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import sendMail from "../../emails";
import SendBetaInvite from "../../emails/beta/SendInvite";
import { createSupaServerClient } from "../../utils/serverSupaClient";
import { createTRPCRouter, elAdminProcedure } from "./context";

export const AdminRouter = createTRPCRouter({
  getBetaRequests: elAdminProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.betaInterest.findMany()
  }),

  sendBetaInvite: elAdminProcedure.input(z.object({ id: z.string() })).mutation(async ({ ctx, input }) => {

    const betaRequest = await ctx.prisma?.betaInterest.findFirst({
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

    return await ctx.prisma?.betaInterest.update({
      where: {
        id: betaRequest.id,
      },
      data: {
        inviteSent: true,
      },
    });
  }),

  deleteBetaRegister: elAdminProcedure.input(
    z.object({
      id: z.string(),
    }),
  ).mutation(async ({ ctx, input }) => {

    return await ctx.prisma?.betaInterest.delete({
      where: {
        id: input.id,
      },
    });
  }),

  getOrgs: elAdminProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.organization.findMany()
  }),

  deleteOrg: elAdminProcedure.input(
    z.object({
      id: z.string(),
    }),
  ).mutation(async ({ ctx, input }) => {

    const org = await ctx.prisma?.organization.findFirst({
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

    const users = await ctx.prisma?.user.findMany({
      where: {
        organizationId: org?.id,
      },
    });

    const Deletedusers = await ctx.prisma?.user.deleteMany({
      where: {
        organizationId: org?.id,
      },
    });

    const organization = await ctx.prisma?.organization.delete({
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
  }),

  getLoginUsers: elAdminProcedure.query(async ({ ctx }) => {

    const supabase = createSupaServerClient();
    return await supabase.auth.admin.listUsers();
  }),

  deleteLoginUser: elAdminProcedure.input(
    z.object({
      id: z.string()
    }),
  ).mutation(async ({ ctx, input }) => {

    const supabase = createSupaServerClient();
    try {
      return await supabase.auth.admin.deleteUser(input.id)
    } catch (err) {
      throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to delete user login" })
    }
  })
})

