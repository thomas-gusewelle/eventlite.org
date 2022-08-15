import {
  Event,
  EventPositions,
  EventReccurance as EV,
  Locations,
  Role,
} from "@prisma/client";
import { EventFormValues, EventRecurrance } from "../../types/eventFormValues";

export function formatEventData(
  input: Event & {
    Locations: Locations | null;
    positions: (EventPositions & {
      Role: Role;
    })[];
  },
  eventRecurrance?: EV
) {
  if (input.recurringId && eventRecurrance != undefined) {
    let recurringData = formatEventRecurrance(eventRecurrance, input);
    const newData: EventFormValues = {
      name: input.name,
      eventDate: input.datetime,
      eventTime: input.datetime,
      isRepeating: input.recurringId ? true : false,
      positions: input.positions.map((position) => ({
        eventPositionId: position.id,
        position: {
          organizationId: position.Role.organizationId,
          name: position.Role.name,
          id: position.Role.id,
        },
        quantity: position.numberNeeded,
      })),
      eventLocation: {
        id: input.Locations?.id || "",
        name: input.Locations?.name || "",
        organizationId: input.Locations?.organizationId || "",
      } || { id: "", name: "", organizationId: "" },
      repeatFrequency: recurringData?.repeatFrequency,
      DEndSelect: recurringData?.DEndSelect,
      DNum: recurringData?.DNum,
      DDate: recurringData?.DDate,
      WEndSelect: recurringData?.WEndSelect,
      WNum: recurringData?.WNum,
      WDate: recurringData?.WDate,
      WCEndSelect: recurringData?.WCEndSelect,
      WCNum: recurringData?.WCNum,
      WCDate: recurringData?.WCDate,
      WCSun: recurringData?.WCSun,
      WCMon: recurringData?.WCMon,
      WCTues: recurringData?.WCTues,
      WCWed: recurringData?.WCWed,
      WCThurs: recurringData?.WCThurs,
      WCFri: recurringData?.WCFri,
      WCSat: recurringData?.WCSat,
      MEndSelect: recurringData?.MEndSelect,
      MNum: recurringData?.MNum,
      MDate: recurringData?.MDate,
    };
    return newData;
  }

  const newData: EventFormValues = {
    name: input.name,
    eventDate: input.datetime,
    eventTime: input.datetime,
    isRepeating: input.recurringId ? true : false,
    positions: input.positions.map((position) => ({
      eventPositionId: position.id,
      position: {
        organizationId: position.Role.organizationId,
        name: position.Role.name,
        id: position.Role.id,
      },
      quantity: position.numberNeeded,
    })),
    eventLocation: {
      id: input.Locations?.id || "",
      name: input.Locations?.name || "",
      organizationId: input.Locations?.organizationId || "",
    },
  };
  return newData;
}

function formatEventRecurrance(recurringData: EV, event: Event) {
  const _newData: EventRecurrance = {
    recurringId: event.recurringId || "",
    repeatFrequency: {
      id: recurringData?.repeatFrequecyId as "D" | "W" | "WC" | "M",
      name: recurringData.repeatFrequencyName,
    },
    DEndSelect: {
      id: recurringData?.DEndSelectId as "Num" | "Date",
      name: recurringData.DEndSelectName || "",
    },
    DNum: recurringData?.DNum || undefined,
    DDate: recurringData?.DDate || undefined,
    WEndSelect: {
      id: recurringData?.WEndSelectId as "Num" | "Date",
      name: recurringData.WEndSelectName || "",
    },
    WNum: recurringData?.WNum || undefined,
    WDate: recurringData?.WDate || undefined,
    WCEndSelect: {
      id: recurringData?.WCEndSelectId as "Num" | "Date",
      name: recurringData.WCEndSelectName || "",
    },
    WCNum: recurringData?.WCNum || undefined,
    WCDate: recurringData?.WCDate || undefined,
    WCSun: recurringData?.WCSun || undefined,
    WCMon: recurringData?.WCMon || undefined,
    WCTues: recurringData?.WCTues || undefined,
    WCWed: recurringData?.WCWed || undefined,
    WCThurs: recurringData?.WCThurs || undefined,
    WCFri: recurringData?.WCFri || undefined,
    WCSat: recurringData?.WCSat || undefined,
    MEndSelect: {
      id: recurringData?.MEndSelectId as "Num" | "Date",
      name: recurringData.MEndSelectName || "",
    },
    MNum: recurringData?.MNum || undefined,
    MDate: recurringData?.MDate || undefined,
  };
  return _newData;
}
