import { useRef } from "react";
import { Controller, useFormContext } from "react-hook-form";

export const PhoneInput = () => {
  const phoneLength = useRef(0);
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext();
  return (
    <>
      <label
        htmlFor='email-address'
        className='block text-sm font-medium text-gray-700'>
        Phone
      </label>

      <Controller
        name='phone'
        control={control}
        rules={{
          validate: {
            length: (value: string) => {
              return value.replace("-", "").length == 10;
            },
          },
        }}
        defaultValue={""}
        render={({ field, fieldState }) => (
          <>
            <input
              type='tel'
              {...field}
              onChange={(e) => {
                const eLength = e.target.value.length;
                if (eLength == 13) return;
                let add = true;
                if (eLength > phoneLength.current) {
                  add = true;
                  phoneLength.current = eLength;
                } else {
                  add = false;
                  phoneLength.current = eLength;
                }

                if (add) {
                  if (
                    e.target.value.length == 3 ||
                    e.target.value.length == 7
                  ) {
                    e.target.value = e.target.value.concat("-");
                  }
                }
                field.onChange(e.target.value);
              }}
              id='phone'
              autoComplete='phone'
              className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
            />
            {fieldState.error && (
              <span className='text-red-500'>
                Please enter a valid phone number with no hyphens.
              </span>
            )}
          </>
        )}
      />
    </>
  );
};
