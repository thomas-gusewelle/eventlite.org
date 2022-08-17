import React, { useEffect } from "react";
import { useState } from "react";
import { InfiniteData } from "react-query";
import { TableOptionsDropdown } from "../../types/tableMenuOptions";
import { SectionHeading } from "../components/headers/SectionHeading";
import { sidebar } from "../components/layout/sidebar";
import { AddDropdownMenu } from "../components/menus/addDropdown";
import { trpc } from "../utils/trpc";
import { Event } from "@prisma/client";
import { CircularProgress } from "../components/circularProgress";
import { TableDropdown } from "../components/menus/tableDropdown";
import { PicNameRowSmall } from "../components/profile/PicNameRow";
import { SingleSelect } from "../components/form/singleSelect";
import { useForm, FormProvider, Controller } from "react-hook-form";

const SchedulePage = () => {
  const utils = trpc.useContext();
  const [cursor, setcursor] = useState<string | null | undefined>(null);

  const getScheduleQuery = trpc.useQuery(
    ["schedule.getSchedule", { limit: 3, cursor: cursor }],
    {
      keepPreviousData: true,
      onSuccess(data) {
        console.log("this is the data: ", data);
      },
    }
  );

  const methods = useForm();

  const addOptions: TableOptionsDropdown = [
    { name: "New Event", href: "/events/addevent" },
    { name: "From Template", href: "#" },
  ];

  if (
    getScheduleQuery.data == undefined ||
    getScheduleQuery.data.users == undefined ||
    getScheduleQuery.isLoading
  ) {
    return (
      <div className='flex justify-center'>
        <CircularProgress />
      </div>
    );
  }
  return (
    <>
      <FormProvider {...methods}>
        <div className='md:hidden grid grid-cols-2 mb-8 gap-4'>
          <SectionHeading>Events</SectionHeading>
          <div className='flex justify-end'>
            <AddDropdownMenu options={addOptions} />
          </div>
          <div className='col-span-2'>
            <input
              //   onChange={(e) => filter(e.target.value)}
              className='border border-gray-100 focus:outline-none focus:border-indigo-700 rounded-xl w-full text-sm text-gray-500 bg-gray-100 pl-4 py-2'
              type='text'
              placeholder='Search'
            />
          </div>
        </div>
        <div className='hidden md:flex justify-between mb-8'>
          <SectionHeading>Events</SectionHeading>
          <div className='flex gap-4'>
            <input
              // onChange={(e) => filter(e.target.value)}
              className='border border-gray-100 focus:outline-none focus:border-indigo-700 rounded-xl w-full text-sm text-gray-500 bg-gray-100 pl-4 py-2'
              type='text'
              placeholder='Search'
            />
            {/* <SearchBar /> */}
            <AddDropdownMenu options={addOptions} />
          </div>
        </div>
        <div>
          <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-12 px-6 mb-6'>
            {getScheduleQuery?.data.items.map((event) => (
              <div
                key={event.id}
                className='pt-4 shadow rounded-lg border border-gray-300'>
                <div className='flex flex-col px-6 mb-4'>
                  <div className='flex justify-between'>
                    <h3 className='font-bold text-xl'>{event.name}</h3>
                  </div>
                  <span className='text-lg font-medium'>
                    {event.Locations?.name}
                  </span>
                  <span>{event.datetime.toLocaleDateString()}</span>
                  <span>
                    {Intl.DateTimeFormat("en-US", {
                      timeStyle: "short",
                    }).format(event.datetime)}
                  </span>
                </div>
                {event.positions.map((position) => {
                  let positionNum = [];
                  for (let i = 1; i <= position.numberNeeded; i++) {
                    positionNum.push(i);
                  }
                  return positionNum.map((num, index) => (
                    <div
                      className='grid grid-cols-2 items-center last:pb-0 last:border-b border-t'
                      key={position.id + index}>
                      <span className='py-3 px-6 font-medium'>
                        {position.Role.name}
                      </span>
                      {position.User[index] ? (
                        <div
                          className={`flex justify-center h-full py-1 px-3 text-center ${
                            position.userResponse == null && "bg-gray-100"
                          }
                   ${position.userResponse == true && "bg-green-200"}
                   ${position.userResponse == false && "bg-red-200"}
                   `}>
                          <PicNameRowSmall user={position?.User[index]} />
                        </div>
                      ) : (
                        <Controller
                          name={`test${position.id}`}
                          defaultValue={{ name: "" }}
                          render={({ field, fieldState }) => (
                            <SingleSelect
                              selected={field.value}
                              setSelected={field.onChange}
                              list={
                                getScheduleQuery?.data?.users?.map((user) => ({
                                  name: user.firstName + " " + user.lastName,
                                  show: true,
                                })) || [{ name: "" }]
                              }
                            />
                          )}
                        />
                      )}
                    </div>
                  ));
                })}
              </div>
            ))}
          </div>
        </div>
        <button
          onClick={() => setcursor(getScheduleQuery.data?.lastCursor?.id)}
          className='text-white bg-red-500 p-2 m-2'>
          {getScheduleQuery.data?.lastCursor?.datetime.toLocaleDateString()}
        </button>
        <button
          onClick={() => setcursor(getScheduleQuery.data?.nextCursor?.id)}
          className='text-white bg-red-500 p-2 mr-2'>
          {getScheduleQuery.data?.nextCursor?.datetime.toLocaleDateString() ||
            null}
        </button>
      </FormProvider>
    </>
  );
};

SchedulePage.getLayout = sidebar;

export default SchedulePage;
