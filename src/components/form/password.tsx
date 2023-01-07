import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { ErrorSpan } from "../errors/errorSpan";

export const PasswordField = ({
  isConfirm = false,
}: {
  isConfirm?: boolean;
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const iconSize = 20;
  const {
    register,
    formState: { errors },
  } = useFormContext();
  return (
    <>
      <label
        htmlFor='passwordConfirm'
        className='block text-sm font-medium text-gray-700'>
        {isConfirm ? "Confirm Password" : "Password"}
      </label>
      <div className='relative'>
        <input
          type={showPassword ? "text" : "password"}
          id='passwordConfirm'
          {...register(isConfirm ? "passwordConfirm" : "password", {
            required: {
              value: true,
              message: isConfirm ? "Re-enter password" : "Password is required",
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
      {!isConfirm && errors.password && (
        <ErrorSpan className='text-red-500'>
          {errors.password.message}
        </ErrorSpan>
      )}
      {isConfirm && errors.passwordConfirm && (
        <ErrorSpan className='text-red-500'>
          {errors.passwordConfirm.message}
        </ErrorSpan>
      )}
    </>
  );
};
