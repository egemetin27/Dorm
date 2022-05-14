import React from "react";
import ReactNative, {
	View,
	Text,
	Image,
	Dimensions,
	Modal,
	RefreshControlBase,
	Alert,
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
import AsyncStorage from "@react-native-async-storage/async-storage";

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
import { AuthContext } from "../../nonVisualComponents/Context";

import { ConsoleLogger } from "@aws-amplify/core";

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
	setTimer,
	isScrollShowed,
	setScrollShowed,
	matchMode,
}) => {
	const progress = useSharedValue(0);
	const x = useSharedValue(0);
	const destination = useSharedValue(0);
	const turn = useSharedValue(1); // 1 => front, -1 => back

	const [likeFlag, setLikeFlag] = React.useState(false);
	const [backfaceIndex, setBackfaceIndex] = React.useState(0);

	const [matchPage, setMatchPage] = React.useState(false);
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

	const photoListRef = React.useRef();

	const { signOut } = React.useContext(AuthContext);

	React.useEffect(() => {
		let abortController = new AbortController();
		return () => {
			abortController.abort();
		};
	});

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
		if (index == indexOfFrontCard && !isScrollShowed && photoList.length > 1) {
			await AsyncStorage.getItem("scrollNotShowed").then((res) => {
				// console.log(res);
				scroll();
				let newValue = parseInt(res) + 1;
				if (newValue == 10) {
					AsyncStorage.removeItem("scrollNotShowed");
					setScrollShowed(true);
				} else {
					AsyncStorage.setItem("scrollNotShowed", newValue.toString());
				}
			});
		}
	};

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
		// const userDataStr = await SecureStore.getItemAsync("userData");
		// const userData = JSON.parse(userDataStr);
		// const myMode = userData.matchMode;
		// val = 0 means "like" ; 1 means "superLike" ; 2 means "dislike"
		backFace.value = false;
		axios
			.post(
				url + "/LikeDislike",
				{
					isLike: val,
					userSwiped: myID,
					otherUser: id,
					matchMode: matchMode,
					// matchMode: myMode,
				},
				{ headers: { "access-token": sesToken } }
			)
			.then((res) => {
				console.log(res.data);

				if (res.data.message == "Match") {
					showMatchScreen(name, photoList[0]?.PhotoLink, myProfilePicture);
					console.log("send notification.");
					sendNotification();
					//setMatchPage(true);
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
						console.log("swipe count ended response");
						let endTime = new Date(error.response.data);
						let currentTime = new Date(Date.now());
						currentTime.setHours(currentTime.getHours() - currentTime.getTimezoneOffset() / 60);
						let diffSec = endTime.getTime() - currentTime.getTime();
						let diff = new Date(diffSec).toISOString().slice(11, 16);
						setTimer(diff.split(":")[0], diff.split(":")[1]);

						x.value = withSpring(0);
						destination.value = 0;
						showLikeEndedModal();
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

	const panHandler =
		indexOfFrontCard == index
			? Gesture.Pan()
					.onUpdate((event) => {
						x.value = event.translationX;
					})
					.onEnd((event) => {
						destination.value = snapPoint(x.value, event.velocityX, SNAP_POINTS);
						x.value = withSpring(destination.value);
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
		return {
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
					scale: x.value < 0 ? interpolate(-x.value, [0, width / 2], [0, 2], Extrapolate.CLAMP) : 0,
				},
			],
			opacity: interpolate(x.value, [-width * 0.95, -width], [1, 0]),
		};
	});

	const animatedPhotoProgress1 = useAnimatedStyle(() => {
		return {
			backgroundColor: photoList.length > 0 ? colors.white : "transparent",
			height: interpolate(progress.value, [0, 1], [24, 8]),
		};
	});
	const animatedPhotoProgress2 = useAnimatedStyle(() => {
		return {
			backgroundColor: photoList.length > 1 ? colors.white : "transparent",
			height: interpolate(progress.value, [0, 1, 2], [8, 24, 8]),
		};
	});
	const animatedPhotoProgress3 = useAnimatedStyle(() => {
		return {
			backgroundColor: photoList.length > 2 ? colors.white : "transparent",
			height: interpolate(progress.value, [1, 2, 3], [8, 24, 8]),
		};
	});
	const animatedPhotoProgress4 = useAnimatedStyle(() => {
		return {
			backgroundColor: photoList.length > 3 ? colors.white : "transparent",
			height: interpolate(progress.value, [2, 3], [8, 24]),
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
		<View key={index} style={{ zIndex: index < indexOfFrontCard ? -1 : 1, width: "100%" }}>
			{(indexOfFrontCard == index || indexOfFrontCard == index - 1) && ( // front or the 2nd card
				<View
					name={"cards"}
					style={{
						width: "100%",
						zIndex: 1,
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
											backfaceVisibility: "hidden",
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
										}}
									>
										<Animated.View
											style={[
												{
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
													minHeight: 8,
													maxHeight: 24,
													width: 8,
													borderRadius: 4,
													marginTop: 4,
												},
												animatedPhotoProgress4,
											]}
										/>
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
											elevation: 0,
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
											{checkText(about) && (
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
								uri: photoList.length > 0 ? photoList[0]?.PhotoLink : null,
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
		</View>
	);
};
