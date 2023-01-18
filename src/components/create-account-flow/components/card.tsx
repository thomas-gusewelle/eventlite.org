import { ReactNode } from "react";

export const LoginCard = ({ children }: { children: ReactNode }) => {
  return (
    <div className='mb-3 w-full rounded bg-white p-10 shadow md:w-1/2 lg:w-1/3'>
      {children}
    </div>
  );
};
