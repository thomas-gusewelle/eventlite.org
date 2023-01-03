import { z } from "zod";
import { createRouter } from "./context";

export const createAccountRouter = createRouter().query("searchForOrg", {
  input: z.string(),
  async resolve({ input }) {
    return await prisma?.organization.findMany({
      where: {
        name: {
          search: `%${input.replace(/ /g, " | ")}%`,
        },
      },
    });
  },
});
