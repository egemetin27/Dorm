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
		<View style={{ height: height, width: width }}>
			<LinearGradient
				colors={["rgba(0,0,0,0.005)", " rgba(0,0,0,0.1)", "rgba(0,0,0,0.5)"]}
				locations={[0, 0.1, 1]}
				start={{ x: 0.5, y: 0 }}
				end={{ x: 0.5, y: 1 }}
				style={{
					minHeight: height * 0.16,
					width: "100%",
					position: "absolute",
					bottom: 0,
					paddingVertical: 20,
				}}
			>
				<View
					style={{
						width: "100%",
						height: "100%",
						flexDirection: "row",
						alignItems: "center",
						justifyContent: "space-between",
						paddingHorizontal: 20,
					}}
				>
					<View style={{ flexShrink: 1 }}>
						<Text
							style={{
								color: colors.white,
								fontSize: width * 0.06,
								fontWeight: "bold",
								letterSpacing: 1.05,
							}}
						>
							{name} • {age}
							{/* Name • Age */}
						</Text>
						<Text
							style={{
								color: colors.white,
								fontSize: width * 0.045,
								fontSize: 18,
								fontStyle: "italic",
							}}
						>
							{university}
							{"\n"}
							{major}
						</Text>
					</View>

					<View
						style={{
							backgroundColor: colors.white,
							height: width * 0.16,
							aspectRatio: 1 / 1,
							borderRadius: width * 0.08,
						}}
					>
						<TouchableOpacity>
							<View
								style={{
									width: "100%",
									height: "100%",
									justifyContent: "center",
									alignItems: "center",
								}}
							>
								{likeFlag ? (
									<Image
										style={{
											width: "65%",
											height: "65%",
											resizeMode: "center",
										}}
										source={require("../assets/spark_filled.png")}
									/>
								) : (
									<Image
										style={{
											width: "65%",
											height: "65%",
											resizeMode: "center",
										}}
										source={require("../assets/spark_outline.png")}
									/>
								)}
							</View>
						</TouchableOpacity>
					</View>
				</View>
			</LinearGradient>
		</View>
	);
}
