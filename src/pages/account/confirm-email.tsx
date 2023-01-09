import Link from "next/link";
import { useRouter } from "next/router";
import { BtnPurple } from "../../components/btn/btnPurple";
import { CardHeader } from "../../components/create-account-flow/components/cardHeader";
import { trpc } from "../../utils/trpc";

const ConfirmEmail = ({ email }: { email: string }) => {
  const resendEmail = trpc.useMutation("createAccount.resendConfirm");
  return (
    <div className='h-screen w-full bg-gradient-to-tl from-indigo-500 to-indigo-900 py-16 px-4'>
      <h2 className='mb-12 text-center text-4xl font-bold text-white'></h2>

      <div className='flex flex-col items-center justify-center'>
        <div className='mb-3 w-full rounded bg-white p-10 shadow md:w-1/2 lg:w-1/3'>
          <>
            <CardHeader>Please confirm your email</CardHeader>
            <p className='my-6 text-center'>
              Please check your email for a confirmation email and click the
              button to confirm your email. If you do not see the email you can
              click the button below to resend the email.
            </p>
            <BtnPurple
              fullWidth={true}
              func={() => resendEmail.mutate({ email: email })}>
              Resend Confirmation
            </BtnPurple>
          </>
        </div>
      </div>
      <p className='text-center text-white'>
        Already have an account?
        <Link href={"/signin"}>
          <a className='ml-1 underline'>Sign In</a>
        </Link>
      </p>
    </div>
  );
};

const ConfirmEmailPage = () => {
  const router = useRouter();
  const { email } = router.query;

  if (!email || typeof email !== "string") {
    return <div>No Id Provided</div>;
  }
  return <ConfirmEmail email={email} />;
};

export default ConfirmEmailPage;
