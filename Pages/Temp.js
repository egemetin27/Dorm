import React from "react";
import ReactNative, {
	Text,
	View,
	Dimensions,
	Pressable,
	ScrollView,
	FlatList,
	TouchableOpacity,
	Image,
	TextInput,
} from "react-native";
import axios from "axios";
import { StatusBar } from "expo-status-bar";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

import commonStyles from "../visualComponents/styles";
import { colors, Gradient, GradientText } from "../visualComponents/colors";
import { AnimatedModal } from "../visualComponents/customComponents";
import { url } from "../connection";
import { useSharedValue } from "react-native-reanimated";
import { loadAsync } from "expo-font";

const { height, width } = Dimensions.get("screen");

export default function Temp() {
	const [str, setStr] = React.useState("");

	const foo = () => {
		const fullName = str.trim();

		if (fullName.lastIndexOf(" ") == -1) {
			console.log("ERROR");
			return;
		}

		const lName = fullName.slice(fullName.lastIndexOf(" ") + 1);
		const fName = fullName.slice(0, fullName.lastIndexOf(" "));

		console.log(`fname: ${fName}\nlname: ${lName}`);
	};

	return (
		<View style={{ height: height, width: width, justifyContent: "center", alignItems: "center" }}>
			<TextInput
				value={str}
				onChangeText={setStr}
				style={{ width: 300, height: 100, fontSize: 20, backgroundColor: "gray" }}
			/>
			<Pressable
				style={{ width: 300, height: 100, backgroundColor: "black" }}
				onPress={() => {
					foo();
				}}
			/>
		</View>
	);
}
