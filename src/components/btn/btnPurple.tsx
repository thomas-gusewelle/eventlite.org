import { ReactNode } from "react";
import { CircularProgressSmall } from "../circularProgress";

export const BtnPurple = ({
  children,
  func,
  type = "button",
  fullWidth = false,
  isLoading = false,
  disabled = false,
}: {
  isLoading?: boolean;
  children: ReactNode;
  func?: () => void;
  type?: "button" | "submit" | "reset";
  fullWidth?: boolean;
  disabled?: boolean;
}) => {
  return (
    <button
      disabled={disabled}
      type={type}
      tabIndex={1}
      className={`flex w-full justify-center rounded-lg border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2  sm:text-sm ${fullWidth ? "" : "sm:w-auto"
        }`}
      onClick={func}>
      {isLoading ? <CircularProgressSmall /> : children}
    </button>
  );
};
