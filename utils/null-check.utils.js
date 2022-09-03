export const checkField = (value) => {
	// return true if null or empty
	if (value == "0") return false;
	return (
		!value || typeof value === "undefined" || (typeof value === "string" && value.length === 0)
	);
};
