import { createTRPCRouter } from "./context";
import { z } from "zod";
import { UserStatus } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { createClient } from "@supabase/supabase-js";
import { publicProcedure, adminProcedure } from "../router/context"
export const userRouter = createTRPCRouter({
  getUser: publicProcedure.query(async ({ ctx }) => {
    //if user does not have a seession return null
    if (ctx.session == null) {
      return null
    }
    const userInfo = await ctx.prisma?.user.findFirst({
      where: {
        id: ctx?.session?.user.id
      },
      include: {
        UserSettings: true,
      },
    });

    return userInfo;
  }),

  getUserByID: publicProcedure.input(z.string()).query(async ({ ctx, input }) => {

    return await ctx.prisma?.user.findFirst({
      where: {
        id: input,
      },
      include: { roles: true, UserSettings: true },
    });
  }),

  getUsersByOrganization: publicProcedure.query(async ({ ctx }) => {

    const orgID = await prisma?.user.findFirst({
      where: { id: ctx?.session?.user.id },
      select: { organizationId: true },
    });

    return await ctx.prisma?.user.findMany({
      orderBy: [{ lastName: "asc" }, { firstName: "asc" }],
      where: {
        organizationId: orgID?.organizationId,
      },
      include: {
        roles: true,
        InviteLink: true,
      },
    });
  }),

  getActiveUsersByOrganization: publicProcedure.query(async ({ ctx }) => {

    const orgID = await prisma?.user.findFirst({
      where: { id: ctx?.session?.user.id },
      select: { organizationId: true },
    });

    return await ctx.prisma?.user.findMany({
      orderBy: [{ lastName: "asc" }, { firstName: "asc" }],
      where: {
        organizationId: orgID?.organizationId,
        OR: [
          { status: "ADMIN" },
          { status: "USER" }
        ]
      },
      include: {
        roles: true,
        InviteLink: true,
      },
    });
  }),


  // mutation is here to facilate updating by logged in user
  // checks to see if user is MANAGER or ADMIN or the same user as is logged in
  // if not it throughs an error
  updateUserByID: publicProcedure.input(

    z.object({
      id: z.string(),
      firstName: z.string(),
      lastName: z.string(),
      email: z.string(),
      phone: z.string().optional(),
      role: z.object({ id: z.string(), name: z.string() }).array(),
      status: z.string(),
    }),
  ).mutation(async ({ ctx, input }) => {

    const user = await ctx.prisma?.user.findFirst({
      where: { id: ctx?.session?.user.id },
      select: { status: true },
    });
    if (ctx?.session?.user.id != input.id && user?.status != "ADMIN") {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Error. Not Approved.",
      });
    }

    const allRoles = await prisma?.role.findMany({});
    const disconnectRoles = allRoles?.filter((role) =>
      input.role.every((i) => i.id !== role.id)
    );

    return await prisma?.user.update({
      data: {
        firstName: input.firstName,
        lastName: input.lastName,
        email: input.email,
        phoneNumber: input.phone,
        roles: {
          connect: input.role.map((role) => ({
            id: role.id,
          })),
          disconnect: disconnectRoles?.map((role) => ({ id: role.id })),
        },
        status: input.status as UserStatus,
      },
      where: { id: input.id },
    });
  }),

  getAmdminCount: adminProcedure.query(async ({ ctx }) => {

    const orgID = await ctx.prisma?.user.findFirst({
      where: { id: ctx?.session?.user.id },
      select: { organizationId: true },
    });
    return await ctx.prisma?.user.count({
      where: { status: "ADMIN", organizationId: orgID?.organizationId },
    });
  }),


  addUser: adminProcedure.input(
    z.object({
      firstName: z.string(),
      lastName: z.string(),
      email: z.string(),
      phone: z.string().optional(),
      role: z.object({ id: z.string(), name: z.string() }).array(),
      status: z.string(),
    }),
  ).mutation(async ({ ctx, input }) => {

    const orgID = await ctx.prisma?.user.findFirst({
      where: { id: ctx?.session?.user.id },
      select: { organizationId: true },
    });

    return await ctx.prisma?.user.create({
      data: {
        firstName: input.firstName,
        lastName: input.lastName,
        email: input.email,
        phoneNumber: input.phone,
        organizationId: orgID?.organizationId,
        roles: {
          connect: input.role.map((role) => ({
            id: role.id,
          })),
        },
        status: input.status as UserStatus,
        UserSettings: {
          create: {},
        },
      },
    });
  }),


  // takes in user id and hasLogin -> deletes user and user login
  deleteUserById: adminProcedure.input(
    z.object({
      id: z.string(),
      hasLogin: z.boolean(),
    }),
  ).mutation(async ({ ctx, input }) => {

    const user = await ctx.prisma?.user.delete({
      where: { id: input.id },
    });

    if (user == undefined) {
      throw new TRPCError({ code: "NOT_FOUND", message: "User not found." });
    }

    if (input.hasLogin) {
      const _supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_PRIVATE!
      );

      const deleteUser = await _supabase.auth.admin.deleteUser(input.id);
      if (deleteUser.error) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Unable to delete user login",
        });
      }
      return deleteUser;
    }
  })

})

