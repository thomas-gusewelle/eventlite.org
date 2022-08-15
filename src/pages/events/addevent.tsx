import { FormProvider, useForm } from "react-hook-form";
import { SectionHeading } from "../../components/headers/SectionHeading";
import { useState } from "react";
import {
  EventFormValues,
  EventRecurrance,
} from "../../../types/eventFormValues";
import { trpc } from "../../utils/trpc";
import { useRouter } from "next/router";
import { Locations } from "@prisma/client";
import {
  CircularProgress,
  CircularProgressSmall,
} from "../../components/circularProgress";
import { findFutureDates } from "../../server/utils/findFutureDates";
import { v4 as uuidv4 } from "uuid";
import { EventForm } from "../../components/form/event/eventForm";
import { sidebar } from "../../components/layout/sidebar";
import { ErrorAlert } from "../../components/alerts/errorAlert";

const AddEvent = () => {
  const utils = trpc.useContext();
  const router = useRouter();
  const [error, setError] = useState({
    state: false,
    message: "There was an error creating your event. Please try again.",
  });
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

  const addEventRecurrance = trpc.useMutation("events.createEventReccurance");
  const addEvent = trpc.useMutation("events.createEvent", {
    onError(error, variables, context) {},
  });
  const methods = useForm<EventFormValues>();
  const submit = methods.handleSubmit((data: EventFormValues) => {
    if (!data.isRepeating) {
      addEvent.mutate(data, {
        onSuccess() {
          router.push("/events");
        },
      });
    }
    if (data.isRepeating) {
      const newDates = findFutureDates(data);
      const recurringId = uuidv4();
      newDates?.map((date, index) => {
        addEvent.mutate(
          {
            name: data.name,
            eventDate: date,
            eventTime: data.eventTime,
            recurringId: recurringId,
            eventLocation: data.eventLocation,
            positions: data.positions,
          },
          {
            onError(error, variables, context) {
              setError({
                state: true,
                message:
                  "There was an error creating your event. Please try again.",
              });
            },
            onSuccess() {
              if (recurringId == undefined) return;
              let _data: any = data;
              _data["recurringId"] = recurringId;
              addEventRecurrance.mutate(_data as EventRecurrance, {
                onSuccess() {
                  router.push("/events");
                },
              });

              //   router.push("/events");
            },
          }
        );
      });
    }
  });

  if (locationsQuery.isLoading) {
    return (
      <div className='flex justify-center'>
        <CircularProgress />
      </div>
    );
  }

  if (locations == undefined) {
    return <div></div>;
  }

  return (
    <>
      {error.state && <ErrorAlert error={error} setState={setError} />}
      <div className='mb-8'>
        <SectionHeading>Add Event</SectionHeading>
      </div>
      <FormProvider {...methods}>
        <form onSubmit={submit} className='shadow'>
          <EventForm locations={locations} />

          <div className='px-4 py-3 bg-gray-50 text-right sm:px-6'>
            <button
              type='submit'
              className='w-16 h-10 inline-flex items-center justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'>
              {addEvent.isLoading ? <CircularProgressSmall /> : "Save"}
            </button>
          </div>
        </form>
      </FormProvider>
    </>
  );
};

AddEvent.getLayout = sidebar;

export default AddEvent;
