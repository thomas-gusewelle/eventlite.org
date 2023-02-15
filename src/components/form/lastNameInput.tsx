import { useFormContext } from "react-hook-form";

export const LastNameInput = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext();
  return (
    <>
      <label htmlFor='last-name' className='form-label'>
        Last name
      </label>
      <input
        type='text'
        {...register("lastName", { required: true })}
        id='last-name'
        autoComplete='family-name'
        className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
      />
      {errors.lastName && (
        <span className='text-red-500'>Last Name is Required</span>
      )}
    </>
  );
};
