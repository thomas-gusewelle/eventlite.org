import { ReactElement } from "react";
import { AlertProvider } from "../../providers/alertProvider";
import { ErrorAlert } from "../alerts/errorAlert";

const LoginFlow = ({ children }: { children: any }) => {
  return (
    <AlertProvider>
      <ErrorAlert/>
      <div className="max-h-full min-h-screen w-full bg-gradient-to-tl from-indigo-500 to-indigo-900 py-16 px-4">
        <div className="flex flex-col items-center justify-center">
          {children}
        </div>
      </div>
    </AlertProvider>
  );
};

export const loginFlowLayout = function getLayout(page: ReactElement) {
  return <LoginFlow>{page}</LoginFlow>;
};
