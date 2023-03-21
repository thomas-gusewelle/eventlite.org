export function shortTime(time: Date, timeZone?: string) {
  return Intl.DateTimeFormat("en-US", { timeStyle: "short", timeZone: timeZone }).format(time);
}
