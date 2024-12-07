import { FormEvent, ReactNode } from "react";

export const BtnNeutral: React.FC<{
  children: ReactNode;
  func?: () => void;
  fullWidth?: boolean;
}> = ({ children, func, fullWidth = false }) => {
  return (
    <button
      type="button"
      onClick={func}
      className={`200ms flex w-full items-center justify-center rounded-lg bg-gray-100 px-4 py-2 text-black transition-all ease-in-out hover:bg-gray-200 ${
        fullWidth ? "" : "sm:w-auto"
      }`}>
      {children}
    </button>
  );
};
