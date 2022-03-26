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
	return (
		<View style={{ height: height, width: width, justifyContent: "center", alignItems: "center" }}>
			<Text style={{ fontFamily: "Now", fontSize: 20 }}>Hi we are testing new fonts in here</Text>
		</View>
	);
}
