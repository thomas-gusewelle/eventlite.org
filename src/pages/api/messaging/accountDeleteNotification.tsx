
import { verifySignature } from "@upstash/qstash/nextjs";
import { NextApiRequest, NextApiResponse } from "next";
import { json } from "stream/consumers";
import superjson from "superjson";
import sendMail from "../../../emails";
import AccountDeleteNotification from "../../../emails/accounts/accountDeleteNotification";
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


  let body: { names: string[], orgId: string } | null = null
  try {
    body = JSON.parse(req.body)
  } catch (err) {
    console.error(err)
    res.status(500).send(err)
    return
  }
  //ensures the body is not null
  if (body == null) {
    res.status(500)
  }

  // gets admin emails for org
  const emails = await prisma?.user.findMany({
    where: {
      status: "ADMIN",
      organizationId: body?.orgId
    },
    select: {
      email: true
    }
  })

  try {
    await sendMail({
      to: emails?.map(user => user.email),
      // needed ! becasue ts thought it was still null even with the check
      component: <AccountDeleteNotification names={body!.names} />
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ "status": "500", "error": err });
    return
  }

  res.status(200).send(null);
}
