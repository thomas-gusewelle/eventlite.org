import { z } from "zod";
import { createRouter } from "./context";

export const eventsRouter = createRouter().mutation("createEvents", {
  input: z.object({
    name: z.string(),
    eventDate: 
  }),
  async resolve({ ctx }) {
    const org = await prisma?.user.findFirst({
      where: { id: ctx.session?.user.id },
      select: { organizationId: true },
    });

    return await prisma?.event.createMany({
      data: 
    });
  },
});
