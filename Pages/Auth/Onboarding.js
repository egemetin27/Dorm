import { StatusBar } from "expo-status-bar";
import React from "react";
import {
	StyleSheet,
	Text,
	View,
	TouchableOpacity,
	Image,
	Dimensions,
	SafeAreaView,
} from "react-native";

import Animated, {
	useAnimatedStyle,
	interpolate,
	useSharedValue,
	withTiming,
} from "react-native-reanimated";

import MaskedView from "@react-native-masked-view/masked-view";
import AsyncStorage from "@react-native-async-storage/async-storage";
import commonStyles from "../../visualComponents/styles";
import { colors, Gradient } from "../../visualComponents/colors";

const { width, height } = Dimensions.get("window");

export default function Onboarding({ navigation }) {
	const progress = useSharedValue(0);
	const headerArr = [
		"Senin için\ntasarlandı",
		"Kimi\ngetiriyorsun?",
		"Aradığını bulmak\nartık kolay",
	];
	const contentArr = [
		"Kişinin kart alanına çift dokunarak kartın arka yüzünü görebilir ve onu daha yakından tanıyabilirsin!",
		"Şehrin en iyi etkinlikleri üzerinden yeni insanlarla tanışma şansı seni bekliyor.",
		"İnsanları istediğin gibi filtrele, ortak zevklerin olan insanlarla eşleş.",
	];

	const [counter, counterChanger] = React.useState(0);

	const navigate = async () => {
		try {
			await AsyncStorage.getItem("Constants").then(async (res) => {
				const list = JSON.parse(res);
				const toSave = { ...list, introShown: true };
				await AsyncStorage.setItem("Constants", JSON.stringify(toSave));
			});

			// await AsyncStorage.setItem("introShown", "yes");
		} catch (error) { console.log(error); }
		navigation.replace("WelcomePage");
	};

	return (
		<View style={commonStyles.Container}>
			<StatusBar style={"light"} />
			<Gradient
				style={{
					width: "100%",
					height: "100%",
				}}
			>
				<View style={{ alignSelf: "flex-end", marginTop: height * 0.05 }}>
					<TouchableOpacity
						style={{
							right: 35,
							top: 2,
							paddingHorizontal: width * 0.05,
							paddingVertical: height * 0.01,
						}}
						onPress={navigate}
					>
						<Text style={{ fontSize: Math.min(height * 0.03, width * 0.05), color: colors.white }}>
							Atla
						</Text>
					</TouchableOpacity>
				</View>
				<View
					name={"upper container"}
					style={{ flexDirection: "row", marginLeft: width / 12, marginTop: height / 27 }}
				>
					<View name={"circles"}>
						{headerArr.map((_, index) => {
							return (
								<Animated.View
									key={index}
									style={[
										{
											minHeight: 12,
											width: 12,
											borderRadius: 6,
											backgroundColor: colors.white,
											marginTop: height * 0.015,
										},

										useAnimatedStyle(() => {
											return {
												height: withTiming(
													interpolate(progress.value - index, [-1, 0, 1], [12, 36, 12])
												),
												opacity: withTiming(
													interpolate(
														progress.value - index,
														[-2, -1, 0, 1, 2],
														[0.7, 0.7, 1, 0.7, 0.7]
													)
												),
											};
										}),
									]}
								/>
							);
						})}
					</View>
					<View
						name={"text"}
						style={{
							paddingRight: width * 0.2,
							width: "100%",
							marginLeft: width * 0.05,
						}}
					>
						<Text style={styles.TextHeader}>{headerArr[counter]}</Text>
						<Text style={styles.TextContent}>{contentArr[counter]}</Text>
					</View>
				</View>
				<View
					name={"icon container"}
					style={{
						alignItems: "center",
						width: "100%",
						height: Math.min(height * 0.4, width * 0.8),
					}}
				>
					<Image
						name={"icon 1"}
						resizeMode="contain"
						style={{
							aspectRatio: 1,
							width: width * 0.8,
							maxHeight: height * 0.4,
							position: "absolute",
							opacity: counter == 0 ? 1 : 0,
						}}
						source={require("../../assets/OnboardIcon1.png")}
					/>
					<Image
						name={"icon 2"}
						resizeMode="contain"
						style={{
							aspectRatio: 1,
							width: width * 0.8,
							maxHeight: height * 0.4,
							position: "absolute",
							opacity: counter == 1 ? 1 : 0,
						}}
						source={require("../../assets/OnboardIcon2.png")}
					/>
					<Image
						name={"icon 3"}
						resizeMode="contain"
						style={{
							aspectRatio: 1,
							width: width * 0.8,
							maxHeight: height * 0.4,
							position: "absolute",
							opacity: counter == 2 ? 1 : 0,
						}}
						source={require("../../assets/OnboardIcon3.png")}
					/>
				</View>

				<TouchableOpacity
					style={[
						commonStyles.button,
						{
							position: "absolute",
							bottom: height / 10,
							backgroundColor: colors.white,
							width: width / 1.5,
						},
					]}
					onPress={
						counter < 2
							? () => {
								progress.value++;
								counterChanger(counter + 1);
							}
							: navigate
					}
				>
					<MaskedView
						maskElement={
							<View
								style={{
									flex: 1,
									justifyContent: "center",
								}}
							>
								<Text
									style={{
										letterSpacing: 0.75,
										fontFamily: "PoppinsSemiBold",
										fontSize: height * 0.025,
									}}
								>
									{counter != 2 ? "Sonraki" : "Başlayalım"}
								</Text>
							</View>
						}
					>
						<Gradient
							style={{
								flex: 1,
								width: "100%",
								height: "100%",
							}}
						>
							<Text
								style={{
									letterSpacing: 0.75,
									fontFamily: "PoppinsSemiBold",
									fontSize: height * 0.025,
								}}
							>
								{counter != 2 ? "Sonraki" : "Başlayalım"}
							</Text>
						</Gradient>
					</MaskedView>
				</TouchableOpacity>
			</Gradient>
		</View>
	);
}

const styles = StyleSheet.create({
	TextHeader: {
		color: colors.white,
		fontFamily: "PoppinsSemiBold",
		fontSize: Math.min(height * 0.04, width * 0.06),
	},
	TextContent: {
		marginTop: 5,
		color: colors.white,
		letterSpacing: 0.9,
		fontSize: Math.min(height * 0.02, width * 0.03),
	},
});
