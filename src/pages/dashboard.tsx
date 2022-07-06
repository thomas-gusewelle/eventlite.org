import { useSession } from "next-auth/react";
import SidebarLayout from "../components/layout/sidebar";
import { trpc } from "../utils/trpc";
import { useRouter } from "next/router";

const Dashboard = () => {
  const user = useSession();
  const router = useRouter();

  if (user.status == "unauthenticated") {
    router.push("/");
    return <div></div>;
  }

  return (
    <SidebarLayout>
      <div></div>
    </SidebarLayout>
  );
};

export default Dashboard;
