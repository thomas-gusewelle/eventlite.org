import type { NextPage } from "next";
import Link from "next/link";
import Head from "next/head";
import { getUser, supabaseClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/router";
import { navbar } from "../components/marketing-site/layout/navbar";

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

const Home = () => {
  return (
    <>
      <section id='hero-section' className='container mx-auto flex'></section>
    </>
  );
};

Home.getLayout = navbar;

export default Home;
