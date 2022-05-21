import React from "react";
import { View, Image, TouchableWithoutFeedback, Dimensions } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StatusBar } from "expo-status-bar";

import commonStyles from "../visualComponents/styles";

const { height, width } = Dimensions.get("screen");

export default function Tutorial({ navigation }) {
	const imageList = [
		require("../assets/Tutorial/1.jpg"),
		require("../assets/Tutorial/2.jpg"),
		require("../assets/Tutorial/3.jpg"),
		require("../assets/Tutorial/4.jpg"),
		require("../assets/Tutorial/5.jpg"),
		require("../assets/Tutorial/6.jpg"),
		require("../assets/Tutorial/7.jpg"),
		require("../assets/Tutorial/8.jpg"),
		require("../assets/Tutorial/9.jpg"),
	];
	const [index, setIndex] = React.useState(0);

	const handleEnd = async () => {
		await AsyncStorage.getItem("Constants").then(async (res) => {
			const list = JSON.parse(res);
			const toSave = { ...list, tutorialShown: true };
			await AsyncStorage.setItem("Constants", JSON.stringify(toSave));
		});
		// await AsyncStorage.setItem("tutorialShown", "yes");
		navigation.replace("MainScreen");
	};

	return (
		<View style={commonStyles.Container}>
			<StatusBar style="dark" />
			<TouchableWithoutFeedback
				onPress={() => {
					index < 8 ? setIndex(index + 1) : handleEnd();
				}}
			>
				<Image
					source={imageList[index]}
					style={{ height: height, width: width }}
					resizeMode={"stretch"}
				/>
			</TouchableWithoutFeedback>
		</View>
	);
}
