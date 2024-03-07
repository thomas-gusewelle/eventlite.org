import { Dispatch, SetStateAction, useContext, useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { EmailInput } from "../../form/emailInput";
import { FirstNameInput } from "../../form/firstNameInput";
import { LastNameInput } from "../../form/lastNameInput";
import { PhoneInput } from "../../form/phoneInput";
import { CardHeader } from "../components/cardHeader";
import { BtnNeutral } from "../../btn/btnNeutral";
import { BtnPurple } from "../../btn/btnPurple";
import { PasswordField } from "../../form/password";
import { CreateOrgContext } from "../dataStore";

export const YourInfoStep = ({
  setStep,
}: {
  setStep: Dispatch<SetStateAction<number>>;
}) => {
  const { state, setState } = useContext(CreateOrgContext)!;
  const methods = useForm();

  const handleSubmit = methods.handleSubmit((data) => {
    setState((prev) => ({
      ...prev,
      firstName: data.firstName,
      lastName: data.lastName,
      phoneNumber: data.phoneNumber,
      email: data.email,
      password: data.password,
      passwordConfirm: data.passwordConfirm,
    }));
    setStep(3);
  });

  useEffect(() => {
    methods.reset(state);
  }, []);

  return (
    <>
      <CardHeader>Your Info</CardHeader>
      <section className="mt-6 grid">
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit}>
            <FirstNameInput />
            <LastNameInput />
            <PhoneInput />
            <EmailInput />
            <PasswordField />
            <PasswordField isConfirm />
            <div className="mt-6 flex items-center justify-center gap-6">
              <BtnNeutral
                fullWidth
                func={() => {
                  setStep(1);
                }}
              >
                Back
              </BtnNeutral>
              <BtnPurple type="submit" fullWidth>
                Next
              </BtnPurple>
            </div>
          </form>
        </FormProvider>
      </section>
    </>
  );
};
