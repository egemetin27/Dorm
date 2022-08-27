import React, { useContext } from "react";
import { View, Text, Image, Dimensions, Alert } from "react-native";
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
	useAnimatedStyle,
	useSharedValue,
	withDelay,
	withSpring,
	withTiming,
} from "react-native-reanimated";
import { snapPoint } from "react-native-redash";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BlurView } from "expo-blur";

import commonStyles from "../../visualComponents/styles";
import { colors, Gradient, GradientText } from "../../visualComponents/colors";
import axios from "axios";
import url from "../../connection";
import { getGender } from "../../nonVisualComponents/generalFunctions";
import { getAge } from "../../utils/date.utils";
import { dietList, signList, smokeAndDrinkList } from "../../nonVisualComponents/Lists";

const { width, height } = Dimensions.get("window");
const SNAP_POINTS = [-width * 1.5, 0, width * 1.5];
import { AuthContext } from "../../contexts/auth.context";
import { Session } from "../../nonVisualComponents/SessionVariables";
import { getTimeDiff } from "../../nonVisualComponents/generalFunctions";

import crypto from "../../functions/crypto";
import CustomImage from "../../components/custom-image.component";

export default Card = React.memo(
	({
		card,
		eventId,
		eventName,
		index,
		idxForMainPage,
		backFace,
		myID,
		sesToken,
		indexOfFrontCard,
		incrementIndex,
		showReportPage,
		myProfilePicture,
		showLikeEndedModal,
		isScrollShowed,
		matchMode,
		showMatchScreen,
		length,
		refreshList,
	}) => {
		const { user, signOut, setPeopleIndex } = useContext(AuthContext);
		const progress = useSharedValue(0);
		const x = useSharedValue(0);
		const destination = useSharedValue(0);
		const turn = useSharedValue(1); // 1 => front, -1 => back

		const [likeFlag, setLikeFlag] = React.useState(false);
		const [backfaceIndex, setBackfaceIndex] = React.useState(0);

		const About = card?.About ?? "";
		const drink = card?.Alkol ?? "";
		const diet = card?.Beslenme ?? "";
		const sign = card?.Burc ?? "";
		const religion = card?.Din ?? "";
		const genderNo = card?.Gender ?? "";
		const major = card?.Major ?? "";
		const name = card?.Name ?? "";
		const university = card?.School ?? "";
		const smoke = card?.Sigara ?? "";
		const id = card?.UserId ?? "";
		const photoList = card?.photos ?? "";
		const bDay = card?.Birth_Date ?? "";
		const hobbies = card?.interest ?? "";

		const {
			// About = "",
			// Alkol: drink = "",
			// Beslenme: diet = "",
			// Burc: sign = "",
			// Din: religion = " ",
			// Gender: genderNo = 0,
			// Major: major = "",
			// Name: name = "",
			// School: university = "",
			// Sigara: smoke = "",
			// Surname: sName,
			// userId: id = 0,
			// photos: photoList = [],
			// Birth_Date: bDay = "",
			// interest: hobbies = [],
		} = card;

		const gender = getGender(genderNo);
		const age = getAge(bDay);

		const photoListRef = React.useRef();

		React.useEffect(() => {
			let abortController = new AbortController();
			return () => {
				abortController.abort();
			};
		});

		// React.useEffect(async () => {
		// 	if (photoList.length > 0) {
		// 		photoList.map(async (item, index) => {
		// 			await Image.prefetch(item?.PhotoLink);
		// 		});
		// 	}
		// }, []);

		const scroll = () => {
			if (photoListRef.current) {
				setTimeout(() => {
					// scrollDown();
					photoListRef.current.scrollToIndex({ index: 0.4 });
				}, 200);
				setTimeout(() => {
					// scrollUp();
					photoListRef.current.scrollToIndex({ index: 0 });
				}, 600);
			}
		};
		const checkScrollNeeded = async () => {
			if (index == indexOfFrontCard.value && !isScrollShowed && photoList.length > 1) {
				scroll();
				if (Session.ScrollNumber + 1 == 10) {
					AsyncStorage.removeItem("scrollNotShowed");
					Session.ScrollShown = true;
					return;
				}
				Session.ScrollNumber += 1;
				AsyncStorage.setItem("scrollNotShowed", Session.ScrollNumber.toString());
			}
		};

		const checkText = (text) => {
			// return false if null
			if (text == "null" || text == null || text == "undefined" || text.length == 0 || text == 0)
				return false;
			return true;
		};

		const onSwipe = async (val) => {
			// 0 = like, 1 = super like, 2 =  dislike
			backFace.value = false;
			setPeopleIndex(idxForMainPage+1);
			if (val == 0 && Session.LikeCount == 0 && getTimeDiff(user.SwipeRefreshTime)) {
				x.value = withSpring(0);
				destination.value = 0;

				const time = getTimeDiff(user.SwipeRefreshTime);
				showLikeEndedModal(time.hour, time.minute);
				return;
			}
			const likeDislike = crypto.encrypt({
				isLike: val,
				userSwiped: myID,
				otherUser: id,
				matchMode,
				eventId,
				eventName,
			});

			axios
				.post(url + "/LikeDislike", likeDislike, {
					headers: { "access-token": user.sesToken },
				})
				.then((res) => {
					console.log(res.data);
					// if (res.data.LikeCount == 0) {
					// 	user.SwipeRefreshTime = normalizeTime(Date.now());
					// 	Session.LikeCount = 0;
					// }

					if (res.data.message == "Match") {
						showMatchScreen(name, photoList[0]?.PhotoLink, myProfilePicture);
						console.log("send notification.");
					}

					if (index == length - 1) {
						setTimeout(refreshList, 100);
						return;
					}

					incrementIndex();
				})
				.catch((error) => {
					if (error.response) {
						console.log(error.response);
						if (error.response.status == 410) {
							Alert.alert("Oturumunuzun süresi doldu!");
							signOut();
						}
						if (error.response.status == 408) {
							// console.log("swipe count ended response");
							user.SwipeRefreshTime = error.response.data;
							Session.LikeCount = 0;

							const time = getTimeDiff(error.response.data);
							showLikeEndedModal(time.hour, time.minute);

							x.value = withSpring(0);
							destination.value = 0;
						}
						return;
					} else if (error.request) {
						console.log("request error: ", error.request);
					} else {
						console.log("error: ", error.message);
					}
					incrementIndex();
				});
		};

		const panHandler = React.useMemo(() =>
			Gesture.Pan()
				.onUpdate((event) => {
					if (indexOfFrontCard.value == index) {
						// if (index == 1) {
						x.value = event.translationX;
					}
				})
				.onEnd((event) => {
					if (indexOfFrontCard.value == index) {
						// if (index == 1) {
						destination.value = snapPoint(x.value, event.velocityX, SNAP_POINTS);
						x.value = withSpring(destination.value);
						destination.value > 0
							? runOnJS(onSwipe)(0)
							: destination.value < 0
							? runOnJS(onSwipe)(2)
							: null;
					}
				})
		);

		const tapHandler = React.useMemo(() =>
			Gesture.Tap()
				.numberOfTaps(2)
				.onStart(() => {
					if (indexOfFrontCard.value == index) {
						// if (index == 1) {
						turn.value = withTiming(-turn.value);
						backFace.value = !backFace.value;
					}
				})
		);

		const animatedFrontFace = useAnimatedStyle(() => {
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
				transform: [
					{
						translateX:
							x.value > 0
								? interpolate(x.value, [0, width], [0, -width / 2 - 60], Extrapolate.CLAMP)
								: 0,
					},
					{
						scale:
							x.value > 0 ? interpolate(x.value, [0, width / 2], [0, 2], Extrapolate.CLAMP) : 0,
					},
				],
				opacity: interpolate(x.value, [width * 0.95, width], [1, 0]),
			};
		});

		const animatedDislike = useAnimatedStyle(() => {
			return {
				transform: [
					{
						translateX:
							x.value < 0
								? interpolate(x.value, [0, -width], [0, width / 2 + 60], Extrapolate.CLAMP)
								: 0,
					},
					{
						scale:
							x.value < 0 ? interpolate(-x.value, [0, width / 2], [0, 2], Extrapolate.CLAMP) : 0,
					},
				],
				opacity: interpolate(x.value, [-width * 0.95, -width], [1, 0]),
			};
		});

		const animatedPhotoProgress1 = useAnimatedStyle(() => {
			return {
				height: interpolate(progress.value, [0, 1], [24, 8]),
				display: photoList?.length > 0 ? "flex" : "none",
			};
		});

		const animatedPhotoProgress2 = useAnimatedStyle(() => {
			return {
				height: interpolate(progress.value, [0, 1, 2], [8, 24, 8]),
				display: photoList?.length > 1 ? "flex" : "none",
			};
		});

		const animatedPhotoProgress3 = useAnimatedStyle(() => {
			return {
				height: interpolate(progress.value, [1, 2, 3], [8, 24, 8]),
				display: photoList?.length > 2 ? "flex" : "none",
			};
		});

		const animatedPhotoProgress4 = useAnimatedStyle(() => {
			return {
				height: interpolate(progress.value, [2, 3], [8, 24]),
				display: photoList?.length > 3 ? "flex" : "none",
			};
		});

		const handleScroll = ({ nativeEvent }) => {
			progress.value = nativeEvent.contentOffset.y / nativeEvent.layoutMeasurement.height;
		};

		const animatedWrapper = useAnimatedStyle(() => {
			return {
				// zIndex: withTiming(interpolate(index, [0, 1, 2], [-1, 1, -1])),
				// display: index >= 0 && index <= 2 ? "flex" : "none",
				zIndex: withTiming(interpolate(indexOfFrontCard.value - index, [-1, 0, 1], [-1, 1, -1])),
				display:
					indexOfFrontCard.value <= index + 1 && indexOfFrontCard.value >= index - 1
						? "flex"
						: "none",
			};
		});

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
			<Animated.View key={index} style={[{ width: "100%" }, animatedWrapper]}>
				{/* {indexOfFrontCard.value <= index + 1 &&
				indexOfFrontCard.value >= index - 1 && ( // front or the 2nd card */}
				<Animated.View
					name={"cards"}
					style={{
						width: "100%",
						position: "absolute",
						justifyContent: "center",
					}}
				>
					<Animated.View style={[animatedSwipe]}>
						<GestureDetector gesture={composedGesture}>
							<Animated.View>
								<Animated.View
									style={[
										commonStyles.photo,
										{
											height: Math.min(width * 1.35, height * 0.7),
											backfaceVisibility: "visible",
											// backfaceVisibility: "hidden",
											elevation: 0,
										},
										animatedFrontFace,
									]}
								>
									{photoList?.length > 0 ? (
										<FlatList
											ref={photoListRef}
											data={photoList}
											onLayout={async () => {
												await checkScrollNeeded();
											}}
											keyExtractor={(item) => {
												return item.Photo_Order;
											}}
											renderItem={({ item }) => {
												return (
													<View>
														<CustomImage
															url={item?.PhotoLink ?? "AAA"}
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
									<Animated.View
										style={[
											{
												backfaceVisibility: "hidden",
												position: "absolute",
												left: 20,
												top: 20,
											},
											animatedFrontFace,
										]}
									>
										<Animated.View
											style={[
												{
													backgroundColor: colors.white,
													elevation: 10,
													minHeight: 8,
													maxHeight: 24,
													width: 8,
													borderRadius: 4,
												},
												animatedPhotoProgress1,
											]}
										/>
										<Animated.View
											style={[
												{
													backgroundColor: colors.white,
													elevation: 10,
													minHeight: 8,
													maxHeight: 24,
													width: 8,
													borderRadius: 4,
													marginTop: 4,
												},
												animatedPhotoProgress2,
											]}
										/>
										<Animated.View
											style={[
												{
													backgroundColor: colors.white,
													elevation: 10,
													minHeight: 8,
													maxHeight: 24,
													width: 8,
													borderRadius: 4,
													marginTop: 4,
												},
												animatedPhotoProgress3,
											]}
										/>
										<Animated.View
											style={[
												{
													backgroundColor: colors.white,
													elevation: 10,
													minHeight: 8,
													maxHeight: 24,
													width: 8,
													borderRadius: 4,
													marginTop: 4,
												},
												animatedPhotoProgress4,
											]}
										/>
									</Animated.View>
									<Animated.View
										style={[
											{ position: "absolute", top: 20, right: 20, backfaceVisibility: "hidden" },
											animatedFrontFace,
										]}
									>
										<TouchableOpacity
											onPress={() => {
												showReportPage(id);
											}}
										>
											{/* <Text
												style={{
													textShadowColor: colors.black,
													textShadowRadius: 8,
													textShadowOffset: { width: 0, height: 0 },
												}}
											>
												<MaterialIcons name="outlined-flag" size={30} color={colors.white} />
											</Text> */}
											<Image
												style={{
													height: 25,
													tintColor: colors.white,
													resizeMode: "contain",
												}}
												source={require("../../assets/report.png")}
											/>
										</TouchableOpacity>
									</Animated.View>
									<LinearGradient
										colors={["rgba(0,0,0,0.005)", " rgba(0,0,0,0.1)", "rgba(0,0,0,0.7)"]}
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
										<Animated.View
											style={[
												{
													width: "100%",
													height: "100%",
													flexDirection: "row",
													alignItems: "center",
													justifyContent: "space-between",
													paddingHorizontal: 20,
													backfaceVisibility: "hidden",
												},
												animatedFrontFace,
											]}
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
										</Animated.View>
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
											backgroundColor: "transparent",
											// backgroundColor: colors.cool_gray,
											elevation: 0,
										},
										animatedBackFace,
									]}
								>
									<BlurView
										intensity={100}
										tint="dark"
										style={{ width: "100%", height: "100%", position: "absolute" }}
									/>
									{/* <ReactNative.ScrollView */}
									<ScrollView
										showsVerticalScrollIndicator={false}
										style={{
											zIndex: 5,
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
														fontSize: Math.min(height * 0.025, width * 0.04),
														textAlign: "center",
														paddingVertical: 5,
													}}
												>
													Cinsiyet{"\n"}
													<Text
														style={{
															fontFamily: "PoppinsSemiBold",
															fontSize: Math.min(height * 0.03, width * 0.048),
														}}
													>
														{gender}
													</Text>
												</Text>
											)}
											{checkText(religion) && (
												<Text
													name={"Religion"}
													style={{
														color: colors.light_gray,
														fontSize: Math.min(height * 0.025, width * 0.04),
														textAlign: "center",
														paddingVertical: 5,
													}}
												>
													Dini İnanç{"\n"}
													<Text
														style={{
															fontFamily: "PoppinsSemiBold",
															fontSize: Math.min(height * 0.03, width * 0.048),
														}}
													>
														{religion}
													</Text>
												</Text>
											)}
											{checkText(sign) && (
												<Text
													name={"Sign"}
													style={{
														color: colors.light_gray,
														fontSize: Math.min(height * 0.025, width * 0.04),
														textAlign: "center",
														paddingVertical: 5,
													}}
												>
													Burç{"\n"}
													<Text
														style={{
															fontFamily: "PoppinsSemiBold",
															fontSize: Math.min(height * 0.03, width * 0.048),
														}}
													>
														{signList[sign].choice}
													</Text>
												</Text>
											)}
											{checkText(diet) && (
												<Text
													name={"Diet"}
													style={{
														color: colors.light_gray,
														fontSize: Math.min(height * 0.025, width * 0.04),
														textAlign: "center",
														paddingVertical: 5,
													}}
												>
													Beslenme Tercihi{"\n"}
													<Text
														style={{
															fontFamily: "PoppinsSemiBold",
															fontSize: Math.min(height * 0.03, width * 0.048),
														}}
													>
														{dietList[diet].choice}
													</Text>
												</Text>
											)}
											{checkText(drink) && (
												<Text
													name={"Drink"}
													style={{
														color: colors.light_gray,
														fontSize: Math.min(height * 0.025, width * 0.04),
														textAlign: "center",
														paddingVertical: 5,
													}}
												>
													Alkol Kullanımı{"\n"}
													<Text
														style={{
															fontFamily: "PoppinsSemiBold",
															fontSize: Math.min(height * 0.03, width * 0.048),
														}}
													>
														{smokeAndDrinkList[drink].choice}
													</Text>
												</Text>
											)}
											{checkText(smoke) && (
												<Text
													name={"Smoke"}
													style={{
														color: colors.light_gray,
														fontSize: Math.min(height * 0.025, width * 0.04),
														textAlign: "center",
														paddingVertical: 5,
													}}
												>
													Sigara Kullanımı{"\n"}
													<Text
														style={{
															fontFamily: "PoppinsSemiBold",
															fontSize: Math.min(height * 0.03, width * 0.048),
														}}
													>
														{smokeAndDrinkList[smoke].choice}
													</Text>
												</Text>
											)}
											{checkText(hobbies) && (
												<Text
													name={"Hobbies"}
													style={{
														color: colors.light_gray,
														fontSize: Math.min(height * 0.025, width * 0.04),
														textAlign: "center",
														paddingVertical: 5,
													}}
												>
													İlgi Alanları{"\n"}
													{hobbies.map((item, index) => {
														return (
															<Text
																key={index}
																style={{
																	fontFamily: "PoppinsSemiBold",
																	fontSize: Math.min(height * 0.03, width * 0.048),
																}}
															>
																{item.InterestName}
																{hobbies.length > index + 1 ? (
																	<Text
																		style={{
																			fontFamily: "PoppinsSemiBold",
																			fontSize: Math.min(height * 0.03, width * 0.048),
																		}}
																	>
																		{" "}
																		|{" "}
																	</Text>
																) : null}
															</Text>
														);
													})}
												</Text>
											)}
											{checkText(About) && (
												<Text
													name={"About"}
													style={{
														color: colors.light_gray,
														fontSize: Math.min(height * 0.025, width * 0.04),
														textAlign: "center",
														paddingVertical: 5,
													}}
												>
													Hakkında{"\n"}
													<Text
														style={{
															fontFamily: "PoppinsSemiBold",
															fontSize: Math.min(height * 0.03, width * 0.048),
														}}
													>
														{About}
													</Text>
												</Text>
											)}
										</View>
									</ScrollView>
									{/* </ReactNative.ScrollView> */}
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
				</Animated.View>
				{/* )} */}
			</Animated.View>
		);
	}
);
