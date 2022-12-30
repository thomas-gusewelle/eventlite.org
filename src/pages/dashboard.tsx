import { sidebar } from "../components/layout/sidebar";
import { trpc } from "../utils/trpc";
import { useContext, useEffect, useState } from "react";
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
import { DashboardAvaililityModal } from "../components/modal/dashboard/availibilityModal";
import { TableDropdown } from "../components/menus/tableDropdown";
import { CircularProgress } from "../components/circularProgress";

type stateData = (Event & {
  Locations: Locations | null;
  positions: (EventPositions & {
    User: User | null;
    Role: Role;
  })[];
})[];

// TODO: fix spacing issue when one event is approve and the other is not

const Dashboard = () => {
  const user = useContext(UserContext);
  const utils = trpc.useContext();
  const alertContext = useContext(AlertContext);
  const [availabilityModal, setAvailabilityModal] = useState(false);
  const [eventsData, setEventsData] = useState<stateData>([]);
  // render, setRender is being used to force rerending of nested eventsData on mutate
  const [render, setRender] = useState(true);

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
  const userResponseMutation = trpc.useMutation("events.updateUserResponse", {
    onError(error, variables, context) {
      alertContext.setError({
        state: true,
        message: `Error updating response. ${error.message}`,
      });
      eventsQuery.refetch();
    },
    onMutate(variables) {
      if (variables.positionId == undefined) return;
      // returns the event item we are working with
      let item = eventsData.find((item) =>
        item.positions.map((pos) => pos.id).includes(variables.positionId!)
      );
      // Findes index in posiiton list
      let posIndex = item?.positions.findIndex(
        (item) => item.id == variables?.positionId
      );

      //Checks undifined cases
      if (posIndex == -1 || posIndex == undefined) return;
      if (
        item == undefined ||
        item?.positions == undefined ||
        item?.positions[posIndex]?.userResponse === undefined
      )
        return;

      // Sets value based on user choice
      if (variables.response == "APPROVE") {
        item.positions[posIndex]!.userResponse = true;
      } else if (variables.response == "DENY") {
        item.positions[posIndex]!.userResponse = false;
      } else {
        item.positions[posIndex]!.userResponse = null;
      }

      // all other events in the list
      const others = eventsData.filter((event) => event.id != item?.id);
      setEventsData(
        [item, ...others].sort(
          (a, b) => a.datetime.getTime() - b.datetime.getTime()
        )
      );
      // forces rerender to work around nested object
      setRender(!render);
    },
    onSuccess() {
      // utils.queryClient.cancelQueries();
      eventsQuery.refetch();
    },
  });

  return (
    <>
      <DashboardAvaililityModal
        open={availabilityModal}
        setOpen={setAvailabilityModal}
      />
      <div className='flex justify-center'>
        <BtnPurple func={() => setAvailabilityModal(!availabilityModal)}>
          Update Availability
        </BtnPurple>
      </div>
      <div className='mt-8 flex justify-center'>
        <SectionHeading>Upcoming Events</SectionHeading>
      </div>

      {eventsQuery.isLoading || eventsQuery.isRefetching ? (
        <div className='my-6 flex justify-center'>
          <CircularProgress />
        </div>
      ) : (
        <div className='my-6 grid grid-cols-1 gap-6 xl:grid-cols-2 2xl:grid-cols-3'>
          {eventsData.map((event) => {
            let userResponse = event.positions.find(
              (item) => item.userId == user?.id
            );
            return (
              <div
                key={event.id}
                className='flex flex-col border-gray-300 pt-4'>
                <div
                  className={`rounded-t-lg pt-2 ${
                    userResponse?.userResponse == null
                      ? ""
                      : "rounded-b-lg border-b"
                  } round border-t border-r border-l shadow`}>
                  <div className='mb-4 flex flex-col px-3'>
                    <div className='flex justify-between'>
                      <h3 className='text-xl font-bold'>{event.name}</h3>
                      {userResponse?.userResponse != null && (
                        <TableDropdown
                          options={[
                            {
                              name: `Change Availability to ${
                                userResponse.userResponse == true
                                  ? "False"
                                  : "True"
                              }`,
                              function: () =>
                                userResponseMutation.mutate({
                                  positionId: userResponse?.id,
                                  response:
                                    userResponse?.userResponse == true
                                      ? "DENY"
                                      : "APPROVE",
                                }),
                            },
                            {
                              name: "Change Availability to Unknown",
                              function: () =>
                                userResponseMutation.mutate({
                                  positionId: userResponse?.id,
                                  response: "NULL",
                                }),
                            },
                          ]}
                        />
                      )}
                    </div>

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
                          className='grid grid-cols-[1fr_1.5fr] items-center border-t last:border-b last:pb-0'
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
                </div>
                {/* User approval section */}
                {userResponse?.userResponse == null && (
                  <div className='grid grid-cols-2 overflow-hidden rounded-b-lg border-b border-r border-l'>
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
              </div>
            );
          })}
        </div>
      )}
    </>
  );
};

Dashboard.getLayout = sidebar;

export default Dashboard;
