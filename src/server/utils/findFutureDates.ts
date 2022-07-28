import { EventFormValues } from "../../../types/eventFormValues";
import { addDays, replaceTime } from "./dateTimeModifers";

export function findFutureDates(input: EventFormValues) {
  if (input == undefined) return null;
  console.log("This is the number", input.DNum);

  switch (input.repeatFrequency?.id) {
    case "D":
      return DailyDates(
        input.eventDate,
        input.DEndSelect,
        input.DNum,
        input.DDate
      );

    case "W":
      break;
    case "WC":
      break;
    case "M":
      break;
  }
}

function DailyDates(
  eventDate: Date,
  endSelect?: { id: "Num" | "Date"; name: string },
  endNum?: number,
  endDate?: Date
) {
  const timeInDay = 1000 * 60 * 60 * 24;

  if (endSelect?.id == "Num" && endNum != undefined && endNum > 0) {
    let recurringDates = [eventDate];
    for (let i = 1; i <= endNum; i++) {
      let newDate = addDays(eventDate, i);
      recurringDates.push(newDate);
    }

    return recurringDates;
  }
  if (endSelect?.id == "Date") {
    let recurringDates = [eventDate];
    if (endDate == undefined) return null;

    endDate = replaceTime(endDate, eventDate);
    const numberOfDays = (endDate.getTime() - eventDate.getTime()) / timeInDay;
    for (let i = 1; i <= numberOfDays; i++) {
      let newDate = addDays(eventDate, i);
      recurringDates.push(newDate);
    }
    return recurringDates;
  }
}
