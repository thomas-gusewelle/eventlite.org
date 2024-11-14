// Formats date in MM/D/Y format
export function shortDate(date: Date, timeZone?: string) {
  return Intl.DateTimeFormat("en-US", {
    month: "2-digit",
    day: "numeric",
    year: "numeric",
    timeZone: timeZone,
  }).format(date);
}

export function shortUTCDate(date: Date, offset: number) {
  const tempTime = new Date(date);
  tempTime.setMinutes(-offset);
  return Intl.DateTimeFormat("en-US", {
    month: "2-digit",
    day: "numeric",
    year: "numeric",
  }).format(tempTime);
}
// Formats date in Sunday, November 6, 2022 format
export function longDate(date: Date, timeZone?: string) {
  return Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: timeZone,
  }).format(date);
}

export function oneMonthInFuture(): Date {
  const date = new Date();
  date.setMonth(date.getMonth() + 1);
  return date;
}
