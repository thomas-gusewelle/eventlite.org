import { User, UserSettings } from "@prisma/client";
import { createContext, ReactNode, useEffect, useState } from "react";
import { api } from "../server/utils/api"
import { createClient } from "../utils/supabase/client";

export const UserContext = createContext<
  | (User & {
    UserSettings: UserSettings | null;
  })
  | null
  | undefined
>(null);

// type UserProviderData =
//   | (User & {
//     UserSettings: UserSettings | null;
//   })
//   | null
//   | undefined;

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const query = api.user.getUser.useQuery(undefined);
  const supabase = createClient();

  useEffect(() => {
    const status = supabase.auth.onAuthStateChange((event, session) => {
      if (event == "SIGNED_OUT") {
        query.refetch()
        // setData(null)
      } else if (session) {
        query.refetch();
      }
    })
    return () => {
      status.data.subscription.unsubscribe();
    }
  }, [])
  return <UserContext.Provider value={query.data ?? undefined}>{children}</UserContext.Provider>;
};
