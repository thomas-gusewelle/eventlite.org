
import { User, Event, EventPositions, Locations, Role, UserSettings } from "@prisma/client"
import { Client } from "@upstash/qstash"
import { verifySignature } from "@upstash/qstash/nextjs"
import { NextApiRequest, NextApiResponse } from "next"
import superjson from "superjson"
import { prisma } from "../../../server/db/client"

type EventsWithPositions = (Event & {
  Locations: Locations | null;
  positions: (EventPositions & {
    Role: Role | null
    User: (User & {
      UserSettings: UserSettings | null
    }) | null
  })[];
})[] | undefined

export type ReminderEmailData = {
  user: User,
  events: EventsWithPositions
}


const qstashClient = new Client({
  token: process.env.QSTASH_TOKEN!
})

export default verifySignature(handler, {
  currentSigningKey: process.env.QSTASH_CURRENT_SIGNING_KEY,
  nextSigningKey: process.env.QSTASH_NEXT_SIGNING_KEY,
})

async function handler(req: NextApiRequest, res: NextApiResponse) {

  // This is kind of nasty but works for getting the times right
  // The issue is that events are saved with UTC time that has the timezone offset 
  // so they can end up in the wrong day if the event is late in the day
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const test = new Date()
  test.setHours(0, 0, 0, 0)
  let tomorrow = new Date()
  tomorrow.setDate(today.getDate() + 1)
  tomorrow.setHours(0, today.getTimezoneOffset(), 0, 0)
  let dayAfterTomorrow = new Date()
  dayAfterTomorrow.setDate(today.getDate() + 2)
  // Add sevon hours to capture late night events in US timezones
  dayAfterTomorrow.setHours(7, today.getTimezoneOffset(), 0, 0)
  const events: EventsWithPositions = await prisma?.event.findMany({
    where: {
      datetime: {
        gt: tomorrow,
        lt: dayAfterTomorrow
      }
    },
    include: {
      Locations: true,
      positions: {
        include: {
          Role: true,
          User: {
            include: {
              UserSettings: true
            }
          }
        }
      }
    }
  })

  const emails: ReminderEmailData[] = []

  events?.forEach(event => {
    event.positions.forEach(position => {
      // checks to ensure user.that they have a login, and want to recieve reminder emails
      if (position.User && position.User.hasLogin && position.User.UserSettings?.sendReminderEmail) {
        // checks to see if the user is already included in the emails array
        if (emails.map(item => item.user.id).includes(position.User.id)) {
          const index = emails.map(item => item.user.id).indexOf(position.User.id)
          //if exists adds event to user
          if (index >= 0) {
            emails[index]?.events?.push(event)
          }
          // if user is not in emails array then adds user and event
        } else {
          emails.push({ user: position.User, events: [event] })
        }
      }
    })
  })




  const sentEmails = await Promise.all(
    emails.map(email => {
      return qstashClient.publishJSON({
        url: `https://${req.headers.host}/api/messaging/remindScheduleEmail`,
        body: superjson.stringify(email),
      })
    })
  )

  res.status(201).send(sentEmails)
}
