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

import commonStyles from "../visualComponents/styles";
import { colors, Gradient, GradientText } from "../visualComponents/colors";
import { AnimatedModal } from "../visualComponents/customComponents";
import { url } from "../connection";
import { useSharedValue } from "react-native-reanimated";

const { height, width } = Dimensions.get("window");

export default function Hobbies() {
	const modalVisible = useSharedValue(true);

	return (
		<View style={commonStyles.Container}>
			<StatusBar />
			<TouchableOpacity
				style={{ width: 200, height: 120, backgroundColor: "blue" }}
				onPress={() => {
					modalVisible.value = true;
				}}
			/>

			<AnimatedModal
				visible={modalVisible}
				dismiss={() => {
					modalVisible.value = false;
					console.log("AAA");
					console.log(modalVisible.value);
				}}
			>
				<View
					style={{
						width: width * 0.8,
						aspectRatio: 1,
						maxHeight: height * 0.5,
						backgroundColor: "white",
						borderRadius: 10,
						alignItems: "center",
						paddingVertical: 30,
						paddingHorizontal: 40,
					}}
				>
					<ReactNative.TouchableOpacity
						onPress={() => {
							modalVisible.value = false;
						}}
						style={{ position: "absolute", top: 15, right: 20 }}
					>
						<Text
							style={{
								color: colors.medium_gray,
								fontSize: 16,
								fontWeight: "600",
								letterSpacing: 0.5,
							}}
						>
							Kapat
						</Text>
					</ReactNative.TouchableOpacity>
					<Image
						source={require("../assets/superLikeFinished.png")}
						style={{ height: "24%" }}
						resizeMode={"contain"}
					/>
					<Text
						style={{
							textAlign: "center",
							marginTop: 20,
							color: colors.medium_gray,
							fontSize: 16,
						}}
					>
						Kıvılcım hakların bitti! Gün içinde tekrar yenilecek ama aranızdaki kıvılcımlar hiçbir
						yere kaçmıyor
					</Text>
					<Text
						style={{
							textAlign: "center",
							marginTop: 20,
							color: colors.cool_gray,
							fontSize: 16,
						}}
					>
						Kıvılcım hakkın için kalan süre:{"\n"}
						<Feather name="clock" size={16} color={colors.cool_gray} />
						{/* {hour} saat {minute} dakika {second} saniye */}
					</Text>
					<ReactNative.TouchableOpacity
						// onPress={handlePopupSubmit}
						style={[commonStyles.button, { width: "100%", overflow: "hidden", marginTop: 20 }]}
					>
						<Gradient style={{ justifyContent: "center", alignItems: "center" }}>
							<Text
								style={{
									color: colors.white,
									fontSize: 20,
									fontWeight: "bold",
									letterSpacing: 1,
								}}
							>
								Devam Et
							</Text>
						</Gradient>
					</ReactNative.TouchableOpacity>
				</View>
			</AnimatedModal>
		</View>
	);
}

const Item = ({ item, value, setValue }) => {
	const [activity, setActivity] = React.useState(false);

	const toggleActivity = () => {
		if (!activity && value.length < 5) {
			setActivity(true);
			setValue([...value, item.key]);
		} else if (activity) {
			setActivity(false);
			const tempArr = value;
			tempArr.splice(tempArr.indexOf(item.key), 1);
			setValue(tempArr);
		}
	};

	return (
		<Pressable
			onPress={() => {
				toggleActivity();
			}}
			style={{
				backgroundColor: colors.white,
				alignSelf: "flex-start",
				marginLeft: 20,
				minWidth: width / 4,
				height: width / 8,
				borderRadius: width / 16,
				overflow: "hidden",
			}}
		>
			{activity ? (
				<Gradient
					style={{
						paddingHorizontal: 10,
						justifyContent: "center",
						alignItems: "center",
					}}
				>
					<Text style={{ color: colors.white }}>{item.key}</Text>
				</Gradient>
			) : (
				<View
					style={{
						paddingHorizontal: 10,
						width: "100%",
						height: "100%",
						justifyContent: "center",
						alignItems: "center",
					}}
				>
					<Text style={{ color: colors.black }}>{item.key}</Text>
				</View>
			)}
		</Pressable>
	);
};