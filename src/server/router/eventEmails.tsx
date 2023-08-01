import { z } from "zod";
import sendMail from "../../emails";
import UpcomingScheduleEmail from "../../emails/schedule/upcomingSchedule";
import { EventsWithPositions, ReminderEmailData } from "../../pages/api/messaging/schedule";
import { createTRPCRouter, adminProcedure } from "./context";

export const eventEmailsRouter = createTRPCRouter({
  upcomingSchedule: adminProcedure.input(z.object({
    startingDate: z.date(),
    endingDate: z.date(),
    includeNonRegisteredAccounts: z.boolean()
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
    const events: EventsWithPositions = await prisma?.event.findMany({
      where: {
        datetime: {
          gt: startingDate,
          lt: dayAfterEndingDate
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

    console.log("Number: ", events?.length)

    const emails: ReminderEmailData[] = []

    events?.forEach(event => {
      event.positions.forEach(position => {
        // checks to ensure user.that they have a login, and want to recieve reminder emails
        const isUserRegistered = position.User?.hasLogin;
        const shouldISend = isUserRegistered ? position.User?.UserSettings?.sendReminderEmail : input.includeNonRegisteredAccounts;

        if (position.User && shouldISend) {
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


    emails.forEach(async (email) => {
      await sendMail({
        to: email.user.email, component: <UpcomingScheduleEmail data={{
          user: email.user,
          events: email.events?.sort((a, b) => a.datetime.getTime() - b.datetime.getTime())
        }} startingDate={input.startingDate} endingDate={input.endingDate} />
      })
    })

  })
})
