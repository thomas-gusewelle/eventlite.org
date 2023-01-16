import type { NextPage } from "next";
import Link from "next/link";
import Head from "next/head";
import { getUser, supabaseClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/router";

export async function getServerSideProps(context: any) {
  const user = await getUser(context);

  if (user.user && !user.error) {
    return {
      redirect: {
        destination: "/dashboard",
      },
    };
  }
  return {
    props: {},
  };
}

const Home: NextPage = () => {
  const loggedUser = supabaseClient.auth.user();
  const router = useRouter();

  if (loggedUser) {
    router.push("/dashboard");
  }

  return (
    <>
      <Head>
        <title>Themelios Schedule</title>
        <meta
          name='description'
          content='Themelios Schedule - An app for volunteer scheduling'
        />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <div className='grid'>
        <div>Index</div>
        <Link href={"/dashboard"}>
          <a>Dashboard</a>
        </Link>
        <Link href={"/signin"}>
          <a>SignIn</a>
        </Link>
        <Link href={"/create-account"}>
          <a>Create Account</a>
        </Link>
      </div>
    </>
  );
};

export default Home;
