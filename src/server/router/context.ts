// src/server/router/context.ts
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import * as trpc from "@trpc/server";
import * as trpcNext from "@trpc/server/adapters/next";

import { prisma } from "../db/client";

export const createContext = async (
  opts: trpcNext.CreateNextContextOptions
) => {
  const req = opts.req;
  const res = opts.res;
  // console.log("req & res", req, res);

  const supabaseServer = createServerSupabaseClient({ req, res });
  const { data, error } = await supabaseServer.auth.getUser();

  return {
    req,
    res,
    data,
    prisma,
  };
};

type Context = trpc.inferAsyncReturnType<typeof createContext>;

export const createRouter = () => trpc.router<Context>();
