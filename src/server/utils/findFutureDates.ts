import { EventFormValues } from "../../../types/eventFormValues";
import { addDays } from "./dateTimeModifers";

export function findFutureDates(input: EventFormValues) {
  if (input == undefined) return null;

  switch (input.repeatFrequency?.id) {
    case "D":
      return DailyDates(
        input.eventDate,
        input.DEndSelect,
        input.DNum,
        input.DDate
      );
      break;
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
  endSelect?: { id: string; name: string },
  endNum?: number,
  endDate?: Date
) {
  if (endSelect?.id == "Num" && endNum != undefined && endNum > 0) {
    let recurringDates = [eventDate];
    for (let i = 1; i <= endNum; i++) {
      let newDate = addDays(eventDate, i);
      recurringDates.push(newDate);
    }
    console.log(recurringDates);
    return recurringDates;
  }
  if (endSelect?.id == "Date") {
    let recurringDates = [eventDate];
    if (endDate == undefined) return null;
    const numberOfDays = endDate?.getDate() - eventDate.getDate();
    for (let i = 1; i <= numberOfDays; i++) {
      let newDate = addDays(eventDate, i);
      recurringDates.push(newDate);
    }
    return recurringDates;
  }
}
