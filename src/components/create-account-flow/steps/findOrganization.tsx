import { Combobox, Transition } from "@headlessui/react";
import { Organization } from "@prisma/client";
import { Dispatch, FormEvent, Fragment, SetStateAction, useState } from "react";
import { Controller, FormProvider, useFormContext } from "react-hook-form";
import { api } from "../../../server/utils/api";
import { BtnNeutral } from "../../btn/btnNeutral";
import { BtnPurple } from "../../btn/btnPurple";
import { CircularProgress } from "../../circularProgress";
import { ErrorSpan } from "../../errors/errorSpan";
import { CardHeader } from "../components/cardHeader";

// TODO: Fix full text search to search partial word
export const FindOrganization = ({
  setStep,
}: {
  setStep: Dispatch<SetStateAction<number>>;
}) => {
  const {
    register,
    control,
    setValue,
    setError,
    clearErrors,
    formState: { errors },
  } = useFormContext();
  const [selectedOrg, setSelectedOrg] = useState("");
  const [query, setQuery] = useState("");
  const searchQuery = api.createAccount.searchForOrg.useQuery(query, {
    enabled: !!(query != ""),
  });
  return (
    <>
      <CardHeader>Find Organization</CardHeader>

      <Controller
        control={control}
        name="orgName"
        defaultValue={null}
        rules={{ required: "Please select an organization." }}
        render={({ field, formState, fieldState }) => (
          <>
            <section className="mt-6">
              <Combobox
                value={field.value}
                onChange={(value: Organization) => {
                  field.onChange(value.name);
                  setValue("orgID", value.id);
                }}
              >
                <div className="relative">
                  <Combobox.Input
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    onChange={(e) => {
                      setQuery(e.target.value);
                      field.onChange(null);
                    }}
                  />
                  {fieldState.error && (
                    <ErrorSpan>{fieldState.error.message}</ErrorSpan>
                  )}
                  <Transition
                    as={Fragment}
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <Combobox.Options className="absolute z-20 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                      {searchQuery.isLoading && (
                        <div className="flex justify-center py-2">
                          <CircularProgress />
                        </div>
                      )}
                      {!searchQuery.isLoading &&
                        (searchQuery.isError ||
                          searchQuery.data?.length == 0) && (
                          <div className="py-2 pl-10">
                            Organization Not Found
                          </div>
                        )}
                      {searchQuery.data?.map((org) => (
                        <Combobox.Option
                          key={org.id}
                          value={org}
                          className={({ active }) =>
                            `relative cursor-default select-none py-2 pl-10 pr-4 ${
                              active ? "bg-indigo-100" : "text-gray-900"
                            }`
                          }
                        >
                          {({ selected }) => (
                            <>
                              <span
                                className={`block cursor-pointer truncate ${
                                  selected
                                    ? "font-medium text-indigo-700"
                                    : "font-normal"
                                }`}
                              >
                                {org.name}
                              </span>
                            </>
                          )}
                        </Combobox.Option>
                      ))}
                    </Combobox.Options>
                  </Transition>
                </div>
              </Combobox>
            </section>
            <div
              onClick={(e) => e.preventDefault()}
              className="mt-6 flex items-center justify-center gap-6"
            >
              <BtnNeutral
                func={() => {
                  field.onChange(null);
                  setStep(1);
                }}
              >
                Back
              </BtnNeutral>
              <BtnPurple
                onClick={() => {
                  if (field.value == null) {
                    setError("orgName", {
                      type: "required",
                      message: "Please select an existing organization.",
                    });
                  } else if (field.value != "") {
                    clearErrors("orgName");
                    setStep(3);
                  }
                }}
              >
                Next
              </BtnPurple>
            </div>
          </>
        )}
      />
      <input {...register("orgID")} type={"hidden"} />
    </>
  );
};
