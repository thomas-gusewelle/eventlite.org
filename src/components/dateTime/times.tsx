import { DateTime } from "luxon";

const localTZ = Intl.DateTimeFormat().resolvedOptions().timeZone;

export function shortTime(
  time: Date,
  timeZone: string,
) {
  const luxTime = DateTime.fromJSDate(time);
  if (timeZone != localTZ) {
    console.log("changing time zone")
    const withTimeZone = luxTime.setZone(localTZ);
    return withTimeZone.toFormat("h:mm a ZZZZ");
  }
  return luxTime.toFormat("h:mm a ZZZZ");
}

export function shortUTCTime(time: Date, offset: number) {
  // const tempTime = new Date(time);
  // tempTime.setMinutes(-offset);
  // return Intl.DateTimeFormat("en-US", { timeStyle: "short" }).format(tempTime);
  const luxTime = DateTime.fromJSDate(time)
  const luxTimecopy = luxTime.setZone("America/Chicago");
  return luxTimecopy.toFormat("h:mm a ZZZZ");
}
