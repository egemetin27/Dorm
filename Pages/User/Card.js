import React from "react";
import ReactNative, {
	View,
	Text,
	Image,
	Dimensions,
	Modal,
	RefreshControlBase,
} from "react-native";
import {
	ScrollView,
	GestureDetector,
	Gesture,
	TouchableOpacity,
	FlatList,
} from "react-native-gesture-handler";
import Animated, {
	Extrapolate,
	interpolate,
	runOnJS,
	useAnimatedReaction,
	useAnimatedStyle,
	useSharedValue,
	withDelay,
	withSpring,
	withTiming,
} from "react-native-reanimated";
import { snapPoint } from "react-native-redash";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

import commonStyles from "../../visualComponents/styles";
import { colors, Gradient, GradientText } from "../../visualComponents/colors";
import axios from "axios";
import { url } from "../../connection";
import { getAge, getGender } from "../../nonVisualComponents/generalFunctions";
import { dietList, genderList, signList, smokeAndDrinkList } from "../../nonVisualComponents/Lists";
import * as SecureStore from "expo-secure-store";

const { width, height } = Dimensions.get("window");
const SNAP_POINTS = [-width * 1.5, 0, width * 1.5];
import { API, graphqlOperation } from "aws-amplify";
import { getMsgUser } from "../../src/graphql/queries";
import { CustomModal } from "../../visualComponents/customComponents";
import { NavigationContainer } from "@react-navigation/native";

