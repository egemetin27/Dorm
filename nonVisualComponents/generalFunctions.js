import { Dimensions, Platform, PixelRatio } from "react-native";

export const getGender = (val) => {
	if (val == 0) return "Kadın";
	else if (val == 1) return "Erkek";
	else if (val == 2) return "Non-Binary";
	else return "Beyan Edilmemdi";
};

export const getChoice = (str, arr) => {
	if (str == "null" || str == "" || str == "undefined") return { key: 0, choice: "" };

	const idx = arr.findIndex((item) => {
		return item.choice == str;
	});
	return arr[idx];
};

const { width: SCREEN_WIDTH } = Dimensions.get("window");

// based on iphone 5s's scale
const scale = SCREEN_WIDTH / 320;

export function normalize(size) {
	const newSize = size * scale;
	if (Platform.OS === "ios") {
		return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 1;
	} else {
		return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
	}
}

export function getTimeDiff(refreshTime) {
	let currentTime = normalizeTime(Date.now());

	let endTime = new Date(refreshTime);

	if (endTime < currentTime) {
		return false;
	}

	let diffSec = endTime.getTime() - currentTime.getTime();

	let diff = new Date(diffSec).toISOString().slice(11, 16);

	return { hour: diff.split(":")[0], minute: diff.split(":")[1] };
}

export function normalizeTime(time) {
	let date = new Date(time);
	date.setHours(date.getHours() - date.getTimezoneOffset() / 60);
	return date;
}
