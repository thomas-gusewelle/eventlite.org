import { FormEvent, ReactNode } from "react";

export const BtnNeutral: React.FC<{
  children: ReactNode;
  func?: () => void;
}> = ({ children, func }) => {
  return (
    <button
      onClick={func}
      className='200ms flex w-full items-center justify-center rounded-lg bg-gray-100 px-4 py-2 transition-all ease-in-out hover:bg-gray-200 sm:w-auto'>
      {children}
    </button>
  );
};
