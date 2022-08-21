import React, { useEffect } from "react";
import { useState } from "react";
import { InfiniteData } from "react-query";
import { TableOptionsDropdown } from "../../types/tableMenuOptions";
import { SectionHeading } from "../components/headers/SectionHeading";
import { sidebar } from "../components/layout/sidebar";
import { AddDropdownMenu } from "../components/menus/addDropdown";
import { trpc } from "../utils/trpc";
import { Event, User } from "@prisma/client";
import { CircularProgress } from "../components/circularProgress";
import { TableDropdown } from "../components/menus/tableDropdown";
import { PicNameRowSmall } from "../components/profile/PicNameRow";
import { SingleSelect } from "../components/form/singleSelect";
import { useForm, FormProvider, Controller } from "react-hook-form";
import { fullName } from "../utils/fullName";
import { ErrorAlert } from "../components/alerts/errorAlert";

const SchedulePage = () => {
	const utils = trpc.useContext();
	const [showConfirm, setShowConfirm] = useState({
		state: false,
		message: "Changes Saved",
	});
	const [cursor, setcursor] = useState<string | null | undefined>(null);

	const getScheduleQuery = trpc.useQuery(
		["schedule.getSchedule", { limit: 4, cursor: cursor }],
		{
			keepPreviousData: true,
			onSuccess(data) {},
		}
	);

	const scheduleUserMutation = trpc.useMutation("schedule.updateUserRole", {
		onSuccess() {
			setShowConfirm({ state: true, message: "Changes Saved" });
		},
	});

	const methods = useForm();

	const addOptions: TableOptionsDropdown = [
		{ name: "New Event", href: "/events/addevent" },
		{ name: "From Template", href: "#" },
	];

	const sumbit = methods.handleSubmit((data) => {
		data = Object.values(data).filter((item) => item.positionId != null);
		console.log("This is the data", data);
	});

	if (
		getScheduleQuery.data == undefined ||
		getScheduleQuery.data.users == undefined ||
		getScheduleQuery.isLoading
	) {
		return (
			<div className="flex justify-center">
				<CircularProgress />
			</div>
		);
	}
	return (
		<>
			{showConfirm.state && (
				<ErrorAlert error={showConfirm} setState={setShowConfirm} />
			)}
			<form onSubmit={sumbit}>
				<div className="mb-8 grid grid-cols-2 gap-4 md:hidden">
					<SectionHeading>Schedule</SectionHeading>
					<div className="flex justify-end">
						<AddDropdownMenu options={addOptions} />
					</div>
				</div>
				<div className="mb-8 hidden justify-between md:flex">
					<SectionHeading>Schedule</SectionHeading>
				</div>
				<div>
					<div className="mb-6 grid gap-6 px-6 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
						{getScheduleQuery?.data.items.map((event) => (
							<div
								key={event.id}
								className="flex flex-col rounded-lg border border-gray-300 shadow">
								<div className=" mb-4 flex flex-col px-6 pt-4">
									<div className="flex justify-between">
										<h3 className="text-xl font-bold">{event.name}</h3>
									</div>
									<span className="text-lg font-medium">
										{event.Locations?.name}
									</span>
									<span>{event.datetime.toLocaleDateString()}</span>
									<span>
										{Intl.DateTimeFormat("en-US", {
											timeStyle: "short",
										}).format(event.datetime)}
									</span>
								</div>

								{event.positions.map((position) => {
									let positionNum = [];
									for (let i = 1; i <= position.numberNeeded; i++) {
										positionNum.push(i);
									}
									return (
										<div
											className="grid grid-cols-2 border-t last:border-b last:pb-0"
											key={position.id}>
											<span className="py-3 px-6 font-medium">
												{position.Role.name}
											</span>
											<div>
												{positionNum.map((num, index) => (
													<>
														<Controller
															key={num + index}
															name={position.id + index}
															defaultValue={
																{
																	name: fullName(
																		position.User[index]?.firstName,
																		position.User[index]?.lastName
																	),
																} || { name: "" }
															}
															control={methods.control}
															render={({ field, fieldState }) => (
																<SingleSelect
																	selected={field.value}
																	setSelected={(value) => {
																		field.onChange(value);
																		console.log(value);
																		console.log({
																			posisitionId: position.id,
																			userId: value.id,
																		});
																		scheduleUserMutation.mutate({
																			posisitionId: position.id,
																			userId: value.userId,
																		});
																	}}
																	list={
																		getScheduleQuery?.data?.users
																			?.filter((user) =>
																				user.roles
																					.map((role) => role.id || "")
																					.includes(position.roleId)
																			)
																			.map((user) => ({
																				name: fullName(
																					user.firstName,
																					user.lastName
																				),
																				userId: user.id,
																				positionId: position.id,
																				show: true,
																			})) || [{ name: "" }]
																	}
																/>
															)}
														/>
													</>
												))}
											</div>
										</div>
									);
								})}
							</div>
						))}
					</div>
				</div>
				<button
					onClick={() => setcursor(getScheduleQuery.data?.lastCursor?.id)}
					className="m-2 bg-red-500 p-2 text-white">
					{getScheduleQuery.data?.lastCursor?.datetime.toLocaleDateString()}
				</button>
				<button
					onClick={() => setcursor(getScheduleQuery.data?.nextCursor?.id)}
					className="mr-2 bg-red-500 p-2 text-white">
					{getScheduleQuery.data?.nextCursor?.datetime.toLocaleDateString() ||
						null}
				</button>
				<button className="bg-indigo-200">Submit form</button>
			</form>
		</>
	);
};

SchedulePage.getLayout = sidebar;

export default SchedulePage;
