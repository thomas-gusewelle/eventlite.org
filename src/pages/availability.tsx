import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { LimitSelect } from "../components/form/limitSelect";
import { SectionHeading } from "../components/headers/SectionHeading";
import { sidebar } from "../components/layout/sidebar";
import { Modal } from "../components/modal/modal";
import { ModalBody } from "../components/modal/modalBody";
import { ModalTitle } from "../components/modal/modalTitle";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { MdOutlineCalendarToday } from "react-icons/md";
import { BottomButtons } from "../components/modal/bottomButtons";
import { BtnSave } from "../components/btn/btnSave";
import { BtnCancel } from "../components/btn/btnCancel";
import Head from "next/head";

const AvailabilityPage = () => {
	const [limit, setLimit] = useState(4);
	const [modalOpen, setModalOpen] = useState(true);
	const [dates, setDates] = useState<Date[]>([]);
	const methods = useForm();

	const submit = methods.handleSubmit((data) => {
		console.log(data);
	});
	const date = methods.watch("Date");

	useEffect(() => {
		console.log("These are the dates", dates);
		console.log("This is the date", date);
	}, [dates, date]);

	return (
		<>
			<Head>
				<link href="../../static/calendar.css" rel="stylesheet" />
			</Head>
			<div className="mb-8 flex justify-between gap-4 md:hidden">
				<SectionHeading>Unavaliable Dates</SectionHeading>
				<div>
					<span></span>
					<LimitSelect selected={limit} setSelected={setLimit} />
				</div>
			</div>
			<div className="mb-8 hidden justify-between md:flex">
				<SectionHeading>Unavailable Dates</SectionHeading>
				<div>
					<LimitSelect selected={limit} setSelected={setLimit} />
				</div>
			</div>

			<Modal open={modalOpen} setOpen={setModalOpen}>
				<ModalBody>
					<ModalTitle text={"Add Unavailable Dates"} />
					<form onSubmit={submit} className="h-max min-h-[250px]">
						<div className="">
							{/* <label className="text-gray-700">End Date</label> */}
							<div className="mt-6 flex flex-col gap-3 md:flex-row">
								<Controller
									name="Date"
									control={methods.control}
									rules={{ required: true }}
									// defaultValue={{ start: new Date(), end: null }}
									defaultValue={null}
									render={({ field: { value, onChange } }) => (
										<div className="customDate">
											<DatePicker
												id="aDate"
												autoComplete="off"
												selected={null}
												// onChange={(dates) => {
												// 	const [start, end] = dates;
												// 	onChange({ start: start, end: end });
												// 	methods.setValue("startDate", start);
												// 	methods.setValue("endDate", end);
												// }}

												onChange={(date) => {
													onChange(date);
													if (date) {
														if (
															dates
																.map((item) => item.getTime())
																.includes(date.getTime())
														) {
															setDates(
																dates.filter(
																	(_date) => _date.getTime() != date.getTime()
																)
															);
															methods.setValue("Date", null);
														} else {
															setDates([...dates, date]);
														}
													}
												}}
												// minDate={new Date()}
												// startDate={value.start}
												// endDate={value.end}

												highlightDates={dates}
												// selectsRange

												inline
												className="customDate m-0 block w-full rounded-l border border-solid border-gray-300 bg-white bg-clip-padding px-3 py-1.5 text-base font-normal text-gray-700 transition ease-in-out focus:border-blue-600 focus:bg-white focus:text-gray-700 focus:outline-none"
											/>
										</div>
									)}
								/>
								<div className="flex flex-col gap-3">
									{dates.map((date, index) => (
										<div key={index} className="flex gap-3">
											<span>{date.toString()}</span>
											<button
												className="bg-black p-2 text-red-200"
												onClick={() =>
													setDates(dates.filter((item) => item != date))
												}>
												Delete
											</button>
										</div>
									))}
								</div>
								<div className="grid grid-cols-2 gap-3">
									<div className="flex flex-col">
										<label className="text-gray-700">Start Date</label>
										<Controller
											name="startDate"
											rules={{ required: true }}
											control={methods.control}
											defaultValue={new Date()}
											render={({ field }) => (
												<DatePicker
													autoComplete="off"
													selected={field.value}
													onChange={(date) => {
														field.onChange(date);
														let endDate: Date | null =
															methods.getValues("endDate");
														if (endDate && date) {
															if (endDate.getTime() < date.getTime()) {
																methods.setValue("endDate", null);
															}
														}
													}}
													className="m-0 block w-full rounded-l border border-solid border-gray-300 bg-white bg-clip-padding px-3 py-1.5 text-base font-normal text-gray-700 transition ease-in-out focus:border-blue-600 focus:bg-white focus:text-gray-700 focus:outline-none"
												/>
											)}
										/>
									</div>

									<div>
										<label className="text-gray-700">End Date</label>
										<Controller
											name="endDate"
											rules={{ required: true }}
											control={methods.control}
											defaultValue={null}
											render={({ field }) => (
												<DatePicker
													autoComplete="off"
													selected={field.value}
													onChange={field.onChange}
													minDate={methods.getValues("startDate")}
													isClearable
													className="m-0 block w-full rounded-l border border-solid border-gray-300 bg-white bg-clip-padding px-3 py-1.5 text-base font-normal text-gray-700 transition ease-in-out focus:border-blue-600 focus:bg-white focus:text-gray-700 focus:outline-none"
												/>
											)}
										/>
									</div>
								</div>
							</div>
							{/* {methods.formState.errors.DDate && (
								<span className="text-red-500">End Date Required</span>
							)} */}
						</div>
					</form>
				</ModalBody>
				<BottomButtons>
					<BtnSave type={"submit"} />
					<BtnCancel
						onClick={() => {
							setModalOpen(false);
						}}
					/>
				</BottomButtons>
			</Modal>
			<button onClick={() => setModalOpen(true)}>show</button>
		</>
	);
};

AvailabilityPage.getLayout = sidebar;

export default AvailabilityPage;
