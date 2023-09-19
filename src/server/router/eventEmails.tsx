import { z } from "zod";
import sendMail from "../../emails";
import UpcomingScheduleEmail from "../../emails/schedule/upcomingSchedule";
import { createTRPCRouter, adminProcedure } from "./context";

export const eventEmailsRouter = createTRPCRouter({
  upcomingSchedule: adminProcedure.input(z.object({
    startingDate: z.date(),
    endingDate: z.date(),
    includedUsers: z.object({
      id: z.string(),
      email: z.string().email(),
      firstName: z.string()
    }).array()
  })).mutation(async ({ ctx, input }) => {

    // This is kind of nasty but works for getting the times right
    // The issue is that events are saved with UTC time that has the timezone offset 
    // so they can end up in the wrong day if the event is late in the day
    const startingDate = input.startingDate;
    startingDate.setHours(0, 0, 0, 0)
    let endingDate = input.endingDate;
    endingDate.setHours(0, startingDate.getTimezoneOffset(), 0, 0)
    let dayAfterEndingDate = new Date(endingDate)
    dayAfterEndingDate.setDate(startingDate.getDate() + 2)
    // Add sevon hours to capture late night events in US timezones
    dayAfterEndingDate.setHours(7, startingDate.getTimezoneOffset(), 0, 0)

    const events = await Promise.all(input.includedUsers.map(async (user) => {
      const eventQuery = await prisma?.event.findMany({
        where: {
          positions: {
            some: {
              userId: user.id
            }
          },
          datetime: {
            gt: startingDate,
            lt: dayAfterEndingDate
          }
        },
        include: {
          Locations: true
        }
      })
      return { user: user, events: eventQuery }
    }))
    return Promise.all(events.map(async (event) => {
      sendMail({
        to: event.user.email, component: <UpcomingScheduleEmail data={{
          user: event.user,
          events: event.events?.sort((a, b) => a.datetime.getTime() - b.datetime.getTime())
        }} startingDate={input.startingDate} endingDate={input.endingDate} />
      })
    }))
  })
})
