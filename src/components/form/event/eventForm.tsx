import { Controller, useFormContext } from "react-hook-form";
import { PositionsSelector } from "./positionSelections";
import { RecurringOptions } from "./recurringOptions";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  MdAccessTime,
  MdOutlineCalendarToday,
} from "react-icons/md";
import { SingleSelect } from "../singleSelect";
import { Switch } from "@headlessui/react";
import { Locations } from "@prisma/client";
import { useEffect, useState } from "react";
import { EventRepeatFrequency } from "../../../../types/eventFormValues";
import { findWeekday } from "../../../utils/findWeekday";
import { ErrorSpan } from "../../errors/errorSpan";
import { yearsFromToday } from "../../../server/utils/dateTimeModifers";
import { useRouter } from "next/router";
import { LocationSelector } from "./locationSelector";

export const EventForm: React.FC<{
  rec?: boolean;
  alreadyRec?: boolean | null;
}> = ({  rec = null, alreadyRec = null }) => {
  const router = useRouter();
  const { control, register, formState, watch } = useFormContext();
  const [frequncyOptions, setFrequncyOptions] = useState<
    EventRepeatFrequency[]
  >([]);
  const [repeatFrequency, setRepeatFrequency] = useState<EventRepeatFrequency>({
    id: "D",
    name: "Daily",
  });
  const [isRepeating, setIsRepeating] = useState(false);
  const _isRepeating: boolean = watch("isRepeating", false);
  const _repeatFrequency: { id: "D" | "W" | "WC" | "M"; name: string } = watch(
    "repeatFrequency",
    {
      id: "D",
      name: "Daily",
    }
  );
  const _eventDate: Date = watch("eventDate", new Date());
  useEffect(() => {
    if (_isRepeating != undefined) {
      setIsRepeating(_isRepeating);
    }
  }, [_isRepeating]);

  useEffect(() => {
    if (
      _repeatFrequency != undefined &&
      _repeatFrequency.id != repeatFrequency.id
    ) {
      setRepeatFrequency(_repeatFrequency);
    }
  }, [_repeatFrequency, repeatFrequency.id]);

  useEffect(() => {
    setFrequncyOptions([
      { id: "D", name: `Daily` },
      { id: "W", name: `Weekly (${findWeekday(_eventDate)}s)` },
      // { id: "WC", name: "Weekly (Custom)" },
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
      <div className='mb-6 grid grid-cols-6 gap-6 px-6'>
        <div className='col-span-6 sm:col-span-4'>
          <label htmlFor='event-name' className=' text-gray-700'>
            Event Name
          </label>
          <input
            type='text'
            id='Name'
            autoFocus
            {...register("name", { required: true, minLength: 3 })}
            className=' block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
          />
          {formState.errors.name && (
            <span className='text-red-500'>Event Name is Required</span>
          )}
        </div>
        <div className='col-span-2 hidden sm:block'></div>
        <div className='col-span-6 md:col-span-2'>
          <label htmlFor='EventDate' className='text-gray-700'>
            Event Date
          </label>
          <div className='relative'>
            <Controller
              control={control}
              name='eventDate'
              defaultValue={new Date()}
              rules={{ required: true }}
              render={({ field: { onChange, value }, fieldState }) => (
                <>
                  <div className='flex'>
                    <DatePicker
                      id='datepick'
                      selected={value}
                      onChange={onChange}
                      minDate={new Date()}
                      maxDate={yearsFromToday()}
                      className=' m-0 block w-full rounded-l border border-solid border-gray-300 bg-white bg-clip-padding px-3 py-1.5 text-base font-normal text-gray-700 transition ease-in-out focus:border-blue-600 focus:bg-white focus:text-gray-700 focus:outline-none'
                    />

                    <div
                      onClick={() =>
                        document.getElementById("datepick")?.focus()
                      }
                      className='flex cursor-pointer items-center rounded-r border border-l-0 border-gray-300 bg-gray-50 px-3 hover:text-indigo-700'>
                      <MdOutlineCalendarToday size={20} />
                    </div>
                  </div>
                  {fieldState.error?.type == "required" && (
                    <ErrorSpan>Date Required</ErrorSpan>
                  )}
                </>
              )}
            />
          </div>
        </div>
        <div className='col-span-6 md:col-span-2 lg:col-span-2'>
          <label className='text-gray-700'>Event Time</label>

          <Controller
            control={control}
            name='eventTime'
            defaultValue={new Date()}
            rules={{ required: true }}
            render={({ field: { onChange, value }, fieldState }) => (
              <>
                <div className='flex'>
                  <DatePicker
                    id='timepick'
                    selected={value}
                    onChange={onChange}
                    showTimeSelect
                    showTimeSelectOnly
                    timeIntervals={15}
                    timeCaption='Time'
                    dateFormat='h:mm aa'
                    className='m-0 block w-full rounded-l border border-solid border-gray-300 bg-white bg-clip-padding px-3 py-1.5 text-base font-normal text-gray-700 transition ease-in-out focus:border-blue-600 focus:bg-white focus:text-gray-700 focus:outline-none'
                  />
                  <div
                    onClick={() => document.getElementById("timepick")?.focus()}
                    className='flex cursor-pointer items-center rounded-r border border-l-0 border-gray-300 bg-gray-50 px-3 hover:text-indigo-700'>
                    <MdAccessTime size={20} />
                  </div>
                </div>
                {fieldState.error?.type == "required" && (
                  <ErrorSpan>Time Required</ErrorSpan>
                )}
              </>
            )}
          />
        </div>
        {/* Fill space div */}
        <div className='hidden md:col-span-2 md:block lg:col-span-2'></div>

        {/* Event Location */}
        <LocationSelector />
        {/* Fill space div */}
        <div className='hidden md:col-span-2 md:block '></div>

        {/* Event recurring switch */}
        {(alreadyRec == false || alreadyRec == null || rec == true) && (
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
                        className={`${value
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
                <div className='col-span-2 hidden sm:block'></div>
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
