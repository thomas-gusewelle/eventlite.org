import { createRouter } from "./context";

export const roleRouter = createRouter().query("getRoles", {
  async resolve({ ctx }) {
    return await prisma?.role.findMany();
  },
});
