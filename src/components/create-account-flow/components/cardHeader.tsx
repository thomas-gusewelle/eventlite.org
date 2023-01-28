import { ReactNode } from "react";

export const CardHeader = ({ children }: { children: ReactNode }) => {
  return (
    <h2
      tabIndex={0}
      className='mb-3 text-center text-2xl font-extrabold leading-6 text-gray-800'>
      {children}
    </h2>
  );
};
