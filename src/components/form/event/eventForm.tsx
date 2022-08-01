import { Controller, useFormContext } from "react-hook-form";
import { PositionsSelector } from "./positionSelections";
import { RecurringOptions } from "./recurringOptions";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { MdAccessTime, MdOutlineCalendarToday } from "react-icons/md";
import { SingleSelect } from "../singleSelect";
import { Switch } from "@headlessui/react";
import { Locations } from "@prisma/client";
import { useEffect, useState } from "react";
import { EventRepeatFrequency } from "../../../../types/eventFormValues";
import { findWeekday } from "../../../utils/findWeekday";
import { NIL } from "uuid";

export const EventForm: React.FC<{
  locations: Locations[];
  rec?: boolean;
  alreadyRec?: boolean | null;
}> = ({ locations, rec = null, alreadyRec = null }) => {
  const { control, register, formState, watch } = useFormContext();
  const [frequncyOptions, setFrequncyOptions] = useState<
    EventRepeatFrequency[]
  >([]);
  const [repeatFrequency, setRepeatFrequency] = useState<EventRepeatFrequency>({
    id: "D",
    name: "Daily",
  });
  const [isRepeating, setIsRepeating] = useState(false);
  const _isRepeating = watch("isRepeating", false);
  const _repeatFrequency = watch("repeatFrequency", {
    id: "D",
    name: "Daily",
  });
  const _eventDate: Date = watch("eventDate", new Date());
  useEffect(() => {
    console.log("this is the repeating", _isRepeating);
    if (_isRepeating != undefined) {
      setIsRepeating(_isRepeating);
    }
  }, [_isRepeating]);

  useEffect(() => {
    if (_repeatFrequency != undefined) {
      setRepeatFrequency(_repeatFrequency);
    }
  }, [_repeatFrequency]);

  useEffect(() => {
    setFrequncyOptions([
      { id: "D", name: `Daily` },
      { id: "W", name: `Weekly (${findWeekday(_eventDate)}s)` },
      { id: "WC", name: "Weekly (Custom)" },
      {
        id: "M",
        name: `Monthly (${Intl.DateTimeFormat("en-US", {
          month: "short",
          day: "2-digit",
        }).format(_eventDate)})`,
      },
    ]);
  }, [_eventDate]);

  return (
    <>
      <div className='grid grid-cols-6 gap-6 mb-6 px-6'>
        <div className='col-span-6 sm:col-span-3'>
          <label htmlFor='event-name' className=' text-gray-700'>
            Event Name
          </label>
          <input
            type='text'
            id='Name'
            autoFocus
            {...register("name", { required: true, minLength: 3 })}
            className=' focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
          />
          {formState.errors.name && (
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
                control={control}
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
                onClick={() => document.getElementById("datepick")?.focus()}
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
              control={control}
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
            control={control}
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
        {(rec || alreadyRec == false) && (
          <>
            <div className='col-span-2 sm:col-span-1'>
              <label className='text-gray-700'>Repeats?</label>
              <div className='mt-1'>
                <Controller
                  name='isRepeating'
                  control={control}
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
            <div className='col-span-4 sm:col-span-2'>
              {isRepeating && (
                <div>
                  <label>Frequency</label>
                  <Controller
                    name='repeatFrequency'
                    control={control}
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

            {isRepeating && (
              <>
                <div className='hidden sm:block col-span-2'></div>
                <div className='col-span-6 sm:col-span-3'>
                  <RecurringOptions selection={repeatFrequency} />
                </div>
              </>
            )}
          </>
        )}
      </div>

      {/* Positions Selection */}
      <PositionsSelector />
    </>
  );
};
