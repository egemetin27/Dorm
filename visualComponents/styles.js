import { StyleSheet, Dimensions } from "react-native";
import { colors } from "./colors";

const { width, height } = Dimensions.get("screen");

export default styles = StyleSheet.create({
	Container: {
		height: "100%",
		// height: height,
		width: width,
		// backgroundColor: "red",
		backgroundColor: colors.backgroundNew,
		alignItems: "center",
		zIndex: 0,
	},
	innerContainer: {
		paddingHorizontal: width * 0.06,
		marginTop: 20,
		position: "relative",
	},
	Header: {
		position: "relative",
		width: "100%",
		height: 35,
		marginTop: 60,
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	inputContainer: {
		width: width * 0.8,
		aspectRatio: 6 / 1,
		borderRadius: 8,
		alignSelf: "center",
		justifyContent: "center",
	},
	ValidInput: {
		backgroundColor: colors.white,
	},
	InvalidInput: {
		backgroundColor: colors.soft_red,
		borderColor: "#FF4646",
		borderWidth: 1.5,
	},
	input: {
		width: width * 0.8,
		aspectRatio: 6 / 1,
		paddingLeft: 15,
		borderRadius: 8,
	},
	button: {
		backgroundColor: "#B6B6B6",
		width: Math.min(width * 0.8, 600),
		aspectRatio: 6 / 1,
		alignItems: "center",
		justifyContent: "center",
		borderRadius: 8,
		shadowColor: "rgba(58, 41, 106, 0.2)",
		shadowOffset: { width: 0, height: 10 },
		shadowRadius: 20,
		alignSelf: "center",
		elevation: 10,
	},
	buttonText: {
		position: "relative",
		color: "#FFFFFF",
		fontStyle: "normal",
		fontFamily: "PoppinsSemiBold",
		fontSize: height * 0.02,
		textAlign: "center",
		letterSpacing: 1.2,
	},
	photo: {
		aspectRatio: 2 / 3,
		backgroundColor: colors.white,
		borderRadius: 20,
		alignItems: "center",
		justifyContent: "center",
		alignSelf: "center",
		overflow: "hidden",
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 3,
	},
});
