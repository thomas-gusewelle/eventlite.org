import { EventPositions, Event, User } from "@prisma/client";
import DayBeforeEmail from "../schedule/dayBeforeEmail";



type EventsWithPositions = (Event & {
  positions: (EventPositions & {
    User: User | null
  })[];
})[] | undefined

const event: EventsWithPositions =
  [{
    id: "clfbvndga00035ajcryacqrik",
    recurringId: null,
    name: "Test",
    organizationId: "3144787e-a95a-4c1d-a14f-98c8622d3987",
    datetime: new Date(),
    locationsId: "3146d597-83ec-405f-b880-7e33f1260b0f",
    unavailableUsers: null,
    positions: [
      {
        id: "clfbvndga00055ajcudoya0hf",
        eventId: "clfbvndga00035ajcryacqrik",
        roleId: "e0b6323c-b3a1-4077-8432-e126c9761f53",
        userId: "clfbvo3h100075ajcb52fapz5",
        userResponse: null,
        User: {
          id: "clfbvo3h100075ajcb52fapz5",
          firstName: "Test",
          lastName: "test2",
          status: "USER",
          email: "test@eedc.com",
          emailVerified: null,
          phoneNumber: "1231234123",
          image: null,
          organizationId: "3144787e-a95a-4c1d-a14f-98c8622d3987",
          hasLogin: false,
          userSettingsId: null
        }
      }
    ]
  }]

export function dayBeforeEmail() {
  return <DayBeforeEmail events={event} user={{
    id: "",
    firstName: "Timmy",
    lastName: "Test",
    status: "USER",
    email: "test@test.com",
    emailVerified: null,
    phoneNumber: null,
    image: null,
    organizationId: null,
    hasLogin: false,
    userSettingsId: null
  }} />
}
