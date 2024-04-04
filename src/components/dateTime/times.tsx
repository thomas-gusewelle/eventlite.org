export function shortTime(
  time: Date,
  timeZone?: string,
  offset: number = new Date().getTimezoneOffset()
) {
  const tempTime = new Date(
    time.toLocaleString(undefined, { timeZone: timeZone })
  );
  tempTime.setMinutes(tempTime.getTimezoneOffset() - offset);
  return Intl.DateTimeFormat("en-US", {
    timeStyle: "short",
    timeZone: timeZone,
  }).format(tempTime);
}
