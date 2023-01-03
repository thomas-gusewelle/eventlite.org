import { useFormContext } from "react-hook-form";

export const EmailInput = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext();
  return (
    <>
      {" "}
      <label
        htmlFor='email-address'
        className='block text-sm font-medium text-gray-700'>
        Email address
      </label>
      <input
        type='text'
        {...register("email", {
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
      {errors.email && (
        <span className='text-red-500'>{errors.email.message as any}</span>
      )}
    </>
  );
};
