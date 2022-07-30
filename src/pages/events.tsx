import { Event, EventPositions, Role, User } from "@prisma/client";
import { FormEvent, useEffect, useState } from "react";
import { PaginateData } from "../../types/paginate";
import { TableOptionsDropdown } from "../../types/tableMenuOptions";
import { SectionHeading } from "../components/headers/SectionHeading";
import { PaginationBar } from "../components/layout/pagination-bar";
import { sidebar } from "../components/layout/sidebar";
import { AddDropdownMenu } from "../components/menus/addDropdown";
import { TableDropdown } from "../components/menus/tableDropdown";
import { PicNameRow, PicNameRowSmall } from "../components/profile/PicNameRow";
import { paginate } from "../utils/paginate";
import { trpc } from "../utils/trpc";

const filter = (e: string) => {};

const EventsPage = () => {
	const utils = trpc.useContext();
	const [error, setError] = useState({ state: false, message: "" });
	const [pageNum, setPageNum] = useState(1);
	const [paginatedData, setpagiantedData] = useState<
		PaginateData<
			(Event & {
				positions: (EventPositions & {
					User: User | null;
					Role: Role;
				})[];
			})[]
		>
	>();
	const [events, setEvents] = useState<
		(Event & {
			positions: (EventPositions & {
				User: User | null;
				Role: Role;
			})[];
		})[]
	>([]);
	const [eventsPagianted, setEventsPaginated] = useState<
		(Event & {
			positions: (EventPositions & {
				User: User | null;
				Role: Role;
			})[];
		})[]
	>([]);

	useEffect(() => {
		if (events != undefined) {
			const _paginated = paginate(events, pageNum, 15);
			setpagiantedData(_paginated);
			setEventsPaginated(_paginated.data);
		}
	}, [pageNum, events]);

	const eventsQuery = trpc.useQuery(
		["events.getUpcomingEventsByOrganization"],
		{
			onSuccess(data) {
				if (data != undefined) {
					setEvents(data);
				}
			},
		}
	);

	const deleteEventMutation = trpc.useMutation("events.deleteEventById", {
		onMutate(data) {
			utils.queryClient.cancelQueries();
			setEvents(events.filter((event) => event.id != data));
		},
		onError() {
			if (eventsQuery.data) {
				setEvents(eventsQuery.data);
			}
			eventsQuery.refetch();
		},
		onSuccess() {
			eventsQuery.refetch();
		},
	});

	const filter = (e: string) => {};

	const addOptions: TableOptionsDropdown = [
		{ name: "New Event", href: "/events/addevent" },
		{ name: "From Template", href: "#" },
	];

	if (paginatedData == undefined) {
		return null;
	}

	return (
		<>
			{/* MD Top Bar */}
			<div className="md:hidden grid grid-cols-2 mb-8 gap-4">
				<SectionHeading>Events</SectionHeading>
				<div className="flex justify-end">
					<AddDropdownMenu options={addOptions} />
				</div>
				<div className="col-span-2">
					<input
						onChange={(e) => filter(e.target.value)}
						className="border border-gray-100 focus:outline-none focus:border-indigo-700 rounded-xl w-full text-sm text-gray-500 bg-gray-100 pl-4 py-2"
						type="text"
						placeholder="Search"
					/>
				</div>
			</div>

			{/* Desktop Top Bar */}
			<div className="hidden md:flex justify-between mb-8">
				<SectionHeading>Events</SectionHeading>
				<div className="flex gap-4">
					<input
						onChange={(e) => filter(e.target.value)}
						className="border border-gray-100 focus:outline-none focus:border-indigo-700 rounded-xl w-full text-sm text-gray-500 bg-gray-100 pl-4 py-2"
						type="text"
						placeholder="Search"
					/>
					{/* <SearchBar /> */}
					<AddDropdownMenu options={addOptions} />
				</div>
			</div>

			<div className="grid grid-cols-1 sm:grid-cols-3 gap-12 px-6">
				{eventsPagianted.map((event) => (
					<div
						key={event.id}
						className="pt-4 shadow rounded-lg border border-b-gray-300">
						<div className="flex flex-col px-6 mb-4">
							<div className="flex justify-between">
								<h3 className="font-bold text-xl">{event.name}</h3>
								<TableDropdown
									options={[
										{ name: "Schedule", href: "/schedule" },
										{ name: "Edit", href: `/events/edit/${event.id}` },
										{
											name: "Edit All",
											href: `/events/edit/${event.recurringId}`,
											show: event.recurringId ? false : true,
										},
										{
											name: "Delete",
											function: () => deleteEventMutation.mutate(event.id),
										},
									]}
								/>
							</div>
							<span>{event.datetime.toLocaleDateString()}</span>
							<span>
								{Intl.DateTimeFormat("en-US", { timeStyle: "short" }).format(
									event.datetime
								)}
							</span>
						</div>
						{event.positions.map((position) => (
							<div
								className="grid grid-cols-2 items-center last:pb-0 border-t-2"
								key={position.id}>
								<span className="py-3 px-6 font-medium">
									{position.Role.name}
								</span>
								{position.userId ? (
									<div
										className={`flex justify-center py-3 text-center ${
											position.userResponse == null && "bg-gray-100"
										}
                    ${position.userResponse == true && "bg-green-200"}
                    ${position.userResponse == false && "bg-red-200"}
                    `}>
										<PicNameRowSmall user={position?.User} />
									</div>
								) : (
									<div className="py-3 px-6 bg-gray-100 text-center">
										Not Scheduled
									</div>
								)}
							</div>
						))}
					</div>
				))}
			</div>
			<PaginationBar
				setPageNum={setPageNum}
				pageNum={pageNum}
				paginateData={paginatedData}
			/>
		</>
	);
};

EventsPage.getLayout = sidebar;

export default EventsPage;
