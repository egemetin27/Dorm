import React from "react";
import { View, Text, Image, StyleSheet, Dimensions, Pressable } from "react-native";
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

import commonStyles from "../../visualComponents/styles";
import { colors, Gradient } from "../../visualComponents/colors";

const { width, height } = Dimensions.get("window");

const Card = ({ event }) => {
	const {
		Description: name,
		Date: date,
		StartTime: time,
		Location: location,
		Category: genre,
		Organizator: seller,
		favorited = false,
	} = event;

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

	const arr = [
		{ key: "A", color: "red" },
		{ key: "B", color: "blue" },
		{ key: "C", color: "green" },
		{ key: "D", color: "orange" },
	];

	// how much the Fav star should go up relative to the height of the surrounding circle (height * constant = marginBottom)
	const MARGIN_CONSTANT = 0.190983 / 2;

	const handleFavorited = () => {
		// send favorited value to database
		setFavFlag(!favFlag);
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
							{arr.map((item, index) => {
								return (
									<View
										key={index}
										style={{
											width: "100%",
											height: width * 1.35,
											backgroundColor: item.color,
										}}
									/>
									// <Image
									// 	key={index}
									// 	source={{
									// 		uri: item,
									// 	}}
									// 	style={{
									// 		height: width * 1.35,
									// 		resizeMode: "cover",
									// 		backgroundColor: "red",
									// 	}}
									// />
								);
							})}
						</ScrollView>

						<View
							style={{
								position: "absolute",
								left: 20,
								top: 20,
								justifyContent: "space-between",
								minHeight: arr.length * 10 + 16,
							}}
						>
							{arr.map((_, index) => {
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
											fontSize: 18,
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
						{/* <Image
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
									/> */}
						<View
							name={"colorFilter"}
							style={{
								width: "100%",
								height: "100%",
								position: "absolute",
								backgroundColor: "rgba(0,0,0,0.25)",
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
										fontSize: 18,
										textAlign: "center",
										paddingVertical: 5,
									}}
								>
									Yer{"\n"}
									<Text style={{ fontWeight: "bold", fontSize: 22 }}>{location}</Text>
								</Text>
								<Text
									name={"Date"}
									style={{
										color: colors.light_gray,
										fontSize: 18,
										textAlign: "center",
										paddingVertical: 5,
									}}
								>
									Tarih{"\n"}
									<Text style={{ fontWeight: "bold", fontSize: 22 }}>{date}</Text>
								</Text>
								<Text
									name={"Time"}
									style={{
										color: colors.light_gray,
										fontSize: 18,
										textAlign: "center",
										paddingVertical: 5,
									}}
								>
									Saat{"\n"}
									<Text style={{ fontWeight: "bold", fontSize: 22 }}>{time}</Text>
								</Text>
								<Text
									name={"Genre"}
									style={{
										color: colors.light_gray,
										fontSize: 18,
										textAlign: "center",
										paddingVertical: 5,
									}}
								>
									Tür{"\n"}
									<Text style={{ fontWeight: "bold", fontSize: 22 }}>{genre}</Text>
								</Text>
								<Text
									name={"Seller"}
									style={{
										color: colors.light_gray,
										fontSize: 18,
										textAlign: "center",
										paddingVertical: 5,
									}}
								>
									Bilet Platformu{"\n"}
									<Text style={{ fontWeight: "bold", fontSize: 22 }}>{seller}</Text>
								</Text>
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
	const { idx, list } = route.params;

	// const list = [
	// 	{
	// 		key: 1,
	// 		name: "1",
	// 		date: "date1",
	// 		time: "time1",
	// 		location: "location1",
	// 		genre: "genre1",
	// 		seller: "seller1",
	// 		favorited: false,
	// 	},
	// 	{
	// 		key: 2,
	// 		name: "2",
	// 		date: "date2",
	// 		time: "time2",
	// 		location: "location2",
	// 		genre: "genre2",
	// 		seller: "seller2",
	// 		favorited: false,
	// 	},
	// 	{
	// 		key: 3,
	// 		name: "3",
	// 		date: "date3",
	// 		time: "time3",
	// 		location: "location3",
	// 		genre: "genre3",
	// 		seller: "seller3",
	// 		favorited: false,
	// 	},
	// 	{
	// 		key: 4,
	// 		name: "4",
	// 		date: "date4",
	// 		time: "time4",
	// 		location: "location4",
	// 		genre: "genre4",
	// 		seller: "seller4",
	// 		favorited: false,
	// 	},
	// ];

	return (
		<View style={commonStyles.Container}>
			<View
				style={{
					backgroundColor: "#F4F3F3",
					height: height * 0.15,
					width: "100%",
					flexDirection: "row",
					justifyContent: "space-between",
					paddingHorizontal: 20,
					paddingVertical: 25,
					alignItems: "flex-end",
					elevation: 10,
				}}
			>
				<TouchableOpacity>
					<Ionicons name="arrow-back-outline" size={30} color="black" />
				</TouchableOpacity>
				<Text style={{}}>dorm</Text>
				<Ionicons name="arrow-back-outline" size={30} color="#F4F3F3" />
			</View>

			<Carousel
				defaultIndex={idx}
				width={width}
				data={list}
				renderItem={({ item }) => <Card event={item} />}
			/>

			{/* PART: TabBar */}
			<View name={"tab-Bar"} style={styles.tabBar}>
				<Pressable
					onPress={() => {
						navigation.navigate("MainScreen", { screen: "Profil" });
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
						navigation.navigate("MainScreen", { screen: "AnaSayfa" });
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
						navigation.navigate("MainScreen", { screen: "Mesajlar" });
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