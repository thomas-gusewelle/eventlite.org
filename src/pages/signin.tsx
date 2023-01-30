import { FormEvent, useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { VerticalLogo } from "../components/create-account-flow/components/VerticalLogo";
import { loginFlowLayout } from "../components/layout/login-flow-layout";
import { LoginCard } from "../components/create-account-flow/components/card";
import { CardHeader } from "../components/create-account-flow/components/cardHeader";
import Link from "next/link";
import { BtnPurple } from "../components/btn/btnPurple";
import { FormProvider, useForm } from "react-hook-form";
import { EmailInput } from "../components/form/emailInput";
import { PasswordField } from "../components/form/password";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { UserContext } from "../providers/userProvider";

const SignIn = () => {
  const router = useRouter();
  const methods = useForm<{ email: string; password: string }>();
  const supabase = useSupabaseClient();
  const user = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(false);

  const signIn = methods.handleSubmit(async (input) => {
    setIsLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email: input.email,
      password: input.password,
    });
    console.log(data);
    if (error) {
      alert(error.message);
      setIsLoading(false);
      return;
    }
  });

  useEffect(() => {
    if (user != undefined || user != null) {
      router.push("/dashboard");
    }
  }, [user, router]);

  return (
    <>
      <VerticalLogo />
      <LoginCard>
        <CardHeader>Sign in to your account</CardHeader>
        <p className='mt-4 text-center text-sm font-medium leading-none text-gray-500'>
          Need to setup your organization?
          <Link href={"/create-account"} legacyBehavior>
            <span
              tabIndex={0}
              role='link'
              aria-label='Sign up here'
              className='ml-1 cursor-pointer text-sm font-medium leading-none text-gray-800 underline'>
              Sign up here
            </span>
          </Link>
        </p>
        <FormProvider {...methods}>
          <form className='mt-6' onSubmit={signIn}>
            <EmailInput />
            <PasswordField />
            <div className='mt-8'>
              <BtnPurple isLoading={isLoading} fullWidth={true} type='submit'>
                Sign in
              </BtnPurple>
            </div>
            <p className='mt-4 text-center text-sm font-medium leading-none text-gray-500'>
              Forgot your password?
              <Link href={"/account/forgot-password"} legacyBehavior>
                <span
                  tabIndex={0}
                  role='link'
                  aria-label='Sign up here'
                  className='ml-1 cursor-pointer text-sm font-medium leading-none text-gray-800 underline'>
                  Click here
                </span>
              </Link>
            </p>
          </form>
        </FormProvider>
      </LoginCard>
    </>
  );
};

SignIn.getLayout = loginFlowLayout;

export default SignIn;
