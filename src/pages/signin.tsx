import { FormEvent, useState } from "react";
import { useRouter } from "next/router";
import { supabaseClient } from "@supabase/auth-helpers-nextjs";
import { VerticalLogo } from "../components/create-account-flow/components/VerticalLogo";
import { loginFlowLayout } from "../components/layout/login-flow-layout";
import { LoginCard } from "../components/create-account-flow/components/card";
import { CardHeader } from "../components/create-account-flow/components/cardHeader";
import Link from "next/link";
import { BtnPurple } from "../components/btn/btnPurple";
import { FormProvider, useForm } from "react-hook-form";
import { EmailInput } from "../components/form/emailInput";
import { PasswordField } from "../components/form/password";

const SignIn = () => {
  const router = useRouter();
  const methods = useForm<{ email: string; password: string }>();

  const signIn = methods.handleSubmit(async (data) => {
    const { user, error } = await supabaseClient.auth.signIn({
      email: data.email,
      password: data.password,
    });
    console.log(user);
    if (error) {
      alert(error.message);
      return;
    }
    router.push("/dashboard");
  });

  return (
    <>
      <VerticalLogo />
      <LoginCard>
        <CardHeader>Sign in to your account</CardHeader>
        <p className='mt-4 text-center text-sm font-medium leading-none text-gray-500'>
          Need to setup your organization?
          <Link href={"/create-account"}>
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
              <BtnPurple fullWidth={true} type='submit'>
                Sign in
              </BtnPurple>
            </div>
            <p className='mt-4 text-center text-sm font-medium leading-none text-gray-500'>
              Forgot your password?
              <Link href={"/account/forgot-password"}>
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
