export const fullName = (firstName: string | null, lastName: string | null) => {
  if (firstName == null || lastName == null) {
    return "";
  }
  return firstName + " " + lastName;
};
