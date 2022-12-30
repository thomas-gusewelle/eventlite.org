export function shortTime(time: Date) {
  return Intl.DateTimeFormat("en-US", { timeStyle: "short" }).format(time);
}
