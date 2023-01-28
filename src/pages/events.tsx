import { Tab } from "@headlessui/react";
import { Event, EventPositions, Locations, Role, User } from "@prisma/client";
import { useRouter } from "next/router";
import { FormEvent, useContext, useEffect, useRef, useState } from "react";
import { PaginateData } from "../../types/paginate";
import { TableOptionsDropdown } from "../../types/tableMenuOptions";
import { BtnCancel } from "../components/btn/btnCancel";
import { BtnDelete } from "../components/btn/btnDelete";
import { CircularProgress } from "../components/circularProgress";
import { shortDate } from "../components/dateTime/dates";
import { shortTime } from "../components/dateTime/times";
import { SectionHeading } from "../components/headers/SectionHeading";
import { NoDataLayout } from "../components/layout/no-data-layout";
import { PaginationBar } from "../components/layout/pagination-bar";
import { sidebar } from "../components/layout/sidebar";
import { AddDropdownMenu } from "../components/menus/addDropdown";
import { TableDropdown } from "../components/menus/tableDropdown";
import { BottomButtons } from "../components/modal/bottomButtons";
import { Modal } from "../components/modal/modal";
import { ModalBody } from "../components/modal/modalBody";
import { ModalTitle } from "../components/modal/modalTitle";
import { PicNameRowSmall } from "../components/profile/PicNameRow";
import { AlertContext } from "../providers/alertProvider";
import { UserContext } from "../providers/userProvider";
import { classNames } from "../utils/classnames";
import { paginate } from "../utils/paginate";
import { trpc } from "../utils/trpc";

type stateData = (Event & {
  Locations: Locations | null;
  positions: (EventPositions & {
    User: User | null;
    Role: Role;
  })[];
})[];

