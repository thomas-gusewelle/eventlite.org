
import { User, Event, EventPositions, Locations, Role } from "@prisma/client"
import { Client } from "@upstash/qstash"
import { NextApiRequest, NextApiResponse } from "next"
import superjson from "superjson"
import { prisma } from "../../../server/db/client"

type EventsWithPositions = (Event & {
  Locations: Locations | null;
  positions: (EventPositions & {
    Role: Role | null
    User: User | null
  })[];
})[] | undefined

export type ReminderEmailData = {
  user: User,
  events: EventsWithPositions
}


const qstashClient = new Client({
  token: process.env.QSTASH_TOKEN!
})

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // if (req.method !== "POST") {
  //   return res.status(404).end()
  // }
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  let tomorrow = new Date()
  tomorrow.setDate(today.getDate() + 1)
  tomorrow.setHours(0, 0, 0, 0)
  let dayAfterTomorrow = new Date()
  dayAfterTomorrow.setDate(today.getDate() + 2)
  dayAfterTomorrow.setHours(0, 0, 0, 0)
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
          User: true
        }
      }
    }
  })
  console.log({ today: today, tomorrow: tomorrow, dayAfter: dayAfterTomorrow })
  console.log(events)

  const emails: ReminderEmailData[] = []

  events?.forEach(event => {
    event.positions.forEach(position => {
      if (position.User) {
        if (emails.map(item => item.user.id).includes(position.User.id)) {
          const index = emails.map(item => item.user.id).indexOf(position.User.id)
          if (index >= 0) {
            emails[index]?.events?.push(event)
          }
        } else {
          emails.push({ user: position.User, events: [event] })
        }
      }
    })
  })




  // const sentEmails = await Promise.all(
  //   emails.map(async email => {
  //     return await qstashClient.publishJSON({
  //       url: `https://${req.headers.host}/api/messaging/remindScheduleEmail`,
  //       body: superjson.stringify(email),
  //     })
  //   })
  // )

  // res.status(201).json({
  //   today: today.toDateString(), tomorrow: tomorrow.toDateString(),
  //   dayAfter: dayAfterTomorrow.toDateString(),
  //   events: events?.map(item => ({ name: item.name, date: item.datetime.toDateString() })),
  //   emails: emails.map(item => ({ name: item.user.firstName, events: item.events?.map(ev => ev.name) }))
  // })
  res.status(201).send(emails)
}