import { UserForm } from "../../components/form/userForm";
import SidebarLayout from "../../components/layout/sidebar";
import { useSession } from "next-auth/react";

const AddUser = () => {
  const session = useSession();

  if (session.status == "unauthenticated") {
    return <div></div>;
  }

  return (
    <SidebarLayout>
      <UserForm />;
    </SidebarLayout>
  );
};

export default AddUser;
