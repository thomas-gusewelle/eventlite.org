// Date modifiers

import { DateTime } from "luxon";

//TODO: implement luxon to add days and months
export function addDays(date: Date, days: number) {
  var result = DateTime.fromJSDate(date);
  const newDate = result.plus({days: days})
  return newDate;
}

export function addWeeks(date: Date, occurance: number) {
  var result = DateTime.fromJSDate(date);
  const newDate = result.plus({days: occurance * 7})
  return newDate;
}

export function addMonths(date: Date, occurance: number) {
  var result = DateTime.fromJSDate(date);
  const newDate = result.plus({months: occurance})
  return newDate;
}

export function yearsFromToday() {
  const now = new Date();
  now.setFullYear(now.getFullYear() + 2);
  return now;
}

export function monthsBetween(startDate: Date, endDate: Date) {
  const numberOfMonths =
    endDate.getMonth() -
    startDate.getMonth() +
    12 * (endDate.getFullYear() - startDate.getFullYear());

  if (endDate.getDate() < startDate.getDate()) {
    return numberOfMonths - 1;
  }
  return numberOfMonths;
}

// Time Modifiers

export function replaceTime(date: Date, time: Date) {
  let result = new Date(date);
  result.setHours(
    time.getHours(),
    time.getMinutes(),
    time.getSeconds(),
    time.getMilliseconds()
  );
  return result;
}

export function roundHourDown() {
  let currentTime = new Date();
  currentTime.setHours(currentTime.getHours(), 0, 0);
  return currentTime;
}

export function zeroTime(input: Date | undefined): Date | undefined {
  if (input == undefined) return undefined;
  input.setHours(0);
  input.setMinutes(0);
  input.setMilliseconds(0);
  return input;
}
