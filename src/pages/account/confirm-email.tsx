import Link from "next/link";
import { useRouter } from "next/router";
import { BtnPurple } from "../../components/btn/btnPurple";
import { LoginCard } from "../../components/create-account-flow/components/card";
import { CardHeader } from "../../components/create-account-flow/components/cardHeader";
import { loginFlowLayout } from "../../components/layout/login-flow-layout";
import { api } from "../../server/utils/api"

const ConfirmEmail = ({ email }: { email: string }) => {
  const resendEmail = api.createAccount.resendConfirm.useMutation();
  return (
    <>
      <LoginCard>
        <CardHeader>Please confirm your email</CardHeader>
        <p className='my-6 text-center'>
          Please check your email for a confirmation email and click the button
          to confirm your email. If you do not see the email you can click the
          button below to resend the email.
        </p>
        <BtnPurple
          fullWidth={true}
          func={() => resendEmail.mutate({ email: email })}>
          Resend Confirmation
        </BtnPurple>
      </LoginCard>

      <p className='text-center text-white'>
        Already have an account?
        <Link href={"/signin"} className='ml-1 underline'>
          Sign In
        </Link>
      </p>
    </>
  );
};

const ConfirmEmailPage = () => {
  const router = useRouter();
  const { email } = router.query;

  if (!email || typeof email !== "string") {
    return <div>No Email Provided</div>;
  }
  return <ConfirmEmail email={email} />;
};

ConfirmEmailPage.getLayout = loginFlowLayout;

export default ConfirmEmailPage;
