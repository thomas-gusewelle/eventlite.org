import Link from "next/link";
import { useRouter } from "next/router";
import { FormProvider, useForm } from "react-hook-form";
import { BtnPurple } from "../../components/btn/btnPurple";
import { CircularProgress } from "../../components/circularProgress";
import { EmailInput } from "../../components/form/emailInput";
import { PasswordField } from "../../components/form/password";
import { trpc } from "../../utils/trpc";

type FormFields = { email: string; password: string; passwordConfirm: string };

const Invite = ({ code }: { code: string }) => {
  const methods = useForm<FormFields>();
  const router = useRouter();
  const password = methods.watch("password");
  const confirmPassword = methods.watch("passwordConfirm");

  const getUserFromCode = trpc.useQuery(
    ["createAccount.getUserFromInvite", code],
    {
      onSuccess(data) {
        console.log(data);
      },
    }
  );
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

  if (getUserFromCode.isLoading) {
    return (
      <div className='mt-12 flex justify-center'>
        <CircularProgress />
      </div>
    );
  }

  if (getUserFromCode.data == undefined) {
    return <div>Error getting user</div>;
  }

  return (
    <div className='h-screen w-full bg-gradient-to-tl from-indigo-500 to-indigo-900 py-16 px-4'>
      <h2 className='mb-12 text-center text-4xl font-bold text-white'>
        Join {getUserFromCode.data?.Organization?.name}&apos;s Team
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
        <Link href={"/signin"}>
          <a className='ml-1 underline'>Sign In</a>
        </Link>
      </p>
    </div>
  );
};

const InvitePage = () => {
  const router = useRouter();
  const { code } = router.query;

  if (!code || typeof code !== "string") {
    return <div>No Id Provided</div>;
  }
  return <Invite code={decodeURIComponent(code)} />;
};

export default InvitePage;