export default Card = ({
	card,
	index,
	backFace,
	setPopupVisible,
	numberOfSuperLikes,
	myID,
	sesToken,
	indexOfFrontCard,
	incrementIndex,
	navigateFromCard,
	showMatchScreen,
	showReportPage,
	myProfilePicture,
	showLikeEndedModal,
	likeEnded,
	setTimer,
}) => {
	const progress = useSharedValue(0);
	const x = useSharedValue(0);
	const destination = useSharedValue(0);
	const turn = useSharedValue(1); // 1 => front, -1 => back

	const [likeFlag, setLikeFlag] = React.useState(false);
	const [backfaceIndex, setBackfaceIndex] = React.useState(0);

	const [matchPage, setMatchPage] = React.useState(false);
	const [reportPage, setReportPage] = React.useState(false);
	const [chosenReport, setChosenReport] = React.useState(0);

	const reportProfile = async () => {
		setReportPage(false);
		let abortController = new AbortController();
		const userDataStr = await SecureStore.getItemAsync("userData");
		const userData = JSON.parse(userDataStr);
		const userID = userData.UserId.toString();
		const myToken = userData.sesToken;
		try {
			await axios
				.post(
					url + "/report",
					{
						UserId: userID,
						sikayetEdilen: id,
						sikayetKodu: chosenReport,
						aciklama: "",
					},
					{ headers: { "access-token": myToken } }
				)
				.catch((err) => {
					console.log(err);
				});
			incrementIndex();
		} catch (error) {
			console.log(error);
		}
	};

	const {
		About: about,
		Alkol: drink,
		Beslenme: diet,
		Burc: sign,
		Din: religion,
		Gender: genderNo,
		Major: major,
		Name: name,
		School: university,
		Sigara: smoke,
		Surname: sName,
		UserId: id,
		photos: photoList,
		Birth_Date: bDay,
		interest: hobbies,
	} = card;

	const gender = getGender(genderNo);
	const age = getAge(bDay);

	const goToMsg = async () => {
		navigateFromCard();
	};

	const sendNotification = async () => {
		try {
			const userData = await API.graphql(graphqlOperation(getMsgUser, { id: id }));
			let response = fetch("https://exp.host/--/api/v2/push/send", {
				method: "POST",
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					to: userData.data.getMsgUser.pushToken,
					sound: "default",
					title: "Dorm",
					body: "Yeni bir eşleşmeniz var!",
				}),
			});
		} catch (e) {
			console.log(e);
		}
	};

	const checkText = (text) => {
		// return false if null
		if (text == "null" || text == null || text == "undefined" || text.length == 0 || text == 0)
			return false;
		return true;
	};

	const onSwipe = async (val) => {
		// val = 0 means "like" ; 1 means "superLike" ; 2 means "dislike"
		// if (likeEnded.value == false || val == 2) {
		await axios
			.post(
				url + "/LikeDislike",
				{
					isLike: val,
					userSwiped: myID,
					otherUser: id,
					matchMode: "0",
				},
				{ headers: { "access-token": sesToken } }
			)
			.then((res) => {
				console.log(res.data);
				if (res.data.LikeCount == 0) {
					likeEnded.value = true;
				}
				if (res.data.message == "Match") {
					console.log("send notification.");
					sendNotification();
					showMatchScreen(name, photoList[0]?.PhotoLink, myProfilePicture);
					//setMatchPage(true);
				}
				incrementIndex();
			})
			.catch((error) => {
				if (error.response) {
					if (error.response.status == 408) {
						likeEnded.value = true;
						console.log("swipe count ended response");
						let endTime = new Date(error.response.data);
						let currentTime = new Date(Date.now());
						let hourLeft = (endTime.getHours() - currentTime.getHours() + 24) % 24;
						let minuteLeft = (endTime.getMinutes() - currentTime.getMinutes() + 60) % 60;
						setTimer(hourLeft, minuteLeft);

						x.value = withSpring(0);
						destination.value = 0;
						showLikeEndedModal();
					}
				} else if (error.request) {
					console.log("request error: ", error.request);
				} else {
					console.log("error: ", error.message);
				}
			});
		// } else {
		// 	x.value = withSpring(0);
		// 	destination.value = 0;
		// 	showLikeEndedModal();
		// }
	};

	const panHandler =
		indexOfFrontCard == index
			? Gesture.Pan()
					.onUpdate((event) => {
						x.value = event.translationX;
					})
					.onEnd((event) => {
						destination.value = snapPoint(x.value, event.velocityX, SNAP_POINTS);
						x.value = withSpring(destination.value);
					})
					.onFinalize(() => {
						// TODO: decrease the daily number of likes by one if the value is greater than 0 and send the LIKED/DISLIKED data to backend
						destination.value > 0
							? runOnJS(onSwipe)(0)
							: destination.value < 0
							? runOnJS(onSwipe)(2)
							: null;
					})
			: Gesture.Pan();

	const tapHandler = Gesture.Tap()
		.numberOfTaps(2)
		.onStart(() => {
			if (indexOfFrontCard == index) {
				turn.value = withTiming(-turn.value);
				backFace.value = !backFace.value;
			}
		});

	const animatedFrontFace = useAnimatedStyle(() => {
		// if (index != indexOfFrontCard) return {};
		// if (index != 0) return {};
		return {
			transform: [
				{
					rotateY: `${interpolate(turn.value, [1, -1], [0, 180])}deg`,
				},
			],
		};
	});

	const animatedBackFace = useAnimatedStyle(() => {
		return {
			zIndex: turn.value == 1 ? -1 : 1,
			transform: [
				{
					rotateY: `${interpolate(turn.value, [1, -1], [180, 360])}deg`,
				},
			],
		};
	});

	const animatedSwipe = useAnimatedStyle(() => {
		// if (index != indexOfFrontCard) return {};
		// if (index != 0) return {};
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
		// if (index != indexOfFrontCard) return {};
		// if (index != 0) return {};
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
		// if (index != indexOfFrontCard) return {};
		// if (index != 0) return {};
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

	const animatedPhotoProgress = (index) =>
		useAnimatedStyle(() => {
			return {
				height: interpolate(progress.value - index, [-1, 0, 1], [8, 24, 8]),
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

	// const handleSuperlike = () => {
	// 	// TODO: send the like data to database and if the daily number of superlike is finished, show the popup
	// 	if (numberOfSuperLikes.value > 0) {
	// 		onSwipe(1);
	// 		setLikeFlag(true);
	// 		numberOfSuperLikes.value--;
	// 	} else {
	// 		setPopupVisible(true);
	// 	}
	// };

	const composedGesture = Gesture.Race(tapHandler, panHandler);

	return (
		<View key={index} style={{ position: "absolute", zIndex: index < indexOfFrontCard ? -1 : 1 }}>
			{indexOfFrontCard == index || indexOfFrontCard == index - 1 ? ( // front or the 2nd card
				<View name={"cards"} style={{ width: "100%", justifyContent: "center", zIndex: 1 }}>
					<Animated.View style={[animatedSwipe]}>
						<GestureDetector gesture={composedGesture}>
							<Animated.View>
								<Animated.View
									style={[
										commonStyles.photo,
										{
											height: Math.min(width * 1.35, height * 0.7),
											backfaceVisibility: "hidden",
										},
										animatedFrontFace,
									]}
								>
									{photoList?.length > 0 ? (
										<FlatList
											data={photoList}
											keyExtractor={(item) => {
												return item.Photo_Order;
											}}
											renderItem={({ item }) => {
												return (
													<View>
														<Image
															// key={item.index}
															source={{
																uri: item?.PhotoLink ?? "AAA",
															}}
															style={{
																aspectRatio: 1 / 1.5,
																height: Math.min(height * 0.7, width * 1.35),
																resizeMode: "cover",
																backgroundColor: colors.cool_gray,
															}}
														/>
													</View>
												);
											}}
											pagingEnabled={true}
											showsVerticalScrollIndicator={false}
											onScroll={handleScroll}
											initialNumToRender={2}
										/>
									) : (
										<View
											style={{
												width: "100%",
												height: "100%",
												justifyContent: "center",
												alignItems: "center",
											}}
										>
											<Ionicons name="person" color="white" size={width * 0.5} />
										</View>
									)}
									<View
										style={{
											position: "absolute",
											left: 20,
											top: 20,
											justifyContent: "space-between",
											minHeight: photoList?.length * 10 + 16,
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
														animatedPhotoProgress(index),
													]}
												/>
											);
										})}
									</View>
									<View style={{ position: "absolute", top: 20, right: 20 }}>
										<TouchableOpacity
											onPress={() => {
												//showMatchScreen(name, photoList[0]?.PhotoLink, myProfilePicture);
												showReportPage(id);
												//setReportPage(true);
												//setMatchPage(true);
											}}
										>
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
									<LinearGradient
										colors={["rgba(0,0,0,0.005)", " rgba(0,0,0,0.1)", "rgba(0,0,0,0.5)"]}
										locations={[0, 0.1, 1]}
										start={{ x: 0.5, y: 0 }}
										end={{ x: 0.5, y: 1 }}
										style={{
											minHeight: height * 0.12,
											width: "100%",
											position: "absolute",
											bottom: 0,
											paddingVertical: 10,
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
														fontSize: Math.min(35, width * 0.06),
														fontFamily: "PoppinsSemiBold",
														letterSpacing: 1.05,
													}}
												>
													{name} • {age}
													{/* Name • Age */}
												</Text>
												<Text
													style={{
														color: colors.white,
														fontSize: Math.min(24, width * 0.045),
														fontFamily: "PoppinsItalic",
														lineHeight: Math.min(27, width * 0.05),
													}}
												>
													{university}
													{"\n"}
													{major}
												</Text>
											</View>

											{/* <View
										style={{
											backgroundColor: colors.white,
											height: width * 0.16,
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
									</View> */}
										</View>
									</LinearGradient>
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
											backgroundColor: colors.cool_gray,
										},
										animatedBackFace,
									]}
								>
									<Image
										source={{
											uri:
												photoList?.length > 0
													? photoList[backfaceIndex]?.PhotoLink
													: "Nothing to see here",
										}}
										blurRadius={20}
										style={{
											position: "absolute",
											aspectRatio: 1 / 1.5,
											width: width * 0.9,
											maxHeight: height * 0.7,
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
									<ReactNative.ScrollView
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
											{checkText(gender) && (
												<Text
													name={"Gender"}
													style={{
														color: colors.light_gray,
														fontSize: 18,
														textAlign: "center",
														paddingVertical: 5,
													}}
												>
													Cinsiyet{"\n"}
													<Text style={{ fontFamily: "PoppinsSemiBold", fontSize: 22 }}>
														{gender}
													</Text>
												</Text>
											)}
											{checkText(religion) && (
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
													<Text style={{ fontFamily: "PoppinsSemiBold", fontSize: 22 }}>
														{religion}
													</Text>
												</Text>
											)}
											{checkText(sign) && (
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
													<Text style={{ fontFamily: "PoppinsSemiBold", fontSize: 22 }}>
														{signList[sign].choice}
													</Text>
												</Text>
											)}
											{checkText(diet) && (
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
													<Text style={{ fontFamily: "PoppinsSemiBold", fontSize: 22 }}>
														{dietList[diet].choice}
													</Text>
												</Text>
											)}
											{checkText(drink) && (
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
													<Text style={{ fontFamily: "PoppinsSemiBold", fontSize: 22 }}>
														{smokeAndDrinkList[drink].choice}
													</Text>
												</Text>
											)}
											{checkText(smoke) && (
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
													<Text style={{ fontFamily: "PoppinsSemiBold", fontSize: 22 }}>
														{smokeAndDrinkList[smoke].choice}
													</Text>
												</Text>
											)}
											{checkText(hobbies) && (
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
													{hobbies.map((item, index) => {
														return (
															<Text
																key={index}
																style={{ fontFamily: "PoppinsSemiBold", fontSize: 22 }}
															>
																{item.InterestName}
																{hobbies.length > index + 1 ? (
																	<Text style={{ fontFamily: "PoppinsSemiBold", fontSize: 22 }}>
																		{" "}
																		|{" "}
																	</Text>
																) : null}
															</Text>
														);
													})}
												</Text>
											)}
											{checkText(about) && (
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
													<Text style={{ fontFamily: "PoppinsSemiBold", fontSize: 22 }}>
														{about}
													</Text>
												</Text>
											)}
										</View>
									</ReactNative.ScrollView>
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
			) : (
				<View
					name={"cards"}
					style={{
						width: "100%",
						justifyContent: "center",
						zIndex: index < indexOfFrontCard ? -1 : 0,
						opacity: index < indexOfFrontCard ? 0 : 1,
					}}
				>
					<View
						style={[
							commonStyles.photo,
							{
								width: width * 0.9,
								maxHeight: height * 0.7,
								backfaceVisibility: "hidden",
							},
						]}
					>
						<Image
							key={index}
							source={{
								// uri: photoList[0]?.PhotoLink,
								uri: indexOfFrontCard + 1 == index ? photoList[0]?.PhotoLink ?? null : null,
							}}
							style={{
								height: "100%",
								width: "100%",
								resizeMode: "cover",
								backgroundColor: colors.cool_gray,
							}}
						/>
						<View
							style={{
								position: "absolute",
								left: 20,
								top: 20,
								justifyContent: "space-between",
								minHeight: photoList?.length * 10 + 16,
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
												height: index == 0 ? 24 : 8,
											},
											animatedPhotoProgress(index),
										]}
									/>
								);
							})}
						</View>

						<View style={{ position: "absolute", top: 20, right: 20 }}>
							<TouchableOpacity
								onPress={() => {
									setReportPage(true);
								}}
							>
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

						<LinearGradient
							colors={["rgba(0,0,0,0.005)", " rgba(0,0,0,0.1)", "rgba(0,0,0,0.5)"]}
							locations={[0, 0.1, 1]}
							start={{ x: 0.5, y: 0 }}
							end={{ x: 0.5, y: 1 }}
							style={{
								minHeight: height * 0.12,
								width: "100%",
								position: "absolute",
								bottom: 0,
								paddingVertical: 10,
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
											fontFamily: "PoppinsSemiBold",
											letterSpacing: 1.05,
										}}
									>
										{name} • {age}
									</Text>
									<Text
										style={{
											color: colors.white,
											fontSize: width * 0.045,
											fontFamily: "PoppinsItalic",
											lineHeight: width * 0.05,
										}}
									>
										{university}
										{"\n"}
										{major}
									</Text>
								</View>

								{/* <View
											style={{
												backgroundColor: colors.white,
												height: width * 0.16,
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
										</View> */}
							</View>
						</LinearGradient>
					</View>
				</View>
			)}
			{/* Match Page Modal */}
			<CustomModal
				visible={matchPage}
				onRequestClose={() => {
					setMatchPage(false);
				}}
				onDismiss={() => {
					setMatchPage(false);
				}}
			>
				<View
					style={{
						height: height,
						width: width,
						top: 0,
						left: 0,
						right: 0,
						bottom: 0,
						position: "absolute",
						justifyContent: "center",
						alignItems: "center",
						alignContent: "center",
					}}
				>
					<View
						style={{
							height: height * 0.95,
							width: width * 0.95,
							backgroundColor: colors.white,
						}}
					>
						<GradientText
							style={{
								fontSize: 26,
								fontWeight: "bold",
								textAlign: "center",
								paddingVertical: height * 0.02,
							}}
							text={"Hey! \n Eşleştiniz"}
						/>
						<Text
							style={{
								fontSize: 23,
								fontFamily: "Poppins",
								color: colors.medium_gray,
								textAlign: "center",
								paddingVertical: height * 0.02,
							}}
						>
							{name} {"&"} Sen
						</Text>
						<Image
							source={{
								uri: photoList[0].PhotoLink,
							}}
							style={{
								top: height * 0.25,
								left: width * 0.12,
								borderRadius: 20,
								position: "absolute",
								aspectRatio: 1 / 1.5,
								width: width * 0.4,
								maxHeight: height * 0.7,
								resizeMode: "cover",
								transform: [{ rotateZ: "-18deg" }],
								zIndex: 2,
							}}
						/>
						<Image
							source={{
								uri: myProfilePicture,
							}}
							style={{
								top: height * 0.3,
								left: width * 0.4,
								borderRadius: 20,
								position: "absolute",
								aspectRatio: 1 / 1.5,
								width: width * 0.4,
								maxHeight: height * 0.7,
								resizeMode: "cover",
								transform: [{ rotateZ: "23deg" }],
							}}
						/>
						<Text
							style={{
								paddingTop: height * 0.425,
								fontSize: 16,
								fontFamily: "Poppins",
								color: colors.medium_gray,
								textAlign: "center",
								paddingHorizontal: 5,
							}}
						>
							“Merhaba!” demek için dışarıda karşılaşmayı bekleme.
						</Text>

						<ReactNative.TouchableOpacity
							onPress={() => {
								setMatchPage(false);
								//goToMsg();
							}}
							style={{
								paddingTop: 10,
								maxWidth: "100%",
								overflow: "hidden",
								justifyContent: "center",
								alignItems: "center",
							}}
						>
							<Gradient
								style={{
									justifyContent: "center",
									alignItems: "center",
									width: "80%",
									borderRadius: 12,
								}}
							>
								<Text
									style={{
										color: colors.white,
										fontSize: 18,
										fontFamily: "PoppinsSemiBold",
										padding: 10,
									}}
								>
									Mesaj Gönder
								</Text>
							</Gradient>
						</ReactNative.TouchableOpacity>
						<ReactNative.TouchableOpacity
							style={{
								paddingTop: 5,
							}}
							onPress={async () => {
								await setMatchPage(false);
							}}
						>
							<GradientText
								style={{
									fontSize: 18,
									fontFamily: "Poppins",
									fontWeight: "bold",
									textAlign: "center",
									paddingVertical: height * 0.02,
								}}
								text={"Daha sonra"}
							/>
						</ReactNative.TouchableOpacity>
					</View>
				</View>
			</CustomModal>
			{/* Match Page Modal */}

			{/* Report Page Modal */}

			<CustomModal
				visible={reportPage}
				dismiss={() => {
					setReportPage(false);
				}}
			>
				<View
					style={{
						maxWidth: width * 0.9,
						height: height * 0.9,
						backgroundColor: colors.white,
						borderRadius: 10,
						paddingHorizontal: 36,
					}}
				>
					<View
						style={{
							width: "100%",
							marginTop: 20,
						}}
					>
						<View
							style={{
								flexDirection: "row",
								width: "100%",
								alignContent: "center",
								justifyContent: "center",
								marginVertical: 10,
							}}
						>
							<Image
								style={{ left: width * 0.1, alignSelf: "center" }}
								source={require("../../assets/report.png")}
							/>
							<View
								style={{
									left: width * 0.2,
								}}
							>
								<TouchableOpacity
									onPress={() => {
										setReportPage(false);
									}}
									style={{
										alignSelf: "flex-end",
										padding: 16,
										zIndex: 5,
									}}
								>
									<Text style={{ fontSize: 22, color: colors.medium_gray }}>İptal</Text>
								</TouchableOpacity>
							</View>
						</View>
						<View
							style={{
								flexDirection: "row",
								width: "100%",
								alignItems: "center",
								justifyContent: "center",
								marginVertical: 5,
							}}
						>
							<Text
								style={{
									color: colors.black,
									fontSize: 20,
									lineHeight: 24,
									fontFamily: "PoppinsSemiBold",
									fontWeight: "500",
								}}
							>
								Bildirmek istiyor musun ?
							</Text>
						</View>
						<View
							style={{
								flexDirection: "row",
								width: "100%",
								alignItems: "center",
								justifyContent: "center",
								marginVertical: 10,
							}}
						>
							<Text
								style={{
									color: colors.dark_gray,
									fontSize: 13,
									fontFamily: "Poppins",
									fontWeight: "400",
									textAlign: "center",
								}}
							>
								{name} adlı kişiyi bildiriyorsun. Bunu ona söylemeyeceğiz.
							</Text>
						</View>
						<TouchableOpacity
							onPress={() => {
								chosenReport == 1 ? setChosenReport(0) : setChosenReport(1);
							}}
							style={{
								maxWidth: "100%",

								borderRadius: 12,
								overflow: "hidden",
								justifyContent: "center",
								alignItems: "center",
								borderColor: colors.black,
								borderWidth: 1,
								marginBottom: 10,
							}}
						>
							{chosenReport == 1 ? (
								<GradientText
									text={"Sahte Profil/Spam"}
									style={{ fontSize: 18, fontWeight: "bold", padding: 5 }}
								/>
							) : (
								<Text style={{ fontSize: 18, fontWeight: "bold", padding: 5 }}>
									Sahte Profil/Spam
								</Text>
							)}
						</TouchableOpacity>
						<TouchableOpacity
							onPress={() => {
								chosenReport == 2 ? setChosenReport(0) : setChosenReport(2);
							}}
							style={{
								maxWidth: "100%",
								borderRadius: 12,
								overflow: "hidden",
								justifyContent: "center",
								alignItems: "center",
								borderColor: colors.black,
								borderWidth: 1,
								marginBottom: 10,
							}}
						>
							{chosenReport == 2 ? (
								<GradientText
									text={"Uygunsuz Mesaj"}
									style={{ fontSize: 18, fontWeight: "bold", padding: 5 }}
								/>
							) : (
								<Text style={{ fontSize: 18, fontWeight: "bold", padding: 5 }}>Uygunsuz Mesaj</Text>
							)}
						</TouchableOpacity>
						<TouchableOpacity
							onPress={() => {
								chosenReport == 3 ? setChosenReport(0) : setChosenReport(3);
							}}
							style={{
								maxWidth: "100%",

								borderRadius: 12,
								overflow: "hidden",
								justifyContent: "center",
								alignItems: "center",
								borderColor: colors.black,
								borderWidth: 1,
								marginBottom: 10,
							}}
						>
							{chosenReport == 3 ? (
								<GradientText
									text={"Uygunsuz Fotoğraf"}
									style={{ fontSize: 18, fontWeight: "bold", padding: 5 }}
								/>
							) : (
								<Text style={{ fontSize: 18, fontWeight: "bold", padding: 5 }}>
									Uygunsuz Fotoğraf
								</Text>
							)}
						</TouchableOpacity>
						<TouchableOpacity
							onPress={() => {
								chosenReport == 4 ? setChosenReport(0) : setChosenReport(4);
							}}
							style={{
								maxWidth: "100%",

								borderRadius: 12,
								overflow: "hidden",
								justifyContent: "center",
								alignItems: "center",
								borderColor: colors.black,
								borderWidth: 1,
								marginBottom: 10,
							}}
						>
							{chosenReport == 4 ? (
								<GradientText
									text={"Uygunsuz Biyografi"}
									style={{ fontSize: 18, fontWeight: "bold", padding: 5 }}
								/>
							) : (
								<Text style={{ fontSize: 18, fontWeight: "bold", padding: 5 }}>
									Uygunsuz Biyografi
								</Text>
							)}
						</TouchableOpacity>
						<TouchableOpacity
							onPress={() => {
								chosenReport == 5 ? setChosenReport(0) : setChosenReport(5);
							}}
							style={{
								maxWidth: "100%",

								borderRadius: 12,
								overflow: "hidden",
								justifyContent: "center",
								alignItems: "center",
								borderColor: colors.black,
								borderWidth: 1,
								marginBottom: 10,
							}}
						>
							{chosenReport == 5 ? (
								<GradientText
									text={"Reşit olmayan kullanıcı"}
									style={{ fontSize: 18, fontWeight: "bold", padding: 5 }}
								/>
							) : (
								<Text style={{ fontSize: 18, fontWeight: "bold", padding: 5 }}>
									Reşit Olmayan Kullanıcı
								</Text>
							)}
						</TouchableOpacity>
						<TouchableOpacity
							onPress={() => {
								chosenReport == 6 ? setChosenReport(0) : setChosenReport(6);
							}}
							style={{
								maxWidth: "100%",

								borderRadius: 12,
								overflow: "hidden",
								justifyContent: "center",
								alignItems: "center",
								borderColor: colors.black,
								borderWidth: 1,
								marginBottom: 10,
							}}
						>
							{chosenReport == 6 ? (
								<GradientText
									text={"Diğer"}
									style={{ fontSize: 18, fontWeight: "bold", padding: 5 }}
								/>
							) : (
								<Text style={{ fontSize: 18, fontWeight: "bold", padding: 5 }}>Diğer</Text>
							)}
						</TouchableOpacity>

						<TouchableOpacity
							onPress={reportProfile}
							style={{
								maxWidth: "100%",

								borderRadius: 12,
								overflow: "hidden",
								marginTop: 20,
								justifyContent: "center",
								alignItems: "center",
							}}
						>
							<Gradient
								style={{
									justifyContent: "center",
									alignItems: "center",
									width: "100%",
								}}
							>
								<Text
									style={{
										color: colors.white,
										fontSize: 22,
										fontFamily: "PoppinsSemiBold",
										padding: 10,
									}}
								>
									Bildir
								</Text>
							</Gradient>
						</TouchableOpacity>
					</View>
				</View>
			</CustomModal>
			{/* Report Page Modal */}
		</View>
	);
};
