import { useRouter } from "next/router";
import { sidebar } from "../../../components/layout/sidebar";

const ViewProfile = ({ id }: { id: string }) => {
  return <div>{id}</div>;
};

const ViewProfilePage = () => {
  const router = useRouter();
  const { id } = router.query;

  if (!id || typeof id !== "string") {
    return <div>No Id Provided</div>;
  }

  return <ViewProfile id={id} />;
};

ViewProfilePage.getLayout = sidebar;

export default ViewProfilePage;
