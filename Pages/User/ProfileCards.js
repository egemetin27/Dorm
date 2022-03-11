import React from "react";
import ReactNative, { View, Text, Image, StyleSheet, Dimensions, Pressable } from "react-native";
import {
	ScrollView,
	GestureDetector,
	Gesture,
	TouchableOpacity,
} from "react-native-gesture-handler";
import Animated, {
	Extrapolate,
	interpolate,
	runOnJS,
	useAnimatedReaction,
	useAnimatedStyle,
	useSharedValue,
	useDerivedValue,
	withDelay,
	withSpring,
	withTiming,
} from "react-native-reanimated";
import { snapPoint, ReText } from "react-native-redash";
import { Octicons, Feather, Ionicons } from "@expo/vector-icons";
import commonStyles from "../../visualComponents/styles";
import { colors, Gradient } from "../../visualComponents/colors";
import { CustomModal } from "../../visualComponents/customComponents";
import { StatusBar } from "expo-status-bar";

const { width, height } = Dimensions.get("window");
const SNAP_POINTS = [-width * 1.5, 0, width * 1.5];

const Card = ({ card, index, backFace, setPopupVisible, numberOfSuperLikes }) => {
	const progress = useSharedValue(0);
	const x = useSharedValue(0);
	const destination = useSharedValue(0);
	const turn = useSharedValue(1); // 1 => front, -1 => back

	const [likeFlag, setLikeFlag] = React.useState(false);
	const [backfaceIndex, setBackfaceIndex] = React.useState(0);

	const {
		About: about,
		Alkol: drink,
		Beslenme: diet,
		Burc: sign,
		Din: religion,
		Gender: gender,
		Major: major,
		Name: fName,
		School: university,
		Sigara: smoke,
		Surname: sName,
		UserId: id,
		photos: photoList,
		// age
		// hobbies,
	} = card ?? {
		id: 0,
		name: "name",
		age: "age",
		university: "university",
		major: "major",
		photoList: [],
		gender: "gender",
		religion: "religion",
		sign: "sign",
		diet: "diet",
		drink: "drink",
		smoke: "smoke",
		hobbies: "hobbies",
		about: "about",
	};

	const name = fName + " " + sName;
	const age = "22";
	const hobbies = ["A", "B", "C"];

	const panHandler = Gesture.Pan()
		.onUpdate((event) => {
			x.value = event.translationX;
		})
		.onEnd((event) => {
			destination.value = snapPoint(x.value, event.velocityX, SNAP_POINTS);
			// const destination = snapPoint(x.value, event.velocityX, SNAP_POINTS);
			x.value = withSpring(destination.value);
		})
		.onFinalize(() => {
			// TODO: decrease the daily number of likes by one if the value is greater than 0 and send the LIKED/DISLIKED data to backend
			destination.value > 0
				? console.log("LIKED")
				: destination.value < 0
				? console.log("DISLIKED")
				: console.log("NOTHING");
		});

	const tapHandler = Gesture.Tap()
		.numberOfTaps(2)
		.onStart(() => {
			turn.value = -turn.value;
			backFace.value = !backFace.value;
		});

	const animatedFrontFace = useAnimatedStyle(() => {
		return {
			transform: [
				{
					rotateY: withTiming(`${interpolate(turn.value, [1, -1], [0, 180])}deg`),
				},
			],
		};
	});

	const animatedBackFace = useAnimatedStyle(() => {
		return {
			transform: [
				{
					rotateY: withTiming(`${interpolate(turn.value, [1, -1], [180, 360])}deg`),
				},
			],
		};
	});

	const animatedSwipe = useAnimatedStyle(() => {
		return {
			transform: [
				{ translateX: x.value },
				{ translateY: likeFlag ? withDelay(500, withTiming(-height)) : 0 },
				{
					rotateZ: `${interpolate(x.value, [-width / 2, width / 2], [-15, 15])}deg`,
				},
			],
		};
	});

	const animatedLike = useAnimatedStyle(() => {
		return {
			opacity: destination.value == SNAP_POINTS[1] ? withTiming(1) : withTiming(0),
			transform: [
				{
					translateX:
						x.value > 0
							? interpolate(x.value, [0, width], [0, -width / 2 - 60], Extrapolate.CLAMP)
							: 0,
				},
				{
					scale: x.value > 0 ? interpolate(x.value, [0, width / 2], [0, 2], Extrapolate.CLAMP) : 0,
				},
			],
		};
	});

	const animatedDislike = useAnimatedStyle(() => {
		return {
			opacity: destination.value == SNAP_POINTS[1] ? withTiming(1) : withTiming(0),
			transform: [
				{
					translateX:
						x.value < 0
							? interpolate(x.value, [0, -width], [0, width / 2 + 60], Extrapolate.CLAMP)
							: 0,
				},
				{
					scale: x.value < 0 ? interpolate(-x.value, [0, width / 2], [0, 2], Extrapolate.CLAMP) : 0,
				},
			],
		};
	});

	const handleScroll = ({ nativeEvent }) => {
		progress.value = nativeEvent.contentOffset.y / nativeEvent.layoutMeasurement.height;
	};

	useAnimatedReaction(
		() => {
			return progress.value;
		},
		() => {
			runOnJS(setBackfaceIndex)(Math.round(progress.value));
		}
	);

	const handleSuperlike = () => {
		// TODO: send the like data to database and if the daily number of superlike is finished, show the popup
		if (numberOfSuperLikes.value > 0) {
			setLikeFlag(true);
			numberOfSuperLikes.value--;
		} else {
			setPopupVisible(true);
		}
	};

	const composedGesture = Gesture.Race(tapHandler, panHandler);

	return (
		<View key={index} style={{ position: "absolute" }}>
			<View name={"cards"} style={{ width: "100%", justifyContent: "center" }}>
				<Animated.View style={[animatedSwipe]}>
					<GestureDetector gesture={composedGesture}>
						<Animated.View>
							<Animated.View
								style={[
									commonStyles.photo,
									{
										width: width * 0.9,
										maxHeight: height * 0.7,
										backfaceVisibility: "hidden",
									},
									animatedFrontFace,
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
										// console.log("In Map: ", item);
										return (
											<Image
												key={index}
												source={{
													uri: item?.PhotoLink ?? "AAA",
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

								<View
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
												position: "absolute",
												right: 20,
												backgroundColor: colors.white,
												height: "70%",
												aspectRatio: 1 / 1,
												borderRadius: Dimensions.get("window").height * 0.1,
											}}
										>
											<TouchableOpacity onPress={handleSuperlike}>
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
															source={require("../../assets/spark_filled.png")}
														/>
													) : (
														<Image
															style={{
																width: "65%",
																height: "65%",
																resizeMode: "center",
															}}
															source={require("../../assets/spark_outline.png")}
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
										uri:
											photoList.length > 0
												? photoList[backfaceIndex].PhotoLink
												: "Nothing to see here",
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
									<View
										style={{
											width: "100%",
											alignItems: "center",
										}}
									>
										<Text
											name={"Gender"}
											style={{
												color: colors.light_gray,
												fontSize: 18,
												textAlign: "center",
												paddingVertical: 5,
											}}
										>
											Cinsityet{"\n"}
											<Text style={{ fontWeight: "bold", fontSize: 22 }}>{gender}</Text>
										</Text>
										<Text
											name={"Religion"}
											style={{
												color: colors.light_gray,
												fontSize: 18,
												textAlign: "center",
												paddingVertical: 5,
											}}
										>
											Dini İnanç{"\n"}
											<Text style={{ fontWeight: "bold", fontSize: 22 }}>{religion}</Text>
										</Text>
										<Text
											name={"Sign"}
											style={{
												color: colors.light_gray,
												fontSize: 18,
												textAlign: "center",
												paddingVertical: 5,
											}}
										>
											Burç{"\n"}
											<Text style={{ fontWeight: "bold", fontSize: 22 }}>{sign}</Text>
										</Text>
										<Text
											name={"Diet"}
											style={{
												color: colors.light_gray,
												fontSize: 18,
												textAlign: "center",
												paddingVertical: 5,
											}}
										>
											Beslenme Tercihi{"\n"}
											<Text style={{ fontWeight: "bold", fontSize: 22 }}>{diet}</Text>
										</Text>
										<Text
											name={"Drink"}
											style={{
												color: colors.light_gray,
												fontSize: 18,
												textAlign: "center",
												paddingVertical: 5,
											}}
										>
											Alkol Kullanımı{"\n"}
											<Text style={{ fontWeight: "bold", fontSize: 22 }}>{drink}</Text>
										</Text>
										<Text
											name={"Smoke"}
											style={{
												color: colors.light_gray,
												fontSize: 18,
												textAlign: "center",
												paddingVertical: 5,
											}}
										>
											Sigara Kullanımı{"\n"}
											<Text style={{ fontWeight: "bold", fontSize: 22 }}>{smoke}</Text>
										</Text>
										<Text
											name={"Hobbies"}
											style={{
												color: colors.light_gray,
												fontSize: 18,
												textAlign: "center",
												paddingVertical: 5,
											}}
										>
											İlgi Alanları{"\n"}
											<Text style={{ fontWeight: "bold", fontSize: 22 }}>{hobbies}</Text>
										</Text>
										<Text
											name={"About"}
											style={{
												color: colors.light_gray,
												fontSize: 18,
												textAlign: "center",
												paddingVertical: 5,
											}}
										>
											Hakkında{"\n"}
											<Text style={{ fontWeight: "bold", fontSize: 22 }}>{about}</Text>
										</Text>
									</View>
								</ScrollView>
							</Animated.View>
						</Animated.View>
					</GestureDetector>
				</Animated.View>

				<Animated.View
					name={"like"}
					style={[
						{
							position: "absolute",
							width: 60,
							aspectRatio: 1 / 1,
							backgroundColor: "transparent",
							borderRadius: 30,
							right: -80,
						},
						animatedLike,
					]}
				>
					<Image
						style={{ width: "100%", height: "100%", resizeMode: "contain" }}
						source={require("../../assets/Like.png")}
					/>
				</Animated.View>
				<Animated.View
					name={"dislike"}
					style={[
						{
							position: "absolute",
							width: 60,
							aspectRatio: 1 / 1,
							backgroundColor: "transparent",
							borderRadius: 30,
							left: -80,
						},
						animatedDislike,
					]}
				>
					<Image
						style={{
							tintColor: colors.gray,
							width: "100%",
							height: "100%",
							resizeMode: "contain",
						}}
						source={require("../../assets/Dislike.png")}
					/>
				</Animated.View>
			</View>
		</View>
	);
};

export default function ProfileCards({ navigation, route }) {
	const [popupVisible, setPopupVisible] = React.useState(false);

	const numberOfSuperLikes = useSharedValue(1); // TODO: get this data from database
	const backFace = useSharedValue(false);

	const derivedText = useDerivedValue(
		() =>
			`${
				backFace.value
					? "Arka yüze dönmek için kart alanına çift dokun"
					: "Daha iyi tanımak için kart alanına çift dokun"
			}`
	);

	// const peopleList = route.params?.list;

	const peopleList = route.params.list;

	function handlePopupSubmit() {
		console.log("super like submit...");
	}

	const hour = 15;
	const minute = 20;
	const second = 51; // TODO: get this data from database

	return (
		<View style={commonStyles.Container}>
			<StatusBar style="dark" />
			<View
				name={"header"}
				style={{
					flexDirection: "row",
					height: height * 0.14,
					width: width,
					marginBottom: 20,
					backgroundColor: colors.white,
					elevation: 10,
					paddingVertical: 20,
					paddingHorizontal: 30,
					justifyContent: "space-between",
					alignItems: "flex-end",
				}}
			>
				<TouchableOpacity
					onPress={() => {
						navigation.goBack();
					}}
				>
					<Feather style={{}} name="chevron-left" size={30} color={colors.cool_gray} />
				</TouchableOpacity>
				<TouchableOpacity>
					{/* TODO: open filtering modal here  */}
					<Octicons
						style={{ transform: [{ rotate: "-90deg" }] }}
						name="settings"
						size={30}
						color={colors.cool_gray}
					/>
				</TouchableOpacity>
			</View>
			<View style={{ width: "100%", height: height * 0.7, alignItems: "center" }}>
				{peopleList.reverse().map((item, index) => (
					<Card
						key={index}
						index={index}
						card={item}
						backFace={backFace}
						setPopupVisible={(val) => setPopupVisible(val)}
						numberOfSuperLikes={numberOfSuperLikes}
					/>
				))}
			</View>

			<View
				style={{
					width: "100%",
				}}
			>
				<ReText
					text={derivedText}
					style={{
						textAlign: "center",
						fontSize: 18,
						color: colors.medium_gray,
						letterSpacing: 0.2,
					}}
				/>
			</View>

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

					<Text
						style={{
							fontSize: 13,
							fontWeight: "bold",
							color: colors.cool_gray,
						}}
					>
						Profil
					</Text>
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
					<Text
						style={{
							fontSize: 13,
							fontWeight: "bold",
							color: colors.cool_gray,
						}}
					>
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
					<Text
						style={{
							fontSize: 13,
							fontWeight: "bold",
							color: colors.cool_gray,
						}}
					>
						Mesajlar
					</Text>
				</Pressable>
			</View>

			<CustomModal
				visible={popupVisible}
				dismiss={() => {
					setPopupVisible(false);
				}}
				// style={{ position: "absolute" }}
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
							setPopupVisible(false);
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
						source={require("../../assets/superLikeFinished.png")}
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
						{hour} saat {minute} dakika {second} saniye
					</Text>
					<ReactNative.TouchableOpacity
						onPress={handlePopupSubmit}
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
			</CustomModal>
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