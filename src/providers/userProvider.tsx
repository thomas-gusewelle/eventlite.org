import { User, UserSettings } from "@prisma/client";
import { createContext, ReactNode } from "react";
import { trpc } from "../utils/trpc";

export const UserContext = createContext<
  | (User & {
      UserSettings: UserSettings | null;
    })
  | null
  | undefined
>(null);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const { data, isLoading, error } = trpc.useQuery(["user.getUser"]);

  return <UserContext.Provider value={data}>{children}</UserContext.Provider>;
};
