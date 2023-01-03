export const BtnPurple = ({
  children,
  func,
  type = "button",
}: {
  children: any;
  func?: () => void;
  type?: "button" | "submit" | "reset";
}) => {
  return (
    <button
      type={type}
      tabIndex={1}
      className='flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm'
      onClick={func}>
      {children}
    </button>
  );
};
