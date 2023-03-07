import { UserStatus } from "@prisma/client";
import { createClient } from "@supabase/supabase-js";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import sendMail from "../../emails";
import ConfirmEmailNew from "../../emails/accounts/ConfirmEmailNew";
import { createRouter } from "./context";

export const organizationRouter = createRouter()
  .mutation("createOrg", {
    input: z.object({
      firstName: z.string(),
      lastName: z.string(),
      email: z.string().email(),
      password: z.string(),
      phoneNumber: z.string().optional(),
      status: z.union([
        z.literal("ADMIN"),
        z.literal("INACTIVE"),
        z.literal("USER"),
      ]),
      orgName: z.string(),
      orgPhoneNumber: z.string().optional(),
    }),
    async resolve({ input }) {

      // Create signup link and send to user
      const _supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_PRIVATE!
      );

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

      //Create organization and user in org (not the login)
      const org = await prisma?.organization.create({
        data: {
          name: input.orgName,
          phone_number: input.orgPhoneNumber,
        },
      });

      const user = await prisma?.user.create({
        data: {
          id: data.user.id,
          firstName: input.firstName,
          lastName: input.lastName,
          email: input.email,
          phoneNumber: input.phoneNumber,
          organizationId: org?.id,
          hasLogin: true,
          status: input.status as UserStatus,
          UserSettings: {
            create: {},
          },
        },
      });

      try {
        await sendMail({ to: "tgusewelle@eventlite.org", subject: "Organization Created", text: `Awesome! Someone set up an organization. The name was ${org?.name}` })
      } catch (err) {

      }

      return { org: org, user: user };
    },
  })
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
  });
