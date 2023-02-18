import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createRouter } from "./context";
import sgMail from "@sendgrid/mail";
import { InviteLink } from "@prisma/client";
import { createClient } from "@supabase/supabase-js";
import { createSupaServerClient } from "../../utils/serverSupaClient";
import { resetPasswordEmail } from "../../emails/resetPassword";
import sendMail from "../../emails";
import ConfirmEmailNew from "../../emails/accounts/ConfirmEmailNew";
import InviteCode from "../../emails/accounts/InviteCode";

export const createAccountRouter = createRouter()
  .query("searchForOrg", {
    input: z.string(),
    async resolve({ input }) {
      return await prisma?.organization.findMany({
        where: {
          name: {
            search: `%${input.replace(/ /g, " | ")}%`,
          },
        },
      });
    },
  })
  .query("getUserFromInvite", {
    input: z.string(),
    async resolve({ input }) {
      const invite = await prisma?.inviteLink.findFirst({
        where: { id: input },
      });
      if (invite == null || invite == undefined) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invite link does not exist.",
        });
      }
      return await prisma?.user.findFirst({
        where: { id: invite.userId },
        include: { Organization: true },
      });
    },
  })
  //creates or finds code to send to user
  .mutation("createInviteLinkWithID", {
    input: z.object({
      userId: z.string(),
    }),
    async resolve({ input }) {
      let link: InviteLink | null | undefined = undefined;
      //tries to create the link and if it cannot then it finds the existing link and resends the link.
      try {
        link = await prisma?.inviteLink.create({
          data: {
            user: {
              connect: {
                id: input.userId,
              },
            },
          },
        });
      } catch (error) {
        link = await prisma?.inviteLink.findFirst({
          where: { userId: input.userId },
        });
      }

      if (link == undefined || link == null) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Error creating or retrieving invite code.",
        });
      }

      const user = await prisma?.user.findFirst({
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
      //   console.log(error);
      //   throw new TRPCError({
      //     code: "INTERNAL_SERVER_ERROR",
      //     message: "Failed to send invite code",
      //   });
      // }
      return link;
    },
  })

  .mutation("resendConfirm", {
    input: z.object({
      email: z.string().email(),
    }),
    async resolve({ input }) {
      console.log("Here 119");
      const _supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_PRIVATE!
      );

      const { data, error } = await _supabase.auth.admin.generateLink({
        email: input.email,
        type: "signup",

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
    },
  })
  //  used for creating login for user that is already in org.
  // creates the user then updates the database userID and deletes the inviteLink entry
  .mutation("createInviteLogin", {
    input: z.object({
      email: z.string().email(),
      password: z.string(),
      confirmPassword: z.string(),
      inviteId: z.string(),
    }),
    async resolve({ input, ctx }) {
      // check confirmPass == password
      if (input.password != input.password) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Passwords do not match",
        });
      }

      const user = await prisma?.inviteLink.findFirst({
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

      const updateuser = await prisma?.user.update({
        where: {
          id: user.userId,
        },
        data: {
          id: data?.user?.id,
          hasLogin: true,
        },
      });
      const deleteLink = await prisma?.inviteLink.delete({
        where: { id: input.inviteId },
      });
      return data;
    },
  })
  // Checks to ensure the user exists and then sends email
  .mutation("generateResetPassword", {
    input: z.object({
      email: z.string().email(),
    }),
    async resolve({ input }) {
      const user = await prisma?.user.findFirst({
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
      sgMail.setApiKey(process.env.SENDGRID_API_KEY!);
      try {
        await sgMail.send({
          to: user.email,
          from: {
            email: "accounts@eventlite.org",
            name: "EventLite.org",
          },
          subject: `Reset Password`,
          html: resetPasswordEmail(input.email),
        });
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to send password reset email",
        });
      }
    },
  })
  // takes in email and passwords. Find the user from public.users and updated the auth password
  .mutation("resetPassword", {
    input: z.object({
      email: z.string().email(),
      password: z.string(),
      passwordConfirm: z.string(),
    }),
    async resolve({ input }) {
      if (input.password != input.passwordConfirm) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Passwords do not match.",
        });
      }

      const user = await prisma?.user.findFirst({
        where: {
          email: input.email,
        },
      });
      if (user == null || user == undefined) {
        throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });
      }
      const _supabase = createSupaServerClient();
      const update = await _supabase.auth.admin.updateUserById(user.id, {
        password: input.password,
      });
      if (update.error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error updating the password.",
        });
      }
      return update;
    },
  })
  .mutation("registerBetaInterest", {
    input: z.object({
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

    async resolve({ input }) {
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
          `,
        });
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error as string,
        });
      }

      return await prisma?.betaInterest.create({
        data: {
          firstName: input.firstName,
          lastName: input.lastName,
          email: input.email,
          orgName: input.orgName,
          teamSize: input.teamSize,
        },
      });
    },
  });
