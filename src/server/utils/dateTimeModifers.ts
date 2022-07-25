export function addDays(date: Date, days: number) {
  var result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export function replaceTime(date: Date, time: Date) {
  let result = new Date(date);
  result.setTime(time.getTime());
  return result;
}

export function addWeeks(date: Date, occurance: number) {
  var result = new Date(date);
  result.setDate(result.getDate() + occurance * 7);
  return result;
}
