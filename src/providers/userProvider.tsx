import { User, UserSettings } from "@prisma/client";
import { useUser } from "@supabase/auth-helpers-react";
import { createContext, ReactNode, useEffect, useState } from "react";
import { trpc } from "../utils/trpc";

export const UserContext = createContext<
  | (User & {
      UserSettings: UserSettings | null;
    })
  | null
  | undefined
>(null);

type UserProviderData =
  | (User & {
      UserSettings: UserSettings | null;
    })
  | null
  | undefined;

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState<UserProviderData>(undefined);
  const user = useUser();
  const query = trpc.useQuery(["user.getUser"], {
    enabled: !!user,
    onSuccess: (data) => setData(data),
  });

  useEffect(() => {
    if (user != null) {
    } else {
      setData(undefined);
    }
  }, [user]);

  // supabaseClient.auth.onAuthStateChange((event, session) => {
  //   if (event == "SIGNED_IN") {
  //     query.refetch();
  //   }
  // });

  return <UserContext.Provider value={data}>{children}</UserContext.Provider>;
};
