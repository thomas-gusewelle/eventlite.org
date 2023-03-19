import { EventPositions, Locations, Role, User } from "@prisma/client";
import { verifySignature } from "@upstash/qstash/nextjs";
import { NextApiRequest, NextApiResponse } from "next";
import superjson from "superjson";
import sendMail from "../../../emails";
import DayBeforeEmail from "../../../emails/schedule/dayBeforeEmail";
import { ReminderEmailData } from "./schedule";

export const config = {
  api: { bodyParser: false },
};

type Events = (Event & {
  Locations: Locations | null;
  positions: (EventPositions & {
    Role: Role | null
    User: User | null
  })[];
})[] | undefined
// export default verifySignature(handler, {
//   currentSigningKey: process.env.QSTASH_CURRENT_SIGNING_KEY,
//   nextSigningKey: process.env.QSTASH_NEXT_SIGNING_KEY,
// })
const testString = '{ "user": { "id": "clfbvo3h100075ajcb52fapz5", "firstName": "Test", "lastName": "test2", "status": "USER", "email": "test@eedc.com", "emailVerified": null, "phoneNumber": "1231234123", "image": null, "organizationId": "3144787e-a95a-4c1d-a14f-98c8622d3987", "hasLogin": false, "userSettingsId": null }, "events": [{ "id": "clfbvndga00035ajcryacqrik", "recurringId": null, "name": "Test", "organizationId": "3144787e-a95a-4c1d-a14f-98c8622d3987", "datetime": "2023-03-20T01:44:16.376Z", "locationsId": "3146d597-83ec-405f-b880-7e33f1260b0f", "unavailableUsers": null, "Locations": { "id": "3146d597-83ec-405f-b880-7e33f1260b0f", "name": "Sanctuary", "organizationId": "3144787e-a95a-4c1d-a14f-98c8622d3987" }, "positions": [{ "id": "clfbvndga00055ajcudoya0hf", "eventId": "clfbvndga00035ajcryacqrik", "roleId": "e0b6323c-b3a1-4077-8432-e126c9761f53", "userId": "clfbvo3h100075ajcb52fapz5", "userResponse": null, "Role": { "id": "e0b6323c-b3a1-4077-8432-e126c9761f53", "name": "Test", "organizationId": "3144787e-a95a-4c1d-a14f-98c8622d3987" }, "User": { "id": "clfbvo3h100075ajcb52fapz5", "firstName": "Test", "lastName": "test2", "status": "USER", "email": "test@eedc.com", "emailVerified": null, "phoneNumber": "1231234123", "image": null, "organizationId": "3144787e-a95a-4c1d-a14f-98c8622d3987", "hasLogin": false, "userSettingsId": null } }] }] }'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const test = JSON.parse(testString) as ReminderEmailData
  const back = JSON.stringify(test)
  const body = superjson.parse<{ user: User, events: Events }>(`{"json": ${test}}`)
  console.log(test)
  console.log(body);
  res.status(200).json(body)
  return

  try {
    await sendMail({
      to: "tombome119@gmail.com",
      component: <DayBeforeEmail data={body} />,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send(null);
    return
  }

  res.status(200).send("Hello World");
}
