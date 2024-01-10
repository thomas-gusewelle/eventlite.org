import { Dispatch, SetStateAction, useState } from "react";
import { useFormContext } from "react-hook-form";
import { ErrorSpan } from "../../errors/errorSpan";
import { EmailInput } from "../../form/emailInput";
import { FirstNameInput } from "../../form/firstNameInput";
import { LastNameInput } from "../../form/lastNameInput";
import { PhoneInput } from "../../form/phoneInput";
import { CardHeader } from "../components/cardHeader";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { BtnNeutral } from "../../btn/btnNeutral";
import { BtnPurple } from "../../btn/btnPurple";

export const YourInfoStep = ({
  setStep,
}: {
  setStep: Dispatch<SetStateAction<number>>;
}) => {
  const {
    register,
    setError,
    clearErrors,
    watch,
    formState: { errors },
  } = useFormContext();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const passwordField: string = watch("password");
  const iconSize = 20;
  return (
    <>
      <CardHeader>Your Info</CardHeader>
      <section className='mt-6 grid'>
        <FirstNameInput />
        <LastNameInput />
        <PhoneInput />
        <EmailInput />
        <>
          <label
            htmlFor='password'
            className='block text-sm font-medium text-gray-700'>
            Password
          </label>
          <div className='relative'>
            <input
              type={showPassword ? "text" : "password"}
              id='password'
              {...register("password", {
                required: "Enter a Password",
                minLength: {
                  value: 6,
                  message: "Password must be atleast 6 characters long.",
                },
              })}
              className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
            />
            <div
              className='absolute right-0 top-1/2 mt-[.125rem] -translate-y-1/2 cursor-pointer rounded-r-lg py-2 px-4'
              onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? (
                <AiFillEyeInvisible size={iconSize} />
              ) : (
                <AiFillEye size={iconSize} />
              )}
            </div>
          </div>

          {errors.password && (
            <ErrorSpan className='text-red-500'>
              {errors.password.message}
            </ErrorSpan>
          )}
        </>
        <>
          <label
            htmlFor='passwordConfirm'
            className='block text-sm font-medium text-gray-700'>
            Confirm Password
          </label>
          <div className='relative'>
            <input
              type={showConfirmPassword ? "text" : "password"}
              id='passwordConfirm'
              {...register("passwordConfirm", {
                required: "Re-Enter password",
                validate: {
                  sameAsPassword: (value: string) =>
                    value == passwordField || "Passwords do not match.",
                },
              })}
              className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
            />
            <div
              className='absolute right-0 top-1/2 mt-[.125rem] -translate-y-1/2 cursor-pointer rounded-r-lg py-2 px-4'
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
              {showConfirmPassword ? (
                <AiFillEyeInvisible size={iconSize} />
              ) : (
                <AiFillEye size={iconSize} />
              )}
            </div>
          </div>

          {errors.passwordConfirm && (
            <ErrorSpan className='text-red-500'>
              {errors.passwordConfirm.message}
            </ErrorSpan>
          )}
       <div
        onClick={(e) => e.preventDefault()}
        className='mt-6 flex items-center justify-center gap-6'>
        <BtnNeutral
          fullWidth
          func={() => {
            setStep(2);
          }}>
          Back
        </BtnNeutral> 
        <BtnPurple
          fullWidth
          onClick={() => null} >
          Next
        </BtnPurple>
      </div> </>
      </section>
    </>
  );
};
