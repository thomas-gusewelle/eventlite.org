import { Dispatch, SetStateAction, useRef } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { formatPhoneNumber } from "../../../utils/formatPhoneNumber";
import { BtnNeutral } from "../../btn/btnNeutral";
import { BtnPurple } from "../../btn/btnPurple";
import { CardHeader } from "../components/cardHeader";

// TODO: finish validation of URL and error reporting
export const CreateOrganization = ({
  setStep,
}: {
  setStep: Dispatch<SetStateAction<number>>;
}) => {
  const phoneLength = useRef(0);
  const {
    register,
    control,
    setError,
    setValue,
    formState: { errors },
  } = useFormContext();
  return (
    <>
      <CardHeader>Create Organization</CardHeader>
      <section>
        <div className='mt-3'>
          <label className='form-label'>Organization Name</label>
          <input type='text' className='input-field' {...register("orgName")} />
        </div>
        <div className='mt-3'>
          <label className='form-label'>Website</label>
          <div className=' relative'>
            <input
              type='text'
              className='input-field pl-20'
              {...register("orgWebsite", {
                pattern:
                  /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
              })}
            />

            <div className='translate absolute top-1/2 left-0 -translate-y-1/2 rounded-l-lg bg-gray-200 py-2 px-3 text-gray-600'>
              https://
            </div>
            {/* {errors.} */}
          </div>
        </div>
        <div className='mt-3'>
          <label className='form-label'>Phone</label>
          <Controller
            name='orgPhoneNumber'
            control={control}
            rules={{
              validate: {
                length: (value: string) => {
                  return value.replace(/-/g, "").trim().length == 10;
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
                    console.log(e);
                    const eLength = e.target.value.length;
                    // checks if number is full length and prohibits extra input
                    if (eLength == 13) return;
                    // makes sure input is a number but allows for delation of first number
                    if (
                      Number.isNaN(parseInt(e.target.value)) &&
                      e.target.value != ""
                    )
                      return;

                    //uses ref to track input length to determine if user is deleting or inputing new characters
                    let add = true;
                    if (eLength > phoneLength.current) {
                      add = true;
                      phoneLength.current = eLength;
                    } else {
                      add = false;
                      phoneLength.current = eLength;
                    }
                    if (add) {
                      field.onChange(formatPhoneNumber(e.target.value));
                    } else {
                      field.onChange(e.target.value);
                    }
                  }}
                  id='phone'
                  autoComplete='phone'
                  className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
                />
                {fieldState.error && (
                  <span className='text-red-500'>
                    Please enter a valid phone number (###-###-####)
                  </span>
                )}
              </>
            )}
          />
        </div>
        <div
          onClick={(e) => e.preventDefault()}
          className='mt-6 flex items-center justify-center gap-6'>
          <BtnNeutral
            func={() => {
              setStep(1);
            }}>
            Back
          </BtnNeutral>
          <BtnPurple func={() => {}}>Next</BtnPurple>
        </div>
      </section>
    </>
  );
};
