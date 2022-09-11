import { createRouter } from "./context";
import { z } from "zod";

import { UserStatus } from "@prisma/client";
import { TRPCError } from "@trpc/server";

export const avalibiltyRouter = createRouter();
