import { useRouter } from "next/router";
import { FormProvider, useForm } from "react-hook-form";
import { BtnPurple } from "../../components/btn/btnPurple";
import { LoginCard } from "../../components/create-account-flow/components/card";
import { CardHeader } from "../../components/create-account-flow/components/cardHeader";
import { VerticalLogo } from "../../components/create-account-flow/components/VerticalLogo";
import { PasswordField } from "../../components/form/password";
import { loginFlowLayout } from "../../components/layout/login-flow-layout";
import { sidebar } from "../../components/layout/sidebar";
import { trpc } from "../../utils/trpc";

type FormData = {
  password: string;
  passwordConfirm: string;
};

const ResetPassword = ({ code }: { code: string }) => {
  const methods = useForm<FormData>();
  const router = useRouter();
  const resetPassword = trpc.createAccount.resetPassword.useMutation();

  const submit = methods.handleSubmit((data) => {
    resetPassword.mutate(
      {
        code: code,
        password: data.password,
        passwordConfirm: data.passwordConfirm,
      },
      {
        onSuccess() {
          router.push("/signin");
        },
      }
    );
  });
  return (
    <FormProvider {...methods}>
      <VerticalLogo />
      <LoginCard>
        <form onSubmit={submit}>
          <CardHeader>Reset Password</CardHeader>
          <PasswordField />
          <PasswordField isConfirm={true} />
          <div className='mt-6'>
            <BtnPurple
              isLoading={resetPassword.isLoading}
              fullWidth={true}
              type='submit'>
              Reset
            </BtnPurple>
          </div>
        </form>
      </LoginCard>
    </FormProvider>
  );
};

const ResetPasswordPage = () => {
  const router = useRouter();
  const { code } = router.query;
  if (code == undefined || typeof code != "string") {
    return (
      <>
        <VerticalLogo />
        <LoginCard>
          <CardHeader>Email Not Found</CardHeader>
          <div className='mt-6'>
            <BtnPurple fullWidth={true} func={() => router.back()}>
              Back
            </BtnPurple>
          </div>
        </LoginCard>
      </>
    );
  }
  return <ResetPassword code={decodeURIComponent(code)} />;
};

ResetPasswordPage.getLayout = loginFlowLayout;

export default ResetPasswordPage;
