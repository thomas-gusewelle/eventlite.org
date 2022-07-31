import { Event, EventPositions, Locations, Role } from "@prisma/client";
import { EventFormValues } from "../../types/eventFormValues";

export function formatEventData(
  input: Event & {
    Locations: Locations | null;
    positions: (EventPositions & {
      Role: Role;
    })[];
  }
) {
  if (input.Locations == null) return;

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
      id: input.Locations.id,
      name: input.Locations.name,
      organizationId: input.Locations.organizationId,
    },
  };
  return newData;
}
