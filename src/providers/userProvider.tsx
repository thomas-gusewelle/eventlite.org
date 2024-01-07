import { User, UserSettings } from "@prisma/client";
import { useUser } from "@supabase/auth-helpers-react";
import { stat } from "fs";
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

type UserProviderData =
  | (User & {
    UserSettings: UserSettings | null;
  })
  | null
  | undefined;

// export const UserProvider = ({ children }: { children: ReactNode }) => {
//   const [data, setData] = useState<UserProviderData>(undefined);
//   const user = useUser()
//   console.log("User provider", user)
//   api.user.getUser.useQuery(undefined, {
//     enabled: !!user,
//     onSuccess: (data) => setData(data),
//   });
//
//
//   useEffect(() => {
//     if (user != null) {
//     } else {
//       setData(undefined);
//     }
//   }, [user]);

// supabaseClient.auth.onAuthStateChange((event, session) => {
//   if (event == "SIGNED_IN") {
//     query.refetch();
//   }
// });

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState<UserProviderData>(undefined);
  const supabase = createClient();
  const query = api.user.getUser.useQuery(undefined, {
    onSuccess: (data) => setData(data),
  });


  useEffect(() => {
    const status = supabase.auth.onAuthStateChange((event, session) => {
      if (event == "SIGNED_OUT") {
        setData(null)
      } else if (session) {
        query.refetch();
      }
    })
    return () => {
      status.data.subscription.unsubscribe();
    }
  }, [])
  return <UserContext.Provider value={data}>{children}</UserContext.Provider>;
};
