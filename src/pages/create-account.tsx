import { FormEvent, useState } from "react";
import { useRouter } from "next/router";
import { supabaseClient } from "@supabase/auth-helpers-nextjs";
import { OrganizationSelect } from "../components/create-account-flow/organizationSelect";

const SignIn = () => {
  const router = useRouter();

  return (
    <div className='h-screen w-full bg-gradient-to-tl from-indigo-500 to-indigo-900 py-16 px-4'>
      <div className='flex flex-col items-center justify-center'>
        <div className='mt-16 w-full rounded bg-white p-10 shadow md:w-1/2 lg:w-1/3'>
          <Steps />
        </div>
      </div>
    </div>
  );
};

export default SignIn;

const Steps = () => {
  const [step, setStep] = useState(1);
  const [orgSetting, setOrgSetting] = useState<"FIND" | "CREATE" | null>(null);
  switch (step) {
    case 1:
      return (
        <OrganizationSelect setStep={setStep} setOrgSetting={setOrgSetting} />
      );
    case 2:
      if (orgSetting == "FIND") return <div></div>;
      else if (orgSetting == "CREATE") return <div></div>;
    default:
      return <div></div>;
  }
};
