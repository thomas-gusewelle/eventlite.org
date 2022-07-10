import { UserForm } from "../../components/form/userForm";
import SidebarLayout from "../../components/layout/sidebar";
import { useUser } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";

const AddUser = () => {
  const router = useRouter();
  const user = useUser();

  if (!user) {
    router.push("/signin");
    return <div></div>;
  }

  return (
    <SidebarLayout>
      <UserForm />;
    </SidebarLayout>
  );
};

export default AddUser;
