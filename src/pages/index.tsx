import type { NextPage } from "next";
import Link from "next/link";
import Head from "next/head";
import { getUser, supabaseClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/router";
import { navbar } from "../components/marketing-site/layout/navbar";
import { BtnPurple } from "../components/btn/btnPurple";
import { BtnNeutral } from "../components/btn/btnNeutral";

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
      <section
        id='hero-section'
        className='container mx-auto grid px-8 lg:grid-cols-2'>
        <div>
          <div id='hero-text-container' className='mt-6  text-4xl font-bold'>
            <h1>Volunteer scheduling</h1>
            <h1 className='text-indigo-600'>organized and simple</h1>
          </div>
          <p className='my-3 md:text-center'>
            Higher quality, lower latency, creator focused video calls. Ping is
            the best way to bring your guests into OBS.
          </p>

          <BtnPurple fullWidth={true}>Join the Beta Now</BtnPurple>
        </div>

        <div></div>
      </section>
    </>
  );
};

Home.getLayout = navbar;

export default Home;
