import { Role } from "@prisma/client";
import { useEffect, useState } from "react";
import {
  useForm,
  useFormContext,
  useFieldArray,
  Controller,
} from "react-hook-form";
import { trpc } from "../../../utils/trpc";
import { SingleSelect } from "../singleSelect";

export const PositionsSelector = () => {
  const rolesQuery = trpc.useQuery(["role.getRolesByOrganization"], {
    onSuccess(data) {
      if (data != undefined) {
        setRoles(data);
      }
    },
  });
  const [roles, setRoles] = useState<Role[]>([]);
  const { control, register } = useFormContext();
  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray(
    {
      control, // control props comes from useForm (optional: if you are using FormContext)
      name: "positions", // unique name for your Field Array
    }
  );

  useEffect(() => {
    append({ position: { id: "", name: "" }, quantity: 1 });
  }, [append]);

  return (
    <div className='col-span-6 px-6'>
      {/*  */}
      <div className='grid grid-cols-6 gap-6'>
        <div className='col-span-4'>
          <label className=''>Position</label>
        </div>
        <div className='col-span-2'>
          <label className=''>Quantity</label>
        </div>
      </div>

      <div className='grid grid-cols-6 gap-6'>
        {fields.map((field, index) => (
          <>
            <div className='col-span-4' key={index}>
              <Controller
                name={`positions.${index}.position`}
                control={control}
                render={({ field }) => (
                  <SingleSelect
                    selected={field.value}
                    setSelected={field.onChange}
                    list={roles}
                  />
                )}
              />
            </div>
            <div className='col-span-2'>
              <input
                key={field.id} // important to include key with field's id
                {...register(`positions.${index}.quantity`)}
                type='number'
                className=' focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border border-gray-300 rounded-md'
              />
            </div>
          </>
        ))}
        {/* <div>fadfdsafdsa</div> */}
        <button
          className=''
          type='button'
          onClick={() =>
            append({ position: { id: "", name: "" }, quantity: 1 })
          }>
          click
        </button>
      </div>
    </div>
  );
};
