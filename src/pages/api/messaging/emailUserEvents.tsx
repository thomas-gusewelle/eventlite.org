import { Event, Locations } from "@prisma/client";
import { verifySignature } from "@upstash/qstash/dist/nextjs";
import { NextApiRequest, NextApiResponse } from "next";
import superjson from "superjson";
import sendMail from "../../../emails";
import UpcomingScheduleEmail from "../../../emails/schedule/upcomingSchedule";
import { prisma } from "../../../server/db/client";

export const config = {
  api: { bodyParser: false },
};

export default verifySignature(handler, {
  currentSigningKey: process.env.QSTASH_CURRENT_SIGNING_KEY,
  nextSigningKey: process.env.QSTASH_NEXT_SIGNING_KEY,
});

async function handler(req: NextApiRequest, res: NextApiResponse) {
  type reqData = {
    userId: string;
    email: string;
    firstName: string;
    orgId: string;
    startingDate: Date;
    endingDate: Date;
  };

  type Tevents =
    | (Event & {
      Locations: Locations | null;
    })[]
    | undefined;

  type emailData = {
    data: {
      user: { id: string; email: string; firstName: string };
      events: Tevents;
    };
    startingDate: Date;
    endingDate: Date;
  };

  let body: reqData | null = null;
  try {
    body = superjson.parse<reqData>(req.body);
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
    return;
  }

  const startingDate = body.startingDate;
  startingDate.setHours(0, 0, 0, 0);
  let endingDate = body.endingDate;
  endingDate.setHours(0, startingDate.getTimezoneOffset(), 0, 0);
  let dayAfterEndingDate = new Date(endingDate);
  dayAfterEndingDate.setDate(startingDate.getDate() + 2);
  // Add sevon hours to capture late night events in US timezones
  dayAfterEndingDate.setHours(7, startingDate.getTimezoneOffset(), 0, 0);

  const eventQuery = await prisma?.event.findMany({
    where: {
      positions: {
        some: {
          userId: body.userId,
        },
      },
      datetime: {
        gt: startingDate,
        lt: dayAfterEndingDate,
      },
    },
    include: {
      Locations: true,
    },
    orderBy: [
      {
        datetime: 'asc'
      }
    ]
  });

  if (eventQuery === undefined) {
    res.status(200).send("No events found");
  }

  try {
    await sendMail({
      to: body.email,
      component: (
        <UpcomingScheduleEmail
          data={{
            user: {
              firstName: body.firstName,
            },
            events: eventQuery,
          }}
          startingDate={body.startingDate}
          endingDate={body.endingDate}
        />
      ),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "500", error: err });
    return;
  }

  res.status(200).send(null);
}
