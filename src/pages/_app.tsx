import { api } from "../server/utils/api"
import { ReactNode } from "react";
import "../styles/globals.css";
import "react-datepicker/dist/react-datepicker.css"
import { NextPage } from "next";
import { AppProps } from "next/app";
import { UserProvider as LoginProvider } from "../providers/userProvider";
import Head from "next/head";

export type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactNode) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const MyApp = ({ Component, pageProps }: AppPropsWithLayout) => {
  const getLayout = Component.getLayout ?? ((page: ReactNode) => page);
  const layout = getLayout(<Component {...pageProps} />);
  return (
    <>
      <Head>
        <title>EventLite.org</title>
      </Head>
        <LoginProvider>{layout}</LoginProvider>
    </>);
};


export default api.withTRPC(MyApp)
