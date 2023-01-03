export function formatPhoneNumber(e: string): string {
  if (e.length == 3) {
    return e + "-";
  } else if (e.length >= 7) {
    e = e.replace(/-/g, "");
    let areaCode = e.slice(0, 3);
    let nextThree = e.slice(3, 6);
    let rest = e.slice(6);
    return areaCode + "-" + nextThree + "-" + rest;
  }
  return e;
}

export function removeDashes(num: string): string {
  return num.replace(/-/g, "");
}
