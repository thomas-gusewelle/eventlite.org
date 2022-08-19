export const fullName = (
	firstName: string | null | undefined,
	lastName: string | null | undefined
) => {
	if (
		firstName == null ||
		firstName == undefined ||
		lastName == null ||
		lastName == undefined
	) {
		return null;
	}
	return firstName + " " + lastName;
};
