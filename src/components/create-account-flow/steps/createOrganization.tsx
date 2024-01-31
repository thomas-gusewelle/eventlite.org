import Link from "next/link";
import { Dispatch, SetStateAction, useContext, useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useFormKeyboardControls } from "../../../hooks/useFormKeyboardControls";
import { BtnPurple } from "../../btn/btnPurple";
import { ErrorSpan } from "../../errors/errorSpan";
import { PhoneInput } from "../../form/phoneInput";
import { CardHeader } from "../components/cardHeader";
import { CreateOrgContext } from "../dataStore";

export const CreateOrganization = ({
  setStep,
  stripeCustomerId
}: {
  setStep: Dispatch<SetStateAction<number>>;
    stripeCustomerId: string
}) => {
  const methods = useForm();
  const {
    formState: { errors },
  } = methods;
  const { state, setState } = useContext(CreateOrgContext)!;

  const handleSubmit = methods.handleSubmit((data) => {
    // set the submited data and the stripe customer id into the data store
    setState((prev) => ({
      ...prev,
      orgName: data.orgName,
      orgPhoneNumber: data.phoneNumber,
      stripeCustomerId: stripeCustomerId
    }));
    setStep(2);
  });

  useEffect(() => {
    methods.setValue("orgName", state.orgName);
    methods.setValue("phoneNumber", state.orgPhoneNumber);
  }, []);


  return (
    <>
      <CardHeader>Create Organization</CardHeader>
      <p className="mt-4 text-center text-sm font-medium leading-none text-gray-500">
        Already have an account?
        <Link href={"/signin"} legacyBehavior>
          <span
            tabIndex={0}
            role="link"
            aria-label="Sign up here"
            className="ml-1 cursor-pointer text-sm font-medium leading-none text-gray-800 underline"
          >
            Sign in
          </span>
        </Link>
      </p>
      <section>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit}>
            <div className="mt-6">
              <label className="form-label">Organization Name</label>
              <input
                type="text"
                className="input-field"
                {...methods.register("orgName", {
                  required: "Organization name required",
                })}
              />
              {errors.orgName && (
                <ErrorSpan>{errors.orgName.message}</ErrorSpan>
              )}
            </div>
            <PhoneInput required />
            <div className="mt-6 flex items-center justify-center gap-6">
              <BtnPurple type="submit" fullWidth={true}>
                Next
              </BtnPurple>
            </div>
          </form>
        </FormProvider>
      </section>
    </>
  );
};
