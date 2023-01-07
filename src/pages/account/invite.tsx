import Link from "next/link";
import { useRouter } from "next/router";
import { DetailedHTMLProps, FormHTMLAttributes, useRef, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

import { BtnPurple } from "../../components/btn/btnPurple";
import { CircularProgress } from "../../components/circularProgress";
import { ErrorSpan } from "../../components/errors/errorSpan";
import { EmailInput } from "../../components/form/emailInput";
import { PasswordField } from "../../components/form/password";
import { trpc } from "../../utils/trpc";

type FormFields = { email: string; password: string; passwordConfirm: string };

const Invite = ({ id }: { id: string }) => {
  const methods = useForm<FormFields>();
  const router = useRouter();
  const iconSize = 20;
  const [showPassword, setShowPassword] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const password = methods.watch("password");
  const confirmPassword = methods.watch("passwordConfirm");

  const getUserFromCode = trpc.useQuery(
    ["createAccount.getUserFromInvite", id],
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
      router.push(
        `/account/confirmemail?email=${encodeURI(
          getUserFromCode.data?.email ?? ""
        )}`
      );
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
      inviteId: id,
    });
  });

  if (getUserFromCode.isLoading) {
    return (
      <div className='mt-12 flex justify-center'>
        <CircularProgress />
      </div>
    );
  }
  return (
    <div className='h-screen w-full bg-gradient-to-tl from-indigo-500 to-indigo-900 py-16 px-4'>
      <h2 className='mb-12 text-center text-4xl font-bold text-white'>
        Join {getUserFromCode.data?.Organization?.name}&apos;s Team
      </h2>

      <div className='flex flex-col items-center justify-center'>
        <div className='mb-3 w-full rounded bg-white p-10 shadow md:w-1/2 lg:w-1/3'>
          <FormProvider {...methods}>
            <form ref={formRef} onSubmit={submit}>
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
        Already have an account?{" "}
        <Link href={"/signin"}>
          <a className='underline'>Sign In</a>
        </Link>
      </p>
    </div>
  );
};

const InvitePage = () => {
  const router = useRouter();
  const { id } = router.query;

  if (!id || typeof id !== "string") {
    return <div>No Id Provided</div>;
  }
  return <Invite id={id} />;
};

export default InvitePage;
