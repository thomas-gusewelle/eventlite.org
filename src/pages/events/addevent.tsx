import { FormProvider, useForm } from "react-hook-form";
import { SectionHeading } from "../../components/headers/SectionHeading";
import { useContext, useState } from "react";
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
import { AlertContext } from "../../providers/alertProvider";

// TODO: implement error context
const AddEvent = () => {
  const utils = trpc.useContext();
  const router = useRouter();
  const alertContext = useContext(AlertContext);
  const locationsQuery = trpc.useQuery(["locations.getLocationsByOrg"], {
    onSuccess(data) {
      if (data != undefined) {
        setLocations(data);
      }
    },
    onError(err) {
      alertContext.setError({
        state: true,
        message: `Error fetching locations. Message; ${err.message}`,
      });
      locationsQuery.refetch();
    },
  });
  const [locations, setLocations] = useState<Locations[]>([
    { id: "", name: "", organizationId: "" },
  ]);

  const addEventRecurrance = trpc.useMutation("events.createEventReccurance", {
    onError(error, variables, context) {
      alertContext.setError({
        state: true,
        message: `There was an error saving the reccurance structure. Message: ${error.message}`,
      });
    },
  });
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
              alertContext.setError({
                state: true,
                message: `There was an error creating your event. Please try again. Message: ${error.message}`,
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
      <div className='mb-8'>
        <SectionHeading>Add Event</SectionHeading>
      </div>
      <FormProvider {...methods}>
        <form onSubmit={submit} className='shadow'>
          <EventForm locations={locations} />

          <div className='bg-gray-50 px-4 py-3 text-right sm:px-6'>
            <button
              type='submit'
              className='inline-flex h-10 w-16 items-center justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'>
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
