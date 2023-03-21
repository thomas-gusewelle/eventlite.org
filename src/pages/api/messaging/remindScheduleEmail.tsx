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

export default verifySignature(handler, {
  currentSigningKey: process.env.QSTASH_CURRENT_SIGNING_KEY,
  nextSigningKey: process.env.QSTASH_NEXT_SIGNING_KEY,
})


async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {



  let body: ReminderEmailData | null = null
  try {
    body = superjson.parse<ReminderEmailData>(req.body)
  } catch (err) {
    console.error(err)
    res.status(500).send(err)
    return
  }

  try {
    await sendMail({
      to: "tombome119@gmail.com",
      component: <DayBeforeEmail data={body} />,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ "status": "500", "error": err });
    return
  }

  res.status(200).send(null);
}
