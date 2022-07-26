export function addDays(date: Date, days: number) {
  var result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export function replaceTime(date: Date, time: Date) {
  let result = new Date(date);
  console.log("date: ", result);
  result.setHours(time.getHours(), time.getMinutes(), 0);
  return result;
}

export function addWeeks(date: Date, occurance: number) {
  var result = new Date(date);
  result.setDate(result.getDate() + occurance * 7);
  return result;
}
