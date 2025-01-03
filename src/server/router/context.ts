// src/server/router/context.ts
import { type CreateNextContextOptions } from "@trpc/server/adapters/next";
import { prisma } from "../db/client";
import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { createApiClient } from "../../utils/supabase/server";

/**
 * This is the actual context you will use in your router. It will be used to process every request
 * that goes through your tRPC endpoint.
 *
 * @see https://trpc.io/docs/context
 */
export const createTRPCContext = async (opts: CreateNextContextOptions) => {
  const { req, res } = opts;

  const supabaseServer = createApiClient(req, res);
  const { data } = await supabaseServer.auth.getSession();

  // make session nullable so typing overrides isn't hellish

  return { session: data.session, prisma, req, res };
};

/**
 * 2. INITIALIZATION
 *
 * This is where the tRPC API is initialized, connecting the context and transformer.
 */

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape }) {
    return shape;
  },
});

/**
 * 3. ROUTER & PROCEDURE (THE IMPORTANT BIT)
 *
 * These are the pieces you use to build your tRPC API. You should import these a lot in the
 * "/src/server/api/routers" directory.
 */

/**
 * This is how you create new routers and sub-routers in your tRPC API.
 *
 * @see https://trpc.io/docs/router
 */
export const createTRPCRouter = t.router;

/**
 * Public (unauthenticated) procedure
 *
 * This is the base piece you use to build new queries and mutations on your tRPC API. It does not
 * guarantee that a user querying is authorized, but you can still access user session data if they
 * are logged in.
 */
export const publicProcedure = t.procedure;

/** Reusable middleware that enforces users are logged in before running the procedure. */
const enforceUserIsAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.session || !ctx.session.user.id) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({
    ctx: {
      // infers the `session` as non-nullable
      session: ctx.session,
    },
  });
});

/**
 * Protected (authenticated) procedure
 *
 * If you want a query or mutation to ONLY be accessible to logged in users, use this. It verifies
 * the session is valid and guarantees `ctx.session.user` is not null.
 *
 * @see https://trpc.io/docs/procedures
 */
export const loggedInProcedure = t.procedure.use(enforceUserIsAuthed);

const enforeIsAdmin = t.middleware(async ({ ctx, next }) => {
  if (!ctx.session || !ctx.session.user.id) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  const user = await prisma.user.findFirst({
    where: {
      id: ctx?.session?.user.id,
    },
  });

  if (user == undefined || user.status != "ADMIN") {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({
    ctx: {
      session: ctx.session,
    },
  });
});

export const adminProcedure = t.procedure.use(enforeIsAdmin);

const enforeIsOrgAdmin = t.middleware(async ({ ctx, next }) => {
  if (!ctx.session || !ctx.session.user.id) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  const user = await prisma.user.findFirst({
    where: {
      id: ctx?.session?.user.id,
    },
  });

  if (user == undefined || user.status != "ADMIN") {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  const org = await prisma.organization.findUnique({
    where: {
      id: user.organizationId ?? undefined,
    },
  });

  if (!org) {
    throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
  }
  return next({
    ctx: {
      session: ctx.session,
      org: org,
    },
  });
});

export const adminOrgProcedure = t.procedure.use(enforeIsOrgAdmin);

const enforceIsEventLiteAdmin = t.middleware(async ({ ctx, next }) => {
  if (!ctx.session || !ctx.session.user.id) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  if (ctx.session.user.email != "tgusewelle@eventlite.org") {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next();
});

export const elAdminProcedure = t.procedure.use(enforceIsEventLiteAdmin);
