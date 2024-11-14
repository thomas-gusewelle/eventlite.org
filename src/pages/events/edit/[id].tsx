import { useContext, useState, useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";

import {
  EventFormValues,
  EventRecurrance,
} from "../../../../types/eventFormValues";

import { SectionHeading } from "../../../components/headers/SectionHeading";
import { sidebar } from "../../../components/layout/sidebar";

import { api } from "../../../server/utils/api";
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

  const [eventData, eventQuery] = api.events.getEditEvent.useSuspenseQuery(id);
  useEffect(() => {
    if (eventQuery.isError) {
      alertContext.setError({
        state: true,
        message: `There was an issue getting your event. Message: ${eventQuery.error?.message}`,
      });
    } else if (eventQuery.isSuccess && eventData) {
      if (eventData?.recurranceData == null) {
        methods.reset(
          formatEventData(eventData.event!, eventData.recurranceData!)
        );
      } else {
        methods.reset(formatEventData(eventData.event!));
      }
    }
  }, [alertContext, eventData,  methods, eventQuery.isSuccess, eventQuery.isError, eventQuery.error?.message ]);

  const recurringId = rec
    ? eventData?.event?.recurringId || undefined
    : undefined;
  const alreadyRec = eventData?.event?.recurringId ? true : false;


  const createEventReccuranceData =
    api.events.createEventReccurance.useMutation();
  const editEventRecurranceData =
    api.events.EditEventReccuranceData.useMutation();
  const editEvent = api.events.editEvent.useMutation();
  const editRecurringEvent = api.events.editRecurringEvent.useMutation();

  const preSubmit = methods.handleSubmit((data) => {
    setFormData(data);
    // checking for different positions
    const differentPositionsId = eventData?.event?.positions.filter(
      (item) =>
        !data.positions.map((inp) => inp.eventPositionId).includes(item.id)
    );

    if (differentPositionsId) {
      if (differentPositionsId.length > 0) {
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
    if (data == null) return;

    //submitting data
    if (eventData?.event?.organizationId == null) return;

    let newPositions = data.positions.filter((item) => {
      return eventData?.event?.positions.every(
        (e) => e.Role.id != item.position.id || item.eventPositionId == null
      );
    });
    newPositions = newPositions.filter((item) => item.eventPositionId == null);

    let updatePositions = data.positions.filter((item) => {
      return eventData?.event?.positions.filter(
        (e) => e.Role.id === item.position.id
      );
    });
    updatePositions = updatePositions.filter(
      (item) => item.eventPositionId != undefined
    );
    const deletePositions = eventData?.event?.positions.filter((item) => {
      return data.positions.every((d) => d.eventPositionId != item.id);
    });
    // recurringdId and isRepeating captures both single events that are made repeating and repeating events where only one occurence is being edited.
    // rec == false ensures that the event was not origianly recurring
    if (
      (eventData?.event?.recurringId || data.isRepeating == false) &&
      rec == false
    ) {
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
          id: eventData.event.id,
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
          organization: eventData.event.organizationId,
          newDates: newDates,
        },
        {
          onError(error, variables, context) {
            alertContext.setError({
              state: true,
              message: `There was an error updating you event. Please try again. ${error.message}`,
            });
          },
          onSuccess(returnedData) {
            let _data: any = data;

            _data["recurringId"] = !recurringId
              ? returnedData![0]?.recurringId
              : recurringId;
            if (!recurringId) {
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

  return (
    <>
      <Modal open={modifyPositionsConfirm} setOpen={setModifyPositionsConfirm}>
        <div className="flex justify-center">
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
      <div
      >
        <div className="mb-8">
          <SectionHeading>Edit Event</SectionHeading>
        </div>
        <FormProvider {...methods}>
          <form onSubmit={preSubmit} className="shadow">
            <EventForm rec={rec} alreadyRec={alreadyRec} />

            <div className="flex justify-end bg-gray-50 px-4 py-3 text-right sm:px-6">
              <BtnPurple
                type="submit"
                isLoading={
                  editEvent.isPending ||
                  editRecurringEvent.isPending ||
                  editEventRecurranceData.isPending
                }
              >
                Save
              </BtnPurple>
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
