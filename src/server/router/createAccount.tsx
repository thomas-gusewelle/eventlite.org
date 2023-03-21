import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { api } from "../utils/api"
import sgMail from "@sendgrid/mail";
import { InviteLink } from "@prisma/client";
import { createClient } from "@supabase/supabase-js";
import { createSupaServerClient } from "../../utils/serverSupaClient";
import sendMail from "../../emails";
import ConfirmEmailNew from "../../emails/accounts/ConfirmEmailNew";
import InviteCode from "../../emails/accounts/InviteCode";
import ResetPassword from "../../emails/accounts/ResetPassword";
import ThankYouEmail from "../../emails/beta/ThankYou";
import { createTRPCRouter, loggedInProcedure, adminProcedure, publicProcedure } from "./context";


export const createAccountRouter = createTRPCRouter({
  searchForOrg: publicProcedure.input(z.string()).query(async ({ input, ctx }) => {

    return await ctx.prisma?.organization.findMany({
      where: {
        name: {
          search: `%${input.replace(/ /g, " | ")}%`,
        },
      },
    });
  }),

  getUserFromInvite: publicProcedure.input(z.string()).query(async ({ ctx, input }) => {

    const invite = await ctx.prisma?.inviteLink.findFirst({
      where: { id: input },
    });
    if (invite == null || invite == undefined) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Invite link does not exist.",
      });
    }
    return await ctx.prisma?.user.findFirst({
      where: { id: invite.userId },
      include: { Organization: true },
    });
  }),

  createInviteLinkWithID: loggedInProcedure.input(
    z.object({
      userId: z.string(),
    }),
  ).mutation(async ({ ctx, input }) => {

    let link: InviteLink | null | undefined = undefined;
    //tries to create the link and if it cannot then it finds the existing link and resends the link.
    try {
      link = await ctx.prisma?.inviteLink.create({
        data: {
          user: {
            connect: {
              id: input.userId,
            },
          },
        },
      });
    } catch (error) {
      link = await ctx.prisma?.inviteLink.findFirst({
        where: { userId: input.userId },
      });
    }

    if (link == undefined || link == null) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Error creating or retrieving invite code.",
      });
    }

    const user = await ctx.prisma?.user.findFirst({
      where: { id: input.userId },
      include: {
        Organization: true,
      },
    });
    if (user == undefined || user?.email == undefined) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "User does not exist",
      });
    }

    try {
      sendMail({
        to: user.email,
        component: (
          <InviteCode
            orgName={user.Organization?.name}
            invideCode={link.id}
            email={user.email}
          />
        ),
      });
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to send invite code",
      });
    }

    // sgMail.setApiKey(process.env.SENDGRID_API_KEY!);
    // try {
    //   await sgMail.send({
    //     to: user.email,
    //     from: {
    //       email: "accounts@eventlite.org",
    //       name: "EventLite.org",
    //     },
    //     subject: `Join ${user?.Organization?.name}'s Team`,
    //     html: inviteCodeEmailString(
    //       user.Organization?.name,
    //       link.id,
    //       user.email
    //     ),
    //   });
    // } catch (error) {
    //   throw new TRPCError({
    //     code: "INTERNAL_SERVER_ERROR",
    //     message: "Failed to send invite code",
    //   });
    // }
    return link;
  }),

  resendConfirm: adminProcedure.input(
    z.object({
      email: z.string().email(),
    }),
  ).mutation(async ({ ctx, input }) => {

    const _supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_PRIVATE!
    );

    const { data, error } = await _supabase.auth.admin.generateLink({
      email: input.email,
      type: "signup",
      options: {
        redirectTo: "https://www.eventlite.org/dashboard"
      },
      password: "test",
    });

    if (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: error.message,
      });
    }

    try {
      await sendMail({
        to: input.email,
        component: <ConfirmEmailNew link={data.properties.action_link} />,
      });
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Email send failed",
      });
    }
    return data;
  }),

  //  used for creating login for user that is already in org.
  // creates the user then updates the database userID and deletes the inviteLink entry
  createInviteLogin: publicProcedure.input(
    z.object({
      email: z.string().email(),
      password: z.string(),
      confirmPassword: z.string(),
      inviteId: z.string(),
    }),
  ).mutation(async ({ ctx, input }) => {

    // check confirmPass == password
    if (input.password != input.password) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Passwords do not match",
      });
    }

    const user = await ctx.prisma?.inviteLink.findFirst({
      where: { id: input.inviteId },
    });

    if (!user) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Bad invite link",
      });
    }

    const _supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_PRIVATE!
    );

    // const { data, error } = await supabase.auth.signUp({
    //   email: input.email,
    //   password: input.password,
    // });
    const { data, error } = await _supabase.auth.admin.generateLink({
      email: input.email,
      type: "signup",
      password: input.password,
      options: {
        redirectTo: "https://www.eventlite.org/dashboard"
      }
    });
    if (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: error.message,
        cause: "User Login Creation",
      });
    }

    try {
      await sendMail({
        to: input.email,
        component: <ConfirmEmailNew link={data.properties.action_link} />,
      });
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Email send failed",
      });
    }

    const updateuser = await ctx.prisma?.user.update({
      where: {
        id: user.userId,
      },
      data: {
        id: data?.user?.id,
        hasLogin: true,
      },
    });
    const deleteLink = await ctx.prisma?.inviteLink.delete({
      where: { id: input.inviteId },
    });
    return data;
  }),

  generateResetPassword: publicProcedure.input(
    z.object({
      email: z.string().email(),
    }),
  ).mutation(async ({ ctx, input }) => {

    const user = await ctx.prisma?.user.findFirst({
      where: {
        email: input.email,
      },
    });
    if (user == undefined || user == null) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "User with that email does not exist.",
      });
    }

    const resetCode = await ctx.prisma?.resetPassword.create({
      data: {
        user: {
          connect: {
            id: user.id,
          },
        },
      },
    });

    if (!resetCode) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Error creating reset code",
      });
    }
    try {
      await sendMail({
        to: input.email,
        component: <ResetPassword code={resetCode.id} />,
      });
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Unable to send reset email",
      });
    }
    return;
  }),

  // takes in email and passwords. Find the user from public.users and updated the auth password
  resetPassword: publicProcedure.input(
    z.object({
      code: z.string(),
      password: z.string(),
      passwordConfirm: z.string(),
    }),
  ).mutation(async ({ ctx, input }) => {

    if (input.password != input.passwordConfirm) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Passwords do not match.",
      });
    }

    const resetCode = await ctx.prisma?.resetPassword.findFirst({
      where: {
        id: input.code,
      },
      include: { user: true },
    });
    if (resetCode?.user == null || resetCode?.user == undefined) {
      throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });
    }
    const _supabase = createSupaServerClient();
    const update = await _supabase.auth.admin.updateUserById(
      resetCode.user.id,
      {
        password: input.password,
      }
    );
    if (update.error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Error updating the password.",
      });
    }
    return update;
  }),

  registerBetaInterest: publicProcedure.input(
    z.object({
      firstName: z.string(),
      lastName: z.string(),
      email: z.string().email(),
      orgName: z.string(),
      teamSize: z.union([
        z.literal("1-5"),
        z.literal("5-15"),
        z.literal("15-25"),
        z.literal("25+"),
      ]),
    }),
  ).mutation(async ({ ctx, input }) => {

    sgMail.setApiKey(process.env.SENDGRID_API_KEY!);
    try {
      sgMail.send({
        from: "beta@eventlite.org",
        to: "tgusewelle@eventlite.org",
        subject: "Beta Request",
        text: `first name: ${input.firstName}\n
          last name: ${input.lastName}\n
          email: ${input.email}\n
          organization: ${input.orgName}
          team size: ${input.teamSize}
          `,
      });
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
      });
    }

    try {
      await sendMail({
        to: input.email,
        component: <ThankYouEmail firstName={input.firstName} />,
      });
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
      });
    }

    return await ctx.prisma?.betaInterest.create({
      data: {
        firstName: input.firstName,
        lastName: input.lastName,
        email: input.email,
        orgName: input.orgName,
        teamSize: input.teamSize,
      },
    });
  })

})


