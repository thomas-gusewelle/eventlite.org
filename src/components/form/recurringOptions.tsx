import { useState } from "react";
import { Controller, useForm, useFormContext } from "react-hook-form";
import { SingleSelect } from "./singleSelect";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { MdOutlineCalendarToday } from "react-icons/md";

type selection = { id: string; name: string };

export const RecurringOptions: React.FC<{
  selection: selection;
}> = ({ selection }) => {
  if (selection == undefined) {
    return <div></div>;
  }

  switch (selection.id) {
    case "D":
      return <DailyOptions selection={selection} />;
      break;
    case "W":
      return <WeeklyOptions selection={selection} />;
      break;
    case "WC":
      return <WeeklyCustomOptions selection={selection} />;
    case "M":
      return <MonthlyOptions selection={selection} />;
      break;
    default:
      return <div></div>;
  }
};

const DailyOptions: React.FC<{ selection: selection }> = ({ selection }) => {
  const [occuranceType, setOccuranceType] = useState<selection>({
    id: "Num",
    name: "Ending After",
  });

  const {
    control,
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <div className='grid grid-cols-6 gap-6'>
      <div className='col-span-6'>
        <SingleSelect
          selected={occuranceType}
          setSelected={setOccuranceType}
          list={[
            { id: "Num", name: "Ending After" },
            { id: "Date", name: "Ending On" },
          ]}
        />
      </div>
      {occuranceType.id == "Num" && (
        <div className='col-span-6'>
          <label className='text-gray-700'>Occurances</label>
          <input
            {...register("D-Num", { required: true, max: 52 })}
            required
            type={"number"}
            max={52}
            className='mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
          />
        </div>
      )}
      {occuranceType.id == "Date" && (
        <div className='col-span-6'>
          <label className='text-gray-700'>End Date</label>
          <div className='flex'>
            <Controller
              name='D-Date'
              control={control}
              defaultValue={new Date()}
              render={({ field: { value, onChange } }) => (
                <DatePicker
                  id='D-Datepick'
                  selected={value}
                  onChange={onChange}
                  className='block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded-l transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none'
                />
              )}
            />
            <div
              onClick={() => document.getElementById("D-Datepick")?.focus()}
              className='flex items-center rounded-r cursor-pointer px-3 border border-gray-300 border-l-0 bg-gray-50 hover:text-indigo-700'>
              <MdOutlineCalendarToday size={20} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const WeeklyOptions: React.FC<{ selection: selection }> = ({ selection }) => {
  const [occuranceType, setOccuranceType] = useState<selection>({
    id: "Num",
    name: "Ending After",
  });

  const {
    control,
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <div className='grid grid-cols-6 gap-6'>
      <div className='col-span-6'>
        <SingleSelect
          selected={occuranceType}
          setSelected={setOccuranceType}
          list={[
            { id: "Num", name: "Ending After" },
            { id: "Date", name: "Ending On" },
          ]}
        />
      </div>
      {occuranceType.id == "Num" && (
        <div className='col-span-6'>
          <label className='text-gray-700'>Occurances</label>
          <input
            {...register("W-Num", { required: true, max: 52 })}
            required
            type={"number"}
            max={52}
            className='mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
          />
        </div>
      )}
      {occuranceType.id == "Date" && (
        <div className='col-span-6'>
          <label className='text-gray-700'>End Date</label>
          <div className='flex'>
            <Controller
              name='W-Date'
              control={control}
              render={({ field: { value, onChange } }) => (
                <DatePicker
                  id='W-Datepick'
                  selected={value}
                  onChange={onChange}
                  className='block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded-l transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none'
                />
              )}
            />
            <div
              onClick={() => document.getElementById("W-Datepick")?.focus()}
              className='flex items-center rounded-r cursor-pointer px-3 border border-gray-300 border-l-0 bg-gray-50 hover:text-indigo-700'>
              <MdOutlineCalendarToday size={20} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const WeeklyCustomOptions: React.FC<{ selection: selection }> = ({
  selection,
}) => {
  const [occuranceType, setOccuranceType] = useState<selection>({
    id: "Num",
    name: "Ending After",
  });

  const {
    control,
    register,
    formState: { errors },
  } = useFormContext();

  const days = ["Mon", "Tues", "Wed", "Thurs", "Fri", "Sat", "Sun"];

  return (
    <div className='grid grid-cols-6 gap-6'>
      <div className='col-span-6'>
        <div className='grid grid-cols-4 gap-3'>
          {days.map((day, index) => (
            <div key={index} className='flex gap-1 items-center'>
              <input type={"checkbox"} {...register("WC-" + day)} />
              <label>{day}</label>
            </div>
          ))}{" "}
        </div>
      </div>
      <div className='col-span-6'>
        <SingleSelect
          selected={occuranceType}
          setSelected={setOccuranceType}
          list={[
            { id: "Num", name: "Ending After" },
            { id: "Date", name: "Ending On" },
          ]}
        />
      </div>
      {occuranceType.id == "Num" && (
        <div className='col-span-6'>
          <label className='text-gray-700'>Occurances</label>
          <input
            {...register("WC-Num", { required: true, max: 52 })}
            required
            type={"number"}
            max={52}
            className='mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
          />
        </div>
      )}
      {occuranceType.id == "Date" && (
        <div className='col-span-6'>
          <label className='text-gray-700'>End Date</label>
          <div className='flex'>
            <Controller
              name='WC-Date'
              control={control}
              render={({ field: { value, onChange } }) => (
                <DatePicker
                  id='WC-Datepick'
                  selected={value}
                  onChange={onChange}
                  className='block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded-l transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none'
                />
              )}
            />
            <div
              onClick={() => document.getElementById("W-Datepick")?.focus()}
              className='flex items-center rounded-r cursor-pointer px-3 border border-gray-300 border-l-0 bg-gray-50 hover:text-indigo-700'>
              <MdOutlineCalendarToday size={20} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const MonthlyOptions: React.FC<{ selection: selection }> = ({ selection }) => {
  const [occuranceType, setOccuranceType] = useState<selection>({
    id: "Num",
    name: "Ending After",
  });

  const {
    control,
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <div className='grid grid-cols-6 gap-6'>
      <div className='col-span-6'>
        <SingleSelect
          selected={occuranceType}
          setSelected={setOccuranceType}
          list={[
            { id: "Num", name: "Ending After" },
            { id: "Date", name: "Ending On" },
          ]}
        />
      </div>
      {occuranceType.id == "Num" && (
        <div className='col-span-6'>
          <label className='text-gray-700'>Occurances</label>
          <input
            {...register("M-Num", { required: true, max: 52 })}
            required
            type={"number"}
            max={52}
            className='mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
          />
        </div>
      )}
      {occuranceType.id == "Date" && (
        <div className='col-span-6'>
          <label className='text-gray-700'>End Date</label>
          <div className='flex'>
            <Controller
              name='M-Date'
              control={control}
              render={({ field: { value, onChange } }) => (
                <DatePicker
                  id='M-Datepick'
                  selected={value}
                  onChange={onChange}
                  className='block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded-l transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none'
                />
              )}
            />
            <div
              onClick={() => document.getElementById("M-Datepick")?.focus()}
              className='flex items-center rounded-r cursor-pointer px-3 border border-gray-300 border-l-0 bg-gray-50 hover:text-indigo-700'>
              <MdOutlineCalendarToday size={20} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
