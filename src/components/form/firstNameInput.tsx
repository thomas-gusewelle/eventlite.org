import { useFormContext } from "react-hook-form";

export const FirstNameInput = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext();
  return (
    <>
      {" "}
      <label
        htmlFor='first-name'
        className='block text-sm font-medium text-gray-700'>
        First name
      </label>
      <input
        type='text'
        id='firstName'
        {...register("firstName", { required: true, minLength: 3 })}
        className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
      />
      {errors.firstName && (
        <span className='text-red-500'>First Name is Required</span>
      )}
    </>
  );
};
