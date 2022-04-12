import React from "react";
import ReactNative, { View, Text, Image, Dimensions } from "react-native";
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
	withDelay,
	withSpring,
	withTiming,
} from "react-native-reanimated";
import { snapPoint } from "react-native-redash";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

import commonStyles from "../../visualComponents/styles";
import { colors, Gradient } from "../../visualComponents/colors";
import axios from "axios";
import { url } from "../../connection";
import { getAge, getGender } from "../../nonVisualComponents/generalFunctions";

const { width, height } = Dimensions.get("window");
const SNAP_POINTS = [-width * 1.5, 0, width * 1.5];
import { API, graphqlOperation } from "aws-amplify";
import { getMsgUser } from "../../src/graphql/queries";

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
}) => {
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
		Gender: genderNo,
		Major: major,
		Name: fName,
		School: university,
		Sigara: smoke,
		Surname: sName,
		UserId: id,
		photos: photoList,
		Birth_Date: bDay,
		interest: hobbies,
	} = card;

	// console.log(`name: ${fName}\nindex: ${index}\nindex of first card: ${indexOfFrontCard}\n\n`);

	const name = fName + " " + sName;
	const gender = getGender(genderNo);
	const age = getAge(bDay);

	const sendNotification = async () => {
		try {
			const userData = await API.graphql(graphqlOperation(getMsgUser, { id: id }));
			console.log("++++++++++++++++++++++++++");
			console.log(userData.data);
			console.log("++++++++++++++++++++++++++");
			console.log(userData.data.getMsgUser.pushToken);
			console.log("++++++++++++++++++++++++++");
			console.log(userData.data.getMsgUser.id);
			console.log("++++++++++++++++++++++++++");

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
		if (text == "null" || text == null || text == "undefined" || text.length == 0) return false;
		return true;
	};

	const onSwipe = async (val) => {
		// val = 0 means "like" ; 1 means "superLike" ; 2 means "dislike"
		incrementIndex();
		await axios
			.post(
				url + "/LikeDislike",
				{
					isLike: val,
					userSwiped: myID,
					otherUser: id,
				},
				{ headers: { "access-token": sesToken } }
			)
			.then((res) => {
				console.log("******************");
				console.log(res.data);
				if (res.data == "match") {
					console.log("send notification.");
					sendNotification();
					alert("Bu kişi ile eşleştiniz! (bu sayfa yapım aşamasında)");
				}
				console.log("******************");
			})
			.catch((error) => {
				//console.log(error);
			});
	};

	const panHandler = Gesture.Pan()
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
		});

	const tapHandler = Gesture.Tap()
		.numberOfTaps(2)
		.onStart(() => {
			turn.value = withTiming(-turn.value);
			backFace.value = !backFace.value;
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
			{indexOfFrontCard == index ? (
				<View name={"cards"} style={{ width: "100%", justifyContent: "center", zIndex: 1 }}>
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
									{photoList.length > 0 ? (
										<ScrollView
											scrollEventThrottle={16}
											style={{ width: "100%" }}
											pagingEnabled={true}
											showsVerticalScrollIndicator={false}
											onScroll={handleScroll}
										>
											{photoList.map((item, idx) => {
												// console.log("In Map: ", item);
												return (
													<Image
														key={idx}
														source={{
															uri: item?.PhotoLink ?? "AAA",
														}}
														style={{
															height: width * 1.35,
															maxHeight: height * 0.7,
															resizeMode: "cover",
															backgroundColor: colors.cool_gray,
														}}
													/>
												);
											})}
										</ScrollView>
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
														animatedPhotoProgress(index),
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
													{/* Name • Age */}
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
								</Animated.View>

								{/* PART: backface */}
								<Animated.View
									name={"backface"}
									style={[
										commonStyles.photo,
										{
											width: width * 0.9,
											maxHeight: height * 0.7,
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
												photoList.length > 0
													? photoList[backfaceIndex].PhotoLink
													: "Nothing to see here",
										}}
										blurRadius={20}
										style={{
											position: "absolute",
											aspectRatio: 1 / 1.5,
											maxHeight: height * 0.7,
											width: width * 0.9,
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
														{sign}
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
														{diet}
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
														{drink}
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
														{smoke}
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
												height: index == 0 ? 24 : 8,
											},
											animatedPhotoProgress(index),
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
		</View>
	);
};
