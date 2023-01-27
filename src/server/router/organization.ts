import { UserStatus } from "@prisma/client";
import { createClient } from "@supabase/supabase-js";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createRouter } from "./context";

export const organizationRouter = createRouter()
  .mutation("createOrg", {
    input: z.object({
      id: z.string().uuid(),
      firstName: z.string(),
      lastName: z.string(),
      email: z.string().email(),
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
      console.log(input);
      const org = await prisma?.organization.create({
        data: {
          name: input.orgName,
          phone_number: input.orgPhoneNumber,
        },
      });

      const user = await prisma?.user.create({
        data: {
          id: input.id,
          firstName: input.firstName,
          lastName: input.lastName,
          email: input.email,
          phoneNumber: input.phoneNumber,
          organizationId: org?.id,
          status: input.status as UserStatus,
          UserSettings: {
            create: {},
          },
        },
      });
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
  })
  .mutation("deleteOrg", {
    async resolve({ ctx }) {
      const org = await prisma?.user.findFirst({
        where: {
          id: ctx.data?.user?.id,
        },
        select: {
          organizationId: true,
        },
      });

      const users = await prisma?.user.findMany({
        where: {
          organizationId: org?.organizationId,
        },
      });

      const Deletedusers = await prisma?.user.deleteMany({
        where: {
          organizationId: org?.organizationId,
        },
      });

      const organization = await prisma?.organization.delete({
        where: {
          id: org?.organizationId ?? "",
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

      return organization;
    },
  });
