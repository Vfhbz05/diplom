export const getTodayString = () => {
		const today = new Date();
		const offset = today.getTimezoneOffset();
		const localToday = new Date(today.getTime() - (offset * 60 * 1000));
		return localToday.toISOString().split("T")[0];
	};
