import React from "react";
import {
	View,
	Text,
	Image,
	Dimensions,
	Pressable,
	StyleSheet,
	TouchableOpacity,
} from "react-native";
import { Feather } from "@expo/vector-icons";

import CustomButton from "./button.components";

import { colors } from "../visualComponents/colors";

const { width, height } = Dimensions.get("window");

const IMAGE_LIST = {
	sad_face: require("../assets/sadFace.png"),
	question_face: require("../assets/questionFace.png"),
	wave_hand: require("../assets/waveHand.png"),
	trash_can: require("../assets/biggerTrashCan.png"),
	dorm_text: require("../assets/dorm_text.png"),
	dorm_logo: require("../assets/logoGradient.png"),
	monkey: require("../assets/monkey.png"),
	remove_match: require("../assets/remove_match.png"),
};

// const dismiss = () => {
// 	console.log("dismissing");
// };

// const buttons = [
// 	{
// 		buttonType: "gradient",
// 		text: "Deniyorum",
// 		onPress: () => {
// 			console.log("Deniyorum");
// 		},
// 	},
// ];

export default function ModalPage({ navigation, route }) {
	// const { title, body } = route.params;
	const { title, body, buttons } = { title: null, body: null, buttons: [], ...route.params };
	const image = route.params?.image ? IMAGE_LIST[route.params.image] : null;

	const handleDismiss = () => {
		try {
			// dismiss();
			route.params.dismiss ? route.params?.dismiss() : navigation.goBack();
		} catch (err) {
			console.log("error on ModalPage > handleDismiss():", err);
		}
	};

	return (
		<Pressable onPress={handleDismiss} style={styles.wrapper}>
			<Pressable onPress={null}>
				<View style={styles.modal_container}>
					<Pressable style={styles.modal_exit_button} onPress={handleDismiss}>
						<Feather
							style={{ color: "#9D9D9D" }}
							name="x"
							size={Math.min(32, width * 0.06)}
							color="black"
						/>
					</Pressable>
					{image && (
						<Image
							source={image}
							style={{ height: "25%", maxWidth: "50%", marginBottom: 10 }}
							resizeMode={"contain"}
						/>
					)}
					{title && <Text style={styles.title}>{title}</Text>}
					{body && <Text style={styles.body}>{body}</Text>}
					{buttons.map(({ buttonType, text, onPress }, index) => {
						return (
							<CustomButton key={index} buttonType={buttonType} text={text} onPress={onPress} />
						);
					})}
				</View>
			</Pressable>
		</Pressable>
	);
}

const styles = StyleSheet.create({
	wrapper: {
		width: "100%",
		flex: 1,
		backgroundColor: "rgba(0,0,0, 0.6)",
		justifyContent: "center",
		alignItems: "center",
	},

	modal_container: {
		width: Math.min(width * 0.9, 360),
		backgroundColor: "#F4F3F3",
		alignItems: "center",
		justifyContent: "space-evenly",
		paddingVertical: Math.min(height * 0.05, 30),
		paddingHorizontal: Math.min(width * 0.05, 20),
		borderRadius: 16,
	},

	modal_exit_button: {
		position: "absolute",
		top: "5%",
		right: "5%",
	},
	title: {
		fontSize: Math.min(24, width * 0.06),
		fontFamily: "PoppinsExtraBold",
		color: "#666666",
	},

	body: {
		textAlign: "center",
		color: colors.medium_gray,
		fontSize: Math.min(16, width * 0.04),
	},
});
