import { Dispatch, SetStateAction, useState } from "react";
export const ErrorAlert: React.FC<{
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
    <div className='absolute right-0 top-6 z-50 text-red-600'>
      {/* Code block starts */}

      <div className='flex items-center justify-center px-4 sm:px-0 '>
        <div
          id='alert'
          className={
            flag
              ? "border-red-500 border lg:w-10/12 transition duration-150 ease-in-out bg-red-200 shadow rounded-md  md:flex justify-between items-center  top-0 mt-12 mb-8 py-4 px-4 "
              : "border-red-500 border lg:w-10/12 transition duration-150 ease-in-out bg-red-200 shadow rounded-md  md:flex justify-between items-center  top-0 mt-12 mb-8 py-4 px-4 translate-hidden"
          }>
          <div className='sm:flex items-center'>
            <div className='flex items-end'>
              <div className='mr-2 mt-0.5 sm:mt-0 text-red-600'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  viewBox='0 0 24 24'
                  width={22}
                  height={22}
                  fill='currentColor'>
                  <path
                    className='heroicon-ui'
                    d='M12 2a10 10 0 1 1 0 20 10 10 0 0 1 0-20zm0 2a8 8 0 1 0 0 16 8 8 0 0 0 0-16zm0 9a1 1 0 0 1-1-1V8a1 1 0 0 1 2 0v4a1 1 0 0 1-1 1zm0 4a1 1 0 1 1 0-2 1 1 0 0 1 0 2z'
                  />
                </svg>
              </div>
              <p className='mr-2 text-base font-bold '>Error</p>
            </div>
            <div className='h-1 w-1  rounded-full mr-2 hidden xl:block' />
            <p className='text-base '>{error.message}</p>
          </div>
          <div className='flex justify-end mt-4 md:mt-0 md:pl-4 lg:pl-0'>
            <span
              onClick={() => setState({ state: false, message: "" })}
              className='text-sm cursor-pointer text-black'>
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
