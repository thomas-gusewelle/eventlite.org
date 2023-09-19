import React, { useContext, useEffect, useRef } from "react";
import { useState } from "react";
import { TableOptionsDropdown } from "../../types/tableMenuOptions";
import { SectionHeading } from "../components/headers/SectionHeading";
import { sidebar } from "../components/layout/sidebar";

import { api } from "../server/utils/api"
import { Availability, Role, User } from "@prisma/client";
import { CircularProgress } from "../components/circularProgress";
import { useForm, Controller } from "react-hook-form";
import { fullName } from "../utils/fullName";

import { ScheduleSelect } from "../components/form/scheduleSelect";
import { LimitSelect } from "../components/form/limitSelect";
import { UserContext } from "../providers/userProvider";
import { useRouter } from "next/router";

import { TableDropdown } from "../components/menus/tableDropdown";
import { Modal } from "../components/modal/modal";
import { ModalBody } from "../components/modal/modalBody";
import { BtnCancel } from "../components/btn/btnCancel";
import { BottomButtons } from "../components/modal/bottomButtons";
import { BtnDelete } from "../components/btn/btnDelete";
import { ModalTitle } from "../components/modal/modalTitle";
import { shortDate } from "../components/dateTime/dates";
import { shortTime } from "../components/dateTime/times";
import { AlertContext } from "../providers/alertProvider";
import { NoDataLayout } from "../components/layout/no-data-layout";
import { useQueryClient } from "@tanstack/react-query";
import { createPortal } from "react-dom";
import { EmailScheduleModal } from "../components/modal/emailScheduleModal";
import { BtnPurple } from "../components/btn/btnPurple";

