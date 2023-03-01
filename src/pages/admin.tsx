import { useRouter } from "next/router";
import { useEffect } from "react";
import { CircularProgress } from "../components/circularProgress";
import { AdminLayout } from "../components/layout/admin";
import { sidebar } from "../components/layout/sidebar";

const AdminPage = () => {
  const router = useRouter();

  useEffect(() => {
    router.push("/admin/beta");
  }, [router]);
  return (
    <div className='mt-12 flex justify-center'>
      <CircularProgress />
    </div>
  );
};

AdminPage.getLayout = sidebar;
export default AdminPage;
