import { sidebar } from "../components/layout/sidebar";
import { trpc } from "../utils/trpc";
import { useRouter } from "next/router";
import { useUser } from "@supabase/auth-helpers-react";
import { useContext } from "react";
import { AlertContext } from "../providers/alertProvider";

const Dashboard = () => {
  const user = useUser();
  const router = useRouter();
  const alertContext = useContext(AlertContext);

  if (!user) {
    router.push("/");
  }

  return (
    <div>
      <button
        onClick={() =>
          alertContext?.setError({
            state: true,
            message:
              "This is a test error. It is a long message that tells a lot about the error that is happening. But... Is it really helpful for the user.",
          })
        }>
        setError
      </button>
    </div>
  );
};

Dashboard.getLayout = sidebar;

export default Dashboard;
