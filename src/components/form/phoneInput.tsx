import { useRef } from "react";
import { useFormContext } from "react-hook-form";

export const PhoneInput = () => {
  const phoneLength = useRef(0);
  const {
    register,
    formState: { errors },
  } = useFormContext();
  return (
    <>
      <label
        htmlFor='email-address'
        className='block text-sm font-medium text-gray-700'>
        Phone
      </label>
      <input
        type='tel'
        {...register("phone", {
          validate: {
            length: (value: string) => {
              return value.replace("-", "").length == 10;
            },
          },
          onChange: (e) => {
            const eLength = e.target.value.length;
            if (eLength == 12) return;
            let add = true;
            if (eLength > phoneLength.current) {
              add = true;
              phoneLength.current = eLength;
            } else {
              add = false;
              phoneLength.current = eLength;
            }

            if (add) {
              if (e.target.value.length == 3 || e.target.value.length == 7) {
                e.target.value = e.target.value.concat("-");
              }
            }
          },
        })}
        maxLength={12}
        id='phone'
        autoComplete='phone'
        className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
      />
      {errors.phone && (
        <span className='text-red-500'>
          Please enter a valid phone number with no hyphens.
        </span>
      )}
    </>
  );
};
