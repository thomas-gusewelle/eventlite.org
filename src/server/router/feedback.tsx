import { z } from "zod";
import { createRouter } from "./context";

export const feedbackRouter = createRouter().mutation("submitReport", {
  input: z.object({
    type: z.union([
      z.literal("BUG"),
      z.literal("FEEDBACK"),
      z.literal("OTHER"),
    ]),
    text: z.string().min(1),
  }),
  async resolve({ ctx, input }) {},
});