const SchedulePageComponent: React.FC<{ cursor: string | null }> = ({
  cursor,
}) => {
  const utils = useQueryClient()
  const router = useRouter();
  const userContext = useContext(UserContext);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const eventId = useRef<{ id: string | null }>({ id: null });
  const [deleteAllRecurring, setDeleteAllRecuring] = useState<boolean>(false);
  const [openEmailScheduleModal, setOpenEmailScheduleModal] = useState(false);

  const alertContext = useContext(AlertContext);

  const [selectedPeople, setSelectedPeople] = useState<
    {
      userId: string | null;
      dateTime: Date;
    }[]
  >();
  const [poepleList, setPoepleList] = useState<
    (User & {
      roles: Role[];
      availability: Availability[];
    })[]
  >();
  const user = useContext(UserContext);
  const [limit, setLimit] = useState(
    user?.UserSettings?.scheduleShowAmount ?? 4
  );

  const getScheduleQuery = api.schedule.getSchedule.useQuery(
    { limit: limit, cursor: cursor },
    {
      keepPreviousData: true,
      onSuccess(data) {
        let _selectedPeople: { userId: string | null; dateTime: Date }[] = [];
        data.items?.map((item) =>
          item.positions.map((pos) =>
            _selectedPeople.push({
              userId: pos.userId,
              dateTime: item.datetime,
            })
          )
        );

        setSelectedPeople(_selectedPeople);
        setPoepleList(data.users);
      },
      // onError: () => router.push("/events"),
    }
  );

  useEffect(() => {
  }, [getScheduleQuery]);

  const scheduleUserMutation = api.schedule.updateUserRole.useMutation({
    onSuccess() {
      alertContext.setSuccess({ state: true, message: "Changes Saved" });
    },
  });

  const removeUserFromPosition = api.schedule.removeUserfromPosition.useMutation(
    {
      onMutate(variables) {
        setSelectedPeople(
          selectedPeople?.filter((people) => people.userId != variables.userId)
        );
      },
      onSuccess() {
        alertContext.setSuccess({ state: true, message: "Changes Saved" });
      },
    }
  );

  const methods = useForm();

  const deleteEventMutation = api.events.deleteEventById.useMutation({
    onMutate(data) {
      utils.cancelQueries();

      setDeleteConfirm(false);
    },
    onError() {
      getScheduleQuery.refetch();
    },
    onSuccess() {
      eventId.current.id = null;
      setDeleteAllRecuring(false);
      api.useContext().schedule.getSchedule.invalidate()
      getScheduleQuery.refetch();
    },
  });

  const addOptions: TableOptionsDropdown = [
    { name: "New Event", href: "/events/addevent" },
    { name: "From Template", href: "#" },
  ];

  const sumbit = methods.handleSubmit((data) => {
    data = Object.values(data).filter((item) => item.positionId != null);
  });

  if (getScheduleQuery.isLoading) {
    return (
      <div className='flex justify-center'>
        <CircularProgress />
      </div>
    );
  }

  if (
    getScheduleQuery.data?.items?.length == 0 ||
    getScheduleQuery.data == undefined ||
    poepleList == undefined
  ) {
    return (
      <NoDataLayout
        heading={"Schedule"}
        text={"No events found. Please add an event."}
        func={() => router.push(`/events/addevent?redirect=${router.asPath}`)}
        btnText={"Add Event"}
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
      <div className='relative'>
        <form onSubmit={sumbit}>
          <div className='mb-3 flex justify-between gap-4 md:hidden'>
            <SectionHeading>Schedule</SectionHeading>
            <div className="flex gap-3 items-start">
              <LimitSelect selected={limit} setSelected={setLimit} />
            </div>
          </div>
          <div className='mb-3 hidden justify-between md:flex'>
            <SectionHeading>Schedule</SectionHeading>
            <div className="flex gap-3 min-w-max items-start self-stretch">
              <LimitSelect selected={limit} setSelected={setLimit} />
            </div>
          </div>

          <div className="flex mb-8">
            <BtnPurple onClick={() => setOpenEmailScheduleModal(!openEmailScheduleModal)}>Email Schedule</BtnPurple>
          </div>

          <div>
            <div className='mb-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4'>
              {getScheduleQuery?.data.items?.map((event) => (
                <div
                  key={event.id}
                  className='flex flex-col rounded-lg border border-gray-300 shadow'>
                  <div className=' mb-4 flex flex-col px-3 pt-4'>
                    <div className='flex justify-between'>
                      <h3 className='text-xl font-bold'>{event.name}</h3>
                      <TableDropdown
                        options={[
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
                    </div>
                    <span className='text-lg font-medium'>
                      {event.Locations?.name}
                    </span>
                    <span>{shortDate(event.datetime)}</span>
                    <span>{shortTime(event.datetime)}</span>
                  </div>
                  <div>
                    {event.positions
                      .sort((a, b) => {
                        if (a.Role.name < b.Role.name) return -1;
                        else if (a.Role.name > b.Role.name) return 1;
                        else return 0;
                      })
                      .map((position, index) => {
                        return (
                          <div
                            className='grid grid-cols-3 border-t last:border-b last:pb-0'
                            key={position.id}>
                            <span className='flex items-center px-6 font-medium'>
                              {position.Role.name}
                            </span>
                            <div className='col-span-2'>
                              <>
                                <Controller
                                  key={index}
                                  name={position.id + index}
                                  defaultValue={
                                    {
                                      name: fullName(
                                        position.User?.firstName,
                                        position.User?.lastName
                                      ),
                                      userResponce: position.userResponse,
                                      userId: position.User?.id,
                                    } || { name: "Not Scheuled" }
                                  }
                                  control={methods.control}
                                  render={({ field, fieldState }) => (
                                    <ScheduleSelect
                                      selected={field.value}
                                      setSelected={(value) => {
                                        field.onChange(value);

                                        if (field.value.userId != null) {
                                          removeUserFromPosition.mutate(
                                            {
                                              userId: field.value.userId,
                                              eventPositionId: position.id,
                                            },
                                            {
                                              onSuccess() {
                                                if (value.name == null) return;
                                                scheduleUserMutation.mutate({
                                                  posisitionId: position.id,
                                                  userId: value.userId,
                                                });
                                              },
                                            }
                                          );
                                        }
                                        if (value.name == null) return;
                                        if (field.value.userId == null) {
                                          scheduleUserMutation.mutate({
                                            posisitionId: position.id,
                                            userId: value.userId,
                                          });
                                        }

                                        setSelectedPeople([
                                          ...(selectedPeople || [
                                            {
                                              userId: "",
                                              dateTime: new Date(),
                                            },
                                          ]),
                                          {
                                            userId: value.userId,
                                            dateTime: event.datetime,
                                          },
                                        ]);
                                      }}
                                      list={
                                        poepleList
                                          .filter(
                                            (person) =>
                                              !person.availability
                                                .map((ava) =>
                                                  ava.date.toDateString()
                                                )
                                                .includes(
                                                  event.datetime.toDateString()
                                                ) &&
                                              person.roles
                                                .map((role) => role.id)
                                                .includes(position.roleId) &&
                                              !selectedPeople
                                                ?.filter(
                                                  (date) =>
                                                    date.dateTime ==
                                                    event.datetime
                                                )
                                                .map((selPer) => selPer.userId)
                                                .includes(person.id)
                                          )
                                          .map((user) => ({
                                            name: fullName(
                                              user.firstName,
                                              user.lastName
                                            ),
                                            userId: user.id,
                                            positionId: position.id,
                                            show:
                                              (user.status != "INACTIVE" ||
                                                userContext?.UserSettings
                                                  ?.showInactiveInSchedule) ??
                                              true,
                                          })) || [{ name: "" }]
                                      }
                                    />
                                  )}
                                />
                              </>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className='mx-6 flex justify-between'>
            {getScheduleQuery.data.lastCursor &&
              getScheduleQuery.data.lastCursor.datetime.getTime() <
              getScheduleQuery.data.items[0]!.datetime.getTime() && (
                <button
                  onClick={() =>
                    router.push(
                      `/schedule?cursor=${getScheduleQuery.data.lastCursor?.id}`
                    )
                  }
                  disabled={getScheduleQuery.data.lastCursor ? false : true}
                  className='inline-flex items-center rounded-lg border border-gray-300 bg-gray-50 px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100'>
                  Prev Page
                </button>
              )}
            {getScheduleQuery.data.nextCursor && (
              <button
                onClick={() =>
                  router.push(
                    `/schedule?cursor=${getScheduleQuery.data.nextCursor?.id}`
                  )
                }
                disabled={getScheduleQuery.data.nextCursor ? false : true}
                className='ml-auto inline-flex items-center rounded-lg border border-gray-300 bg-gray-50 px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100'>
                Next Page
              </button>
            )}
          </div>
        </form>
      </div>
      {/* Schedule Email Modal*/}
      {createPortal(<EmailScheduleModal open={openEmailScheduleModal} setOpen={setOpenEmailScheduleModal} />, document.body)}
    </>
  );
};

const SchedulePage = () => {
  const router = useRouter();
  const { cursor } = router.query;

  if (typeof cursor != "string") {
    throw new Error("Invalid cursor type");
  }
  return <SchedulePageComponent cursor={cursor == "" ? null : cursor} />;
};

SchedulePage.getLayout = sidebar;

export default SchedulePage;
