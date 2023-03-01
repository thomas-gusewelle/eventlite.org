import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
  PreviewData,
} from "next";
import { useRouter } from "next/router";
import { NextRequest, NextResponse } from "next/server";
import { ParsedUrlQuery } from "querystring";
import { useEffect } from "react";
import { CircularProgress } from "../components/circularProgress";
import { AdminLayout } from "../components/layout/admin";
import { sidebar } from "../components/layout/sidebar";

export async function getServerSideProps(
  context:
    | GetServerSidePropsContext<ParsedUrlQuery, PreviewData>
    | {
        req: NextApiRequest;
        res: NextApiResponse;
      }
) {
  const supabase = createServerSupabaseClient(context);
  const user = await supabase.auth.getUser();

  if (user.data.user?.email != "tgusewelle@eventlite.org") {
    return {
      redirect: {
        destination: "/dashboard",
      },
    };
  }
  return {
    redirect: {
      destination: "/admin/beta",
    },
  };
}

const AdminPage = () => {
  return (
    <div className='mt-12 flex justify-center'>
      <CircularProgress />
    </div>
  );
};

AdminPage.getLayout = sidebar;
export default AdminPage;
