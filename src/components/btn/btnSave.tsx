import { ButtonHTMLAttributes } from "react";

export const BtnSave: React.FC<{
  onClick?: () => void;
  type?: "button" | "reset" | "submit";
}> = ({ onClick, type = "button" }) => {
  return (
    <button
      type={type}
      className='w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm'
      onClick={onClick}>
      Save
    </button>
  );
};
