import { z } from "zod";
import { createRouter } from "./context";

export const eventsRouter = createRouter().mutation("createEvents", {
  async resolve({ ctx }) {
    const org = await prisma?.user.findFirst({
      where: { id: ctx.session?.user.id },
      select: { organizationId: true },
    });

    return await prisma?.event.createMany({
      data: {},
    });
  },
});
