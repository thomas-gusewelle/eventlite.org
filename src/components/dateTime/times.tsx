export function shortTime(
  time: Date,
  timeZone?: string,
  offset: number = new Date().getTimezoneOffset()
) {
  const tempTime = new Date(time);
  tempTime.setMinutes(tempTime.getTimezoneOffset() - offset);
  return Intl.DateTimeFormat("en-US", {
    timeStyle: "short",
    timeZone: timeZone,
  }).format(tempTime);
}

export function shortUTCTime(time: Date, offset: number) {
  const tempTime = new Date(time);
  tempTime.setMinutes(-offset);
  return Intl.DateTimeFormat("en-US", { timeStyle: "short" }).format(tempTime);
}
