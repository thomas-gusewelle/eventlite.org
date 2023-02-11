import { FormProvider, useForm } from "react-hook-form";
import { BtnPurple } from "../components/btn/btnPurple";
import { LoginCard } from "../components/create-account-flow/components/card";
import { CardHeader } from "../components/create-account-flow/components/cardHeader";
import { VerticalLogo } from "../components/create-account-flow/components/VerticalLogo";
import { ErrorSpan } from "../components/errors/errorSpan";
import { EmailInput } from "../components/form/emailInput";
import { FirstNameInput } from "../components/form/firstNameInput";
import { LastNameInput } from "../components/form/lastNameInput";
import { loginFlowLayout } from "../components/layout/login-flow-layout";

const BetaPage = () => {
  const methods = useForm();

  const submit = methods.handleSubmit((data) => {});
  return (
    <>
      <VerticalLogo />
      <LoginCard>
        <CardHeader>Beta Interest</CardHeader>
        <p className='mt-4 text-center text-sm font-medium leading-none text-gray-500'>
          Join our beta by registering your interest. Be the first to receive an
          invitation and share your feedback with us.
        </p>
        <FormProvider {...methods}>
          <form onSubmit={submit} className={"mt-3"}>
            <FirstNameInput />
            <LastNameInput />
            <EmailInput />

            <label className='form-label'>Organization Name</label>
            <input
              type='text'
              className='input-field'
              defaultValue={""}
              {...methods.register("orgName")}
            />
            {methods.formState.errors.orgName && (
              <ErrorSpan>{methods.formState.errors.orgName.message}</ErrorSpan>
            )}
            <div className='mt-6'>
              <BtnPurple type='submit' fullWidth>
                Submit
              </BtnPurple>
            </div>
          </form>
        </FormProvider>
      </LoginCard>
    </>
  );
};

BetaPage.getLayout = loginFlowLayout;
export default BetaPage;
