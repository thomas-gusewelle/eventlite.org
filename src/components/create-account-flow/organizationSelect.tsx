import { Dispatch, SetStateAction } from "react";
import { BtnPurple } from "../btn/btnPurple";

export const OrganizationSelect = ({
  setStep,
  setOrgSetting,
}: {
  setStep: Dispatch<SetStateAction<number>>;
  setOrgSetting: Dispatch<SetStateAction<"FIND" | "CREATE" | null>>;
}) => {
  return (
    <>
      <p
        tabIndex={0}
        className='text-center text-2xl font-extrabold leading-6 text-gray-800'>
        Do you need to create or find an organization?
      </p>
      <div className='mt-8 flex flex-col justify-center gap-6'>
        <div className='flex justify-center'>
          <BtnPurple
            func={() => {
              setStep(2);
              setOrgSetting("FIND");
            }}>
            Find Organization
          </BtnPurple>
        </div>
        <div className='flex justify-center'>
          <BtnPurple
            func={() => {
              setStep(2);
              setOrgSetting("CREATE");
            }}>
            Create Organization
          </BtnPurple>
        </div>
        {/* <button
          type='submit'
          aria-label='create my account'
          className='w-full rounded border bg-indigo-700 py-4 text-sm font-semibold leading-none text-white hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-700 focus:ring-offset-2'>
          Sign In
        </button> */}
      </div>
    </>
  );
};
