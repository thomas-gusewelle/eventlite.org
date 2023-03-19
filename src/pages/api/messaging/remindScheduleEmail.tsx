
import { verifySignature, } from "@upstash/qstash/nextjs"
import { NextApiRequest, NextApiResponse } from "next";
import superjson from "superjson"
import sendMail from "../../../emails";
import DayBeforeEmail from "../../../emails/schedule/dayBeforeEmail";
import { ReminderEmailData } from "./schedule";

export const config = {
  api: { bodyParser: false }
}

export default verifySignature(handler, {
  currentSigningKey: process.env.QSTASH_CURRENT_SIGNING_KEY,
  nextSigningKey: process.env.QSTASH_NEXT_SIGNING_KEY,
})



async function handler(req: NextApiRequest, res: NextApiResponse) {
  const body = superjson.parse<ReminderEmailData>(req.body)

  try {
    await sendMail({
      to: "tombome119@gmail.com",
      component: <DayBeforeEmail data={
        body
      } />
    })

  } catch (err) {
    console.error(err)
    res.status(500).send(null)
  }

  res.status(200).send("Hello World")

}