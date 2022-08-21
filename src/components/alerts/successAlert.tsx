import { Dispatch, SetStateAction, useState } from "react";
import { MdOutlineCheckCircleOutline } from "react-icons/md";

export const SuccdssAlert: React.FC<{
  error: { state: boolean; message: string };
  setState: Dispatch<
    SetStateAction<{
      state: boolean;
      message: string;
    }>
  >;
}> = ({ error, setState }) => {
  const [flag, setFlag] = useState(true);

  if (error.state == true) {
    setTimeout(() => {
      setState({ state: false, message: "" });
    }, 3500);
  }
  return (
    <div className='absolute right-0 top-6 z-50 text-green-600'>
      {/* Code block starts */}

      <div className='flex items-center justify-center px-4 sm:px-0 '>
        <div
          id='alert'
          className={
            flag
              ? "flex-col top-0 mt-12 mb-8 justify-between rounded-md border border-green-500 bg-green-200  py-4 px-4 shadow  transition duration-150 ease-in-out md:flex "
              : "translate-hidden top-0 mt-12 mb-8 items-center justify-between rounded-md border border-green-500  bg-green-200 py-4 px-4  shadow transition duration-150 ease-in-out md:flex lg:w-10/12"
          }>
          <div className='items-center flex'>
            <div className='flex items-end'>
              <div className='mr-2 mt-0.5 text-green-600 sm:mt-0'>
                <MdOutlineCheckCircleOutline size={24} />
              </div>
              <p className='mr-2 text-base font-bold '>Success</p>
            </div>
            {/* <div className='mr-2 hidden  h-1 w-1 rounded-full xl:block' /> */}
            <p className='text-base '>{error.message}</p>
          </div>
          <div className='mt-4 flex justify-end md:mt-0 md:pl-4'>
            <span
              onClick={() => setState({ state: false, message: "" })}
              className='cursor-pointer text-sm text-black'>
              Dismiss
            </span>
          </div>
        </div>
      </div>

      {/* Code block ends */}
      <style>
        {`
              .translate-show{
                  transform : translateY(0%);
              }
              .translate-hide{
                  transform : translateY(18vh);
              }
              `}
      </style>
    </div>
  );
};
