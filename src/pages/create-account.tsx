import { Dispatch, SetStateAction, useContext, useState } from "react";
import { useRouter } from "next/router";
import { FormProvider, useForm } from "react-hook-form";
import { CreateAccountForm } from "../../types/createAccountFormValues";
import { CreateOrganization } from "../components/create-account-flow/steps/createOrganization";
import { YourInfoStep } from "../components/create-account-flow/steps/yourInfo";
import { BtnNeutral } from "../components/btn/btnNeutral";
import { BtnPurple } from "../components/btn/btnPurple";
import { trpc } from "../utils/trpc";
import { AlertContext } from "../providers/alertProvider";
import { LoginCard } from "../components/create-account-flow/components/card";
import { loginFlowLayout } from "../components/layout/login-flow-layout";
import { VerticalLogo } from "../components/create-account-flow/components/VerticalLogo";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

const SignIn = () => {
  const router = useRouter();
  const { setError } = useContext(AlertContext);
  const [step, setStep] = useState(1);
  const methods = useForm<CreateAccountForm>();
  const supabaseClient = useSupabaseClient();
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
    //if no OrgID == create organization
    if (data.orgID == undefined || data?.orgID == "") {
      const user = await supabaseClient.auth.signUp({
        email: data.email,
        password: data.password,
      });

      if (user.data.user?.id == undefined || user.error) {
        setError({ state: true, message: "Unable to create user" });
        return;
      }
      createOrg.mutate(
        {
          id: user.data.user?.id,
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
    <>
      <VerticalLogo />
      {/* <StepCounter signUpState={step} totalNum={2} /> */}
      <LoginCard>
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
      </LoginCard>
    </>
  );
};

SignIn.getLayout = loginFlowLayout;
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
