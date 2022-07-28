// Date modifiers

export function addDays(date: Date, days: number) {
  var result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export function addWeeks(date: Date, occurance: number) {
  var result = new Date(date);
  result.setDate(result.getDate() + occurance * 7);
  return result;
}

export function yearsFromToday() {
  const now = new Date();
  now.setFullYear(now.getFullYear() + 2);
  return now;
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
