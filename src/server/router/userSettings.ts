import { createTRPCRouter, loggedInProcedure } from "./context";
import { z } from "zod"
import { TRPCError } from "@trpc/server";
import { createSupaServerClient } from "../../utils/serverSupaClient";

export const userSettingsRouter = createTRPCRouter({
  updateEmail: loggedInProcedure.input(
    z.object({
      email: z.string().email(),
      confirmEmail: z.string().email()
    })
  ).mutation(async ({ ctx, input }) => {
    // Check to ensure emails match
    if (input.email != input.confirmEmail) {
      throw new TRPCError({ code: "BAD_REQUEST", message: "Emails do not match" })
    }
    // setup supabase client
    const supabase = createSupaServerClient()
    //update user email on supabase
    const supaUpdate = await supabase.auth.admin.updateUserById(ctx.session.user.id, { email: input.email })
    if (supaUpdate.error) {
      console.log(supaUpdate.error)
      throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Error updating email with supabase" })
    }

    //update user table in DB
    const dbUpdate = await prisma?.user.update({
      where: {
        id: ctx.session.user.id
      },
      data: {
        email: input.email
      }
    })

    // Checks dbUpdate and if failed reverts email in supabase and throws
    if (dbUpdate == undefined) {
      await supabase.auth.admin.updateUserById(ctx.session.user.id, { email: ctx.session.user.email })
      throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Unable to update email" })
    }

    return dbUpdate
  }),

  changePassword: loggedInProcedure.input(z.object({ password: z.string(), confirmPassword: z.string() })).mutation(async ({ input, ctx }) => {
    // Check to ensure that the passwords match
    if (input.password != input.confirmPassword) {
      throw new TRPCError({ code: "BAD_REQUEST", message: "Passwords do not match." })
    }
    // setup supabase
    const supabase = createSupaServerClient();
    //update password
    const passUpdate = await supabase.auth.admin.updateUserById(ctx.session.user.id, { password: input.password })
    if (passUpdate.error) {
      throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Error updating password" })
    }
    return passUpdate
  }),

  changeHidePhoneNum: loggedInProcedure.input(z.object(
    {
      hidePhoneNum: z.boolean(),
      sendReminderEmail: z.boolean(),
    }
  )).mutation(async ({ ctx, input }) => {
    const update = await prisma?.userSettings.update({
      where: {
        userId: ctx.session.user.id
      },
      data: {
        hidePhoneNum: input.hidePhoneNum,
        sendReminderEmail: input.sendReminderEmail
      }
    })
    if (update == undefined) {
      throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Error updating setting" })
    }
    return update
  }),
  // param: boolean
  // changes the reminder email setting which is jj
  changeRemidnerEmails: loggedInProcedure.input(z.boolean()).mutation(async ({ ctx, input }) => {
    const update = await prisma?.userSettings.update({
      where: {
        userId: ctx.session.user.id
      },
      data: {
        sendReminderEmail: input
      }
    })
    if (update == undefined) {
      throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Error updating setting" })
    }
    return update
  }),

  deleteAccount: loggedInProcedure.mutation(async ({ ctx }) => {
    const user = await prisma?.user.findFirst({
      where: {
        id: ctx.session.user.id
      },
      select: {
        organizationId: true,
        status: true
      }
    })
    if (user == undefined) {
      throw new TRPCError({ code: "BAD_REQUEST", message: "Organization ID not found." })
    }
    const orgAdminCount = await prisma?.user.count({
      where: {
        organizationId: user?.organizationId,
        status: "ADMIN"
      }
    })
    if ((orgAdminCount == 1 && user.status == "ADMIN") || orgAdminCount == undefined) {
      throw new TRPCError({ code: "BAD_REQUEST", message: "You must have atleast one admin account. If you would like to delete your entire oganization please use the organization settings" })
    }
    const deleteUser = await prisma?.user.delete({
      where: {
        id: ctx.session.user.id
      }
    })
    if (deleteUser == undefined) {
      throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Error deleting user." })
    }
    const supabase = createSupaServerClient();
    await supabase.auth.admin.deleteUser(ctx.session.user.id)
    await supabase.auth.admin.signOut(ctx.session.access_token)
    return
  }),
})
