import { ReactElement, ReactNode } from "react";

const LoginFlow = ({ children }: { children: any }) => {
  return (
    <div className='max-h-full min-h-screen w-full bg-gradient-to-tl from-indigo-500 to-indigo-900 py-16 px-4'>
      <div className='flex flex-col items-center justify-center'>
        {children}
      </div>
    </div>
  );
};

export const loginFlowLayout = function getLayout(page: ReactElement) {
  return <LoginFlow>{page}</LoginFlow>;
};
