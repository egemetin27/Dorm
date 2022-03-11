import React, { useEffect, useState } from "react";
import {
	StyleSheet,
	View,
	TouchableOpacity,
	FlatList,
	Dimensions,
	Pressable,
	Image,
	Text,
	Button,
	TextInput,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import commonStyles from "../visualComponents/styles";
import { Ionicons } from "@expo/vector-icons";
import { Gradient, GradientText, colors } from "../visualComponents/colors";
import { CustomModal } from "../visualComponents/customComponents";
import Animated, {
	useSharedValue,
	useAnimatedStyle,
	withSpring,
	withTiming,
	useDerivedValue,
	useAnimatedReaction,
	runOnJS,
	interpolate,
	interpolateColor,
} from "react-native-reanimated";
import { StatusBar } from "expo-status-bar";
import DateTimePicker from "@react-native-community/datetimepicker";

import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";
import { ReText } from "react-native-redash";

const { width, height } = Dimensions.get("window");

const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

export default function customSwitch({ style }) {
	const price = useSharedValue("ADSFEFA");
	const formattedPrice = useDerivedValue(() => `${price.value}`);

	return (
		<View style={[commonStyles.Container, { justifyContent: "center" }]}>
			<ReText text={formattedPrice} style={{ color: "black" }} />
		</View>
	);
}

const styles = StyleSheet.create({
	photoContainer: {
		marginTop: 20,
		width: "100%",
		height: width * 1.55,
	},
	photo: {
		marginVertical: height * 0.02,
		marginHorizontal: width * 0.025,
		width: width * 0.45,
		aspectRatio: 1 / 1.5,
		backgroundColor: colors.white,
		borderRadius: 20,
		alignItems: "center",
		justifyContent: "center",
		overflow: "hidden",
		elevation: 0,
		zIndex: 0,
	},
	modalContainer: {
		paddingHorizontal: 23,
		borderRadius: 20,
		backgroundColor: colors.white,
		width: width * 0.7,
		aspectRatio: 1 / 1,
		alignItems: "center",
		justifyContent: "center",
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 4,
		elevation: 5,
	},
	deleteButton: {
		width: "90%",
		height: width * 0.15,
		borderRadius: width * 0.03,
		marginTop: 25,
		overflow: "hidden",
	},
});
