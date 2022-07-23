export const sort = (array, objectKey, smallToBig = true) => {
	// sorts an array of objects with respect to the given key
	const newArray = [...array];
	newArray.sort((a, b) => (a[objectKey] < b[objectKey] ? -1 : a[objectKey] > b[objectKey] ? 1 : 0));
	if (smallToBig) {
		return newArray;
	}
	return newArray.reverse();
};
