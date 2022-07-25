import { addDays } from "./dateTimeModifers";

export function FindFutureDates(
  eventDate: Date,
  repeatFrequency: { id: string; name: string },
  endSelect: { id: string; name: string },
  endNum?: number,
  endDate?: Date
) {
  switch (repeatFrequency.id) {
    case "D":
      return DailyDates(eventDate, endSelect, endNum, endDate);
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
  endSelect: { id: string; name: string },
  endNum?: number,
  endDate?: Date
) {
  if (endSelect.id == "Num" && endNum != undefined && endNum > 0) {
    let recurringDates = [eventDate];
    for (let i = 1; i <= endNum; i++) {
      let newDate = addDays(eventDate, i);
      recurringDates.push(newDate);
    }
    console.log(recurringDates);
    return recurringDates;
  }
  if (endSelect.id == "Date") {
  }
}
