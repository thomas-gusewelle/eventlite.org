export const findWeekday = (date: Date) => {
	return Intl.DateTimeFormat("en-US", { weekday: "long" }).format(date);
};
