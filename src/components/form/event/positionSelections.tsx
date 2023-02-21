import { Role } from "@prisma/client";
import { useEffect, useState } from "react";
import {
  useForm,
  useFormContext,
  useFieldArray,
  Controller,
} from "react-hook-form";
import { trpc } from "../../../utils/trpc";
import { NewSingleSelect, SingleSelect } from "../singleSelect";
import { MdAddCircleOutline, MdDelete } from "react-icons/md";
import { ErrorSpan } from "../../errors/errorSpan";
import { AddSelection } from "../AddSelection";
import { createPortal } from "react-dom";
import { PositionAddModal } from "../../modal/positionAdd";

export const PositionsSelector = () => {
  const [open, setOpen] = useState(false);
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
  };

  const posiitonsField: positionField[] = watch("positions");

  useEffect(() => {
    if (rolesQuery.data == undefined || posiitonsField == undefined) return;
    const _roles = rolesQuery.data?.map((item) => {
      return { ...item, show: true };
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
    });
  }, [append, posiitonsField?.length]);

  return (
    <>
      {open == true &&
        createPortal(
          <PositionAddModal open={open} setOpen={setOpen} />,
          document.body
        )}
      <div className='col-span-6 mb-6 px-6'>
        {/*  */}
        <div className='grid grid-cols-8 gap-6'>
          <div className='col-span-4'>
            <label className=''>Position</label>
          </div>
        </div>

        <div className='mt-1 grid gap-y-6'>
          {fields.map((field, index) => (
            <div
              key={field.id}
              className='mt-1 grid grid-cols-6 gap-x-3 gap-y-6'>
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
                      <NewSingleSelect
                        selected={field.value}
                        setSelected={(value) => {
                          update(index, {
                            eventPositionId: null,
                            position: value,
                          });
                          clearErrors(`positions.${index}`);
                        }}
                        list={roles.map((role) => ({ item: role, show: true }))}
                        label={(role) => role.name}
                        showAdd
                        showAddComponent={
                          <AddSelection onClick={() => setOpen(true)}>
                            Add a Position
                          </AddSelection>
                        }
                      />

                      {/* <SingleSelect
                      selected={field.value}
                      // setSelected={field.onChange}
                      setSelected={(value) => {
                        update(index, {
                          eventPositionId: null,
                          position: value,
                        });
                        clearErrors(`positions.${index}`);
                      }}
                      list={roles}
                    /> */}
                      {fieldState.error?.type == "isNull" && (
                        <ErrorSpan>Position Required</ErrorSpan>
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
                    })
                  }
                  className={`col-span-1 flex cursor-pointer cursor-pointer items-center justify-center`}>
                  <MdAddCircleOutline size={25} className={`text-green-600`} />
                </div>
                <div
                  onClick={() => remove(index)}
                  className={`col-span-1 flex cursor-pointer items-center justify-center ${
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
    </>
  );
};
