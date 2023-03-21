// Formats date in MM/D/Y format
export function shortDate(date: Date, timeZone?: string) {
  return Intl.DateTimeFormat("en-US", {
    month: "2-digit",
    day: "numeric",
    year: "numeric",
    timeZone: timeZone
  }).format(date);
}

// Formats date in Sunday, November 6, 2022 format
export function longDate(date: Date, timeZone?: string) {
  return Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: timeZone
  }).format(date);
}
