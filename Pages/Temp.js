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

const { height, width } = Dimensions.get("screen");

export default function Hobbies() {
	const [txt, setTxt] = React.useState("YAZI");
	const arr = [
		{ key: 1, choice: "Akrep" },
		{ key: 2, choice: "Aslan" },
		{ key: 3, choice: "Balık" },
		{ key: 4, choice: "Başak" },
		{ key: 5, choice: "Boğa" },
		{ key: 6, choice: "İkizler" },
		{ key: 7, choice: "Koç" },
		{ key: 8, choice: "Kova" },
		{ key: 9, choice: "Oğlak" },
		{ key: 10, choice: "Terazi" },
		{ key: 11, choice: "Yay" },
		{ key: 12, choice: "Yengeç" },
	];

	const foo = (val, arr) => {
		const idx = arr.findIndex((item) => {
			return item.choice == val;
		});
		console.log(idx);
	};

	return (
		<View style={{ height: height, width: width, justifyContent: "center", alignItems: "center" }}>
			<TextInput
				style={{
					width: 200,
					height: 120,
					backgroundColor: "rgba(0,0,0,0.2)",
					fontSize: 40,
					textAlign: "center",
				}}
				value={txt}
				onChangeText={(text) => {
					setTxt(text);
				}}
				onEndEditing={() => {
					console.log("AAAAAa");
				}}
			/>
			<TouchableOpacity
				onPress={() => {
					foo(txt, arr);
				}}
				style={{ width: 200, height: 40, backgroundColor: "rgba(100,0,50,0.5)" }}
			/>
		</View>
	);
}
