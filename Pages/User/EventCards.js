import React from "react";
import {
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
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import * as SecureStore from "expo-secure-store";

import commonStyles from "../../visualComponents/styles";
import { colors, Gradient } from "../../visualComponents/colors";
import axios from "axios";
import { url } from "../../connection";

const { width, height } = Dimensions.get("window");

const Card = ({ event, myID, navigation }) => {
	const {
		EventId,
		BuyLink,
		Description: name,
		Date: date,
		StartTime: time,
		Location: location,
		Category: genre,
		Organizator: seller,
		photos: photoList,
		isLiked,
	} = event;

	const favorited = isLiked == 1 ? true : false;

	const progress = useSharedValue(0);
	const turn = useSharedValue(1); // 1 => front, -1 => back

	const animatedCard = useAnimatedStyle(() => {
		return {
			transform: [{ rotateY: withTiming(`${interpolate(turn.value, [1, -1], [0, 180])}deg`) }],
		};
	});

	const animatedBackFace = useAnimatedStyle(() => {
		return {
			transform: [{ rotateY: withTiming(`${interpolate(turn.value, [1, -1], [180, 360])}deg`) }],
		};
	});

	const tapHandler = Gesture.Tap()
		.numberOfTaps(2)
		.onEnd(() => {
			turn.value = -turn.value;
		});

	const handleScroll = ({ nativeEvent }) => {
		progress.value = nativeEvent.contentOffset.y / nativeEvent.layoutMeasurement.height;
	};

	const [favFlag, setFavFlag] = React.useState(favorited);

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

	const handleFavorited = async () => {
		const id = await SecureStore.getItemAsync("userID");
		if (!favFlag) {
			await axios
				.post(
					url + "/likeEvent",
					{ UserId: id, eventId: EventId },
					{ headers: { "access-token": sesToken } }
				)
				.then((res) => console.log(res.data))
				.catch((err) => console.log(err));

			// send favorited value to database
		} else {
			await axios
				.post(
					url + "/dislikeEvent",
					{ UserId: id, eventId: EventId },
					{ headers: { "access-token": sesToken } }
				)
				.then((res) => console.log(res.data))
				.catch((err) => console.log(err));
		}
		setFavFlag(!favFlag);
	};

	const explorePeople = async () => {
		// TODO:

		await axios
			.post(
				url + "/eventParticipants",
				{
					eventId: EventId,
					UserId: myID,
				},
				{ headers: { "access-token": sesToken } }
			)
			.then((res) => {
				if (res.data.length > 0) {
					navigation.replace("ProfileCards", {
						list: res.data,
						myID: myID,
					});
				} else {
					Alert.alert("Etkinliği Beğenen Kimse Yok :/");
				}
			})
			.catch((err) => console.log(err));

		// navigation.replace("ProfileCards", {
		// 	list: [],
		// 	myID: myID,
		// });
	};

	return (
		<View name={"cards"} style={{ width: "100%", justifyContent: "center", height: height * 0.76 }}>
			<StatusBar style="dark" />
			<GestureDetector gesture={tapHandler}>
				<Animated.View style={{}}>
					<Animated.View
						style={[
							commonStyles.photo,
							{ width: width * 0.9, backfaceVisibility: "hidden" },
							animatedCard,
						]}
					>
						<ScrollView
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
											height: width * 1.35,
											resizeMode: "cover",
											backgroundColor: "red",
										}}
									/>
								);
							})}
						</ScrollView>

						<View // photo order indicator dots
							style={{
								position: "absolute",
								left: 20,
								top: 20,
								justifyContent: "space-between",
								minHeight: photoList.length * 10 + 16,
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
						</View>

						<View style={{ position: "absolute", top: 20, right: 20 }}>
							<TouchableOpacity onPress={() => {}}>
								<Image
									style={{
										height: 25,
										tintColor: colors.white,
										resizeMode: "contain",
									}}
									source={require("../../assets/report.png")}
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
								bottom: 0,
							}}
						>
							<View
								style={{
									width: "100%",
									height: "100%",
									justifyContent: "center",
								}}
							>
								<View style={{ position: "absolute", left: 20 }}>
									<Text
										style={{
											color: colors.white,
											fontSize: 24,
											fontWeight: "bold",
											letterSpacing: 1.05,
										}}
									>
										{name}
									</Text>
									<Text
										style={{
											color: colors.white,
											fontSize: width * 0.045,
											fontStyle: "italic",
										}}
									>
										{date}
										{"\n"}
										{time}
									</Text>
								</View>

								<View
									style={{
										position: "absolute",
										right: 20,
										backgroundColor: colors.white,
										height: 60,
										aspectRatio: 1 / 1,
										borderRadius: 30,
									}}
								>
									<TouchableOpacity onPress={handleFavorited}>
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
														width: 40,
														height: 40,
														resizeMode: "contain",
														marginBottom: MARGIN_CONSTANT * 40,
													}}
													source={require("../../assets/Fav_filled.png")}
												/>
											) : (
												<Image
													style={{
														width: 40,
														height: 40,
														resizeMode: "contain",
														marginBottom: MARGIN_CONSTANT * 40,
													}}
													source={require("../../assets/Fav.png")}
												/>
											)}
										</View>
									</TouchableOpacity>
								</View>
							</View>
						</Gradient>
					</Animated.View>

					{/* PART: backface */}
					<Animated.View
						name={"backface"}
						style={[
							commonStyles.photo,
							{
								width: width * 0.9,
								position: "absolute",
								backfaceVisibility: "hidden",
								backgroundColor: "transparent",
							},
							animatedBackFace,
						]}
					>
						<Image
							source={{
								uri: photoList[backfaceIndex],
							}}
							blurRadius={20}
							style={{
								position: "absolute",
								width: width * 0.9,
								aspectRatio: 1 / 1.5,
								resizeMode: "cover",
								transform: [{ rotateY: "180deg" }],
							}}
						/>
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
										fontSize: width * 0.045,
										textAlign: "center",
										paddingVertical: 5,
									}}
								>
									Yer{"\n"}
									<Text style={{ fontWeight: "bold", fontSize: width * 0.055 }}>{location}</Text>
								</Text>
								<Text
									name={"Date"}
									style={{
										color: colors.light_gray,
										fontSize: width * 0.045,
										textAlign: "center",
										paddingVertical: 5,
									}}
								>
									Tarih{"\n"}
									<Text style={{ fontWeight: "bold", fontSize: width * 0.055 }}>{date}</Text>
								</Text>
								<Text
									name={"Time"}
									style={{
										color: colors.light_gray,
										fontSize: width * 0.045,
										textAlign: "center",
										paddingVertical: 5,
									}}
								>
									Saat{"\n"}
									<Text style={{ fontWeight: "bold", fontSize: width * 0.055 }}>{time}</Text>
								</Text>
								<Text
									name={"Genre"}
									style={{
										color: colors.light_gray,
										fontSize: width * 0.045,
										textAlign: "center",
										paddingVertical: 5,
									}}
								>
									Tür{"\n"}
									<Text style={{ fontWeight: "bold", fontSize: width * 0.055 }}>{genre}</Text>
								</Text>
								<Text
									name={"Seller"}
									style={{
										color: colors.light_gray,
										fontSize: width * 0.045,
										textAlign: "center",
										paddingVertical: 5,
									}}
								>
									Bilet Platformu{"\n"}
									<View style={{ alignContent: "center" }}>
										<Pressable
											onPress={async () => {
												await Linking.openURL(BuyLink);
											}}
										>
											<View style={{ flexDirection: "row" }}>
												<Text
													style={{
														color: colors.light_gray,
														textDecorationLine: "underline",
														fontSize: width * 0.055,
														fontWeight: "bold",
													}}
												>
													{seller}
												</Text>
												<Text style={{ fontSize: width * 0.045, color: colors.light_gray }}>
													{" "}
													⇗
												</Text>
											</View>
										</Pressable>
									</View>
								</Text>
								<TouchableOpacity onPress={explorePeople}>
									<View
										style={{
											width: width * 0.6,
											height: 40,
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
												fontSize: width * 0.04,
												color: colors.light_gray,
											}}
										>
											Etkinliği Beğenen Kişileri Keşfet
										</Text>
									</View>
								</TouchableOpacity>
							</View>
						</ScrollView>
					</Animated.View>
				</Animated.View>
				{/* </TapGestureHandler> */}
			</GestureDetector>
		</View>
	);
};

