import { ButtonHTMLAttributes } from "react";

export const BtnSave: React.FC<{
  onClick?: () => void;
  type?: "button" | "reset" | "submit";
}> = ({ onClick, type = "button" }) => {
  return (
    <button
      type={type}
      className='flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm'
      onClick={onClick}>
      Save
    </button>
  );
};
