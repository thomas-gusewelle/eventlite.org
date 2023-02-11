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
import { trpc } from "../utils/trpc";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";

const schema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  orgName: z.string().min(1, { message: "Organization name required" }),
});

const BetaPage = () => {
  const [isSubmit, setIsSubmit] = useState(false);
  const methods = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  });
  const betaMutate = trpc.useMutation("createAccount.registerBetaInterest");

  const submit = methods.handleSubmit((data) => {
    betaMutate.mutate(
      {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        orgName: data.orgName,
      },
      { onSuccess: () => setIsSubmit(true) }
    );
  });
  return (
    <>
      <VerticalLogo />
      <LoginCard>
        <CardHeader>Beta Interest</CardHeader>
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
            <div className='mt-6'>
              <BtnPurple type='submit' fullWidth>
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
