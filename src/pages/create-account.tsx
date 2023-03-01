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
import { trpc } from "../utils/trpc";
import { AlertContext } from "../providers/alertProvider";
import { LoginCard } from "../components/create-account-flow/components/card";
import { loginFlowLayout } from "../components/layout/login-flow-layout";
import { VerticalLogo } from "../components/create-account-flow/components/VerticalLogo";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

const CreateAccount = ({
  code,
  firstName,
  lastName,
  orgName,
  email,
}: {
  code: string;
  firstName: string;
  lastName: string;
  orgName: string;
  email: string;
}) => {
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

    createOrg.mutate(
      {
        inviteCode: code,
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
  const { orgName, firstName, lastName, email, code } = router.query;

  if (
    !orgName ||
    typeof orgName != "string" ||
    !firstName ||
    typeof firstName != "string" ||
    !lastName ||
    typeof lastName != "string" ||
    !email ||
    typeof email != "string" ||
    !code ||
    typeof code != "string"
  ) {
    return <div>Error with invite link</div>;
  }

  return (
    <CreateAccount
      orgName={orgName}
      lastName={lastName}
      firstName={firstName}
      email={email}
      code={decodeURIComponent(code)}
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
