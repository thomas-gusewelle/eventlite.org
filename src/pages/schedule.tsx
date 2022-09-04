import React, { useContext } from "react";
import { useState } from "react";
import { TableOptionsDropdown } from "../../types/tableMenuOptions";
import { SectionHeading } from "../components/headers/SectionHeading";
import { sidebar } from "../components/layout/sidebar";

import { trpc } from "../utils/trpc";
import { Role, User } from "@prisma/client";
import { CircularProgress } from "../components/circularProgress";
import { useForm, Controller } from "react-hook-form";
import { fullName } from "../utils/fullName";
import { SuccdssAlert } from "../components/alerts/successAlert";
import { ScheduleSelect } from "../components/form/scheduleSelect";
import { LimitSelect } from "../components/form/limitSelect";
import { UserContext } from "../providers/userProvider";
import { useRouter } from "next/router";
import { router } from "@trpc/server";

const SchedulePageComponent: React.FC<{ cursor: string | null }> = ({
	cursor,
}) => {
	const utils = trpc.useContext();
	const router = useRouter();
	const [showConfirm, setShowConfirm] = useState({
		state: false,
		message: "Changes Saved",
	});

	const [selectedPeople, setSelectedPeople] = useState<
		{
			userId: string;
			dateTime: Date;
		}[]
	>();
	const [poepleList, setPoepleList] = useState<
		(User & {
			roles: Role[];
		})[]
	>();
	const user = useContext(UserContext);
	const [limit, setLimit] = useState(
		user?.UserSettings?.scheduleShowAmount ?? 4
	);

	const getScheduleQuery = trpc.useQuery(
		["schedule.getSchedule", { limit: limit, cursor: cursor }],
		{
			keepPreviousData: true,
			onSuccess(data) {
				let _selectedPeople: { userId: string; dateTime: Date }[] = [];
				data.items.map((item) =>
					item.positions.map((pos) =>
						pos.User.map((user) => {
							_selectedPeople.push({
								userId: user.id,
								dateTime: item.datetime,
							});
						})
					)
				);

				setSelectedPeople(_selectedPeople);
				setPoepleList(data.users);
			},
		}
	);

	const scheduleUserMutation = trpc.useMutation("schedule.updateUserRole", {
		onSuccess() {
			setShowConfirm({ state: true, message: "Changes Saved" });
		},
	});

	const removeUserFromPosition = trpc.useMutation(
		"schedule.removerUserfromPosition",
		{
			onMutate(variables) {
				setSelectedPeople(
					selectedPeople?.filter((people) => people.userId != variables.userId)
				);
			},
			onSuccess() {
				setShowConfirm({ state: true, message: "Changes Saved" });
			},
		}
	);

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
		getScheduleQuery.isLoading ||
		getScheduleQuery.isFetching ||
		poepleList == undefined
	) {
		return (
			<div className="flex justify-center">
				<CircularProgress />
			</div>
		);
	}
	return (
		<div className="relative">
			{showConfirm.state && (
				<div className="sticky top-0 z-30">
					<SuccdssAlert error={showConfirm} setState={setShowConfirm} />
				</div>
			)}

			<form onSubmit={sumbit}>
				<div className="mb-8 flex justify-between gap-4 md:hidden">
					<SectionHeading>Schedule</SectionHeading>
					<div>
						<span></span>
						<LimitSelect selected={limit} setSelected={setLimit} />
					</div>
				</div>
				<div className="mb-8 hidden justify-between md:flex">
					<SectionHeading>Schedule</SectionHeading>
					<div>
						<LimitSelect selected={limit} setSelected={setLimit} />
					</div>
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
											className="grid grid-cols-[1fr_1.5fr] border-t last:border-b last:pb-0"
											key={position.id}>
											<span className="px-6 font-medium">
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
																	userResponce: position.userResponse,
																	userId: position.User[index]?.id,
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
																				{ userId: "", dateTime: new Date() },
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
																					person.roles
																						.map((role) => role.id)
																						.includes(position.roleId) &&
																					!selectedPeople
																						?.filter(
																							(date) =>
																								date.dateTime == event.datetime
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
				<div className="mx-6 flex justify-between">
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
								className="inline-flex items-center rounded-lg border border-gray-300 bg-gray-50 px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100">
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
							className="ml-auto inline-flex items-center rounded-lg border border-gray-300 bg-gray-50 px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100">
							Next Page
						</button>
					)}
				</div>
			</form>
		</div>
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
