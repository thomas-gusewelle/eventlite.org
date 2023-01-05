export const BtnPurple = ({
  children,
  func,
  type = "button",
  fullWidth = false,
}: {
  children: any;
  func?: () => void;
  type?: "button" | "submit" | "reset";
  fullWidth?: boolean;
}) => {
  return (
    <button
      type={type}
      tabIndex={1}
      className={`flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2  sm:text-sm ${
        fullWidth ? "" : "sm:w-auto"
      }`}
      onClick={func}>
      {children}
    </button>
  );
};
