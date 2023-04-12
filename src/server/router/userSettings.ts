import { createTRPCRouter, loggedInProcedure } from "./context";
import { z } from "zod"
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
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
    let req = ctx.req
    let res = ctx.res
    // const supabase = createServerSupabaseClient({ req, res, })
    const supabase = createSupaServerClient()
    //update user email on supabase
    const supaUpdate = await supabase.auth.admin.updateUserById(ctx.session.id, { email: input.email })
    if (supaUpdate.error) {
      console.log(supaUpdate.error)
      throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Error updating email with supabase" })
    }

    //update user table in DB
    const dbUpdate = await prisma?.user.update({
      where: {
        id: ctx.session.id
      },
      data: {
        email: input.email
      }
    })

    // Checks dbUpdate and if failed reverts email in supabase and throws
    if (dbUpdate == undefined) {
      await supabase.auth.admin.updateUserById(ctx.session.id, { email: ctx.session.email })
      throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Unable to update email" })
    }

    return dbUpdate
  })
})
