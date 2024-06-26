import { useContext, useState } from "react";
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
import { api } from "../../../server/utils/api"
import { useRouter } from "next/router";
import { formatEventData } from "../../../utils/formatEventData";
import { EventForm } from "../../../components/form/event/eventForm";
import { findFutureDates } from "../../../server/utils/findFutureDates";
import { Modal } from "../../../components/modal/modal";
import { ModalBody } from "../../../components/modal/modalBody";
import { ModalTitle } from "../../../components/modal/modalTitle";
import { BottomButtons } from "../../../components/modal/bottomButtons";
import { BtnDelete } from "../../../components/btn/btnDelete";
import { BtnCancel } from "../../../components/btn/btnCancel";
import { AlertContext } from "../../../providers/alertProvider";
import { BtnPurple } from "../../../components/btn/btnPurple";

const EditEvent: React.FC<{ id: string; rec: boolean }> = ({ id, rec }) => {
  const router = useRouter();
  const alertContext = useContext(AlertContext);
  const [modifyPositionsConfirm, setModifyPositionsConfirm] = useState(false);

  const [formData, setFormData] = useState<EventFormValues | null>(null);
  const methods = useForm<EventFormValues>();
  const [alreadyRec, setAlreadyRec] = useState<boolean | null>(null);

  const eventQuery = api.events.getEditEvent.useQuery(id, {
    cacheTime: 0,
    onError(err) {
      alertContext.setError({
        state: true,
        message: `There was an issue getting your event. Message: ${err.message}`,
      });
    },
    onSuccess(data) {
      if (!rec && data != undefined) methods.reset(formatEventData(data));
      if (data?.recurringId) setAlreadyRec(true);
    },
  });


  const recurringId = rec ? eventQuery.data?.recurringId || "" : "";

  const EventRecurrance = api.events.getEventRecurranceData.useQuery(
    recurringId,
    {
      enabled: recurringId != "",
      cacheTime: 0,
      onSuccess(data) {
        if (data) {
          if (eventQuery.data == undefined) return;
          methods.reset(formatEventData(eventQuery.data, data));
        }
      },
    }
  );
  const createEventReccuranceData = api.events.createEventReccurance.useMutation(
  );
  const editEventRecurranceData = api.events.EditEventReccuranceData.useMutation(
  );
  const editEvent = api.events.editEvent.useMutation({ onMutate() { console.log("Mutation Happening") } });
  const editRecurringEvent = api.events.editRecurringEvent.useMutation();

  const locationsQuery = api.locations.getLocationsByOrg.useQuery(undefined, {
    onSuccess(data) {
      if (data != undefined) {
        setLocations(data);
      }
    },
  });
  const [locations, setLocations] = useState<Locations[]>([
    { id: "", name: "", organizationId: "" },
  ]);

  const preSubmit = methods.handleSubmit((data) => {
    setFormData(data);
    console.log(data)
    // checking for different positions
    const differentPositionsId = eventQuery.data?.positions.filter(
      (item) =>
        !data.positions.map((inp) => inp.eventPositionId).includes(item.id)
    );

    if (differentPositionsId) {
      if (differentPositionsId.length > 0) {
        console.log("here 99")
        setModifyPositionsConfirm(true);
      }
      if (differentPositionsId.length == 0) {
        submit(data);
      }
    }
    if (differentPositionsId == undefined) {
      submit(data);
    }
  });

  const submit = (data: EventFormValues) => {
    console.log("here 111: ", data)
    if (data == null) return;

    //submitting data
    if (eventQuery.data?.organizationId == null) return;
    console.log("here 117");


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
    console.log("isRepeating: ", data.isRepeating, "Rec: ", rec)
    // recurringdId and isRepeating captures both single events that are made repeating and repeating events where only one occurence is being edited. 
    // rec == false ensures that the event was not origianly recurring
    if ((eventQuery.data.recurringId || data.isRepeating == false) && rec == false) {
      editEvent.mutate(
        {
          id: id,
          name: data.name,
          eventDate: data.eventDate,
          eventTime: data.eventTime,
          eventTimeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          eventTimeZoneOffset: new Date().getTimezoneOffset(),
          organization: eventQuery.data.organizationId,
          recurringId: eventQuery.data.recurringId || undefined,
          eventLocation: data.eventLocation,
          newPositions: newPositions.map((item) => ({
            position: {
              roleId: item.position.id,
              roleName: item.position.name,
              organizationId: item.position.organizationId,
            },
          })),
          updatePositions: updatePositions.map((item) => ({
            eventPositionId: item.eventPositionId!,
            position: {
              roleId: item.position.id,
              roleName: item.position.name,
              organizationId: item.position.organizationId,
            },
          })),
          deletePositions: deletePositions.map((item) => item.id),
        },
        {
          onError(err) {
            alertContext.setError({
              state: true,
              message: `There was an error updating you event. Please try again. ${err.message}`,
            });
          },
          onSuccess() {
            router.push("/events");
          },
        }
      );
    }
    // isRepeating catures events that are now repeating and rec captures events that where origianlly recuring. 
    if (data.isRepeating == true || rec == true) {
      const newDates = findFutureDates(data);

      if (newDates == undefined || newDates == null) return;

      editRecurringEvent.mutate(
        {
          id: eventQuery.data.id,
          name: data.name,
          eventTime: data.eventTime,
          eventTimeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          eventTimeZoneOffset: new Date().getTimezoneOffset(),
          recurringId: eventQuery.data.recurringId || undefined,
          positions: data.positions.map((position) => ({
            eventPositionId: position.eventPositionId,
            position: {
              roleId: position.position.id,
              roleName: position.position.name,
              organizationId: position.position.organizationId,
            },
          })),
          eventLocation: data.eventLocation,
          organization: eventQuery.data.organizationId,
          newDates: newDates,
        },
        {
          onError(error, variables, context) {
            alertContext.setError({
              state: true,
              message: `There was an error updating you event. Please try again. ${error.message}`,
            });
          },
          // TODO: create new eventReccuranceData for event that was not already recuring
          onSuccess(returnedData) {
            let _data: any = data;

            _data["recurringId"] =
              recurringId == "" ? returnedData![0]?.recurringId : recurringId;
            if (recurringId == "") {
              createEventReccuranceData.mutate(_data as EventRecurrance, {
                onSuccess() {
                  router.push("/events");
                },
              });
            } else {
              editEventRecurranceData.mutate(_data as EventRecurrance, {
                onSuccess() {
                  router.push("/events");
                },
              });
            }
          },
        }
      );
    }
  };

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
      <Modal open={modifyPositionsConfirm} setOpen={setModifyPositionsConfirm}>
        <div className='flex justify-center'>
          <ModalBody>
            <ModalTitle
              text={
                "Modifying exisiting positions will remove scheduled users. Would you like to proceed?"
              }
            />
            <BottomButtons>
              <BtnDelete
                onClick={() => {
                  if (formData == null) return;
                  submit(formData);
                  setModifyPositionsConfirm(false);
                }}
              />
              <BtnCancel
                onClick={() => {
                  setModifyPositionsConfirm(false);
                }}
              />
            </BottomButtons>
          </ModalBody>
        </div>
      </Modal>
      {/* The is loading is handled here to make the reset work correctly */}
      {eventQuery.isLoading || (EventRecurrance.isLoading && recurringId != "") ? (
        <div className='flex justify-center'>
          <CircularProgress />
        </div>
      ) : (
        <></>
      )}
      <div
        className={`${eventQuery.isLoading || (EventRecurrance.isLoading && recurringId != "")
          ? "hidden"
          : "block"
          }`}>
        <div className='mb-8'>
          <SectionHeading>Edit Event</SectionHeading>
        </div>
        <FormProvider {...methods}>
          <form onSubmit={preSubmit} className='shadow'>
            <EventForm
              locations={locations}
              rec={rec}
              alreadyRec={alreadyRec}
            />

            <div className='flex justify-end bg-gray-50 px-4 py-3 text-right sm:px-6'>
              <BtnPurple type="submit" isLoading={editEvent.isLoading ||
                editRecurringEvent.isLoading ||
                editEventRecurranceData.isLoading}>Save</BtnPurple>
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
