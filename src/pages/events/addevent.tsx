import { FormProvider, useForm } from "react-hook-form";
import { SectionHeading } from "../../components/headers/SectionHeading";
import { useContext, useState } from "react";
import {
  EventFormValues,
  EventRecurrance,
} from "../../../types/eventFormValues";
import { api } from "../../server/utils/api"
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
import { AlertContext } from "../../providers/alertProvider";
import { formatEventData } from "../../utils/formatEventData";

const AddEvent = ({ redirect, duplicateId }: { redirect: string | undefined, duplicateId: string | undefined }) => {
  const router = useRouter();
  const alertContext = useContext(AlertContext);
  const methods = useForm<EventFormValues>();
  const [recuringId, setRecuringId] = useState<string | null>(null);


  const eventQuery = api.events.getEditEvent.useQuery(duplicateId ?? "", {
    cacheTime: 0,
    enabled: !!duplicateId,
    onError(err) {
      alertContext.setError({
        state: true,
        message: `There was an issue getting your event. Message: ${err.message}`,
      });
    },
    onSuccess(data) {
      if (data) {
        if (data.recurringId == undefined) {
          methods.reset(formatEventData(data))
        } else {
          setRecuringId(data.recurringId)
        }
      }
    },
  });

  const eventRecurringInfo =
    api.events.getEventRecurranceData.useQuery(recuringId ?? "", {
      enabled: !!recuringId,
      onSuccess(recdata) {
        if (recdata && eventQuery.data) {
          methods.reset(formatEventData(eventQuery.data, recdata))
        }
      }
    })

  const locationsQuery = api.locations.getLocationsByOrg.useQuery(undefined, {
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

  const addEventRecurrance = api.events.createEventReccurance.useMutation({
    onError(error) {
      alertContext.setError({
        state: true,
        message: `There was an error saving the reccurance structure. Message: ${error.message}`,
      });
    },
  });
  const addEvent = api.events.createEvent.useMutation({
    onError(error) { alertContext.setError({ state: true, message: error.message }) },
  });
  const submit = methods.handleSubmit((data: EventFormValues) => {
    if (!data.isRepeating) {
      addEvent.mutate({
        name: data.name,
        eventDate: data.eventDate,
        eventTime: data.eventTime,
        eventTimeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        eventTimeZoneOffset: new Date().getTimezoneOffset(),
        eventLocation: data.eventLocation,
        positions: data.positions,
      }, {
        onSuccess() {
          if (redirect) {
            router.push(redirect);
          } else {
            router.push("/events");
          }
        },
      });
    }
    if (data.isRepeating) {
      const newDates = findFutureDates(data);
      const recurringId = uuidv4();
      newDates?.map((date) => {
        addEvent.mutate(
          {
            name: data.name,
            eventDate: date,
            eventTime: data.eventTime,
            eventTimeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            eventTimeZoneOffset: new Date().getTimezoneOffset(),
            recurringId: recurringId,
            eventLocation: data.eventLocation,
            positions: data.positions,
          },
          {
            onError(error) {
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
                  if (redirect) {
                    router.push(redirect);
                  } else {
                    router.push("/events");
                  }
                },
              });

              //   router.push("/events");
            },
          }
        );
      });
    }
  });

  if (locationsQuery.isLoading || duplicateId ? (eventQuery.isLoading || recuringId ? eventRecurringInfo.isLoading : false) : false) {
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

const AddEventPage = () => {
  const router = useRouter();

  //TODO: check type of new things and pass them to the page
  const { redirect, duplicateId } = router.query;

  if (Array.isArray(redirect) || Array.isArray(duplicateId)) {
    return <div>Error with redirct link</div>;
  }

  return <AddEvent redirect={redirect} duplicateId={duplicateId} />;
};

AddEventPage.getLayout = sidebar;

export default AddEventPage;
