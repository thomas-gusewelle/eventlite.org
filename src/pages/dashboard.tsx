import { sidebar } from "../components/layout/sidebar";
import { trpc } from "../utils/trpc";
import { useContext, useState } from "react";
import { AlertContext } from "../providers/alertProvider";
import { BtnPurple } from "../components/btn/btnPurple";
import { SectionHeading } from "../components/headers/SectionHeading";
import { shortDate } from "../components/dateTime/dates";
import { shortTime } from "../components/dateTime/times";
import { PicNameRowSmall } from "../components/profile/PicNameRow";
import { BtnApprove } from "../components/btn/btnApprove";
import { BtnDeny } from "../components/btn/btnDeny";
import { UserContext } from "../providers/userProvider";
import { Event, EventPositions, Locations, Role, User } from "@prisma/client";

type stateData = (Event & {
  Locations: Locations | null;
  positions: (EventPositions & {
    User: User | null;
    Role: Role;
  })[];
})[];

const Dashboard = () => {
  const user = useContext(UserContext);
  const utils = trpc.useContext();
  const alertContext = useContext(AlertContext);
  const [eventsData, setEventsData] = useState<stateData>([]);
  const eventsQuery = trpc.useQuery(
    ["events.getUpcomingEventsByUser", { page: 1 }],

    {
      onSuccess(data) {
        if (data != undefined) {
          setEventsData(data);
        }
      },
      onError(err) {
        alertContext.setError({
          state: true,
          message: `Error getting upcoming events. ${err.message}`,
        });
      },
    }
  );
  const userResponseMutation = trpc.useMutation("events.updateUserresponse", {
    onError(error, variables, context) {
      alertContext.setError({
        state: true,
        message: `Error updating response. ${error.message}`,
      });
      eventsQuery.refetch();
    },
    onMutate(variables) {
      console.log(variables);
    },
    onSuccess() {
      utils.queryClient.cancelQueries();
      eventsQuery.refetch();
    },
  });

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
        {eventsData.map((event) => {
          let userResponse = event.positions.find(
            (item) => item.userId == user?.id
          );
          console.log(userResponse);
          return (
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
                  return (
                    <div
                      className='grid grid-cols-[1fr_1.5fr] items-center border-t last:rounded-b-lg last:border-b last:pb-0'
                      key={position.id}>
                      <span className='py-3 px-3 font-medium'>
                        {position.Role.name}
                      </span>
                      {position.User ? (
                        <div
                          className={`flex h-full py-1 px-3 text-center ${
                            position.userResponse == null && "bg-gray-100"
                          }
                    ${position.userResponse == true && "bg-green-200"}
                    ${position.userResponse == false && "bg-red-200"}
                    `}>
                          <PicNameRowSmall user={position?.User} />
                        </div>
                      ) : (
                        <div className='flex h-full items-center justify-center bg-gray-100 py-3 px-6 text-center leading-4'>
                          Not Scheduled
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              {/* User approval section */}
              {userResponse?.userResponse == null && (
                <div className='grid grid-cols-2'>
                  <BtnApprove
                    func={() =>
                      userResponseMutation.mutate({
                        response: "APPROVE",
                        positionId: userResponse?.id,
                      })
                    }
                  />
                  <BtnDeny
                    func={() =>
                      userResponseMutation.mutate({
                        response: "DENY",
                        positionId: userResponse?.id,
                      })
                    }
                  />
                </div>
              )}
              <button
                onClick={() =>
                  userResponseMutation.mutate({
                    positionId: userResponse?.id,
                    response: "NULL",
                  })
                }>
                reset
              </button>
            </div>
          );
        })}
      </div>
      <button
        onClick={() => alertContext.setSuccess({ state: true, message: "" })}>
        Approve
      </button>
    </>
  );
};

Dashboard.getLayout = sidebar;

export default Dashboard;
