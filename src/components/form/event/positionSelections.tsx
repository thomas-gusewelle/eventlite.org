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
import { MdAddCircleOutline, MdDelete } from "react-icons/md";

export const PositionsSelector = () => {
  const rolesQuery = trpc.useQuery(["role.getRolesByOrganization"], {
    onSuccess(data) {
      if (data != undefined) {
        setRoles(data);
      }
    },
  });
  const [roles, setRoles] = useState<Role[]>([]);
  const { control, register, setValue, watch } = useFormContext();
  const { fields, append, prepend, remove, swap, move, insert, update } =
    useFieldArray({
      name: "positions", // unique name for your Field Array
    });

  const posiitonsField = watch("positions");
  useEffect(() => {
    console.log("field values: ", posiitonsField);
  });

  useEffect(() => {
    append(
      {
        eventPositionId: "fdafdsa",
        position: { id: "", name: "" },
        quantity: 1,
      },
      { shouldFocus: false }
    );
  }, [append]);

  const changeValue = (index: number, value: any) => {
    update(index, value);
  };

  return (
    <div className='col-span-6 px-6 mb-6'>
      {/*  */}
      <div className='grid grid-cols-8 gap-6'>
        <div className='col-span-4'>
          <label className=''>Position</label>
        </div>
        <div className='col-span-2'>
          <label className=''>Quantity</label>
        </div>
      </div>

      <div className='grid gap-y-6 mt-1'>
        {fields.map((field, index) => (
          <div key={field.id} className='grid grid-cols-8 gap-x-3 gap-y-6 mt-1'>
            <div className='col-span-4'>
              <Controller
                name={`positions.${index}.position`}
                control={control}
                render={({ field }) => (
                  <SingleSelect
                    selected={field.value}
                    // setSelected={field.onChange}
                    setSelected={(value) =>
                      update(index, {
                        eventPositionId: null,
                        position: value,
                        quantity: posiitonsField[index].quantity,
                      })
                    }
                    list={roles}
                  />
                )}
              />
            </div>
            <div className='col-span-2'>
              <Controller
                name={`positions.${index}.quantity`}
                render={({ field }) => (
                  <input
                    // important to include key with field's id
                    {...field}
                    // onChange={(e) => {
                    //   field.onChange(parseInt(e.target.value));
                    //   setValue(`positions.${index}.eventPositionId`, null);
                    // }}
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                    type='number'
                    className=' focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border border-gray-300 rounded-md'
                  />
                )}
              />
            </div>
            <div className='col-span-2 grid grid-cols-2'>
              <div
                onClick={() =>
                  insert(index, { position: { id: "", name: "" }, quantity: 1 })
                }
                className='col-span-1 flex justify-center items-center'>
                <MdAddCircleOutline size={25} className='text-green-600' />
              </div>
              <div
                onClick={() => remove(index)}
                className='cursor-pointer col-span-1 flex justify-center items-center'>
                <MdDelete size={25} className='text-red-600' />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
