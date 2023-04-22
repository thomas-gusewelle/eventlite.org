
import { ReactNode } from "react";
import { CircularProgressSmall } from "../circularProgress";

export const BtnRed = ({
  children,
  onClick,
  type = "button",
  fullWidth = false,
  isLoading = false,
  disabled = false,
}: {
  isLoading?: boolean;
  children: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  fullWidth?: boolean;
  disabled?: boolean;
}) => {
  return (
    <button
      disabled={disabled}
      type={type}
      tabIndex={1}
      className={`
 inline-flex w-full justify-center rounded-md border border-red-400 bg-red-300 px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2  sm:text-sm ${fullWidth ? "" : "sm:w-auto"}`}
      onClick={onClick}>
      {isLoading ? <CircularProgressSmall /> : children}
    </button>
  );
};
