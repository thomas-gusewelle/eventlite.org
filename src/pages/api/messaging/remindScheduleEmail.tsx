
import { EventPositions, User, Event, Locations } from "@prisma/client";
import { verifySignature, } from "@upstash/qstash/nextjs"
import { NextApiRequest, NextApiResponse } from "next";
import sendMail from "../../../emails";
import DayBeforeEmail from "../../../emails/schedule/dayBeforeEmail";

export const config = {
  api: { bodyParser: false }
}

// export default verifySignature(handler, {
//   currentSigningKey: process.env.QSTASH_CURRENT_SIGNING_KEY,
//   nextSigningKey: process.env.QSTASH_NEXT_SIGNING_KEY,
// })



export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const body = req.body
  console.log(body)

  try {
    await sendMail({
      to: "tombome119@gmail.com",
      component: <DayBeforeEmail data={
        req.body
      } />
    })

    console.log("here in the try")
  } catch (err) {
    console.log(err)
    res.status(500).send(null)
  }

  res.status(200).send("Hello World")

}