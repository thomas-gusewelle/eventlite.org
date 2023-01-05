// src/server/router/index.ts
import { createRouter } from "./context";
import superjson from "superjson";

import { userRouter } from "./user";
import { roleRouter } from "./role";
import { locationRouter } from "./locations";
import { eventsRouter } from "./events";
import { scheduleRouter } from "./schedule";
import { avalibiltyRouter } from "./availability";
import { createAccountRouter } from "./createAccount";
import { organizationRouter } from "./organization";

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("user.", userRouter)
  .merge("role.", roleRouter)
  .merge("locations.", locationRouter)
  .merge("events.", eventsRouter)
  .merge("schedule.", scheduleRouter)
  .merge("avalibility.", avalibiltyRouter)
  .merge("createAccount.", createAccountRouter)
  .merge("organization.", organizationRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
