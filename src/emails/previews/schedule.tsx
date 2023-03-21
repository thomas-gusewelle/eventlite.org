import { EventPositions, Event, User, Locations, Role, UserStatus } from "@prisma/client";
import { ReminderEmailData } from "../../pages/api/messaging/schedule";
import DayBeforeEmail from "../schedule/dayBeforeEmail";



type EventsWithPositions = (Event & {
  Locations: Locations | null;
  positions: (EventPositions & {
    Role: Role | null
    User: User | null
  })[];
})[] | undefined

const event: EventsWithPositions =
  [
    {
      id: "clfbvndga00035ajcryacqrik",
      recurringId: null,
      name: "Test",
      organizationId: "3144787e-a95a-4c1d-a14f-98c8622d3987",
      datetime: new Date(),
      timezone: "America/Chicago",
      locationsId: "3146d597-83ec-405f-b880-7e33f1260b0f",
      unavailableUsers: null,
      Locations: {
        id: "474ee39d-e15b-451a-87f0-a703fd864f4f",
        name: "Founders Hall",
        organizationId: "79f18de6-ffeb-11ec-b939-0242ac120002"
      },
      positions: [
        {
          id: "clchrumj2031108mm49ocwzh0",
          eventId: "cl7c7c9ml1058hqv8mbwcp81i",
          roleId: "03181993-c105-46ad-baeb-704649eb3d23",
          userId: "03e6b51f-899b-4941-a412-d2858f15e685",
          userResponse: true,
          Role: {
            id: "03181993-c105-46ad-baeb-704649eb3d23",
            name: "Technical Director",
            organizationId: "79f18de6-ffeb-11ec-b939-0242ac120002"
          },
          User: {
            id: "03e6b51f-899b-4941-a412-d2858f15e685",
            firstName: "Thomas",
            lastName: "Gusewelle",
            status: "ADMIN",
            email: "thomasgusewelle21@gmail.com",
            emailVerified: null,
            phoneNumber: "9792190103",
            image: null,
            organizationId: "79f18de6-ffeb-11ec-b939-0242ac120002",
            hasLogin: true,
            userSettingsId: null
          }
        },
        {
          id: "cl7c7c9ml1059hqv8rll2w3y4",
          eventId: "cl7c7c9ml1058hqv8mbwcp81i",
          roleId: "283b0d77-c6a0-4350-947d-de95e6b6e1cb",
          userId: "cleos0tnr0001ju08j3no7ndc",
          userResponse: null,
          Role: {
            id: "283b0d77-c6a0-4350-947d-de95e6b6e1cb",
            name: "Audio",
            organizationId: "79f18de6-ffeb-11ec-b939-0242ac120002"
          },
          User: {
            id: "cleos0tnr0001ju08j3no7ndc",
            firstName: "Scotty",
            lastName: "Drake",
            status: "USER",
            email: "scotty.drake@att.net",
            emailVerified: null,
            phoneNumber: "",
            image: null,
            organizationId: "79f18de6-ffeb-11ec-b939-0242ac120002",
            hasLogin: false,
            userSettingsId: null
          }
        },
        {
          id: "cl7c7c9ml1060hqv8ksb4ta9f",
          eventId: "cl7c7c9ml1058hqv8mbwcp81i",
          roleId: "a2ab0851-7d49-4e3b-bec4-30c0010f86e0",
          userId: "1a078b30-a6a9-4967-9cee-1b5c4cf6ef8e",
          userResponse: null,
          Role: {
            id: "a2ab0851-7d49-4e3b-bec4-30c0010f86e0",
            name: "Slides",
            organizationId: "79f18de6-ffeb-11ec-b939-0242ac120002"
          },
          User: {
            id: "1a078b30-a6a9-4967-9cee-1b5c4cf6ef8e",
            firstName: "Jack",
            lastName: "Drake",
            status: "USER",
            email: "jack.drake@att.net",
            emailVerified: null,
            phoneNumber: "",
            image: null,
            organizationId: "79f18de6-ffeb-11ec-b939-0242ac120002",
            hasLogin: true,
            userSettingsId: null
          }
        },
        {
          id: "cl7c7c9ml1061hqv8m4gzezag",
          eventId: "cl7c7c9ml1058hqv8mbwcp81i",
          roleId: "56db6d46-2578-4275-8023-8b9a62f896e1",
          userId: "cleos5a4b000d5ayc4dua1jn8",
          userResponse: null,
          Role: {
            id: "56db6d46-2578-4275-8023-8b9a62f896e1",
            name: "Video",
            organizationId: "79f18de6-ffeb-11ec-b939-0242ac120002"
          },
          User: {
            id: "cleos5a4b000d5ayc4dua1jn8",
            firstName: "Henry",
            lastName: "Baxter",
            status: "USER",
            email: "henry.h.baxter@gmail.com",
            emailVerified: null,
            phoneNumber: "",
            image: null,
            organizationId: "79f18de6-ffeb-11ec-b939-0242ac120002",
            hasLogin: false,
            userSettingsId: null
          }
        }
      ]
    },

    {
      id: "clfbvndga00035ajcryacqrik",
      recurringId: null,
      name: "Test",
      organizationId: "3144787e-a95a-4c1d-a14f-98c8622d3987",
      datetime: new Date(),
      timezone: "America/Chicago",
      locationsId: "3146d597-83ec-405f-b880-7e33f1260b0f",
      unavailableUsers: null,
      Locations: {
        id: "474ee39d-e15b-451a-87f0-a703fd864f4f",
        name: "Founders Hall",
        organizationId: "79f18de6-ffeb-11ec-b939-0242ac120002"
      },
      positions: [
        {
          id: "clchrumj2031108mm49ocwzh0",
          eventId: "cl7c7c9ml1058hqv8mbwcp81i",
          roleId: "03181993-c105-46ad-baeb-704649eb3d23",
          userId: "03e6b51f-899b-4941-a412-d2858f15e685",
          userResponse: true,
          Role: {
            id: "03181993-c105-46ad-baeb-704649eb3d23",
            name: "Technical Director",
            organizationId: "79f18de6-ffeb-11ec-b939-0242ac120002"
          },
          User: {
            id: "03e6b51f-899b-4941-a412-d2858f15e685",
            firstName: "Thomas",
            lastName: "Gusewelle",
            status: "ADMIN",
            email: "thomasgusewelle21@gmail.com",
            emailVerified: null,
            phoneNumber: "9792190103",
            image: null,
            organizationId: "79f18de6-ffeb-11ec-b939-0242ac120002",
            hasLogin: true,
            userSettingsId: null
          }
        },
        {
          id: "cl7c7c9ml1059hqv8rll2w3y4",
          eventId: "cl7c7c9ml1058hqv8mbwcp81i",
          roleId: "283b0d77-c6a0-4350-947d-de95e6b6e1cb",
          userId: "cleos0tnr0001ju08j3no7ndc",
          userResponse: null,
          Role: {
            id: "283b0d77-c6a0-4350-947d-de95e6b6e1cb",
            name: "Audio",
            organizationId: "79f18de6-ffeb-11ec-b939-0242ac120002"
          },
          User: {
            id: "cleos0tnr0001ju08j3no7ndc",
            firstName: "Scotty",
            lastName: "Drake",
            status: "USER",
            email: "scotty.drake@att.net",
            emailVerified: null,
            phoneNumber: "",
            image: null,
            organizationId: "79f18de6-ffeb-11ec-b939-0242ac120002",
            hasLogin: false,
            userSettingsId: null
          }
        },
        {
          id: "cl7c7c9ml1060hqv8ksb4ta9f",
          eventId: "cl7c7c9ml1058hqv8mbwcp81i",
          roleId: "a2ab0851-7d49-4e3b-bec4-30c0010f86e0",
          userId: "1a078b30-a6a9-4967-9cee-1b5c4cf6ef8e",
          userResponse: null,
          Role: {
            id: "a2ab0851-7d49-4e3b-bec4-30c0010f86e0",
            name: "Slides",
            organizationId: "79f18de6-ffeb-11ec-b939-0242ac120002"
          },
          User: {
            id: "1a078b30-a6a9-4967-9cee-1b5c4cf6ef8e",
            firstName: "Jack",
            lastName: "Drake",
            status: "USER",
            email: "jack.drake@att.net",
            emailVerified: null,
            phoneNumber: "",
            image: null,
            organizationId: "79f18de6-ffeb-11ec-b939-0242ac120002",
            hasLogin: true,
            userSettingsId: null
          }
        },
        {
          id: "cl7c7c9ml1061hqv8m4gzezag",
          eventId: "cl7c7c9ml1058hqv8mbwcp81i",
          roleId: "56db6d46-2578-4275-8023-8b9a62f896e1",
          userId: "cleos5a4b000d5ayc4dua1jn8",
          userResponse: null,
          Role: {
            id: "56db6d46-2578-4275-8023-8b9a62f896e1",
            name: "Video",
            organizationId: "79f18de6-ffeb-11ec-b939-0242ac120002"
          },
          User: {
            id: "cleos5a4b000d5ayc4dua1jn8",
            firstName: "Henry",
            lastName: "Baxter",
            status: "USER",
            email: "henry.h.baxter@gmail.com",
            emailVerified: null,
            phoneNumber: "",
            image: null,
            organizationId: "79f18de6-ffeb-11ec-b939-0242ac120002",
            hasLogin: false,
            userSettingsId: null
          }
        }
      ]
    }
  ]

const user = {
  id: "",
  firstName: "Timmy",
  lastName: "Test",
  status: "USER" as UserStatus,
  email: "test@test.com",
  emailVerified: null,
  phoneNumber: null,
  image: null,
  organizationId: null,
  hasLogin: false,
  userSettingsId: null
}

export function dayBeforeEmail() {
  const data: ReminderEmailData = { user: user, events: event }
  return <DayBeforeEmail data={data} />
}