const EventsPage = () => {
  const user = useContext(UserContext);
  const [queryString, setQueryString] = useState("");

  const addOptions: TableOptionsDropdown = [
    { name: "New Event", href: "/events/addevent" },
    { name: "From Template", href: "#" },
  ];

  return (
    <>
      {/* MD Top Bar */}
      <div className='mb-3 grid grid-cols-2 gap-4 md:hidden'>
        <SectionHeading>Events</SectionHeading>
        <div className='flex justify-end'>
          {user?.status == "ADMIN" && <AddDropdownMenu options={addOptions} />}
        </div>
        <div className='col-span-2'>
          <input
            value={queryString}
            onChange={(e) => setQueryString(e.target.value)}
            className='w-full rounded-xl border border-gray-100 bg-gray-100 py-2 pl-4 text-sm text-gray-500 focus:border-indigo-700 focus:outline-none'
            type='text'
            placeholder='Search'
          />
        </div>
      </div>

      {/* Desktop Top Bar */}
      <div className='mb-3 hidden justify-between md:flex'>
        <SectionHeading>Events</SectionHeading>
        <div className='flex gap-4'>
          <input
            onChange={(e) => setQueryString(e.target.value)}
            className='w-full rounded-xl border border-gray-100 bg-gray-100 py-2 pl-4 text-sm text-gray-500 focus:border-indigo-700 focus:outline-none'
            type='text'
            placeholder='Search'
          />
          {/* <SearchBar /> */}
          {user?.status == "ADMIN" && <AddDropdownMenu options={addOptions} />}
        </div>
      </div>

      <Tab.Group>
        <Tab.List className='mb-6 flex justify-start space-x-1 rounded-xl bg-gray-100 p-1 sm:w-fit'>
          {[
            {
              name: "Upcoming Events",
              onClick: () => setQueryString(""),
            },
            { name: "Past Events", onClick: () => setQueryString("") },
          ].map((item, index) => (
            <Tab
              key={index}
              onClick={item.onClick}
              className={({ selected }) =>
                classNames(
                  "w-full rounded-lg px-4 py-3 text-sm font-medium leading-5 sm:w-auto",
                  "ring-white ring-opacity-60 ring-offset-2 ring-offset-indigo-400 focus:outline-none focus:ring-2",
                  selected
                    ? "bg-white text-indigo-700 shadow"
                    : " text-gray-600 hover:bg-white/[0.12] hover:text-white"
                )
              }>
              {item.name}
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels>
          <Tab.Panel>
            <UpcomingEvents queryString={queryString} />
          </Tab.Panel>
          <Tab.Panel>
            <PastEvents queryString={queryString} />
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </>
  );
};

EventsPage.getLayout = sidebar;

export default EventsPage;

const UpcomingEvents = ({ queryString }: { queryString: string }) => {
  const utils = trpc.useContext();
  const router = useRouter();
  const alertContext = useContext(AlertContext);
  const user = useContext(UserContext);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const eventId = useRef<{ id: string | null }>({ id: null });
  const [deleteAllRecurring, setDeleteAllRecuring] = useState<boolean>(false);

  const [pageNum, setPageNum] = useState(1);
  const [paginatedData, setpagiantedData] = useState<PaginateData<stateData>>();
  const [events, setEvents] = useState<stateData>([]);
  const [eventsPagianted, setEventsPaginated] = useState<stateData>([]);

  useEffect(() => {
    if (events != undefined) {
      const _paginated = paginate(events, pageNum, 15);
      setpagiantedData(_paginated);
      setEventsPaginated(_paginated.data);
    }
  }, [pageNum, events]);

  const eventsQuery = trpc.useQuery(
    ["events.getUpcomingEventsByOrganization"],
    {
      onSuccess(data) {
        if (data != undefined) {
          setEvents(data);
        }
      },
      onError(err) {
        alertContext.setError({
          state: true,
          message: `There was an error fetching your events. Message: ${err.message}`,
        });
      },
    }
  );

  const deleteEventMutation = trpc.useMutation("events.deleteEventById", {
    onMutate(data) {
      utils.queryClient.cancelQueries();

      if (deleteAllRecurring == false) {
        setEvents(events.filter((event) => event.id != data.id));
      }
      if (deleteAllRecurring == true) {
        let _event = events.filter((event) => event.id == data.id);
        setEvents(
          events.filter((event) => event.recurringId != _event[0]?.recurringId)
        );
      }
      setDeleteConfirm(false);
    },
    onError(err) {
      alertContext.setError({
        state: true,
        message: `There was an error deleting the event. Message: ${err.message}`,
      });
      if (eventsQuery.data) {
        setEvents(eventsQuery.data);
      }
      eventsQuery.refetch();
    },
    onSuccess() {
      eventId.current.id = null;
      setDeleteAllRecuring(false);
      eventsQuery.refetch();
    },
  });

  useEffect(() => {
    const filter = () => {
      if (queryString.length > 0) {
        let key = queryString.toLowerCase();
        const filter = eventsQuery.data?.filter((event) => {
          return (
            event.name.toLowerCase().includes(key) ||
            event.Locations?.name.toLowerCase().includes(key) ||
            event.datetime.toLocaleDateString().toLowerCase().includes(key) ||
            event.datetime
              .toLocaleString("default", { month: "long" })
              .toLowerCase()
              .startsWith(key) ||
            event.positions.some((pos) =>
              pos.Role.name.toLowerCase().includes(key)
            ) ||
            event.positions.some(
              (pos) =>
                pos.User?.firstName?.toLowerCase().includes(key) ||
                pos.User?.lastName?.toLowerCase().includes(key)
            )
          );
        });

        if (filter == undefined) return;
        setPageNum(1);
        setEvents(filter);
      } else {
        if (eventsQuery.data == undefined) return;
        setEvents(eventsQuery.data);
      }
    };
    filter();
  }, [eventsQuery.data, queryString]);

  if (paginatedData == undefined) {
    return null;
  }

  if (eventsQuery.isLoading) {
    return (
      <div className='flex justify-center'>
        <CircularProgress />
      </div>
    );
  }

  if (eventsQuery.data?.length == 0) {
    return (
      <NoDataLayout
        heading='Events'
        btnText='Add Event'
        func={() => router.push("/events/addevent")}
      />
    );
  }

  return (
    <>
      <Modal open={deleteConfirm} setOpen={setDeleteConfirm}>
        <div className='flex justify-center'>
          <ModalBody>
            <ModalTitle
              text={
                deleteAllRecurring
                  ? "Are you sure you want to delete all events in this reccurance?"
                  : "Are you sure you want to delete this event?"
              }
            />
            <BottomButtons>
              <BtnDelete
                onClick={() => {
                  if (eventId.current.id != null)
                    deleteEventMutation.mutate({
                      id: eventId.current.id,
                      deleteRecurring: deleteAllRecurring,
                    });
                }}
              />
              <BtnCancel onClick={() => setDeleteConfirm(false)} />
            </BottomButtons>
          </ModalBody>
        </div>
      </Modal>
      <div className='mb-6 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4'>
        {eventsPagianted.map((event) => (
          <div
            key={event.id}
            className='flex flex-col rounded-lg border border-gray-300 pt-4 shadow'>
            <div className='mb-4 flex flex-col px-3'>
              <div className='flex justify-between'>
                <h3 className='text-xl font-bold'>{event.name}</h3>
                {user?.status == "ADMIN" && (
                  <TableDropdown
                    options={[
                      {
                        name: "Schedule",
                        href: `/schedule?cursor=${event.id}`,
                      },
                      {
                        name: "Edit",
                        href: `/events/edit/${event.id}?rec=false`,
                      },
                      {
                        name: "Edit Recurring",
                        href: `/events/edit/${event.id}?rec=true`,
                        show: event.recurringId ? true : false,
                      },
                      {
                        name: "Delete",
                        function: () => {
                          eventId.current.id = event.id;
                          setDeleteAllRecuring(false);
                          setDeleteConfirm(true);
                        },
                      },
                      {
                        name: "Delete Recurring",
                        function: () => {
                          setDeleteAllRecuring(true);
                          eventId.current.id = event.id;
                          setDeleteConfirm(true);
                        },
                        show: event.recurringId ? true : false,
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
              {event.positions
                .sort((a, b) => {
                  if (a.Role.name < b.Role.name) return -1;
                  else if (a.Role.name > b.Role.name) return 1;
                  else return 0;
                })
                .map((position) => {
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
                        <div className='h-full bg-gray-100' />
                      )}
                    </div>
                  );
                })}
            </div>
          </div>
        ))}
      </div>
      <PaginationBar
        setPageNum={setPageNum}
        pageNum={pageNum}
        paginateData={paginatedData}
      />
    </>
  );
};

const PastEvents = ({ queryString }: { queryString: string }) => {
  const utils = trpc.useContext();
  const router = useRouter();
  const alertContext = useContext(AlertContext);
  const user = useContext(UserContext);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const eventId = useRef<{ id: string | null }>({ id: null });
  const [deleteAllRecurring, setDeleteAllRecuring] = useState<boolean>(false);

  const [pageNum, setPageNum] = useState(1);
  const [paginatedData, setpagiantedData] = useState<PaginateData<stateData>>();
  const [events, setEvents] = useState<stateData>([]);
  const [eventsPagianted, setEventsPaginated] = useState<stateData>([]);
  useEffect(() => {
    if (events != undefined) {
      const _paginated = paginate(events, pageNum, 15);
      setpagiantedData(_paginated);
      setEventsPaginated(_paginated.data);
    }
  }, [pageNum, events]);

  const eventsQuery = trpc.useQuery(["events.getPastEventsByOrganization"], {
    onSuccess(data) {
      if (data != undefined) {
        setEvents(data);
      }
    },
    onError(err) {
      alertContext.setError({
        state: true,
        message: `There was an error fetching your events. Message: ${err.message}`,
      });
    },
  });

  const deleteEventMutation = trpc.useMutation("events.deleteEventById", {
    onMutate(data) {
      utils.queryClient.cancelQueries();

      if (deleteAllRecurring == false) {
        setEvents(events.filter((event) => event.id != data.id));
      }
      if (deleteAllRecurring == true) {
        let _event = events.filter((event) => event.id == data.id);
        setEvents(
          events.filter((event) => event.recurringId != _event[0]?.recurringId)
        );
      }
      setDeleteConfirm(false);
    },
    onError(err) {
      alertContext.setError({
        state: true,
        message: `There was an error deleting the event. Message: ${err.message}`,
      });
      if (eventsQuery.data) {
        setEvents(eventsQuery.data);
      }
      eventsQuery.refetch();
    },
    onSuccess() {
      eventId.current.id = null;
      setDeleteAllRecuring(false);
      eventsQuery.refetch();
    },
  });

  useEffect(() => {
    const filter = () => {
      if (queryString.length > 0) {
        let key = queryString.toLowerCase();
        const filter = eventsQuery.data?.filter((event) => {
          return (
            event.name.toLowerCase().includes(key) ||
            event.Locations?.name.toLowerCase().includes(key) ||
            event.datetime.toLocaleDateString().toLowerCase().includes(key) ||
            event.datetime
              .toLocaleString("default", { month: "long" })
              .toLowerCase()
              .startsWith(key) ||
            event.positions.some((pos) =>
              pos.Role.name.toLowerCase().includes(key)
            ) ||
            event.positions.some(
              (pos) =>
                pos.User?.firstName?.toLowerCase().includes(key) ||
                pos.User?.lastName?.toLowerCase().includes(key)
            )
          );
        });

        if (filter == undefined) return;
        setPageNum(1);
        setEvents(filter);
      } else {
        if (eventsQuery.data == undefined) return;
        setEvents(eventsQuery.data);
      }
    };
    filter();
  }, [eventsQuery.data, queryString]);

  if (paginatedData == undefined) {
    return null;
  }

  if (eventsQuery.isLoading) {
    return (
      <div className='flex justify-center'>
        <CircularProgress />
      </div>
    );
  }

  if (eventsQuery.data?.length == 0) {
    return (
      <NoDataLayout
        heading='Events'
        btnText='Add Event'
        func={() => router.push("/events/addevent")}
      />
    );
  }

  return (
    <>
      <Modal open={deleteConfirm} setOpen={setDeleteConfirm}>
        <div className='flex justify-center'>
          <ModalBody>
            <ModalTitle
              text={
                deleteAllRecurring
                  ? "Are you sure you want to delete all events in this reccurance?"
                  : "Are you sure you want to delete this event?"
              }
            />
            <BottomButtons>
              <BtnDelete
                onClick={() => {
                  if (eventId.current.id != null)
                    deleteEventMutation.mutate({
                      id: eventId.current.id,
                      deleteRecurring: deleteAllRecurring,
                    });
                }}
              />
              <BtnCancel onClick={() => setDeleteConfirm(false)} />
            </BottomButtons>
          </ModalBody>
        </div>
      </Modal>
      <div className='mb-6 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4'>
        {eventsPagianted.map((event) => (
          <div
            key={event.id}
            className='flex flex-col rounded-lg border border-gray-300 pt-4 shadow'>
            <div className='mb-4 flex flex-col px-3'>
              <div className='flex justify-between'>
                <h3 className='text-xl font-bold'>{event.name}</h3>
                {user?.status == "ADMIN" && (
                  <TableDropdown
                    options={[
                      {
                        name: "Schedule",
                        href: `/schedule?cursor=${event.id}`,
                      },
                      {
                        name: "Edit",
                        href: `/events/edit/${event.id}?rec=false`,
                      },

                      {
                        name: "Delete",
                        function: () => {
                          eventId.current.id = event.id;
                          setDeleteAllRecuring(false);
                          setDeleteConfirm(true);
                        },
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
              {event.positions
                .sort((a, b) => {
                  if (a.Role.name < b.Role.name) return -1;
                  else if (a.Role.name > b.Role.name) return 1;
                  else return 0;
                })
                .map((position) => {
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
                        <div className='h-full bg-gray-100' />
                      )}
                    </div>
                  );
                })}
            </div>
          </div>
        ))}
      </div>
      <PaginationBar
        setPageNum={setPageNum}
        pageNum={pageNum}
        paginateData={paginatedData}
      />
    </>
  );
};
