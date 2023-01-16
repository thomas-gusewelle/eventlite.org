export const BtnCancel: React.FC<{ onClick?: () => void; type?: any }> = ({
  onClick,
  type = "button",
}) => {
  return (
    <button
      type={type}
      className='flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm'
      onClick={onClick}>
      Cancel
    </button>
  );
};
