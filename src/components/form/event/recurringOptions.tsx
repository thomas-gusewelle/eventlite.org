import { useEffect, useState } from "react";
import { Controller, useForm, useFormContext } from "react-hook-form";
import { SingleSelect } from "../singleSelect";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { MdOutlineCalendarToday } from "react-icons/md";
import { ErrorSpan } from "../../errors/errorSpan";
import {
	EventEndSelect,
	EventRepeatFrequency,
} from "../../../../types/eventFormValues";
import { yearsFromToday } from "../../../server/utils/dateTimeModifers";

export const RecurringOptions: React.FC<{
	selection: EventRepeatFrequency;
}> = ({ selection }) => {
	if (selection == undefined) {
		return null;
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

const DailyOptions: React.FC<{ selection: EventRepeatFrequency }> = ({
	selection,
}) => {
	const [occuranceType, setOccuranceType] = useState<EventEndSelect>({
		id: "Num",
		name: "Ending After",
	});

	const {
		control,
		register,
		formState: { errors },
		watch,
	} = useFormContext();

	const DEndSelect = watch("DEndSelect");
	useEffect(() => {
		if (DEndSelect != undefined) {
			setOccuranceType(DEndSelect);
		}
	}, [DEndSelect]);

	return (
		<div className="grid grid-cols-6 gap-6">
			<div className="col-span-6">
				<Controller
					name="DEndSelect"
					control={control}
					defaultValue={occuranceType}
					render={({ field: { onChange, value } }) => (
						<SingleSelect
							selected={value}
							setSelected={onChange}
							list={[
								{ id: "Num", name: "Ending After" },
								{ id: "Date", name: "Ending On" },
							]}
						/>
					)}
				/>
			</div>
			{occuranceType.id == "Num" && (
				<div className="col-span-6">
					<label className="text-gray-700">Number of Occurances</label>
					<Controller
						name="DNum"
						control={control}
						rules={{ required: true, max: 52 }}
						defaultValue={1}
						render={({ field, fieldState }) => (
							<>
								<input
									// {...register("DNum", { required: true, max: 52 })}
									{...field}
									onChange={(e) => field.onChange(parseInt(e.target.value))}
									type={"number"}
									className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
								/>
								{fieldState.error?.type === ("required" as any) && (
									<ErrorSpan>Number of occurances required</ErrorSpan>
								)}
								{fieldState.error?.type === ("max" as any) && (
									<ErrorSpan>Max of 52 occurances</ErrorSpan>
								)}
							</>
						)}
					/>
				</div>
			)}
			{occuranceType.id == "Date" && (
				<div className="col-span-6">
					<label className="text-gray-700">End Date</label>
					<div className="flex">
						<Controller
							name="DDate"
							control={control}
							rules={{ required: true }}
							render={({ field: { value, onChange } }) => (
								<DatePicker
									id="D-Datepick"
									autoComplete="off"
									selected={value}
									onChange={onChange}
									minDate={new Date()}
									maxDate={yearsFromToday()}
									className="block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded-l transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
								/>
							)}
						/>

						<div
							onClick={() => document.getElementById("D-Datepick")?.focus()}
							className="flex items-center rounded-r cursor-pointer px-3 border border-gray-300 border-l-0 bg-gray-50 hover:text-indigo-700">
							<MdOutlineCalendarToday size={20} />
						</div>
					</div>
					{errors.DDate && (
						<span className="text-red-500">End Date Required</span>
					)}
				</div>
			)}
		</div>
	);
};

const WeeklyOptions: React.FC<{ selection: EventRepeatFrequency }> = ({
	selection,
}) => {
	const [occuranceType, setOccuranceType] = useState<EventEndSelect>({
		id: "Num",
		name: "Ending After",
	});

	const {
		control,
		register,
		formState: { errors },
		watch,
	} = useFormContext();

	const WEndSelect = watch("WEndSelect");
	useEffect(() => {
		if (WEndSelect != undefined) {
			setOccuranceType(WEndSelect);
		}
	}, [WEndSelect]);

	return (
		<div className="grid grid-cols-6 gap-6">
			<div className="col-span-6">
				<Controller
					name="WEndSelect"
					control={control}
					defaultValue={occuranceType}
					render={({ field: { onChange, value } }) => (
						<SingleSelect
							selected={value}
							setSelected={onChange}
							list={[
								{ id: "Num", name: "Ending After" },
								{ id: "Date", name: "Ending On" },
							]}
						/>
					)}
				/>
			</div>
			{occuranceType.id == "Num" && (
				<div className="col-span-6">
					<label className="text-gray-700">Number of Occurances</label>
					<Controller
						name="WNum"
						control={control}
						rules={{ required: true, max: 52 }}
						defaultValue={1}
						render={({ field, fieldState }) => (
							<>
								<input
									{...field}
									onChange={(e) => field.onChange(parseInt(e.target.value))}
									type={"number"}
									className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
								/>
								{fieldState.error?.type === ("required" as any) && (
									<ErrorSpan>Number of occurances required</ErrorSpan>
								)}
								{fieldState.error?.type === ("max" as any) && (
									<ErrorSpan>Maximum of 52 occurances allowed</ErrorSpan>
								)}
							</>
						)}
					/>
				</div>
			)}
			{occuranceType.id == "Date" && (
				<div className="col-span-6">
					<label className="text-gray-700">End Date</label>
					<div className="flex">
						<Controller
							name="WDate"
							control={control}
							rules={{ required: true }}
							render={({ field: { value, onChange } }) => (
								<DatePicker
									id="W-Datepick"
									selected={value}
									onChange={onChange}
									minDate={new Date()}
									className="block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded-l transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
								/>
							)}
						/>
						<div
							onClick={() => document.getElementById("W-Datepick")?.focus()}
							className="flex items-center rounded-r cursor-pointer px-3 border border-gray-300 border-l-0 bg-gray-50 hover:text-indigo-700">
							<MdOutlineCalendarToday size={20} />
						</div>
					</div>
					{errors.WDate && <ErrorSpan>End date required</ErrorSpan>}
				</div>
			)}
		</div>
	);
};

const WeeklyCustomOptions: React.FC<{ selection: EventRepeatFrequency }> = ({
	selection,
}) => {
	const [occuranceType, setOccuranceType] = useState<EventEndSelect>({
		id: "Num",
		name: "Ending After",
	});

	const {
		control,
		register,
		formState: { errors },
		watch,
	} = useFormContext();

	const WCEndSelect = watch("WCEndSelect");
	useEffect(() => {
		if (WCEndSelect != undefined) {
			setOccuranceType(WCEndSelect);
		}
	}, [WCEndSelect]);

	const days = ["Mon", "Tues", "Wed", "Thurs", "Fri", "Sat", "Sun"];

	return (
		<div className="grid grid-cols-6 gap-6">
			<div className="col-span-6">
				<div className="grid grid-cols-4 gap-3">
					{days.map((day, index) => (
						<div key={index} className="flex gap-1 items-center">
							<input type={"checkbox"} {...register("WC" + day)} />
							<label>{day}</label>
						</div>
					))}{" "}
				</div>
			</div>
			<div className="col-span-6">
				<Controller
					name="WCEndSelect"
					control={control}
					defaultValue={occuranceType}
					render={({ field: { onChange, value } }) => (
						<SingleSelect
							selected={value}
							setSelected={onChange}
							list={[
								{ id: "Num", name: "Ending After" },
								{ id: "Date", name: "Ending On" },
							]}
						/>
					)}
				/>
			</div>
			{occuranceType.id == "Num" && (
				<div className="col-span-6">
					<label className="text-gray-700">Number of Occurances</label>
					<Controller
						name="WCNum"
						control={control}
						rules={{ required: true, max: 52 }}
						defaultValue={1}
						render={({ field, fieldState }) => (
							<>
								<input
									{...field}
									onChange={(e) => field.onChange(parseInt(e.target.value))}
									type={"number"}
									className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
								/>
								{fieldState.error?.type === ("required" as any) && (
									<ErrorSpan>Number of occurances required</ErrorSpan>
								)}
								{fieldState.error?.type === ("max" as any) && (
									<ErrorSpan>Max of 52 occurances</ErrorSpan>
								)}
							</>
						)}
					/>
				</div>
			)}
			{occuranceType.id == "Date" && (
				<div className="col-span-6">
					<label className="text-gray-700">End Date</label>
					<div className="flex">
						<Controller
							name="WCDate"
							control={control}
							rules={{ required: true }}
							render={({ field: { value, onChange } }) => (
								<DatePicker
									id="WC-Datepick"
									selected={value}
									onChange={onChange}
									minDate={new Date()}
									className="block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded-l transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
								/>
							)}
						/>
						<div
							onClick={() => document.getElementById("W-Datepick")?.focus()}
							className="flex items-center rounded-r cursor-pointer px-3 border border-gray-300 border-l-0 bg-gray-50 hover:text-indigo-700">
							<MdOutlineCalendarToday size={20} />
						</div>
					</div>
					{errors.WCDate && <ErrorSpan>End date required</ErrorSpan>}
				</div>
			)}
		</div>
	);
};

const MonthlyOptions: React.FC<{ selection: EventRepeatFrequency }> = ({
	selection,
}) => {
	const [occuranceType, setOccuranceType] = useState<EventEndSelect>({
		id: "Num",
		name: "Ending After",
	});

	const {
		control,
		register,
		formState: { errors },
		watch,
	} = useFormContext();

	const MEndSelect = watch("MEndSelect");
	useEffect(() => {
		if (MEndSelect != undefined) {
			setOccuranceType(MEndSelect);
		}
	}, [MEndSelect]);

	return (
		<div className="grid grid-cols-6 gap-6">
			<div className="col-span-6">
				<Controller
					name="MEndSelect"
					control={control}
					defaultValue={occuranceType}
					render={({ field: { onChange, value } }) => (
						<SingleSelect
							selected={value}
							setSelected={onChange}
							list={[
								{ id: "Num", name: "Ending After" },
								{ id: "Date", name: "Ending On" },
							]}
						/>
					)}
				/>
			</div>
			{occuranceType.id == "Num" && (
				<div className="col-span-6">
					<label className="text-gray-700">Number of Occurances</label>
					<Controller
						name="MNum"
						control={control}
						rules={{ required: true, max: 52 }}
						defaultValue={1}
						render={({ field, fieldState }) => (
							<>
								<input
									{...field}
									onChange={(e) => field.onChange(parseInt(e.target.value))}
									type={"number"}
									className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
								/>
								{fieldState.error?.type === ("required" as any) && (
									<ErrorSpan>Number of occurances required</ErrorSpan>
								)}
								{fieldState.error?.type === ("max" as any) && (
									<ErrorSpan>Max of 52 occurances</ErrorSpan>
								)}
							</>
						)}
					/>
				</div>
			)}
			{occuranceType.id == "Date" && (
				<div className="col-span-6">
					<label className="text-gray-700">End Date</label>
					<div className="flex">
						<Controller
							name="MDate"
							control={control}
							rules={{ required: true }}
							render={({ field: { value, onChange } }) => (
								<DatePicker
									id="M-Datepick"
									selected={value}
									onChange={onChange}
									minDate={new Date()}
									className="block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded-l transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
								/>
							)}
						/>
						<div
							onClick={() => document.getElementById("M-Datepick")?.focus()}
							className="flex items-center rounded-r cursor-pointer px-3 border border-gray-300 border-l-0 bg-gray-50 hover:text-indigo-700">
							<MdOutlineCalendarToday size={20} />
						</div>
					</div>
					{errors.MDate && <ErrorSpan>End date required</ErrorSpan>}
				</div>
			)}
		</div>
	);
};
