import { ReactElement, ReactNode } from "react";

const LoginFlow = ({ children }: { children: any }) => {
  return (
    <div className='h-screen w-full bg-gradient-to-tl from-indigo-500 to-indigo-900 py-16 px-4'>
      {children}
    </div>
  );
};

export const loginFlowLayout = function getLayout(page: ReactElement) {
  return <LoginFlow>{page}</LoginFlow>;
};
