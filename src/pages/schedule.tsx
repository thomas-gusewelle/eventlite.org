import React from "react";
import { useState } from "react";
import { InfiniteData } from "react-query";
import { TableOptionsDropdown } from "../../types/tableMenuOptions";
import { SectionHeading } from "../components/headers/SectionHeading";
import { sidebar } from "../components/layout/sidebar";
import { AddDropdownMenu } from "../components/menus/addDropdown";
import { trpc } from "../utils/trpc";

const SchedulePage = () => {
  const scheduleInfiniteQuery = trpc.useInfiniteQuery(
    ["schedule.infiniteSchedule", { limit: 4 }],
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      onSuccess(data) {},
    }
  );

  const addOptions: TableOptionsDropdown = [
    { name: "New Event", href: "/events/addevent" },
    { name: "From Template", href: "#" },
  ];
  return (
    <>
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
        {scheduleInfiniteQuery.data?.pages.map((group, i) => (
          <React.Fragment key={i}>
            {group.items.map((item) => (
              <h1 key={item.id}>{item.name}</h1>
            ))}
          </React.Fragment>
        ))}
      </div>
    </>
  );
};

SchedulePage.getLayout = sidebar;

export default SchedulePage;
