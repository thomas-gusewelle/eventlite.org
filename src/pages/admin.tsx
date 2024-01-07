import { createClient } from "../utils/supabase/server";
import { GetServerSidePropsContext } from "next";
import { CircularProgress } from "../components/circularProgress";
import { sidebar } from "../components/layout/sidebar";

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const supabase = createClient(context);
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
    <div className="mt-12 flex justify-center">
      <CircularProgress />
    </div>
  );
};

AdminPage.getLayout = sidebar;
export default AdminPage;
