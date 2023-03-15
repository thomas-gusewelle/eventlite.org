// src/pages/_app.tsx
// import { withTRPC } from "@trpc/next";
// import type { AppRouter } from "../server/router";

// import superjson from "superjson";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import {
  createBrowserSupabaseClient,
  Session,
} from "@supabase/auth-helpers-nextjs";
import "../styles/globals.css";
import { NextPage } from "next";
import { ReactNode, useState } from "react";
import { AppProps } from "next/app";
import { UserProvider as LoginProvider } from "../providers/userProvider";
import Head from "next/head";

export type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactNode) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
  initialSession: Session;
};

const MyApp = ({ Component, pageProps }: AppPropsWithLayout) => {
  const getLayout = Component.getLayout ?? ((page: ReactNode) => page);
  const layout = getLayout(<Component {...pageProps} />);
  const [supabaseClient] = useState(() => createBrowserSupabaseClient());
  return (
    <>
      <Head>
        <title>EventLite.org</title>
      </Head>
      <SessionContextProvider
        supabaseClient={supabaseClient}
        initialSession={pageProps.initialSession}>
        <LoginProvider>{layout}</LoginProvider>
      </SessionContextProvider>
    </>);
};

import { api } from "../server/utils/api"

export default api.withTRPC(MyApp)