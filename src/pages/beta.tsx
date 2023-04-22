import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { BtnPurple } from "../components/btn/btnPurple";
import { LoginCard } from "../components/create-account-flow/components/card";
import { CardHeader } from "../components/create-account-flow/components/cardHeader";
import { VerticalLogo } from "../components/create-account-flow/components/VerticalLogo";
import { ErrorSpan } from "../components/errors/errorSpan";
import { EmailInput } from "../components/form/emailInput";
import { FirstNameInput } from "../components/form/firstNameInput";
import { LastNameInput } from "../components/form/lastNameInput";
import { loginFlowLayout } from "../components/layout/login-flow-layout";
import { api } from "../server/utils/api"
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useRouter } from "next/router";

const schema = z.object({
  firstName: z.string().min(1, { message: "First name required" }),
  lastName: z.string().min(1, { message: "Last name required" }),
  email: z.string().email(),
  orgName: z.string().min(1, { message: "Organization name required" }),
  teamSize: z.union([
    z.literal("1-5"),
    z.literal("5-15"),
    z.literal("15-25"),
    z.literal("25+"),
  ]),
});

const BetaPage = () => {
  const [isSubmit, setIsSubmit] = useState(false);
  const router = useRouter();
  const methods = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  });
  const betaMutate = api.createAccount.registerBetaInterest.useMutation();

  const submit = methods.handleSubmit((data) => {
    betaMutate.mutate(
      {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        orgName: data.orgName,
        teamSize: data.teamSize,
      },
      { onSuccess: () => setIsSubmit(true) }
    );
  });

  if (isSubmit) {
    return (
      <>
        <VerticalLogo />
        <LoginCard>
          <CardHeader>Thank you!</CardHeader>
          <p className='mt-4 text-center text-sm font-medium leading-none text-gray-500'>
            Thank you for submitting your interest in our beta. You should
            recieve an email soon with an invitation to the beta.
          </p>
          <div className='mt-6'>
            <BtnPurple fullWidth onClick={() => router.push("/")}>
              Return Home
            </BtnPurple>
          </div>
        </LoginCard>
      </>
    );
  }
  return (
    <>
      <VerticalLogo />
      <LoginCard>
        <CardHeader>Let Us Know You&apos;re Interested</CardHeader>
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
            <label className='form-label'>Team Size</label>
            <div className=''>
              <div className='flex items-center gap-2 '>
                <input
                  {...methods.register("teamSize")}
                  className=' text-indigo-700 checked:bg-indigo-700 indeterminate:bg-indigo-700 hover:bg-indigo-700 focus:bg-indigo-600 focus:shadow-indigo-700 focus:ring-indigo-700'
                  type={"radio"}
                  name='teamSize'
                  value={"1-5"}
                  defaultChecked></input>
                <label>1-5</label>
              </div>
              <div className='flex items-center gap-2 '>
                <input
                  {...methods.register("teamSize")}
                  type={"radio"}
                  name='teamSize'
                  value={"5-15"}
                  className=' text-indigo-700 checked:bg-indigo-700 indeterminate:bg-indigo-700 hover:bg-indigo-700 focus:bg-indigo-600 focus:shadow-indigo-700 focus:ring-indigo-700'></input>{" "}
                <label>5-15</label>
              </div>
              <div className='flex items-center gap-2 '>
                <input
                  {...methods.register("teamSize")}
                  className=' text-indigo-700 checked:bg-indigo-700 indeterminate:bg-indigo-700 hover:bg-indigo-700 focus:bg-indigo-600 focus:shadow-indigo-700 focus:ring-indigo-700'
                  type={"radio"}
                  name='teamSize'
                  value={"15-25"}></input>{" "}
                <label>15-25</label>
              </div>
              <div className='flex items-center gap-2 '>
                <input
                  {...methods.register("teamSize")}
                  className=' text-indigo-700 checked:bg-indigo-700 indeterminate:bg-indigo-700 hover:bg-indigo-700 focus:bg-indigo-600 focus:shadow-indigo-700 focus:ring-indigo-700'
                  type={"radio"}
                  name='teamSize'
                  value={"25+"}></input>{" "}
                <label>25+</label>
              </div>
            </div>

            <div className='mt-6'>
              <BtnPurple
                isLoading={betaMutate.isLoading}
                type='submit'
                fullWidth>
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