export default function EventCards({ navigation, route }) {
	const { idx, list, myID, sesToken } = route.params;

	React.useEffect(() => {
		const backAction = () => {
			navigation.replace("MainScreen", { screen: "AnaSayfa" });
			return true;
		};

		const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);

		return () => backHandler.remove();
	}, []);

	return (
		<View style={commonStyles.Container}>
			<View
				style={{
					backgroundColor: "#F4F3F3",
					height: height * 0.15,
					width: width,
					flexDirection: "row",
					justifyContent: "space-between",
					paddingHorizontal: 20,
					paddingTop: height * 0.05,
					alignItems: "center",
					elevation: 10,
				}}
			>
				<TouchableOpacity
					onPress={() => {
						navigation.replace("MainScreen", { screen: "AnaSayfa" });
					}}
				>
					<Ionicons name="arrow-back-outline" size={30} color="black" />
				</TouchableOpacity>
				<Image
					source={require("../../assets/dorm_text.png")}
					resizeMode="center"
					style={{ maxWidth: "30%", height: "40%" }}
				/>
				<Ionicons name="arrow-back-outline" size={30} color="transparent" />
			</View>

			<Carousel
				defaultIndex={idx}
				width={width}
				loop={false}
				data={list}
				renderItem={({ item }) => (
					<Card event={item} myID={myID} navigation={navigation} sesToken={sesToken} />
				)}
			/>

			{/* PART: TabBar */}
			<View name={"tab-Bar"} style={styles.tabBar}>
				<Pressable
					onPress={() => {
						navigation.replace("MainScreen", { screen: "Profil" });
					}}
					style={{ alignItems: "center", justifyContent: "flex-end", flex: 1 }}
				>
					<Image
						source={require("../../assets/TabBarIcons/profile.png")}
						resizeMode="contain"
						style={{
							tintColor: colors.cool_gray,
							height: height / 36,
						}}
					/>

					<Text style={{ fontSize: 13, fontWeight: "bold", color: colors.cool_gray }}>Profil</Text>
				</Pressable>
				<Pressable
					onPress={() => {
						navigation.replace("MainScreen", { screen: "AnaSayfa" });
					}}
					style={{ alignItems: "center", justifyContent: "flex-end", flex: 1 }}
				>
					<Image
						source={require("../../assets/TabBarIcons/anasayfa.png")}
						resizeMode="contain"
						style={{
							tintColor: colors.cool_gray,
							height: height / 27,
						}}
					/>
					<Text style={{ fontSize: 13, fontWeight: "bold", color: colors.cool_gray }}>
						Ana Sayfa
					</Text>
				</Pressable>
				<Pressable
					onPress={() => {
						navigation.replace("MainScreen", { screen: "Mesajlar" });
					}}
					style={{ alignItems: "center", justifyContent: "flex-end", flex: 1 }}
				>
					<Image
						source={require("../../assets/TabBarIcons/messages.png")}
						resizeMode="contain"
						style={{
							tintColor: colors.cool_gray,
							height: height / 36,
						}}
					/>
					<Text style={{ fontSize: 13, fontWeight: "bold", color: colors.cool_gray }}>
						Mesajlar
					</Text>
				</Pressable>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	tabBar: {
		position: "absolute",
		bottom: 0,
		height: height / 12,
		width: "100%",
		paddingBottom: height / 100,
		backgroundColor: colors.white,
		flexDirection: "row",
	},
});
