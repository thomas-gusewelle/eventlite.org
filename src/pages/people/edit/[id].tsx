import { useRouter } from "next/router";
import SidebarLayout from "../../../components/layout/sidebar";

const EditUser = () => {
  const router = useRouter();
  const { id } = router.query;
  return (
    <SidebarLayout>
      <div>{id}</div>
    </SidebarLayout>
  );
};

export default EditUser;
