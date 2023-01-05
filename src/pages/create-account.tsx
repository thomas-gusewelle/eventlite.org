import {
  Dispatch,
  FormEvent,
  SetStateAction,
  useContext,
  useState,
} from "react";
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
import { trpc } from "../utils/trpc";
import { AlertContext } from "../providers/alertProvider";
import { supabaseClient } from "@supabase/auth-helpers-nextjs";
import Link from "next/link";

// TODO: create org search and find
const SignIn = () => {
  const router = useRouter();
  const { setError } = useContext(AlertContext);
  const [step, setStep] = useState(1);
  const methods = useForm<CreateAccountForm>();
  const createOrg = trpc.useMutation("organization.createOrg", {
    onError(error, variables, context) {
      setError({
        state: true,
        message: `Error creating organization. Message: ${error.message}`,
      });
    },
  });
  const createUser = trpc.useMutation("user.addUser", {
    onError(error, variables, context) {
      setError({
        state: true,
        message: `Error creating user. Message: ${error.message}`,
      });
    },
  });

  const submit = methods.handleSubmit(async (data) => {
    console.log(data);

    //if no OrgID == create organization
    if (data.orgID == undefined || data?.orgID == "") {
      const user = await supabaseClient.auth.signUp({
        email: data.email,
        password: data.password,
      });

      console.log(user);

      if (user.user?.id == undefined || user.error) {
        console.log("here");
        setError({ state: true, message: "Unable to create user" });
        return;
      }
      createOrg.mutate(
        {
          id: user.user?.id,
          orgName: data.orgName,
          orgPhoneNumber: data.orgPhoneNumber,
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phoneNumber: data.phoneNumber,
          status: "ADMIN",
        },
        {
          onSuccess(retunredData, variables, context) {
            router.push("/dashboard");
          },
        }
      );
    }
  });
  return (
    <div className='h-screen w-full bg-gradient-to-tl from-indigo-500 to-indigo-900 py-16 px-4'>
      <h2 className='mb-12 text-center text-4xl font-bold text-white'>
        Welcome to Themelios Schedule
      </h2>
      <StepCounter signUpState={step} totalNum={2} />
      <div className='flex flex-col items-center justify-center'>
        <div className='mb-3 w-full rounded bg-white p-10 shadow md:w-1/2 lg:w-1/3'>
          <FormProvider {...methods}>
            <form onSubmit={submit}>
              <Steps step={step} setStep={setStep} />
              {step == 2 && (
                <div className='mt-6 flex justify-center gap-6'>
                  <BtnNeutral
                    fullWidth={true}
                    func={() => {
                      setStep(1);
                    }}>
                    Back
                  </BtnNeutral>
                  <BtnPurple fullWidth={true} type='submit'>
                    Submit
                  </BtnPurple>
                </div>
              )}
            </form>
          </FormProvider>
        </div>
      </div>
      <p className='text-center text-white'>
        Already have an account?{" "}
        <Link href={"/signin"}>
          <a className='underline'>Sign In</a>
        </Link>
      </p>
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
      return <CreateOrganization setStep={setStep} />;
    case 2:
      return <YourInfoStep setStep={setStep} />;

    default:
      return <div></div>;
  }
};
