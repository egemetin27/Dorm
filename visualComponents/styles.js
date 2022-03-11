import { StyleSheet, Dimensions } from "react-native";
import { colors } from "./colors";

const { width, height } = Dimensions.get("window");

export default styles = StyleSheet.create({
	Container: {
		height: "100%",
		width: "100%",
		backgroundColor: "#F4F3F3",
		alignItems: "center",
		zIndex: 0,
	},
	innerContainer: {
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
		position: "relative",
		width: 327,
		height: 56,
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
		width: 327,
		height: 56,
		left: 15,
		borderRadius: 8,
	},
	button: {
		backgroundColor: "#B6B6B6",
		position: "relative",
		// width: 327,
		// height: 56,
		width: "80%",
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
		fontWeight: "600",
		fontSize: 16,
		textAlign: "center",
		letterSpacing: 1.2,
	},
	photo: {
		marginHorizontal: 15,
		aspectRatio: 1 / 1.5,
		backgroundColor: colors.white,
		borderRadius: 20,
		alignItems: "center",
		justifyContent: "center",
		alignSelf: "center",
		overflow: "hidden",
		shadowColor: "rgba(58, 41, 106, 0.2)",
		shadowOffset: { width: 0, height: 10 },
		shadowRadius: 20,
		alignSelf: "center",
		elevation: 5,
	},
});
