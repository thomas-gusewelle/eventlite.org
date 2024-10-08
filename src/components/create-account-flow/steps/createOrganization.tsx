import Link from "next/link";
import { Dispatch, SetStateAction, useEffect, useRef } from "react";
import { Controller, useFormContext } from "react-hook-form";
import {
  formatPhoneNumber,
  removeDashes,
} from "../../../utils/formatPhoneNumber";
import { BtnPurple } from "../../btn/btnPurple";
import { ErrorSpan } from "../../errors/errorSpan";
import { NewSingleSelect } from "../../form/singleSelect";
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
    clearErrors,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();

  const orgName: string = watch("orgName");
  const orgPhone: string = watch("orgPhoneNumber");

  const submitNext = () => {
    // validate input of fields
    if (orgName?.length == 0 || orgName == undefined) {
      setError("orgName", {
        type: "required",
        message: "Organization name required",
      });
    } else {
      clearErrors("orgName");
    }
    if (removeDashes(orgPhone ?? "").length != 10) {
      setError("orgPhoneNumber", {
        type: "required",
        message: "Phone Number Required",
      });
    } else {
      clearErrors("orgPhoneNumber");
    }
    //proceed to next Step
    if (
      orgName?.length > 0 &&
      removeDashes(orgPhone ?? "").length == 10 &&
      orgName.length > 0
    ) {
      setStep(2);
    }
  };

  // Event listener for using enter key to press next btn
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key == "Enter") {
        submitNext();
      }
    };

    document.addEventListener("keydown", (e) => handleKey(e));

    return () => {
      document.removeEventListener("keydown", (e) => handleKey(e));
    };
  });

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
        <div className="mt-6">
          <label className="form-label">Organization Name</label>
          <input
            type="text"
            className="input-field"
            defaultValue={""}
            {...register("orgName")}
          />
          {errors.orgName && <ErrorSpan>{errors.orgName.message}</ErrorSpan>}
        </div>
        {/* <div className='mt-3'>
        <label className='form-label'>Website</label>
        <div className=' relative'>
          <input
            type='text'
            className='input-field pl-20'
            {...register("orgWebsite", {
              required: true,
              pattern:
                /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
            })}
          />

          <div className='translate absolute top-1/2 left-0 -translate-y-1/2 rounded-l-lg bg-gray-200 py-2 px-3 text-gray-600'>
            https://
          </div>
        </div>
        {errors.orgWebsite && <ErrorSpan>Enter a valid URL</ErrorSpan>}
      </div> */}
        <div className="">
          <label className="form-label">Phone</label>
          <Controller
            name="orgPhoneNumber"
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
                  type="tel"
                  {...field}
                  onChange={(e) => {
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
                  id="phone"
                  autoComplete="phone"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
                {fieldState.error && (
                  <span className="text-red-500">
                    {fieldState.error.message}
                  </span>
                )}
              </>
            )}
          />
          <label className="form-label">Timezone</label>
          <Controller
            name={"timezone"}
            control={control}
            defaultValue={Intl.DateTimeFormat().resolvedOptions().timeZone}
            render={({ field: { onChange, value } }) => {
              console.log(Intl.supportedValuesOf("timeZone"));
              return (
                <NewSingleSelect
                  selected={value}
                  setSelected={(t) => onChange(t)}
                  list={Intl.supportedValuesOf("timeZone").map((item) => ({
                    item: item,
                    hide: false,
                  }))}
                  label={(tz) => tz.replace(/_/g, " ")}
                ></NewSingleSelect>
                // <SingleSelect
                //   selected={value}
                //   setSelected={(t) => onChange(t)}
                //   list={Intl.supportedValuesOf('timeZone')}
                // ></SingleSelect>
              );
            }}
          />
        </div>
        <div
          onClick={(e) => e.preventDefault()}
          className="mt-6 flex items-center justify-center gap-6"
        >
          <BtnPurple fullWidth={true} onClick={() => submitNext()}>
            Next
          </BtnPurple>
        </div>
      </section>
    </>
  );
};
