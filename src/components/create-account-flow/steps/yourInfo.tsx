import { Dispatch, SetStateAction, useState } from "react";
import { FormProvider, useForm, useFormContext } from "react-hook-form";
import { ErrorSpan } from "../../errors/errorSpan";
import { EmailInput } from "../../form/emailInput";
import { FirstNameInput } from "../../form/firstNameInput";
import { LastNameInput } from "../../form/lastNameInput";
import { PhoneInput } from "../../form/phoneInput";
import { CardHeader } from "../components/cardHeader";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { BtnNeutral } from "../../btn/btnNeutral";
import { BtnPurple } from "../../btn/btnPurple";
import { removeDashes } from "../../../utils/formatPhoneNumber";
import { PasswordField } from "../../form/password";

export const YourInfoStep = ({
  setStep,
}: {
  setStep: Dispatch<SetStateAction<number>>;
}) => {
  const methods = useForm();
  const {
    formState: { errors },
  } = methods;
  const iconSize = 20;

  const handleSubmit = methods.handleSubmit((data) => {

  })

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
            <div
              className="mt-6 flex items-center justify-center gap-6"
            >
              <BtnNeutral
                fullWidth
                func={() => {
                  setStep(1);
                }}
              >
                Back
              </BtnNeutral>
              <BtnPurple type="submit" fullWidth >
                Next
              </BtnPurple>
            </div>
          </form>
        </FormProvider>
      </section>
    </>
  );
};
