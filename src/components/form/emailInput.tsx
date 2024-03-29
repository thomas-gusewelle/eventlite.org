import { useFormContext } from "react-hook-form";

// isConfirm is for switching between typical email address and confirm email
export const EmailInput = ({ isConfirm = false }: { isConfirm?: boolean }) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();
  return (
    <>
      <label htmlFor='email-address' className='form-label'>
        {isConfirm ? "Confirm Email" : "Email address"}
      </label>
      <input
        type='text'
        {...register(isConfirm ? "confirmEmail" : "email", {
          required: "Email is required",
          pattern: {
            value:
              /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            message: "Please enter a valid email",
          },
        })}
        id='email'
        autoComplete='email'
        className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
      />
      {!isConfirm && errors.email && (
        <span className='text-red-500'>{errors.email.message as any}</span>
      )}
      {isConfirm && errors.confirmEmail && (
        <span className='text-red-500'>{errors.confirmEmail.message as any}</span>
      )}
    </>
  );
};
