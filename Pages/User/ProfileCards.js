import { useContext, useEffect, useState } from "react";
import ReactNative, {
	View,
	Text,
	Image,
	StyleSheet,
	Dimensions,
	BackHandler,
	ActivityIndicator,
	FlatList,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import Animated, {
	useSharedValue,
	useDerivedValue,
	useAnimatedStyle,
	interpolate,
	Extrapolate,
	withTiming,
} from "react-native-reanimated";
import { StatusBar } from "expo-status-bar";
import { ReText } from "react-native-redash";
import { Feather } from "@expo/vector-icons";
import axios from "axios";
import { normalize } from "../../nonVisualComponents/generalFunctions";

import url from "../../connection";
import commonStyles from "../../visualComponents/styles";
import { colors, Gradient, GradientText } from "../../visualComponents/colors";
import { CustomModal } from "../../visualComponents/customComponents";
import { AuthContext } from "../../contexts/auth.context";

import crypto from "../../functions/crypto";
import Swiper from "react-native-deck-swiper";
import Card from "../../components/person-card-big.component";
import useBackHandler from "../../hooks/useBackHandler";
import CustomImage from "../../components/custom-image.component";
import { Session } from "../../nonVisualComponents/SessionVariables";

const { width, height, fontScale } = Dimensions.get("window");

export default function ProfileCards({ navigation, route }) {
	const {
		user: { userId, sesToken, matchMode },
		peopleListIndex,
		SwipeRefreshTime,
		signOut,
		setPeopleIndex,
		updateProfile,
	} = useContext(AuthContext);

	useBackHandler(() => {
		navigation.goBack();
	});

	const { list, idx, fromEvent = false } = route.params;
	const eventId = route.params.eventID ?? 0;
	const eventName = route.params.eventName ?? "";

	const [isLoading, setIsLoading] = useState(true);
	const [shownList, setShownList] = useState([]);

	const indexOfFrontCard = useSharedValue(0);
	const isBackFace = useSharedValue(false);
	const x = useSharedValue(0);

	const [reportPage, setReportPage] = useState(false);
	const [chosenReport, setChosenReport] = useState(0);

	const [name, setName] = useState("");
	const [reportUserID, setReportUserID] = useState("");

	useEffect(() => {
		const prepare = async () => {
			let profile = list.splice(idx, 1);
			setShownList([profile[0], ...list]);
		};
		prepare()
			.catch(console.error)
			.then(() => {
				setIsLoading(false);
			});
	}, []);

	function showReportPage(otherUserID, name) {
		setName(name);
		setReportPage(true);
		setReportUserID(otherUserID);
	}

	async function reportProfile() {
		if (chosenReport == 0) {
			alert("Lütfen bildirme nedeninizi seçiniz!");
		} else {
			setReportPage(false);
			try {
				const encryptedData = crypto.encrypt({
					userId: route.params.myID,
					sikayetEdilen: reportUserID,
					sikayetKodu: chosenReport,
					aciklama: "",
				});
				await axios
					.post(url + "/report", encryptedData, {
						headers: { "access-token": sesToken },
					})
					.then((res) => {
						if (res.data == "Unauthorized Session") {
							Alert.alert("Oturumunuzun süresi doldu!");
							signOut();
						}
					})
					.catch((err) => {
						console.log(err);
					});
				// setIndexOfFrontCard(indexOfFrontCard + 1);
				indexOfFrontCard.value = indexOfFrontCard.value + 1;
			} catch (error) {
				console.log(error);
			}
		}
	}

	const derivedText = useDerivedValue(
		() =>
			`${
				isBackFace.value
					? "Arka yüze dönmek için kart alanına çift dokun"
					: "Daha iyi tanımak için kart alanına çift dokun"
			}`
	);

	const handleSwipeAnimation = (event) => {
		x.value = event;
	};

	const handleSwipeEnd = () => {
		x.value = withTiming(0);
	};

	const handleSwipe = ({ value, index }) => {
		// 0 = like, 1 = super like, 2 =  dislike
		// setPeopleIndex(index + peopleListIndex);
		isBackFace.value = false;
		console.log("\nUSER SWIPED: " + shownList[index].UserId + " " + shownList[index].Name + "\n");
		setPeopleIndex(idx + peopleListIndex);
		// console.log(value == 0 ? "liked:" : "disliked:");
		// console.log(shownList[index]);
		const likeDislike = crypto.encrypt({
			isLike: value,
			userSwiped: userId,
			otherUser: shownList[index].UserId,
			matchMode,
			eventId,
			eventName,
		});

		indexOfFrontCard.value += 1;

		const otherUser = shownList[index];

		axios
			.post(url + "/userAction/LikeDislike", likeDislike, {
				headers: { "access-token": sesToken },
			})
			.then((res) => {
				console.log(res.data);

				if (res.data.message == "Match") {
					navigation.navigate("MatchModal", {
						firstImg: otherUser.photos[0]?.PhotoLink,
						secondImg: myProfilePicture,
						name: name,
					});
				}
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
						updateProfile({ SwipeRefreshTime: error.response.data });
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
			});
	};

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

	if (isLoading) {
		return (
			<View style={[commonStyles.Container, { justifyContent: "center" }]}>
				<StatusBar style="dark" />
				<ActivityIndicator animating={true} color={"rgba(100, 60, 248, 1)"} size={"large"} />
			</View>
		);
	}
	return (
		<View style={commonStyles.Container}>
			<StatusBar style="dark" backgroundColor="#F4F3F3" />
			<View
				onLayout={() => {}}
				name={"header"}
				style={{
					backgroundColor: "#F4F3F3",
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
						if (fromEvent) {
							navigation.goBack();
							return;
						}
						navigation.goBack();
					}}
				>
					<Feather name="chevron-left" size={30} color={colors.cool_gray} />
				</TouchableOpacity>
				<Image
					source={require("../../assets/dorm_text.png")}
					resizeMode="contain"
					style={{ height: height * 0.04, flex: 1 }}
				/>
				<Feather name="chevron-left" size={30} color={"transparent"} />
			</View>
			<View style={{ width: "100%", height: "100%" }}>
				<View
					style={{
						width: "100%",
						height: Math.min(width * 1.35, height * 0.7),
						marginTop: height * 0.05,
					}}
				>
					<View
						style={[
							{
								width: "100%",
								position: "absolute",
								alignItems: "center",
								justifyContent: "center",
								top: height * 0.3,
								zIndex: -1,
							},
						]}
					>
						{/* <Text style={{ fontSize: normalize(18), color: colors.medium_gray, letterSpacing: 1 }}>
							Yeni kişiler aranıyor...
						</Text> */}
					</View>
					<Swiper
						//swipeBackCard
						onSwiped={handleSwipeEnd}
						onSwiping={handleSwipeAnimation}
						onSwipedAborted={handleSwipeEnd}
						onSwipedRight={(index) => {
							handleSwipe({ value: 0, index });
						}}
						onSwipedLeft={(index) => {
							handleSwipe({ value: 2, index });
						}}
						cards={shownList}
						keyExtractor={(card) => card.UserId}
						stackSize={2}
						useViewOverflow={false}
						verticalSwipe={false}
						backgroundColor="transparent"
						cardVerticalMargin={0}
						stackSeparation={0}
						renderCard={(card, idx) => {
							// return (
							// 	<View
							// 		style={[
							// 			commonStyles.photo,
							// 			{
							// 				height: Math.min(width * 1.35, height * 0.7),
							// 				backgroundColor: "#440080",
							// 				borderColor: "red",
							// 				borderWidth: 5,
							// 			},
							// 		]}
							// 	>
							// 		<FlatList
							// 			data={card.photos}
							// 			keyExtractor={(item) => {
							// 				return item.Photo_Order;
							// 			}}
							// 			renderItem={({ item }) => {
							// 				return (
							// 					<CustomImage
							// 						url={item?.PhotoLink}
							// 						style={{
							// 							// width: "100%",
							// 							// flex: 1,
							// 							aspectRatio: 1 / 1.5,
							// 							height: Math.min(height * 0.7, width * 1.35),
							// 							// //resizeMode: "cover",
							// 							// backgroundColor: colors.cool_gray,
							// 						}}
							// 					/>
							// 				);
							// 			}}
							// 			pagingEnabled={true}
							// 			showsVerticalScrollIndicator={false}
							// 		/>
							// 	</View>
							// );
							return (
								<Card
									card={card}
									index={idx}
									isBackFace={isBackFace}
									isScrollShowed={Session.ScrollShown}
									indexOfFrontCard={indexOfFrontCard}
								/>
							);
						}}
					/>
					{/* {shownList.map((item, index) => {
						return (
							<Card2
								key={index}
								// index={9 - index}
								// index={peopleList.length - index - 1}
								index={index}
								eventId={route.params?.eventId ?? 0}
								eventName={route.params?.eventName ?? ""}
								idxForMainPage={idx + peopleListIndex - 1}
								card={item}
								backFace={backFace}
								myID={user.userId}
								sesToken={user.sesToken}
								indexOfFrontCard={indexOfFrontCard}
								myProfilePicture={route.params.myPP}
								isScrollShowed={Session.ScrollShown}
								matchMode={route.params.matchMode}
								incrementIndex={() => {
									indexOfFrontCard.value = indexOfFrontCard.value + 1;
								}}
								showMatchScreen={(otherName, otherPicture, myPicture) => {
									navigation.navigate("MatchModal", {
										firstImg: otherPicture,
										secondImg: myPicture,
										name: otherName,
									});
								}}
								showReportPage={(otherUserID, name) => {
									showReportPage(otherUserID, name);
								}}
								showLikeEndedModal={(hour, minute) => {
									navigation.navigate("LikeEndedModal", {
										hour: hour,
										minute: minute,
									});
								}}
								showListEndedModal={() => {
									navigation.navigate("ListEndedModal");
								}}
								length={shownList.length}
								refreshList={async () => {
									try {
										setIsLoading(true);
										// setShownList(peopleList.slice(0, 5));
										// setPeopleList(peopleList.slice(5));
										setShownList([shownList[4], ...peopleList.slice(0, 4)]);
										setPeopleList(peopleList.slice(4));
										indexOfFrontCard.value = 0;
										if (peopleList.length == 0) {
											navigation.navigate("ListEndedModal");
											return;
										}
									} finally {
										setIsLoading(false);
									}
								}}
							/>
						);
					})} */}
				</View>

				<View
					style={{
						width: "100%",
						// flex: 1,
						paddingTop: height * 0.015,
						justifyContent: "flex-start",
					}}
				>
					<ReText
						text={derivedText}
						style={{
							textAlign: "center",
							// fontSize: Platform.OS == "android" ? width * 0.03 : width * 0.04,
							// fontSize: normalize(12),
							fontSize: fontScale * normalize(14),
							color: colors.medium_gray,
							letterSpacing: 0.2,
						}}
					/>
				</View>
			</View>

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
								<ReactNative.TouchableOpacity
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
								</ReactNative.TouchableOpacity>
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
								marginVertical: "8%",
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
						<ReactNative.TouchableOpacity
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
								marginBottom: "8%",
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
						</ReactNative.TouchableOpacity>
						<ReactNative.TouchableOpacity
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
								marginBottom: "8%",
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
						</ReactNative.TouchableOpacity>
						<ReactNative.TouchableOpacity
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
								marginBottom: "8%",
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
						</ReactNative.TouchableOpacity>
						<ReactNative.TouchableOpacity
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
								marginBottom: "8%",
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
						</ReactNative.TouchableOpacity>
						<ReactNative.TouchableOpacity
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
								marginBottom: "8%",
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
						</ReactNative.TouchableOpacity>
						<ReactNative.TouchableOpacity
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
								marginBottom: "5%",
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
						</ReactNative.TouchableOpacity>

						<ReactNative.TouchableOpacity
							onPress={reportProfile}
							style={{
								maxWidth: "100%",

								borderRadius: 12,
								overflow: "hidden",
								marginTop: "9%",
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
										padding: "6%",
									}}
								>
									Bildir
								</Text>
							</Gradient>
						</ReactNative.TouchableOpacity>
					</View>
				</View>
			</CustomModal>
			{/* Report Page Modal */}

			{/* Animated Like */}
			<Animated.View
				name={"like"}
				style={[
					{
						position: "absolute",
						top: "50%",
						width: 60,
						aspectRatio: 1 / 1,
						backgroundColor: "transparent",
						borderRadius: 30,
						right: 0,
					},
					animatedLike,
				]}
			>
				<Image
					style={{ width: "100%", height: "100%", resizeMode: "contain" }}
					source={require("../../assets/Like.png")}
				/>
			</Animated.View>

			{/* Animated Dislike */}
			<Animated.View
				name={"dislike"}
				style={[
					{
						position: "absolute",
						top: "50%",
						width: 60,
						aspectRatio: 1 / 1,
						backgroundColor: "transparent",
						borderRadius: 30,
						left: 0,
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
	},
});
