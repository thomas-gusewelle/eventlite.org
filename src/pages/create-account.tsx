import { Dispatch, FormEvent, SetStateAction, useState } from "react";
import { useRouter } from "next/router";
import { OrganizationSelect } from "../components/create-account-flow/steps/organizationSelect";
import StepCounter from "../components/create-account-flow/components/stepCounter";
import { FormProvider, useForm } from "react-hook-form";
import { CreateAccountForm } from "../../types/createAccountFormValues";
import { FindOrganization } from "../components/create-account-flow/steps/findOrganization";
import { CreateOrganization } from "../components/create-account-flow/steps/createOrganization";
import { YourInfoStep } from "../components/create-account-flow/steps/yourInfo";
import { BtnNeutral } from "../components/btn/btnNeutral";
import { BtnPurple } from "../components/btn/btnPurple";
import { CardHeader } from "../components/create-account-flow/components/cardHeader";

// TODO: create org search and find
const SignIn = () => {
  const router = useRouter();
  const [step, setStep] = useState(3);
  const methods = useForm<CreateAccountForm>();

  const submit = methods.handleSubmit((data) => {
    console.log(data);
  });
  return (
    <div className='h-screen w-full bg-gradient-to-tl from-indigo-500 to-indigo-900 py-16 px-4'>
      <StepCounter signUpState={step} totalNum={3} />
      <div className='flex flex-col items-center justify-center'>
        <div className='mt-16 w-full rounded bg-white p-10 shadow md:w-1/2 lg:w-1/3'>
          <FormProvider {...methods}>
            <form onSubmit={submit}>
              <Steps step={step} setStep={setStep} />
              {step == 3 && (
                <div className='mt-6 flex justify-center gap-6'>
                  <BtnNeutral
                    func={() => {
                      setStep(2);
                    }}>
                    Back
                  </BtnNeutral>
                  <BtnPurple type='submit'>Submit</BtnPurple>
                </div>
              )}
            </form>
          </FormProvider>
        </div>
      </div>
    </div>
  );
};

export default SignIn;

const Steps = ({
  step,
  setStep,
}: {
  step: number;
  setStep: Dispatch<SetStateAction<number>>;
}) => {
  const [orgSetting, setOrgSetting] = useState<"FIND" | "CREATE" | null>(null);
  switch (step) {
    case 1:
      return (
        <OrganizationSelect setStep={setStep} setOrgSetting={setOrgSetting} />
      );
    case 2:
      if (orgSetting == "FIND") return <FindOrganization setStep={setStep} />;
      else if (orgSetting == "CREATE")
        return <CreateOrganization setStep={setStep} />;
      else
        return (
          <div>
            <CardHeader>Error!</CardHeader>
          </div>
        );
    case 3:
      return <YourInfoStep setStep={setStep} />;
    default:
      return <div></div>;
  }
};
