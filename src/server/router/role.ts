import { truncate } from "fs";
import { createRouter } from "./context";

export const roleRouter = createRouter().query("getRolesByOrganization", {
  async resolve({ ctx }) {
    const org = await prisma?.user.findFirst({
      select: {
        organizationId: true,
      },
      where: {
        id: ctx.session?.user.id,
      },
    });
    return await prisma?.role.findMany({
      where: { organizationId: org?.organizationId },
    });
  },
});
