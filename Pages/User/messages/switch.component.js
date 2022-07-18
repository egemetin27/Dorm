import { useState } from "react";
import { View, Text, StyleSheet, Dimensions, Pressable } from "react-native";

const { width, height } = Dimensions.get("screen");

import { Gradient, GradientText } from "../../../visualComponents/colors";

const Switch = ({ choiceList, choice, setChoice }) => {
	const handlePress = (index) => {
		setChoice(index);
	};

	return (
		<View style={styles.container}>
			{choiceList.map((choiceInstance, index) => {
				return (
					<Pressable
						key={index}
						onPress={() => {
							handlePress(index);
						}}
						style={styles.choice}
					>
						{index == choice ? (
							<View style={{ alignItems: "center", width: "100%" }}>
								<GradientText style={styles.choice_text} text={choiceInstance} />
								<Gradient
									style={{
										// paddingBottom: Math.min(24, Math.min(height * 0.025, width * 0.05)) * 0.12,
										height: Math.min(24, Math.min(height * 0.025, width * 0.05)) * 0.16,
										width: "100%",
									}}
								/>
							</View>
						) : (
							// {/* </Gradient> */}
							<View style={{ flex: 1 }}>
								<Text style={styles.choice_text}>{choiceInstance}</Text>
							</View>
						)}
					</Pressable>
				);
			})}
		</View>
	);
};

export default Switch;

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		justifyContent: "space-evenly",
		marginTop: height * 0.02,
	},
	choice: {
		flex: 1,
		alignItems: "center",
	},
	choice_text: {
		fontFamily: "PoppinsSemiBold",
		fontSize: Math.min(24, Math.min(height * 0.025, width * 0.05)),
		color: "#B6B6B6",
		paddingBottom: 4,
	},
});
