import { sidebar } from "../components/layout/sidebar";
import { trpc } from "../utils/trpc";
import { useRouter } from "next/router";
import { useUser } from "@supabase/auth-helpers-react";
import { useContext } from "react";
import { AlertContext } from "../providers/alertProvider";
import { BtnPurple } from "../components/btn/btnPurple";
import { SectionHeading } from "../components/headers/SectionHeading";
import { shortDate } from "../components/dateTime/dates";
import { shortTime } from "../components/dateTime/times";
import { PicNameRowSmall } from "../components/profile/PicNameRow";

const Dashboard = () => {
  const router = useRouter();
  const alertContext = useContext(AlertContext);
  const eventsQuery = trpc.useQuery([
    "events.getUpcomingEventsByUser",
    { page: 1 },
  ]);

  return (
    <>
      <div className='grid gap-3 sm:grid-cols-3'>
        <BtnPurple func={() => {}}>test</BtnPurple>
        <BtnPurple func={() => {}}>test</BtnPurple>
        <BtnPurple func={() => {}}>test</BtnPurple>
      </div>
      <div className='mt-8 flex justify-center'>
        <SectionHeading>Upcoming Events</SectionHeading>
      </div>
      <div className='my-6 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4'>
        {eventsQuery.data?.map((event) => (
          <div
            key={event.id}
            className='flex flex-col rounded-lg border border-gray-300 pt-4 shadow'>
            <div className='mb-4 flex flex-col px-3'>
              <h3 className='text-xl font-bold'>{event.name}</h3>

              <span className='text-lg font-medium'>
                {event.Locations?.name}
              </span>
              <span>{shortDate(event.datetime)}</span>
              <span>{shortTime(event.datetime)}</span>
            </div>
            <div className=''>
              {event.positions.map((position) => {
                let positionNum = [];
                for (let i = 1; i <= position.numberNeeded; i++) {
                  positionNum.push(i);
                }
                return positionNum.map((num, index) => (
                  <div
                    className='grid grid-cols-[1fr_1.5fr] items-center border-t last:rounded-b-lg last:border-b last:pb-0'
                    key={position.id + index}>
                    <span className='py-3 px-3 font-medium'>
                      {position.Role.name}
                    </span>
                    {position.User[index] ? (
                      <div
                        className={`flex h-full py-1 px-3 text-center ${
                          position.userResponse == null && "bg-gray-100"
                        }
                    ${position.userResponse == true && "bg-green-200"}
                    ${position.userResponse == false && "bg-red-200"}
                    `}>
                        <PicNameRowSmall user={position?.User[index]} />
                      </div>
                    ) : (
                      <div className='flex h-full items-center justify-center bg-gray-100 py-3 px-6 text-center leading-4'>
                        Not Scheduled
                      </div>
                    )}
                  </div>
                ));
              })}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

Dashboard.getLayout = sidebar;

export default Dashboard;
