import { supabaseClient } from "@supabase/auth-helpers-nextjs";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createRouter } from "./context";
import sgMail from "@sendgrid/mail";
import { InviteLink } from "@prisma/client";

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
  .mutation("createInviteLink", {
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

      sgMail.setApiKey(process.env.SENDGRID_API_KEY!);
      try {
        await sgMail.send({
          to: "tombome119@gmail.com",
          from: "tgusewelle@gkwmedia.com",
          subject: `Join ${user?.Organization?.name}'s Team`,
          html: `<div>
          <h1>Join ${user.Organization?.name}'s Team</h1>
          <a href="/account/invite?code=${encodeURIComponent(
            link.id
          )}">LINK HERE</a>
          </div>`,
        });
      } catch (error) {
        console.log(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to send invite code",
        });
      }
      return link;
    },
  })
  //  used for creating login for user that is already in org.
  // creates the user then updates the database userID and deletes the inviteLink entry
  .mutation("createInviteLogin", {
    input: z.object({
      oldId: z.string(),
      email: z.string().email(),
      password: z.string(),
      confirmPassword: z.string(),
      inviteId: z.string(),
    }),
    async resolve({ input }) {
      // check confirmPass == password
      if (input.password != input.password) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Passwords do not match",
        });
      }

      const { user, error } = await supabaseClient.auth.signUp({
        email: input.email,
        password: input.password,
      });
      if (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error.message,
          cause: "User Login Creation",
        });
      }
      const updateuser = await prisma?.user.update({
        where: {
          id: input.oldId,
        },
        data: {
          id: user?.id,
          hasLogin: true,
        },
      });
      const deleteLink = await prisma?.inviteLink.delete({
        where: { id: input.inviteId },
      });
      return user;
    },
  });
