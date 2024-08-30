import { DateTime } from "luxon";

const localTZ = Intl.DateTimeFormat().resolvedOptions().timeZone;

export function shortTime(time: Date, timeZone: string) {
  const luxTime = DateTime.fromJSDate(time);
  if (timeZone != localTZ) {
    console.log("changing time zone");
    const withTimeZone = luxTime.setZone(localTZ);
    return withTimeZone.toFormat("h:mm a ZZZZ");
  }
  return luxTime.toFormat("h:mm a ZZZZ");
}

export function shortUTCTime(time: Date) {
  const luxTime = DateTime.fromJSDate(time);
  const luxTimecopy = luxTime.setZone("America/Chicago");
  return luxTimecopy.toFormat("h:mm a ZZZZ");
}
