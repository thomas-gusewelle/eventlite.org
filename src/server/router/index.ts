// src/server/router/index.ts
import { createRouter } from "./context";
import superjson from "superjson";

import { userRouter } from "./user";
import { roleRouter } from "./role";

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("user.", userRouter)
  .merge("role.", roleRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
