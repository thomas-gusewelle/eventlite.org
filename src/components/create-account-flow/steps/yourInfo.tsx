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
import { api } from "../../../server/utils/api";

export const YourInfoStep = ({
  setStep,
}: {
  setStep: Dispatch<SetStateAction<number>>;
}) => {
  const { state, setState } = useContext(CreateOrgContext)!;
  const methods = useForm();
  const createOrgMutation = api.organization.createOrg.useMutation();

  //TODO: finish implemeting createOrgMutation to create the user and org here.
  //We are doing this to simplify the stripe process.
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


  //TODO: Solve issue with the password confirm not autofilling

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
                  console.log("back being called");
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
