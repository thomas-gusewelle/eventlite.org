import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { BtnPurple } from "../../components/btn/btnPurple";
import { CircularProgress } from "../../components/circularProgress";
import { EmailInput } from "../../components/form/emailInput";
import { PasswordField } from "../../components/form/password";
import { trpc } from "../../utils/trpc";

type FormFields = { email: string; password: string; passwordConfirm: string };

const Invite = ({
  code,
  email,
  orgName,
}: {
  code: string;
  email: string;
  orgName: string;
}) => {
  const methods = useForm<FormFields>();
  const router = useRouter();
  const password = methods.watch("password");
  const confirmPassword = methods.watch("passwordConfirm");

  useEffect(() => {
    methods.setValue("email", email);
  }, [email, methods]);

  const getUserFromCode = trpc.useQuery([
    "createAccount.getUserFromInvite",
    code,
  ]);
  const createLogin = trpc.useMutation("createAccount.createInviteLogin", {
    onError(error) {
      alert(error.message);
    },
    onSuccess(data, variables, context) {
      router.push(`/account/confirm-email?email=${data?.user?.email ?? ""}`);
    },
  });

  const submit = methods.handleSubmit((data: FormFields) => {
    if (getUserFromCode.data?.id == undefined) {
      alert("User Does Not Exist");
      return;
    }
    createLogin.mutate({
      email: data.email,
      oldId: getUserFromCode.data?.id,
      password: data.password,
      confirmPassword: data.passwordConfirm,
      inviteId: code,
    });
  });

  if (getUserFromCode.data == undefined) {
    return <div>Error getting user</div>;
  }

  return (
    <div className='h-screen w-full bg-gradient-to-tl from-indigo-500 to-indigo-900 py-16 px-4'>
      <h2 className='mb-12 text-center text-4xl font-bold text-white'>
        Join {orgName}&apos;s Team
      </h2>

      <div className='flex flex-col items-center justify-center'>
        <div className='mb-3 w-full rounded bg-white p-10 shadow md:w-1/2 lg:w-1/3'>
          <FormProvider {...methods}>
            <form onSubmit={submit}>
              <EmailInput />
              <PasswordField />
              <PasswordField isConfirm={true} />
              <div className='mt-6 flex justify-center gap-6'>
                <BtnPurple
                  isLoading={getUserFromCode.isLoading}
                  disabled={getUserFromCode.isLoading}
                  fullWidth={true}
                  type='button'
                  func={() => {
                    if (password != confirmPassword) {
                      methods.setError("passwordConfirm", {
                        type: "validate",
                        message: "Passwords do not match",
                      });
                      return;
                    } else {
                      methods.clearErrors("passwordConfirm");
                      submit();
                    }
                  }}>
                  Create Login
                </BtnPurple>
              </div>
            </form>
          </FormProvider>
        </div>
      </div>
      <p className='text-center text-white'>
        Already have an account?
        <Link href={"/signin"} className='ml-1 underline'>
          Sign In
        </Link>
      </p>
    </div>
  );
};

const InvitePage = () => {
  const router = useRouter();
  const { code, email, orgName } = router.query;

  if (!code || typeof code !== "string") {
    return null;
  }
  if (!email || typeof email !== "string") {
    return null;
  }
  if (!orgName || typeof orgName !== "string") {
    return null;
  }
  return (
    <Invite code={decodeURIComponent(code)} email={email} orgName={orgName} />
  );
};

export default InvitePage;
