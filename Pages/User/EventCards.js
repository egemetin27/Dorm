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

import commonStyles from "../../visualComponents/styles";
import { colors, Gradient, GradientText } from "../../visualComponents/colors";
import axios from "axios";
import { url } from "../../connection";
import { CustomModal } from "../../visualComponents/customComponents";
import { AuthContext } from "../../nonVisualComponents/Context";

const { width, height } = Dimensions.get("window");

const Card = ({ event, myID, navigation, sesToken }) => {
	const {
		EventId,
		BuyLink: buyLink,
		Description: name,
		Date: date,
		StartTime: time,
		Location: location,
		Category: genre,
		Organizator: seller,
		photos: photoList,
		isLiked,
	} = event;

	const [favFlag, setFavFlag] = React.useState(isLiked == 1 ? true : false);
	const [backfaceIndex, setBackfaceIndex] = React.useState(0);
	const [likeEventModal, setLikeEventModal] = React.useState(false);
	const [seeWhoLikedModal, setSeeWhoLikedModal] = React.useState(false);

	const { signOut } = React.useContext(AuthContext);

	const progress = useSharedValue(0);
	const turn = useSharedValue(1); // 1 => front, -1 => back

	const animatedCard = useAnimatedStyle(() => {
		return {
			transform: [{ rotateY: `${interpolate(turn.value, [1, -1], [0, 180])}deg` }],
		};
	});

	const animatedBackFace = useAnimatedStyle(() => {
		return {
			zIndex: turn.value == -1 ? 1 : -1,
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

	const handleLikeButton = async () => {
		const id = await SecureStore.getItemAsync("userID");

		if (favFlag) {
			await axios
				.post(
					url + "/dislikeEvent",
					{ UserId: id, eventId: EventId },
					{ headers: { "access-token": sesToken } }
				)
				.then((res) => setFavFlag(false))
				.catch((err) => console.log(err));
			return;
		}
		setLikeEventModal(true);
	};

	const likeEvent = async (likeMode) => {
		const id = await SecureStore.getItemAsync("userID");

		await axios
			.post(
				url + "/likeEvent",
				{ UserId: id, eventId: EventId, likeMode: likeMode },
				{ headers: { "access-token": sesToken } }
			)
			.then((res) => {
				setFavFlag(true);
				// Alert.alert("RES " + res.data);
			})
			.catch((err) => {
				// Alert.alert(err.response.status);
			});
	};

	const explorePeople = async () => {
		if (!favFlag) {
			setSeeWhoLikedModal(true);
			return;
		}
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
				console.log(res.data);
				if (res.data == "Unauthorized Session") {
					Alert.alert("Oturumunuzun süresi doldu!");
					signOut();
				} else if (typeof res.data == "object" && res.data.length > 0) {
					navigation.push("ProfileCards", {
						idx: 0,
						list: res.data,
						myID: myID,
						sesToken: sesToken,
						fromEvent: true,
						eventID: EventId,
					});
				} else {
					Alert.alert("Etkinliği Beğenen Kimse Yok :/");
				}
			})
			.catch((err) => {
				console.log(err);
			});
	};

	const likeButton = React.createRef();

	return (
		<View
			name={"cards"}
			style={{ width: "100%", justifyContent: "flex-start", flex: 1, justifyContent: "center" }}
			// style={{ width: "100%", backgroundColor: "green" }}
		>
			<GestureDetector gesture={tapHandler} waitFor={likeButton}>
				<Animated.View>
					<Animated.View
						style={[
							commonStyles.photo,
							{
								height: Math.min(width * 1.35, height * 0.7),
								backfaceVisibility: "hidden",
								elevation: 0,
							},
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
							{photoList?.map((item, index) => {
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
							{photoList?.map((_, index) => {
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
						{/*Report button for event card }
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
						{ */}
						<View
							style={{
								width: "100%",
								position: "absolute",
								bottom: 0,
								maxHeight: Math.min(width * 0.405, height * 0.21),
							}}
						>
							<Gradient
								colors={["rgba(0,0,0,0.001)", "rgba(0,0,0,0.45)", "rgba(0,0,0,0.65)"]}
								locations={[0, 0.4, 1]}
								start={{ x: 0.5, y: 0 }}
								end={{ x: 0.5, y: 1 }}
								style={{
									height: "100%",
									paddingTop: Math.min(width * 0.1, height * 0.05),
									paddingBottom: 20,
									width: "100%",
									justifyContent: "flex-start",
								}}
							>
								<View
									style={{
										width: "100%",
										height: "100%",
										flex: 1,
										alignItems: "center",
										justifyContent: "space-between",
										flexDirection: "row",
										paddingHorizontal: "5%",
									}}
								>
									<View
										style={{
											flex: 1,
											height: "100%",
											paddingRight: "3%",
											justifyContent: "flex-start",
										}}
									>
										<Text
											numberOfLines={1}
											style={{
												color: colors.white,
												fontSize: Math.min(36, height * 0.03),
												lineHeight: Math.min(height * 0.03, 36) * 1.2,
												fontFamily: "PoppinsSemiBold",
												letterSpacing: -0.2,
											}}
										>
											{name}
										</Text>
										{date != "NaN/NaN/NaN" && (
											<Text
												style={{
													color: colors.white,
													fontSize: Math.min(height * 0.02, 24),
													lineHeight: Math.min(height * 0.02, 24) * 1.2,
													fontFamily: "PoppinsItalic",
												}}
											>
												{date}
											</Text>
										)}

										{time != "" && (
											<Text
												style={{
													color: colors.white,
													fontSize: Math.min(height * 0.02, 24),
													lineHeight: Math.min(height * 0.02, 24) * 1.2,
													fontFamily: "PoppinsItalic",
												}}
											>
												{time}
											</Text>
										)}
									</View>
									{/* <View style={{ zIndex: 5 }}> */}
									<TouchableOpacity onPress={handleLikeButton}>
										<View
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
														source={require("../../assets/Fav_filled.png")}
													/>
												) : (
													<Image
														style={{
															aspectRatio: 1,
															height: (Math.max(Math.min(width * 0.1, height * 0.08), 60) * 2) / 3,
															resizeMode: "contain",
															marginBottom: MARGIN_CONSTANT * 40,
														}}
														source={require("../../assets/Fav.png")}
													/>
												)}
											</View>
										</View>
									</TouchableOpacity>
								</View>
							</Gradient>
						</View>
					</Animated.View>

					{/* PART: backface */}
					<Animated.View
						name={"backface"}
						style={[
							commonStyles.photo,
							{
								elevation: 0,
								height: Math.min(width * 1.35, height * 0.7),
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
								height: Math.min(width * 1.35, height * 0.7),
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
							contentContainerStyle={{
								// marginTop: 30,
								paddingBottom: 10,
								justifyContent: "center",
							}}
							rt
							style={{
								marginTop: 30,
								marginBottom: 10,
								width: "80%",
							}}
						>
							{/* <View style={{ width: "100%", alignItems: "center" }}> */}
							<Text
								name={"Name"}
								style={{
									color: colors.light_gray,
									fontSize: Math.min(height * 0.025, width * 0.04),
									textAlign: "center",
									paddingVertical: 5,
								}}
							>
								Etkinliğin Adı{"\n"}
								<Text
									style={{
										fontFamily: "PoppinsSemiBold",
										fontSize: Math.min(height * 0.03, width * 0.048),
									}}
								>
									{name}
								</Text>
							</Text>
							{location != "" && (
								<Text
									name={"Location"}
									style={{
										color: colors.light_gray,
										fontSize: Math.min(height * 0.025, width * 0.04),
										textAlign: "center",
										paddingVertical: 5,
									}}
								>
									Yer{"\n"}
									<Text
										style={{
											fontFamily: "PoppinsSemiBold",
											fontSize: Math.min(height * 0.03, width * 0.048),
										}}
									>
										{location}
									</Text>
								</Text>
							)}
							{date != "NaN/NaN/NaN" && (
								<Text
									name={"Date"}
									style={{
										color: colors.light_gray,
										fontSize: Math.min(height * 0.025, width * 0.04),
										textAlign: "center",
										paddingVertical: 5,
									}}
								>
									Tarih{"\n"}
									<Text
										style={{
											fontFamily: "PoppinsSemiBold",
											fontSize: Math.min(height * 0.03, width * 0.048),
										}}
									>
										{date}
									</Text>
								</Text>
							)}
							{time != "" && (
								<Text
									name={"Time"}
									style={{
										color: colors.light_gray,
										fontSize: Math.min(height * 0.025, width * 0.04),
										textAlign: "center",
										paddingVertical: 5,
									}}
								>
									Saat{"\n"}
									<Text
										style={{
											fontFamily: "PoppinsSemiBold",
											fontSize: Math.min(height * 0.03, width * 0.048),
										}}
									>
										{time}
									</Text>
								</Text>
							)}
							{genre != "" && (
								<Text
									name={"Genre"}
									style={{
										color: colors.light_gray,
										fontSize: Math.min(height * 0.025, width * 0.04),
										textAlign: "center",
										paddingVertical: 5,
									}}
								>
									Tür{"\n"}
									<Text
										style={{
											fontFamily: "PoppinsSemiBold",
											fontSize: Math.min(height * 0.03, width * 0.048),
										}}
									>
										{genre}
									</Text>
								</Text>
							)}
							{buyLink != "" && (
								<View style={{ width: "100%", alignItems: "center" }}>
									<Text
										name={"Seller"}
										style={{
											textAlign: "center",
											color: colors.light_gray,
											fontSize: Math.min(height * 0.025, width * 0.04),
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

											await Linking.openURL(buyLink);
										}}
										// style={{ backgroundColor: "pink" }}
									>
										<View
											style={{
												flexDirection: "row",
												alignItems: "center",
											}}
										>
											<Text
												style={{
													color: colors.light_gray,
													textDecorationLine: "underline",
													fontSize: Math.min(height * 0.03, width * 0.048),
													fontFamily: "PoppinsSemiBold",
												}}
											>
												{seller}
											</Text>
											<Text
												style={{
													// textAlign: "center",
													fontSize: Math.min(height * 0.03, width * 0.048),
													color: colors.light_gray,
												}}
											>
												{"⇗"}
											</Text>
										</View>
									</Pressable>
								</View>
							)}
							{/* </View> */}
						</ScrollView>
						<View style={{ width: "80%", marginBottom: height * 0.05 }}>
							<TouchableOpacity onPress={explorePeople}>
								<View
									style={{
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
					</Animated.View>
				</Animated.View>
			</GestureDetector>
			<CustomModal
				visible={likeEventModal}
				dismiss={() => {
					setLikeEventModal(false);
				}}
			>
				<Gradient
					style={{
						width: Math.min(width * 0.8, 400),
						aspectRatio: 1.8,
						borderRadius: 30,
						alignItems: "center",
					}}
				>
					<View style={{ position: "absolute", top: 5, right: 10 }}>
						<Pressable
							style={{ padding: 5 }}
							onPress={() => {
								setLikeEventModal(false);
							}}
						>
							<Feather name="x" size={Math.min(width * 0.05, 28)} color={colors.light_gray} />
						</Pressable>
					</View>
					<View
						style={{
							width: "75%",
							height: "100%",
							paddingVertical: "5%",
							alignItems: "center",
						}}
					>
						<Text
							style={{
								color: colors.white,
								fontSize: Math.min(20, width * 0.04),
								fontFamily: "PoppinsBold",
								textAlign: "center",
							}}
						>
							Daha iyi bir eşleşme deneyimi için bu etkinlikteki beklentilerini merak ediyoruz
						</Text>
						<View
							style={{
								flexDirection: "row",
								flex: 1,
								alignItems: "center",
								justifyContent: "space-around",
								width: "100%",
							}}
						>
							<View
								style={{ width: "45%", aspectRatio: 2.1, borderRadius: 10, overflow: "hidden" }}
							>
								<ReactNative.TouchableOpacity
									onPress={() => {
										likeEvent(0);
										setLikeEventModal(false);
									}}
									style={{
										width: "100%",
										height: "100%",
										backgroundColor: colors.light_gray,
										justifyContent: "center",
										alignItems: "center",
									}}
								>
									<GradientText text={"Flört"} style={{ fontFamily: "PoppinsSemiBold" }} />
								</ReactNative.TouchableOpacity>
							</View>
							<View
								style={{ width: "45%", aspectRatio: 2.1, borderRadius: 10, overflow: "hidden" }}
							>
								<ReactNative.TouchableOpacity
									onPress={() => {
										likeEvent(1);
										setLikeEventModal(false);
									}}
									style={{
										width: "100%",
										height: "100%",
										backgroundColor: colors.light_gray,
										justifyContent: "center",
										alignItems: "center",
									}}
								>
									<GradientText text={"Arkadaş"} style={{ fontFamily: "PoppinsSemiBold" }} />
								</ReactNative.TouchableOpacity>
							</View>
						</View>
					</View>
				</Gradient>
			</CustomModal>
			<CustomModal
				visible={seeWhoLikedModal}
				dismiss={() => {
					setSeeWhoLikedModal(false);
				}}
			>
				<Gradient
					style={{
						width: Math.min(width * 0.7, 300),
						maxWidth: width * 0.8,
						paddingVertical: 30,
						borderRadius: 30,
						justifyContent: "center",
						alignItems: "center",
					}}
				>
					<View style={{ position: "absolute", top: 5, right: 10 }}>
						<Pressable
							style={{ padding: 5 }}
							onPress={() => {
								setSeeWhoLikedModal(false);
							}}
						>
							<Feather name="x" size={Math.min(width * 0.05, 28)} color={colors.light_gray} />
						</Pressable>
					</View>

					<View
						style={{
							paddingHorizontal: "10%",
							alignItems: "center",
						}}
					>
						<Text
							style={{
								color: colors.white,
								fontSize: Math.min(20, width * 0.04),
								fontFamily: "PoppinsBold",
								textAlign: "center",
							}}
						>
							Etkinliğe gidenleri keşfetmen için etkinliği favorilere eklemiş olmalısın!
						</Text>
					</View>

					<View style={{ width: "70%", marginTop: 20 }}>
						<ReactNative.TouchableOpacity
							onPress={() => {
								setSeeWhoLikedModal(false);
								setLikeEventModal(true);
							}}
							style={{
								paddingVertical: 10,
								backgroundColor: colors.light_gray,
								justifyContent: "center",
								alignItems: "center",
								borderRadius: 10,
							}}
						>
							<GradientText text={"Etkinliği Beğen"} style={{ fontFamily: "PoppinsSemiBold" }} />
						</ReactNative.TouchableOpacity>
					</View>
				</Gradient>
			</CustomModal>
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
			<StatusBar style="dark" backgroundColor="#F4F3F3" />
			<View
				style={{
					backgroundColor: "#F4F3F3",
					// maxHeight: height * 0.15,
					paddingVertical: height * 0.015,

					width: width,
					flexDirection: "row",
					justifyContent: "space-between",
					paddingHorizontal: 20,
					alignItems: "center",
					elevation: 10,
					shadowOffset: {
						width: 0,
						height: 5,
					},
					shadowOpacity: 0.34,
					shadowRadius: 6.27,
				}}
			>
				<TouchableOpacity
					onPress={() => {
						navigation.replace("MainScreen", { screen: "AnaSayfa" });
					}}
				>
					<Feather name="chevron-left" size={30} color={colors.cool_gray} />
				</TouchableOpacity>
				<Image
					source={require("../../assets/dorm_text.png")}
					resizeMode="contain"
					style={{ height: height * 0.04, flex: 1 }}
				/>
				<Feather name="chevron-left" size={30} color={"#F4F3F3"} />
			</View>
			{list.length > 0 && (
				<View style={{ flex: 1 }}>
					<Carousel
						windowSize={list.length > 7 ? 7 : list.length}
						defaultIndex={idx}
						width={width}
						loop={false}
						data={list}
						renderItem={({ item }) => (
							<Card event={item} myID={myID} navigation={navigation} sesToken={sesToken} />
						)}
					/>
				</View>
			)}
			<View
				style={{
					width: width,
					paddingHorizontal: width * 0.1,
					marginBottom: Math.min(12, height * 0.02),
					// backgroundColor: "red",
				}}
			>
				<Text
					numberOfLines={2}
					adjustsFontSizeToFit={true}
					style={{
						textAlign: "center",
						// fontSize: Math.min(width * 0.04, 24),
						color: colors.medium_gray,
						letterSpacing: 0.2,
					}}
				>
					Etkinlikle ilgili ayrıntılı bilgi almak ve etkinliğe gidenleri keşfetmek için karta çift
					dokun
				</Text>
			</View>
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
