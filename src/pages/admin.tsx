import { createClient } from "../utils/supabase/server";
import {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
  PreviewData,
} from "next";
import { ParsedUrlQuery } from "querystring";
import { CircularProgress } from "../components/circularProgress";
import { sidebar } from "../components/layout/sidebar";

export async function getServerSideProps(
  context:
    | GetServerSidePropsContext<ParsedUrlQuery, PreviewData>
    | {
      req: NextApiRequest;
      res: NextApiResponse;
    }
) {
  const supabase = createClient(cookeies());
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
function cookeies(): import("next/dist/compiled/@edge-runtime/cookies").RequestCookies | import("next/dist/server/app-render").ReadonlyRequestCookies {
  throw new Error("Function not implemented.");
}

