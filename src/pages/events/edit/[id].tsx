import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

import {
	EventFormValues,
	EventRecurrance,
} from "../../../../types/eventFormValues";
import {
	CircularProgress,
	CircularProgressSmall,
} from "../../../components/circularProgress";

import { SectionHeading } from "../../../components/headers/SectionHeading";
import { sidebar } from "../../../components/layout/sidebar";

import { Locations } from "@prisma/client";
import { trpc } from "../../../utils/trpc";
import { useRouter } from "next/router";
import { formatEventData } from "../../../utils/formatEventData";
import { EventForm } from "../../../components/form/event/eventForm";
import { findFutureDates } from "../../../server/utils/findFutureDates";

const EditEvent: React.FC<{ id: string; rec: boolean }> = ({ id, rec }) => {
	const router = useRouter();
	const methods = useForm<EventFormValues>();
	const [alreadyRec, setAlreadyRec] = useState<boolean | null>(null);

	useEffect(() => {
		console.log("Is it loading", eventQuery.isFetching),
			[eventQuery.isFetching];
	});

	const eventQuery = trpc.useQuery(["events.getEditEvent", id], {
		cacheTime: 0,
		onSuccess(data) {
			if (!rec && data != undefined) methods.reset(formatEventData(data));
			if (data?.recurringId) setAlreadyRec(true);
		},
	});

	const recurringId = rec ? eventQuery.data?.recurringId || "" : "";
	const EventRecurrance = trpc.useQuery(
		["events.getEventRecurranceData", recurringId],
		{
			enabled: !!recurringId,
			cacheTime: 0,
			onSuccess(data) {
				if (data) {
					if (eventQuery.data == undefined) return;
					methods.reset(formatEventData(eventQuery.data, data));
				}
			},
		}
	);
	const editEventRecurranceData = trpc.useMutation(
		"events.EditEventReccuranceData"
	);
	const editEvent = trpc.useMutation("events.editEvent");
	const editRecurringEvent = trpc.useMutation("events.editRecurringEvent");

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

	const submit = methods.handleSubmit((data) => {
		console.log("this is the data: ", data);
		if (eventQuery.data?.organizationId == null) return;

		let newPositions = data.positions.filter((item) => {
			return eventQuery.data?.positions.every(
				(e) => e.Role.id != item.position.id || item.eventPositionId == null
			);
		});
		newPositions = newPositions.filter((item) => item.eventPositionId == null);

		let updatePositions = data.positions.filter((item) => {
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
		if (rec == false) {
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
		}

		if (rec == true) {
			const newDates = findFutureDates(data);
			if (
				newDates == undefined ||
				newDates == null ||
				eventQuery.data.recurringId == null
			)
				return;
			editRecurringEvent.mutate(
				{
					name: data.name,
					eventTime: data.eventTime,
					recurringId: eventQuery.data.recurringId,
					positions: data.positions.map((position) => ({
						eventPositionId: position.eventPositionId,
						position: {
							roleId: position.position.id,
							roleName: position.position.name,
							organizationId: position.position.organizationId,
						},
						quantity: position.quantity,
					})),
					eventLocation: data.eventLocation,
					organization: eventQuery.data.organizationId,
					newDates: newDates,
				},
				{
					onError(error, variables, context) {
						alert(error.message);
					},
					onSuccess() {
						let _data: any = data;
						_data["recurringId"] = recurringId;
						console.log("This is the data", _data);
						editEventRecurranceData.mutate(_data as EventRecurrance, {
							onSuccess() {
								router.push("/events");
							},
						});
					},
				}
			);
		}
	});

	if (locationsQuery.isLoading) {
		return (
			<div className="flex justify-center">
				<CircularProgress />
			</div>
		);
	}

	if (locations == undefined) {
		return <div></div>;
	}

	return (
		<>
			{/* The is loading is handled here to make the reset work correctly */}
			{eventQuery.isFetching || EventRecurrance.isLoading ? (
				<div className="flex justify-center">
					<CircularProgress />
				</div>
			) : (
				<></>
			)}
			<div
				className={`${
					eventQuery.isFetching || EventRecurrance.isLoading
						? "hidden"
						: "block"
				}`}>
				<div className="mb-8">
					<SectionHeading>Edit Event</SectionHeading>
				</div>
				<FormProvider {...methods}>
					<form onSubmit={submit} className="shadow">
						<EventForm
							locations={locations}
							rec={rec}
							alreadyRec={alreadyRec}
						/>

						<div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
							<button
								type="submit"
								className="w-16 h-10 inline-flex items-center justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
								{editEvent.isLoading ||
								editRecurringEvent.isLoading ||
								editEventRecurranceData.isLoading ? (
									<CircularProgressSmall />
								) : (
									"Save"
								)}
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

	const { id, rec } = router.query;

	if (!id || typeof id !== "string" || !rec || typeof rec !== "string") {
		return <div>No Id Provided</div>;
	}

	function parseBoolean(rec: string) {
		if (rec.toLowerCase() == "true") {
			return true;
		}
		if (rec.toLowerCase() == "false") {
			return false;
		}
		return false;
	}

	return <EditEvent id={id} rec={parseBoolean(rec)} />;
};

EditEventPage.getLayout = sidebar;

export default EditEventPage;
