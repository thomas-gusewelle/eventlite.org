import {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { useRouter } from "next/router";
import { FormProvider, useForm } from "react-hook-form";
import { CreateAccountForm } from "../../types/createAccountFormValues";
import { CreateOrganization } from "../components/create-account-flow/steps/createOrganization";
import { YourInfoStep } from "../components/create-account-flow/steps/yourInfo";
import { BtnNeutral } from "../components/btn/btnNeutral";
import { BtnPurple } from "../components/btn/btnPurple";
import { api } from "../server/utils/api"
import { AlertContext } from "../providers/alertProvider";
import { LoginCard } from "../components/create-account-flow/components/card";
import { loginFlowLayout } from "../components/layout/login-flow-layout";
import { VerticalLogo } from "../components/create-account-flow/components/VerticalLogo";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

const CreateAccount = ({
  firstName,
  lastName,
  orgName,
  email,
}: {
  firstName: string | undefined;
  lastName: string | undefined;
  orgName: string | undefined;
  email: string | undefined;
}) => {
  const router = useRouter();
  const { setError } = useContext(AlertContext);
  const [step, setStep] = useState(1);
  const methods = useForm<CreateAccountForm>();
  const supabaseClient = useSupabaseClient();
  const createOrg = api.organization.createOrg.useMutation({
    onError(error, variables, context) {
      setError({
        state: true,
        message: `Error creating organization. Message: ${error.message}`,
      });
    },
  });
  const createUser = api.user.addUser.useMutation({
    onError(error, variables, context) {
      setError({
        state: true,
        message: `Error creating user. Message: ${error.message}`,
      });
    },
  });

  const submit = methods.handleSubmit(async (data) => {
    //if no OrgID == create organization

    createOrg.mutate(
      {
        orgName: data.orgName,
        orgPhoneNumber: data.orgPhoneNumber,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        phoneNumber: data.phoneNumber,
        status: "ADMIN",
      },

      {
        onError(err) {
          alert(err);
        },
        onSuccess(retunredData, variables, context) {
          router.push("/dashboard");
        },
      }
    );
  });

  useEffect(() => {
    methods.reset({
      orgName: orgName,
      email: email,
      firstName: firstName,
      lastName: lastName,
    });
  }, [email, firstName, lastName, methods, orgName]);
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
                <BtnPurple
                  isLoading={createOrg.isLoading}
                  fullWidth={true}
                  type='submit'>
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

const CreateAcountPage = () => {
  const router = useRouter();
  const { orgName, firstName, lastName, email } = router.query;

  if (Array.isArray(orgName) || Array.isArray(firstName) || Array.isArray(lastName) || Array.isArray(email)) {
    return <div>Error with invite link
    </div>
  }

  return (
    <CreateAccount
      orgName={orgName}
      lastName={lastName}
      firstName={firstName}
      email={email}
    />
  );
};

CreateAcountPage.getLayout = loginFlowLayout;
export default CreateAcountPage;

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
