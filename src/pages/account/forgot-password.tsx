import Link from "next/link";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { BtnPurple } from "../../components/btn/btnPurple";
import { LoginCard } from "../../components/create-account-flow/components/card";
import { CardHeader } from "../../components/create-account-flow/components/cardHeader";
import { VerticalLogo } from "../../components/create-account-flow/components/VerticalLogo";
import { EmailInput } from "../../components/form/emailInput";
import { loginFlowLayout } from "../../components/layout/login-flow-layout";
import { api } from "../../server/utils/api"

const ForgotPasswordPage = () => {
  const methods = useForm<{ email: string }>();
  const [isSubmit, setIsSubmit] = useState(false);
  const generateEmail = api.createAccount.generateResetPassword.useMutation();

  const submit = methods.handleSubmit((data) => {
    generateEmail.mutate(
      { email: data.email },
      {
        onError(error, variables, context) {
          methods.setError("email", { message: error.message });
        },
        onSuccess() {
          setIsSubmit(true);
        },
      }
    );
  });

  if (isSubmit) {
    return (
      <>
        <VerticalLogo />
        <LoginCard>
          <CardHeader>Please Check Your Email</CardHeader>
          <p className='my-6 text-center'>
            An email to reset your password has been sent to the email you
            provided. Please use the link in the email to reset your password.
            If you do not see the email please check your spam.
          </p>
          <BtnPurple fullWidth={true} func={() => setIsSubmit(false)}>
            Back
          </BtnPurple>
        </LoginCard>
      </>
    );
  }
  return (
    <FormProvider {...methods}>
      <VerticalLogo />
      <LoginCard>
        <form onSubmit={submit}>
          <CardHeader>Forgot Password</CardHeader>

          <EmailInput />
          <div className='mt-6'>
            <BtnPurple
              isLoading={generateEmail.isLoading}
              type='submit'
              fullWidth={true}>
              Submit
            </BtnPurple>
          </div>
        </form>
        <p className='mt-4 text-center text-sm font-medium leading-none text-gray-500'>
          Here by accident?
          <Link href={"/signin"} legacyBehavior>
            <span
              tabIndex={0}
              role='link'
              aria-label='Sign up here'
              className='ml-1 cursor-pointer text-sm font-medium leading-none text-gray-800 underline'>
              Sign in
            </span>
          </Link>
        </p>
      </LoginCard>
    </FormProvider>
  );
};

ForgotPasswordPage.getLayout = loginFlowLayout;

export default ForgotPasswordPage;
