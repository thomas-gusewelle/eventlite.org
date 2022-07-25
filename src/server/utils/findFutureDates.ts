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
    let recurringDates = [];
    for (let i = 1; i <= endNum; i++) {
      eventDate.addDays();
    }
  }
  if (endSelect.id == "Date") {
  }
}
