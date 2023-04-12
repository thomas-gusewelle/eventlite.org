import { userRouter } from "./user";
import { roleRouter } from "./role";
import { locationRouter } from "./locations";
import { eventsRouter } from "./events";
import { scheduleRouter } from "./schedule";
import { avalibiltyRouter } from "./availability";
import { createAccountRouter } from "./createAccount";
import { organizationRouter } from "./organization";
import { feedbackRouter } from "./feedback";
import { AdminRouter } from "./admin";
import { createTRPCRouter } from "./context";
import { userSettingsRouter } from "./userSettings";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  user: userRouter,
  role: roleRouter,
  locations: locationRouter,
  events: eventsRouter,
  schedule: scheduleRouter,
  avalibility: avalibiltyRouter,
  createAccount: createAccountRouter,
  organization: organizationRouter,
  feedback: feedbackRouter,
  admin: AdminRouter,
  userSettings: userSettingsRouter
});


// export type definition of API
export type AppRouter = typeof appRouter;
