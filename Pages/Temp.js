import React from "react";
import ReactNative, {
	View,
	Text,
	Image,
	StyleSheet,
	Dimensions,
	Pressable,
	BackHandler,
	Linking,
	Alert,
} from "react-native";
import {
	ScrollView,
	TouchableOpacity,
	GestureDetector,
	Gesture,
	RectButton,
} from "react-native-gesture-handler";
import Animated, {
	interpolate,
	runOnJS,
	useAnimatedReaction,
	useAnimatedStyle,
	useSharedValue,
	withTiming,
} from "react-native-reanimated";
import Carousel from "react-native-reanimated-carousel";
import { Ionicons, Feather } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import * as SecureStore from "expo-secure-store";

import commonStyles from "../visualComponents/styles";
import { colors, Gradient } from "../visualComponents/colors";
import axios from "axios";
import { url } from "../connection";

const { width, height } = Dimensions.get("window");

export default function Card() {
	const progress = useSharedValue(0);
	const turn = useSharedValue(1); // 1 => front, -1 => back

	const animatedCard = useAnimatedStyle(() => {
		return {
			transform: [{ rotateY: `${interpolate(turn.value, [1, -1], [0, 180])}deg` }],
		};
	});

	const animatedBackFace = useAnimatedStyle(() => {
		return {
			transform: [{ rotateY: `${interpolate(turn.value, [1, -1], [180, 360])}deg` }],
		};
	});

	const tapHandler = Gesture.Tap()
		.numberOfTaps(2)
		.onEnd(() => {
			turn.value = withTiming(-turn.value);
		});

	const handleScroll = ({ nativeEvent }) => {
		progress.value = nativeEvent.contentOffset.y / nativeEvent.layoutMeasurement.height;
	};

	const [favFlag, setFavFlag] = React.useState(true);

	const [backfaceIndex, setBackfaceIndex] = React.useState(0);

	useAnimatedReaction(
		() => {
			return progress.value;
		},
		() => {
			runOnJS(setBackfaceIndex)(Math.round(progress.value));
		}
	);

	// how much the Fav star should go up relative to the height of the surrounding circle (height * constant = marginBottom)
	const MARGIN_CONSTANT = 0.190983 / 2;

	const explorePeople = async () => {
		// await axios
		// 	.post(
		// 		url + "/eventParticipants",
		// 		{
		// 			eventId: EventId,
		// 			UserId: myID,
		// 		},
		// 		{ headers: { "access-token": sesToken } }
		// 	)
		// 	.then((res) => {
		// 		if (res.data.length > 0) {
		// 			navigation.push("ProfileCards", {
		// 				idx: 0,
		// 				list: res.data,
		// 				myID: myID,
		// 				sesToken: sesToken,
		// 				fromEvent: true,
		// 			});
		// 		} else {
		// 			Alert.alert("Etkinliği Beğenen Kimse Yok :/");
		// 		}
		// 	})
		// 	.catch((err) => console.log(err));
	};

	return (
		<View
			name={"cards"}
			style={{ width: "100%", justifyContent: "center", height: height * 0.76, paddingTop: 100 }}
		>
			<GestureDetector gesture={tapHandler}>
				<Animated.View style={{ width: "100%", height: "100%", backgroundColor: "red" }}>
					<Animated.View
						style={[
							commonStyles.photo,
							{ height: Math.min(width * 1.35, height * 0.7), backfaceVisibility: "hidden" },
							animatedCard,
						]}
					>
						<View
							style={{
								position: "absolute",
								bottom: 0,
								left: 0,
								zIndex: 50,
								elevation: 20,
							}}
						>
							<TouchableOpacity
								onPress={() => {
									console.log("XX");
								}}
								style={{
									width: 100,
									height: 100,
									backgroundColor: "pink",
								}}
							/>
						</View>
						{/* <ScrollView
							scrollEventThrottle={16}
							style={{ width: "100%" }}
							pagingEnabled={true}
							showsVerticalScrollIndicator={false}
							onScroll={handleScroll}
						>
							{photoList.map((item, index) => {
								return (
									<Image
										key={index}
										source={{
											uri: item ?? "AAA",
										}}
										style={{
											height: Math.min(height * 0.7, width * 1.35),
											resizeMode: "cover",
											backgroundColor: colors.cool_gray,
										}}
									/>
								);
							})}
						</ScrollView> */}

						{/* <View // photo order indicator dots
							style={{
								position: "absolute",
								left: 20,
								top: 20,
								justifyContent: "space-between",
								// minHeight: photoList.length * 10 + 16,
							}}
						>
							{photoList.map((_, index) => {
								return (
									<Animated.View
										key={index}
										style={[
											{
												minHeight: 8,
												width: 8,
												borderRadius: 4,
												backgroundColor: colors.white,
											},

											useAnimatedStyle(() => {
												return {
													height: interpolate(progress.value - index, [-1, 0, 1], [8, 24, 8]),
												};
											}),
										]}
									/>
								);
							})}
						</View> */}

						<View style={{ position: "absolute", top: 20, right: 20 }}>
							<TouchableOpacity onPress={() => {}}>
								<Image
									style={{
										height: 25,
										tintColor: colors.white,
										resizeMode: "contain",
									}}
									source={require("../assets/report.png")}
								/>
							</TouchableOpacity>
						</View>

						<Gradient
							colors={["rgba(0,0,0,0.005)", " rgba(0,0,0,0.1)", "rgba(0,0,0,0.5)"]}
							locations={[0, 0.1, 1]}
							start={{ x: 0.5, y: 0 }}
							end={{ x: 0.5, y: 1 }}
							style={{
								height: "15%",
								width: "100%",
								position: "absolute",
								justifyContent: "flex-end",
								bottom: 0,
							}}
						>
							<View
								style={{
									width: "100%",
									height: "100%",
									alignItems: "center",
									justifyContent: "space-between",
									flexDirection: "row",
									paddingHorizontal: "5%",
								}}
							>
								<View style={{ flex: 1, paddingRight: "5%" }}>
									<Text
										numberOfLines={1}
										style={{
											color: colors.white,
											fontSize: Math.min(24, width * 0.048),
											// fontFamily: "PoppinsSemiBold",
											letterSpacing: 1.05,
										}}
									></Text>
									<Text
										style={{
											color: colors.white,
											fontSize: Math.min(18, width * 0.036),
											// fontFamily: "PoppinsItalic",
										}}
									></Text>
								</View>
								<TouchableOpacity
									onPress={() => {
										console.log("AAA");
									}}
								>
									<View
										// accessible
										// accessibilityRole="button"
										style={{
											backgroundColor: colors.white,
											height: Math.max(Math.min(width * 0.1, height * 0.08), 60),
											aspectRatio: 1 / 1,
											borderRadius: Math.max(Math.min(width * 0.1, height * 0.08), 60) / 2,
										}}
									>
										<View
											style={{
												width: "100%",
												height: "100%",
												justifyContent: "center",
												alignItems: "center",
											}}
										>
											{favFlag ? (
												<Image
													style={{
														aspectRatio: 1,
														height: (Math.max(Math.min(width * 0.1, height * 0.08), 60) * 2) / 3,
														resizeMode: "contain",
														marginBottom: MARGIN_CONSTANT * 40,
													}}
													source={require("../assets/Fav_filled.png")}
												/>
											) : (
												<Image
													style={{
														aspectRatio: 1,
														height: (Math.max(Math.min(width * 0.1, height * 0.08), 60) * 2) / 3,
														resizeMode: "contain",
														marginBottom: MARGIN_CONSTANT * 40,
													}}
													source={require("../assets/Fav.png")}
												/>
											)}
										</View>
									</View>
								</TouchableOpacity>
								{/* </View> */}
							</View>
						</Gradient>
					</Animated.View>

					{/* PART: backface */}
					<Animated.View
						name={"backface"}
						style={[
							commonStyles.photo,
							{
								height: Math.min(width * 1.35, height * 0.7),
								position: "absolute",
								backfaceVisibility: "hidden",
								backgroundColor: "transparent",
							},
							animatedBackFace,
						]}
					>
						{/* <Image
							source={{
								uri: photoList[backfaceIndex],
							}}
							blurRadius={20}
							style={{
								position: "absolute",
								height: Math.min(width * 1.35, height * 0.7),
								aspectRatio: 1 / 1.5,
								resizeMode: "cover",
								transform: [{ rotateY: "180deg" }],
							}}
						/> */}
						<View
							name={"colorFilter"}
							style={{
								width: "100%",
								height: "100%",
								position: "absolute",
								backgroundColor: "rgba(64,64,64,0.5)",
							}}
						/>
						<ScrollView
							showsVerticalScrollIndicator={false}
							style={{
								width: "80%",
								marginVertical: 30,
							}}
						>
							<View style={{ width: "100%", alignItems: "center" }}>
								<Text
									name={"Location"}
									style={{
										color: colors.light_gray,
										fontSize: Math.min(width * 0.045, 27),
										textAlign: "center",
										paddingVertical: 5,
									}}
								>
									Yer{"\n"}
									<Text style={{ fontSize: Math.min(width * 0.055, 30) }}>{/* {location} */}</Text>
								</Text>
								<Text
									name={"Date"}
									style={{
										color: colors.light_gray,
										fontSize: Math.min(width * 0.045, 27),
										textAlign: "center",
										paddingVertical: 5,
									}}
								>
									Tarih{"\n"}
									<Text style={{ fontSize: Math.min(width * 0.055, 30) }}>{/* {date} */}</Text>
								</Text>
								<Text
									name={"Time"}
									style={{
										color: colors.light_gray,
										fontSize: Math.min(width * 0.045, 27),
										textAlign: "center",
										paddingVertical: 5,
									}}
								>
									Saat{"\n"}
									<Text style={{ fontSize: Math.min(width * 0.055, 30) }}>{/* {time} */}</Text>
								</Text>
								<Text
									name={"Genre"}
									style={{
										color: colors.light_gray,
										fontSize: Math.min(width * 0.045, 27),
										textAlign: "center",
										paddingVertical: 5,
									}}
								>
									Tür{"\n"}
									<Text style={{ fontSize: Math.min(width * 0.055, 30) }}>{/* {genre} */}</Text>
								</Text>
								<Text
									name={"Seller"}
									style={{
										textAlign: "center",
										color: colors.light_gray,
										fontSize: Math.min(width * 0.045, 27),
										paddingTop: 5,
									}}
								>
									Bilet Platformu
								</Text>
								<Pressable
									onPress={async () => {
										if (turn.value != -1) return;
										await axios
											.post(
												url + "/eventLinkClick",
												{ EventId: EventId },
												{ headers: { "access-token": sesToken } }
											)
											.catch((err) => console.log(err));

										await Linking.openURL(BuyLink);
									}}
								>
									<View style={{ flexDirection: "row", alignContent: "center" }}>
										<Text
											style={{
												color: colors.light_gray,
												textDecorationLine: "underline",
												fontSize: Math.min(width * 0.055, 30),
											}}
										>
											{/* {seller} */}
										</Text>
										<Text
											style={{
												textAlign: "center",
												fontSize: Math.min(width * 0.07, 30),
												color: colors.light_gray,
											}}
										>
											{"⇗"}
										</Text>
									</View>
								</Pressable>
								<View style={{ width: "100%" }}>
									<TouchableOpacity onPress={explorePeople}>
										<View
											style={{
												// width: width,
												// backgroundColor: "blue",
												paddingHorizontal: 10,
												paddingVertical: 15,
												borderRadius: 10,
												borderWidth: 1,
												borderColor: colors.light_gray,
												justifyContent: "center",
												alignItems: "center",
												marginTop: 10,
											}}
										>
											<Text
												numberOfLines={1}
												adjustsFontSizeToFit={true}
												style={{
													fontSize: Math.min(width * 0.1, 18),
													color: colors.light_gray,
												}}
											>
												Etkinliği Beğenen Kişileri Keşfet
											</Text>
										</View>
									</TouchableOpacity>
								</View>
							</View>
						</ScrollView>
					</Animated.View>
				</Animated.View>
			</GestureDetector>
		</View>
	);
}

const styles = StyleSheet.create({
	tabBar: {
		position: "absolute",
		bottom: 0,
		height: height * 0.08,
		width: "100%",
		paddingBottom: height * 0.008,
		backgroundColor: colors.white,
		flexDirection: "row",
		elevation: 5,
	},
});
