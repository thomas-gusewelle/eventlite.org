import { MdAdd } from "react-icons/md";

export const BtnAdd = () => {
  return (
    <div className='relative inline-block text-left md:mr-6'>
      <div className='inline-flex justify-center w-full border border-gray-300 shadow-sm p-2 rounded-full bg-indigo-700 text-sm font-medium text-gray-700 hover:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500'>
        <MdAdd color='white' size={25} aria-hidden='true' />
      </div>
    </div>
  );
};
