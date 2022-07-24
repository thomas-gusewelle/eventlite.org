import { useForm } from "react-hook-form";
import { SectionHeading } from "../../components/headers/SectionHeading";
import { sidebar } from "../../components/layout/sidebar";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useEffect, useState } from "react";
import { MdOutlineCalendarToday, MdAccessTime } from "react-icons/md";
import { Switch } from "@headlessui/react";
import { SingleSelect } from "../../components/form/singleSelect";
import { findWeekday } from "../../utils/findWeekday";
import { RecurringOptions } from "../../components/form/recurringOptions";

const AddEvent = () => {
	const [eventDate, setEventDate] = useState<Date>(new Date());
	const [eventTime, setEventTime] = useState<Date>();
	const [frequncyOptions, setFrequncyOptions] = useState<
		{ id: string; name: string }[]
	>([]);
	const [repeatFrequency, setRepeatFrequency] = useState<{
		id: string;
		name: string;
	}>({ id: "D", name: `Daily` });
	const [isRepeating, setIsRepeating] = useState(false);

	useEffect(() => {
		setFrequncyOptions([
			{ id: "D", name: `Daily` },
			{ id: "W", name: `Weekly (${findWeekday(eventDate)}s)` },
			{ id: "WC", name: "Weekly (Custom)" },
			{ id: "M", name: `Monthly (${eventDate.getDate()})` },
		]);
	}, [eventDate]);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm();

	const submit = handleSubmit((data) => {
		console.log(data);
	});

	return (
		<>
			<div className="mb-8">
				<SectionHeading>Add Event</SectionHeading>
			</div>
			<form onSubmit={submit} className="shadow">
				<div className="grid grid-cols-6 gap-6 mb-6 px-6">
					<div className="col-span-6 sm:col-span-3">
						<label
							htmlFor="event-name"
							className="block text-sm font-medium text-gray-700">
							Event Name
						</label>
						<input
							type="text"
							id="Name"
							{...register("name", { required: true, minLength: 3 })}
							className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
						/>
						{errors.name && (
							<span className="text-red-500">Event Name is Required</span>
						)}
					</div>
					<div className="hidden sm:block col-span-3"></div>
					<div className="col-span-6 sm:col-span-2">
						<label htmlFor="EventDate" className="text-gray-700">
							Event Date
						</label>
						<div className="relative">
							<div className="flex">
								<DatePicker
									id="datepick"
									selected={eventDate}
									onChange={(date: Date) => setEventDate(date)}
									className="block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded-l transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
								/>
								<div
									onClick={() => document.getElementById("datepick")?.focus()}
									className="flex items-center rounded-r cursor-pointer px-3 border border-gray-300 border-l-0 bg-gray-50 hover:text-indigo-700">
									<MdOutlineCalendarToday size={20} />
								</div>
							</div>
						</div>
					</div>
					<div className="col-span-6 sm:col-span-1">
						<label className="text-gray-700">Event Time</label>
						<div className="flex">
							<DatePicker
								id="timepick"
								selected={eventTime}
								onChange={(date: Date) => setEventTime(date)}
								showTimeSelect
								showTimeSelectOnly
								timeIntervals={15}
								timeCaption="Time"
								dateFormat="h:mm aa"
								className="block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded-l transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
							/>
							<div
								onClick={() => document.getElementById("timepick")?.focus()}
								className="flex items-center rounded-r cursor-pointer px-3 border hover:text-indigo-700 border-gray-300 border-l-0 bg-gray-50">
								<MdAccessTime size={20} />
							</div>
						</div>
					</div>
					{/* Fill space div */}
					<div className="hidden sm:block col-span-3"></div>

					{/* Event recurring switch */}
					<div className="col-span-2 sm:col-span-1">
						<label className="text-gray-700">Repeats?</label>
						<div className="mt-1">
							<Switch
								checked={isRepeating}
								onChange={setIsRepeating}
								className={`${isRepeating ? "bg-indigo-700" : "bg-gray-200"}
          relative inline-flex h-[38px] w-[74px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}>
								<span className="sr-only">Is Repeating</span>
								<span
									aria-hidden="true"
									className={`${
										isRepeating
											? "translate-x-9 bg-white"
											: "translate-x-0 bg-white"
									}
            pointer-events-none inline-block h-[34px] w-[34px] transform rounded-full  shadow-lg ring-0 transition duration-200 ease-in-out`}
								/>
							</Switch>
						</div>
					</div>

					{/* event frequency selection */}
					<div className="col-span-4 sm:col-span-2">
						{isRepeating && (
							<div>
								<label>Frequency</label>
								<SingleSelect
									list={frequncyOptions}
									selected={repeatFrequency}
									setSelected={setRepeatFrequency}
								/>
							</div>
						)}
					</div>

					{/* Options for recurring event */}
					{isRepeating && (
						<div className="col-span-6 sm:col-span-3">
							<RecurringOptions selection={repeatFrequency} />
						</div>
					)}
				</div>

				<div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
					<button
						type="submit"
						className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
						Save
					</button>
				</div>
			</form>
		</>
	);
};

AddEvent.getLayout = sidebar;

export default AddEvent;
