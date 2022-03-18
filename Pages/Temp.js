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
	const name = "Can Can Can AAAAAAAAAAA BBBBBBBBBBBBBBBBBB CCCCCCCCCCCCCCCCCCCCCC";
	const age = 22;
	const university = "Sabanci University";
	const major = "Computer Science";

	const likeFlag = false;

	return (
		<View style={{ height: height, width: width, justifyContent: "center", alignItems: "center" }}>
			<Image
				source={require("../assets/dorm_text.png")}
				resizeMode="contain"
				style={{
					// tintColor: colors.cool_gray,
					// backgroundColor: "red",
					height: "10%",
				}}
			/>
		</View>
	);
}
