import { Locations } from "@prisma/client";
import { Controller, useFormContext } from "react-hook-form";
import { ErrorSpan } from "../../errors/errorSpan";
import { AddSelection } from "../AddSelection";
import { NewSingleSelect } from "../singleSelect";
import { createPortal } from "react-dom";
import { useState } from "react";
import { LocationAddModel } from "../../modal/locationAdd";
import { api } from "../../../server/utils/api";

export const LocationSelector = () => {
  const { control } = useFormContext();
  const [open, setOpen] = useState(false);
  const [locations, _locationsQuery] =
    api.locations.getLocationsByOrg.useSuspenseQuery(undefined);
  
  if (!locations) {
    return <></>;
  }

  return (
    <>
      {open &&
        createPortal(
          <LocationAddModel open={open} setOpen={setOpen} />,
          document.body
        )}
      <div className="col-span-6 md:col-span-4 ">
        <label className="text-gray-700">Event Location</label>
        <Controller
          name="eventLocation"
          control={control}
          defaultValue={{ id: "", name: "", organizationId: "" }}
          rules={{ validate: { isNull: (v) => v.id != "" } }}
          render={({ field: { onChange, value }, fieldState }) => (
            <>
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
                    }}
                  >
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
