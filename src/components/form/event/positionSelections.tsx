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
import { ErrorSpan } from "../../errors/errorSpan";

export const PositionsSelector = () => {
  const rolesQuery = trpc.useQuery(["role.getRolesByOrganization"], {
    onSuccess(data) {
      if (data != undefined) {
        const _data = data.map((item) => {
          return { ...item, show: true };
        });
        setRoles(_data);
      }
    },
  });
  const [roles, setRoles] = useState<(Role & { show: boolean })[]>([]);
  const {
    control,
    register,
    setValue,
    watch,
    clearErrors,
    formState: { errors },
  } = useFormContext();
  const { fields, append, prepend, remove, swap, move, insert, update } =
    useFieldArray({
      name: "positions", // unique name for your Field Array
    });

  type positionField = {
    eventPositionId: string;
    position: { id: string; name: string };
    quantity: number;
  };

  const posiitonsField: positionField[] = watch("positions");

  useEffect(() => {
    console.log(posiitonsField);
    if (rolesQuery.data == undefined || posiitonsField == undefined) return;
    const _roles = rolesQuery.data?.map((item) => {
      let isShow = !posiitonsField
        .map((field) => field.position.id)
        .includes(item.id);
      return { ...item, show: isShow };
    });
    if (_roles == undefined) return;

    setRoles(_roles);
  }, [setRoles, posiitonsField, rolesQuery.data]);

  //creates first position field on load of event create
  useEffect(() => {
    if (posiitonsField?.length == undefined) return;
    if (posiitonsField.length > 0) return;
    append({
      eventPositionId: null,
      position: { id: "", name: "" },
      quantity: 1,
    });
  }, [append, posiitonsField?.length]);

  const test = (v: any) => console.log(v);
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
                rules={{
                  validate: {
                    isNull: (v) => v.id != "",
                  },
                }}
                render={({ field, fieldState }) => (
                  <>
                    <SingleSelect
                      selected={field.value}
                      // setSelected={field.onChange}
                      setSelected={(value) => {
                        update(index, {
                          eventPositionId: null,
                          position: value,
                          quantity: posiitonsField[index]!.quantity,
                        });
                        clearErrors(`positions.${index}`);
                      }}
                      list={roles}
                    />
                    {fieldState.error?.type == "isNull" && (
                      <ErrorSpan>Position Required</ErrorSpan>
                    )}
                  </>
                )}
              />
            </div>
            <div className='col-span-2'>
              <Controller
                name={`positions.${index}.quantity`}
                rules={{ min: 1, max: 20 }}
                render={({ field, fieldState }) => (
                  <>
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
                    {fieldState.error?.type == "min" && (
                      <ErrorSpan>Quantity Must Be 1 or More</ErrorSpan>
                    )}
                    {fieldState.error?.type == "max" && (
                      <ErrorSpan>Max Quantity of 20</ErrorSpan>
                    )}
                  </>
                )}
              />
            </div>
            <div className='col-span-2 ml-3 flex gap-6'>
              <div
                onClick={() =>
                  insert(index + 1, {
                    eventPositionId: null,
                    position: { id: "", name: "" },
                    quantity: 1,
                  })
                }
                className={`cursor-pointer col-span-1 flex justify-center items-center ${
                  posiitonsField.length == rolesQuery.data?.length &&
                  "pointer-events-none"
                } cursor-pointer`}>
                <MdAddCircleOutline
                  size={25}
                  className={`text-green-600 ${
                    posiitonsField.length == rolesQuery.data?.length &&
                    "text-gray-300"
                  }`}
                />
              </div>
              <div
                onClick={() => remove(index)}
                className={`cursor-pointer col-span-1 flex justify-center items-center ${
                  index == 0 &&
                  posiitonsField.length < 2 &&
                  "pointer-events-none"
                }`}>
                <MdDelete
                  size={25}
                  className={`text-red-600 ${
                    index == 0 && posiitonsField.length < 2 && "text-gray-300"
                  }`}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
