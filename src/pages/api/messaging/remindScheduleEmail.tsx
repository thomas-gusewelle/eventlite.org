
import { EventPositions, User, Event } from "@prisma/client";
import { verifySignature, } from "@upstash/qstash/nextjs"
import { NextApiRequest, NextApiResponse } from "next";
import sendMail from "../../../emails";

export const config = {
  api: { bodyParser: false }
}

export default verifySignature(handler, {
  currentSigningKey: process.env.QSTASH_CURRENT_SIGNING_KEY,
  nextSigningKey: process.env.QSTASH_NEXT_SIGNING_KEY,
})



type EventsWithPositions = (Event & {
  positions: (EventPositions & {
    User: User | null
  })[];
})[] | undefined

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const body = req.body
  console.log(body)

  try {
    await sendMail({
      to: "tombome119@gmail.com",
      text: "Hello World",
      subject: "Hello"
    })
  } catch (err) {
    res.status(500).send(null)
  }
}