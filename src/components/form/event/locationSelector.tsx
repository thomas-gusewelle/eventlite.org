import { Locations } from "@prisma/client";
import { Controller, useFormContext } from "react-hook-form";
import { ErrorSpan } from "../../errors/errorSpan";
import { AddSelection } from "../AddSelection";
import { NewSingleSelect } from "../singleSelect";
import { createPortal } from "react-dom";
import { useState } from "react";
import { LocationAddModel } from "../../modal/locationAdd";

export const LocationSelector = ({ locations }: { locations: Locations[] }) => {
  const { control, register, formState, watch } = useFormContext();
  const [open, setOpen] = useState(false);
  return (
    <>
      {open &&
        createPortal(
          <LocationAddModel open={open} setOpen={setOpen} />,
          document.body
        )}
      <div className='col-span-6 md:col-span-3 '>
        <label className='text-gray-700'>Event Location</label>
        <Controller
          name='eventLocation'
          control={control}
          defaultValue={{ id: "", name: "", organizationId: "" }}
          rules={{ validate: { isNull: (v) => v.id != "" } }}
          render={({ field: { onChange, value }, fieldState }) => (
            <>
              {/* <SingleSelect
            selected={value}
            setSelected={onChange}
            list={locations}
          /> */}
              <NewSingleSelect
                selected={value}
                setSelected={onChange}
                list={locations.map((loc) => ({ item: loc, hide: false }))}
                label={(item) => item.name}
                showAdd={true}
                showAddComponent={
                  <AddSelection
                    onClick={() => {
                      setOpen(true);
                    }}>
                    Add a Location
                  </AddSelection>
                }
              />
              {fieldState.error?.type == "isNull" && (
                <ErrorSpan>Location Required</ErrorSpan>
              )}
            </>
          )}
        />
      </div>
    </>
  );
};
