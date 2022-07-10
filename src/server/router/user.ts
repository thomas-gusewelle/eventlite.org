import { createRouter } from "./context";
import { z } from "zod";

export const userRouter = createRouter()
  .query("getUser", {
    async resolve({ ctx }) {
      return await prisma?.user.findFirst({
        where: {
          id: ctx.session?.user.id,
        },
      });
    },
  })
  .query("getUsersByOrganization", {
    async resolve({ ctx }) {
      const orgID = await prisma?.user.findFirst({
        where: { id: ctx.session?.user.id },
        select: { organizationId: true },
      });

      return await prisma?.user.findMany({
        where: {
          organizationId: orgID?.organizationId,
        },
        include: {
          roles: true,
        },
      });
    },
  });
