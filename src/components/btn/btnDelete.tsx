export const BtnDelete: React.FC<{ onClick?: () => void; type?: any }> = ({
  onClick,
  type = "button",
}) => {
  return (
    <button
      type={type}
      className=' inline-flex w-full justify-center rounded-md border border-red-400 bg-red-300 px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm'
      onClick={onClick}>
      Delete
    </button>
  );
};
