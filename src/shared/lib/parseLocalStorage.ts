export const parseLocalStorage = (fieldName: string) => {
	if (!fieldName) return null;
	try {
		const value = localStorage.getItem("user");
		const parsedValue = value ? JSON.parse(value) : null;
		return parsedValue;
	} catch (e) {
		console.log(e);
		return null;
	}
};
