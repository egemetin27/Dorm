import { View, Image, Text, Dimensions, StyleSheet } from "react-native";

import { GradientText, colors } from "../../visualComponents/colors";

const { width, height } = Dimensions.get("screen");

const TabbarButton = ({ icon, label, focused }) => {
	return (
		<View style={styles.container}>
			<Image
				source={icon}
				style={{
					tintColor: focused ? {} : colors.cool_gray,
					maxHeight: "50%",
					maxWidth: "16%",
					resizeMode: "contain",
				}}
			/>
			{focused ? (
				<GradientText style={styles.gradient_label} text={label} />
			) : (
				<Text style={styles.label}>{label}</Text>
			)}
		</View>
	);
};

export default TabbarButton;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		width: width * 0.33,
		alignItems: "center",
		justifyContent: "flex-end",
	},
	gradient_label: {
		fontSize: height * 0.016,
		fontFamily: "PoppinsBold",
	},
	label: {
		fontSize: height * 0.016,
		fontFamily: "PoppinsBold",
		color: colors.cool_gray,
	},
});
