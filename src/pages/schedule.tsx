import React, { useEffect } from "react";
import { useState } from "react";
import { InfiniteData } from "react-query";
import { TableOptionsDropdown } from "../../types/tableMenuOptions";
import { SectionHeading } from "../components/headers/SectionHeading";
import { sidebar } from "../components/layout/sidebar";
import { AddDropdownMenu } from "../components/menus/addDropdown";
import { trpc } from "../utils/trpc";
import { Event } from "@prisma/client";

const SchedulePage = () => {
  const utils = trpc.useContext();
  const [cursor, setcursor] = useState<string | null | undefined>(null);
  const [lastCursor, setLastCursor] = useState<string | null | undefined>(null);
  const scheduleInfiniteQuery = trpc.useInfiniteQuery(
    ["schedule.infiniteSchedule", { limit: 1 }],
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      onSuccess(data) {},
    }
  );
  const [data, setData] = useState<{
    items: Event[];
    nextCursor: string | undefined;
    lastCursor: string | null | undefined;
  }>();
  const getScheduleQuery = trpc.useQuery(
    ["schedule.getSchedule", { limit: 1, cursor: cursor }],
    {
      keepPreviousData: true,

      onSuccess(data) {
        if (lastCursor == null) {
          setLastCursor(data.items[0]!.id);
        }

        setData(data);
      },
    }
  );
  useEffect(() => {
    console.log("thjis is the cuirsor", cursor);
    console.log("this is the last cursor", lastCursor);
  }, [cursor, lastCursor]);

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
        {data?.items.map((item) => (
          <div key={item.id}>
            <h1>{item.name}</h1>
            <p>{item.datetime.toLocaleDateString()}</p>
          </div>
        ))}
      </div>
      <button
        onClick={() => setcursor(lastCursor)}
        className='text-white bg-red-500 p-2 m-2'>
        get prev page
      </button>
      <button
        onClick={() => setcursor(getScheduleQuery.data?.nextCursor)}
        className='text-white bg-red-500 p-2 mr-2'>
        get next page
      </button>

      {/* <div>
        {scheduleInfiniteQuery.data?.pages.map((group, i) => (
          <React.Fragment key={i}>
            {group.items.map((item) => (
              <div key={item.id}>
                <h1 key={item.id}>{item.name}</h1>
                <p>{item.datetime.toLocaleDateString()}</p>
              </div>
            ))}
          </React.Fragment>
        ))}
      </div>
      <button
        onClick={() => scheduleInfiniteQuery.fetchNextPage()}
        className='bg-red-500 text-white p-2'>
        Move Page Forward
      </button> */}
    </>
  );
};

SchedulePage.getLayout = sidebar;

export default SchedulePage;
