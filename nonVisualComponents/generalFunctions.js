import { Dimensions, Platform, PixelRatio } from "react-native";

export const getGender = (val) => {
	if (val == 0) return "Kadın";
	else if (val == 1) return "Erkek";
	else if (val == 2) return "Non-Binary";
	else return "Beyan Edilmemdi";
};

export const getAge = (date) => {
	var birthday = new Date(date);
	return ~~((Date.now() - birthday) / 31557600000);
};

export const getChoice = (str, arr) => {
	if (str == "null" || str == "" || str == "undefined") return { key: 0, choice: "" };

	const idx = arr.findIndex((item) => {
		return item.choice == str;
	});
	return arr[idx];
};

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

// based on iphone 5s's scale
const scale = SCREEN_WIDTH / 320;

export function normalize(size) {
	const newSize = size * scale;
	if (Platform.OS === "ios") {
		return Math.round(PixelRatio.roundToNearestPixel(newSize));
	} else {
		return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
	}
}
