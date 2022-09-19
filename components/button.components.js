import { View, Text, StyleSheet, Dimensions, Pressable } from "react-native";

import { Gradient, GradientText } from "../visualComponents/colors";

const { width, height } = Dimensions.get("window");

const BUTTON_TYPES = {
	gradient: "gradient",
	inverted: "inverted",
	transparent: "transparent",
	white: "white",
	white_selected: "white_selected",
};

const CustomButton = ({
	text = "",
	buttonType = "gradient",
	onPress = () => {},
	positioning = { marginTop: 10, marginBottom: 0 },
	style = {},
	...props
}) => {
	const type = BUTTON_TYPES[buttonType];

	const pressHandler = () => {
		onPress();
	};

	if (type == BUTTON_TYPES.gradient || type == BUTTON_TYPES.white_selected) {
		return (
			<View style={[styles.container, positioning]}>
				<Gradient style={[styles.base, { borderRadius: 8 }, style]}>
					<Pressable
						{...props}
						style={[styles.base, styles[`${type}`], style]}
						onPress={pressHandler}
					>
						{type == BUTTON_TYPES.gradient ? (
							<Text style={[styles.base_text, styles[`${type}_text`], style]}>{text}</Text>
						) : (
							<GradientText style={[{ fontFamily: "PoppinsSemiBold" }, style]} text={text} />
						)}
					</Pressable>
				</Gradient>
			</View>
		);
	}

	return (
		<View style={positioning}>
			<Pressable {...props} style={[styles.base, styles[`${type}`], style]} onPress={pressHandler}>
				{type == BUTTON_TYPES.inverted ? (
					<GradientText style={[{ fontFamily: "PoppinsSemiBold" }, style]} text={text} />
				) : (
					<Text style={[styles.base_text, styles[`${type}_text`], style]}>{text}</Text>
				)}
			</Pressable>
		</View>
	);
};

export default CustomButton;

const styles = StyleSheet.create({
	container: {
		shadowColor: "rgba(0, 0, 0, 0.3)",
		shadowOffset: {
			width: 0,
			height: 5,
		},
		shadowOpacity: 0.34,
		shadowRadius: 6.27,

		elevation: 10,
	},
	base: {
		width: "80%",
		aspectRatio: 4.5 / 1,
		alignSelf: "center",
		backgroundColor: "#F4F3F3",
		alignItems: "center",
		justifyContent: "center",
		borderRadius: 8,
	},
	base_text: {
		fontSize: Math.min(24, Math.max(width * 0.03, height * 0.03)),
		fontFamily: "PoppinsSemiBold",
		color: "black",
	},

	gradient: {
		shadowColor: "transparent",
		backgroundColor: "transparent",
	},
	gradient_text: {
		color: "white",
	},

	inverted: {
		// shadowColor: "transparent",
	},
	inverted_text: {},

	transparent: {
		backgroundColor: "transparent",
		shadowColor: "transparent",
		borderWidth: 1.25,
		borderColor: "#828282",
	},
	transparent_text: {
		color: "#828282",
	},

	white: {
		backgroundColor: "white",
		shadowColor: "rgba(0, 0, 0, 0.24)",
	},
	white_text: {
		color: "#B6B6B6",
	},

	white_selected: {
		width: "100%",
		borderWidth: 2,
		borderColor: "transparent",
	},
	white_selected_text: {},
});
