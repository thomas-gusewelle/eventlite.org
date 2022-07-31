import { Switch } from "@headlessui/react";
import { useEffect, useState } from "react";
import {
  Controller,
  FormProvider,
  useFieldArray,
  useForm,
  useFormContext,
} from "react-hook-form";
import { MdAccessTime, MdOutlineCalendarToday } from "react-icons/md";
import {
  EventFormValues,
  EventRepeatFrequency,
} from "../../../../types/eventFormValues";
import {
  CircularProgress,
  CircularProgressSmall,
} from "../../../components/circularProgress";
import { PositionsSelector } from "../../../components/form/event/positionSelections";
import { RecurringOptions } from "../../../components/form/event/recurringOptions";
import { SingleSelect } from "../../../components/form/singleSelect";
import { SectionHeading } from "../../../components/headers/SectionHeading";
import { sidebar } from "../../../components/layout/sidebar";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Locations } from "@prisma/client";
import { trpc } from "../../../utils/trpc";
import { useRouter } from "next/router";
import { formatEventData } from "../../../utils/formatEventData";

const EditEvent: React.FC<{ id: string }> = ({ id }) => {
  const router = useRouter();
  const eventQuery = trpc.useQuery(["events.getEventById", id], {
    onSuccess(data) {
      if (data && data.Locations != null) {
        methods.reset(formatEventData(data));
      }
    },
  });
  const editEvent = trpc.useMutation("events.editEvent");
  const [eventDate, setEventDate] = useState<Date>(new Date());
  const [eventTime, setEventTime] = useState<Date>();
  const [frequncyOptions, setFrequncyOptions] = useState<
    EventRepeatFrequency[]
  >([]);
  const [repeatFrequency, setRepeatFrequency] = useState<EventRepeatFrequency>({
    id: "D",
    name: "Daily",
  });
  const locationsQuery = trpc.useQuery(["locations.getLocationsByOrg"], {
    onSuccess(data) {
      if (data != undefined) {
        setLocations(data);
      }
    },
  });
  const [locations, setLocations] = useState<Locations[]>([
    { id: "", name: "", organizationId: "" },
  ]);
  const [isRepeating, setIsRepeating] = useState(false);
  const methods = useForm<EventFormValues>();
  const _isRepeating = methods.watch("isRepeating", false);
  const _repeatFrequency = methods.watch("repeatFrequency", {
    id: "D",
    name: "Daily",
  });

  useEffect(() => {
    if (_isRepeating != undefined) {
      setIsRepeating(_isRepeating);
    }
  }, [_isRepeating]);

  useEffect(() => {
    console.log(_repeatFrequency);
    if (_repeatFrequency != undefined) {
      setRepeatFrequency(_repeatFrequency);
    }
  }, [_repeatFrequency]);

  const submit = methods.handleSubmit((data) => {
    if (eventQuery.data?.organizationId == null) return;

    let newPositions = data.positions.filter((item) => {
      return eventQuery.data?.positions.every(
        (e) => e.Role.id != item.position.id || item.eventPositionId == null
      );
    });
    newPositions = newPositions.filter((item) => item.eventPositionId == null);

    let updatePositions = data.positions.filter((item) => {
      console.log("this is the position ID", item.eventPositionId);
      return eventQuery.data?.positions.filter(
        (e) => e.Role.id === item.position.id
      );
    });
    updatePositions = updatePositions.filter(
      (item) => item.eventPositionId != undefined
    );
    const deletePositions = eventQuery.data.positions.filter((item) => {
      return data.positions.every((d) => d.eventPositionId != item.id);
    });

    editEvent.mutate(
      {
        id: id,
        name: data.name,
        eventDate: data.eventDate,
        eventTime: data.eventTime,
        organization: eventQuery.data.organizationId,
        recurringId: eventQuery.data.recurringId || undefined,
        eventLocation: data.eventLocation,
        newPositions: newPositions.map((item) => ({
          position: {
            roleId: item.position.id,
            roleName: item.position.name,
            organizationId: item.position.organizationId,
          },
          quantity: item.quantity,
        })),
        updatePositions: updatePositions.map((item) => ({
          eventPositionId: item.eventPositionId!,
          position: {
            roleId: item.position.id,
            roleName: item.position.name,
            organizationId: item.position.organizationId,
          },
          quantity: item.quantity,
        })),
        deletePositions: deletePositions.map((item) => item.id),
      },
      {
        onSuccess() {
          router.push("/events");
        },
      }
    );
  });

  return (
    <>
      {/* The is loading is handled here to make the reset work correctly */}
      {eventQuery.isLoading ? (
        <div className='flex justify-center'>
          <CircularProgress />{" "}
        </div>
      ) : (
        <></>
      )}
      <div className={`${eventQuery.isLoading ? "hidden" : "block"}`}>
        <div className='mb-8'>
          <SectionHeading>Edit Event</SectionHeading>
        </div>
        <FormProvider {...methods}>
          <form onSubmit={submit} className='shadow'>
            <div className='grid grid-cols-6 gap-6 mb-6 px-6'>
              <div className='col-span-6 sm:col-span-3'>
                <label htmlFor='event-name' className=' text-gray-700'>
                  Event Name
                </label>
                <input
                  type='text'
                  id='Name'
                  autoFocus
                  {...methods.register("name", {
                    required: true,
                    minLength: 3,
                  })}
                  className=' focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
                />
                {methods.formState.errors.name && (
                  <span className='text-red-500'>Event Name is Required</span>
                )}
              </div>
              <div className='hidden sm:block col-span-3'></div>
              <div className='col-span-6 md:col-span-2'>
                <label htmlFor='EventDate' className='text-gray-700'>
                  Event Date
                </label>
                <div className='relative'>
                  <div className='flex'>
                    <Controller
                      control={methods.control}
                      name='eventDate'
                      defaultValue={new Date()}
                      render={({ field: { onChange, value } }) => (
                        <DatePicker
                          id='datepick'
                          selected={value}
                          onChange={onChange}
                          className=' block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded-l transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none'
                        />
                      )}
                    />

                    <div
                      onClick={() =>
                        document.getElementById("datepick")?.focus()
                      }
                      className='flex items-center rounded-r cursor-pointer px-3 border border-gray-300 border-l-0 bg-gray-50 hover:text-indigo-700'>
                      <MdOutlineCalendarToday size={20} />
                    </div>
                  </div>
                </div>
              </div>
              <div className='col-span-6 md:col-span-2 lg:col-span-1'>
                <label className='text-gray-700'>Event Time</label>
                <div className='flex'>
                  <Controller
                    control={methods.control}
                    name='eventTime'
                    defaultValue={new Date()}
                    render={({ field: { onChange, value } }) => (
                      <DatePicker
                        id='timepick'
                        selected={value}
                        onChange={onChange}
                        showTimeSelect
                        showTimeSelectOnly
                        timeIntervals={15}
                        timeCaption='Time'
                        dateFormat='h:mm aa'
                        className='block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded-l transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none'
                      />
                    )}
                  />

                  <div
                    onClick={() => document.getElementById("timepick")?.focus()}
                    className='flex items-center rounded-r cursor-pointer px-3 border hover:text-indigo-700 border-gray-300 border-l-0 bg-gray-50'>
                    <MdAccessTime size={20} />
                  </div>
                </div>
              </div>
              {/* Fill space div */}
              <div className='hidden md:block md:col-span-2 lg:col-span-3'></div>

              {/* Event Location */}
              <div className='col-span-6 md:col-span-3 '>
                <label className='text-gray-700'>Event Location</label>
                <Controller
                  name='eventLocation'
                  control={methods.control}
                  defaultValue={{ id: "", name: "", organizationId: "" }}
                  render={({ field: { onChange, value } }) => (
                    <SingleSelect
                      selected={value}
                      setSelected={onChange}
                      list={locations}
                    />
                  )}
                />
              </div>
              {/* Fill space div */}
              <div className='hidden md:block md:col-span-3 '></div>

              {/* Event recurring switch */}
              <div className='col-span-2 sm:col-span-1'>
                <label className='text-gray-700'>Repeats?</label>
                <div className='mt-1'>
                  <Controller
                    name='isRepeating'
                    control={methods.control}
                    defaultValue={false}
                    render={({ field: { onChange, value } }) => (
                      <Switch
                        checked={value}
                        onChange={onChange}
                        className={`${value ? "bg-indigo-700" : "bg-gray-200"}
			 relative inline-flex h-[38px] w-[74px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}>
                        <span className='sr-only'>Is Repeating</span>
                        <span
                          aria-hidden='true'
                          className={`${
                            value
                              ? "translate-x-9 bg-white"
                              : "translate-x-0 bg-white"
                          }
			   pointer-events-none inline-block h-[34px] w-[34px] transform rounded-full  shadow-lg ring-0 transition duration-200 ease-in-out`}
                        />
                      </Switch>
                    )}
                  />
                </div>
              </div>

              {/* event frequency selection */}
              <div className='col-span-4 sm:col-span-2'>
                {isRepeating && (
                  <div>
                    <label>Frequency</label>
                    <Controller
                      name='repeatFrequency'
                      control={methods.control}
                      defaultValue={{ id: "D", name: "Daily" }}
                      render={({ field: { value, onChange } }) => (
                        <SingleSelect
                          list={frequncyOptions}
                          selected={value}
                          setSelected={onChange}
                        />
                      )}
                    />
                  </div>
                )}
              </div>

              {/* Options for recurring event */}
              {isRepeating && (
                <>
                  <div className='hidden sm:block col-span-2'></div>
                  <div className='col-span-6 sm:col-span-3'>
                    <RecurringOptions selection={repeatFrequency} />
                  </div>
                </>
              )}
            </div>

            {/* Positions Selection */}
            <PositionsSelector />
            <div className='px-4 py-3 bg-gray-50 text-right sm:px-6'>
              <button
                type='submit'
                className='w-16 h-10 inline-flex items-center justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'>
                {/* {addEvent.isLoading ? <CircularProgressSmall /> : "Save"} */}
              </button>
            </div>
          </form>
        </FormProvider>
      </div>
    </>
  );
};

const EditEventPage = () => {
  const router = useRouter();
  console.log("This is the query", router.query);
  const { id } = router.query;

  if (!id || typeof id !== "string") {
    return <div>No Id Provided</div>;
  }

  return <EditEvent id={id} />;
};

EditEventPage.getLayout = sidebar;

export default EditEventPage;
