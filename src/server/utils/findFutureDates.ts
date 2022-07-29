import { EventFormValues } from "../../../types/eventFormValues";
import {
  addDays,
  addMonths,
  addWeeks,
  monthsBetween,
  replaceTime,
} from "./dateTimeModifers";

export function findFutureDates(input: EventFormValues) {
  if (input == undefined) return null;
  console.log("This is the number", input.DNum);

  switch (input.repeatFrequency?.id) {
    case "D":
      return DailyDates(
        replaceTime(input.eventDate, input.eventTime),
        input.DEndSelect,
        input.DNum,
        input.DDate
      );

    case "W":
      return weeklyDates(
        replaceTime(input.eventDate, input.eventTime),
        input.WEndSelect,
        input.WNum,
        input.WDate
      );
    case "WC":
      break;
    case "M":
      return monthlyDates(
        replaceTime(input.eventDate, input.eventTime),
        input.MEndSelect,
        input.MNum,
        input.MDate
      );
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
    for (let i = 1; i < endNum; i++) {
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

function weeklyDates(
  eventDate: Date,
  endSelect?: { id: "Num" | "Date"; name: string },
  endNum?: number,
  endDate?: Date
) {
  const timeInDay = 1000 * 60 * 60 * 24;

  if (endSelect?.id == "Num" && endNum != undefined && endNum > 0) {
    let recurringDates = [eventDate];
    for (let i = 1; i < endNum; i++) {
      let newDate = addWeeks(eventDate, i);
      recurringDates.push(newDate);
    }

    return recurringDates;
  }
  if (endSelect?.id == "Date") {
    let recurringDates = [eventDate];
    if (endDate == undefined) return null;

    endDate = replaceTime(endDate, eventDate);
    const numberOfDays = (endDate.getTime() - eventDate.getTime()) / timeInDay;
    const numberofWeeks = Math.floor(numberOfDays / 7);
    for (let i = 1; i <= numberofWeeks; i++) {
      let newDate = addWeeks(eventDate, i);
      recurringDates.push(newDate);
    }
    return recurringDates;
  }
}

function monthlyDates(
  eventDate: Date,
  endSelect?: { id: "Num" | "Date"; name: string },
  endNum?: number,
  endDate?: Date
) {
  if (endSelect?.id == "Num" && endNum != undefined && endNum > 0) {
    let recurringDates = [eventDate];
    for (let i = 1; i < endNum; i++) {
      let newDate = addMonths(eventDate, i);
      recurringDates.push(newDate);
    }
    return recurringDates;
  }
  if (endSelect?.id == "Date") {
    let recurringDates = [eventDate];
    if (endDate == undefined) return null;

    endDate = replaceTime(endDate, eventDate);
    const numberOfMonths = monthsBetween(eventDate, endDate);
    for (let i = 1; i <= numberOfMonths; i++) {
      let newDate = addMonths(eventDate, i);
      recurringDates.push(newDate);
    }
    return recurringDates;
  }
}
