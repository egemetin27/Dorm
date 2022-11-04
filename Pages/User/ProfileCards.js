import { useContext, useEffect, useRef, useState, useMemo } from "react";
import {
	View,
	Image,
	StyleSheet,
	Dimensions,
	ActivityIndicator,
	Text,
	ScrollView,
	Alert,
} from "react-native";
import Animated, {
	useSharedValue,
	useDerivedValue,
	useAnimatedStyle,
	interpolate,
	Extrapolate,
	withSpring,
} from "react-native-reanimated";
import Swiper from "react-native-deck-swiper";
import axios from "axios";
import { ReText } from "react-native-redash";

import CustomButton from "../../components/button.components";
import Card from "../../components/person-card-big.component";
import AdCard from "../../components/ad-card-big.component";
import { CustomModal } from "../../visualComponents/customComponents";
import { colors } from "../../visualComponents/colors";
import commonStyles from "../../visualComponents/styles";

import { getTimeDiff, normalize } from "../../nonVisualComponents/generalFunctions";

import crypto from "../../functions/crypto";
import url from "../../connection";
import { Session } from "../../nonVisualComponents/SessionVariables";

import { AuthContext } from "../../contexts/auth.context";

import useBackHandler from "../../hooks/useBackHandler";
import HomeHeader from "../../components/headers/header-home.component";
import { PeopleContext } from "../../contexts/people.context";

const { width, height, fontScale } = Dimensions.get("window");

const REPORT_REASONS = {
	spam: { choice: "Sahte profil / Spam", key: 1 },
	message: { choice: "Uygunsuz mesaj", key: 2 },
	photo: { choice: "Uygunsuz fotoğraf", key: 3 },
	bio: { choice: "Uygunsuz biyografi", key: 4 },
	age: { choice: "Reşit olmayan kullanıcı", key: 5 },
	other: { choice: "Diğer", key: 6 },
};

const MODE_INDICES = {
	flirt: 0,
	friend: 1,
};

export default function ProfileCards({ navigation, route }) {
	const {
		user: { userId, matchMode, sesToken, Photo },
		peopleListIndex,
		setPeopleIndex,
		peopleTutorialDone,
		signOut,
		updateProfile,
	} = useContext(AuthContext);
	const { peopleList, changeMode } = useContext(PeopleContext);

	const {
		mode = "event",
		list = [],
		idx = 0,
		eventId = 0,
		eventName = "",
	} = route?.params ?? { list: [], idx: 0, fromEvent: false };

	const [isLoading, setIsLoading] = useState(true);

	const shownList = useMemo(() => {
		if (mode === "event") {
			setIsLoading(false);
			return list;
		}
		return peopleList;
	}, [mode, list, peopleList]);

	const myProfilePicture = Photo[0].PhotoLink ?? "";

	const swiperRef = useRef();

	const [reportPage, setReportPage] = useState({
		visible: false,
		chosenReport: -1,
		name: "",
		id: 0,
		index: 0,
	});
	const indexOfFrontCard = useSharedValue(0);
	const isBackFace = useSharedValue(false);
	const x = useSharedValue(0);

	const capitalizedName = useMemo(
		() => reportPage?.name.charAt(0).toUpperCase() + reportPage?.name.slice(1),
		[reportPage]
	);

	useEffect(() => {
		if (mode !== "event") {
			changeMode(MODE_INDICES[mode]).then(setIsLoading(false));
		}
	}, [mode]);

	useEffect(() => {
		// const getTutorialShown = async () => {
		// 	await AsyncStorage.getItem("Constants").then((res) => {
		// 		if (JSON.parse(res).tutorialShown == true) {
		// 			setTimeout(() => {
		// 				navigation.navigate("PeopleTutorialModal", { index: 3 });
		// 			}, 200);
		// 		}
		// 	});
		// 	// await AsyncStorage.getItem("Constants").then(async (res) => {
		// 	// 	const list = JSON.parse(res);
		// 	// 	if (list.people.peopleTutorialShown == true) return;
		// 	// 	const toSave = { ...list, peopleTutorialShown: true };
		// 	// 	await AsyncStorage.setItem("Constants", JSON.stringify(toSave));
		// 	// });
		// };
		//getTutorialShown();
	}, []);

	useEffect(() => {
		if (peopleTutorialDone != true) {
			setTimeout(() => {
				navigation.navigate("PeopleTutorialModal", { index: 3 });
			}, 200);
		}
	}, []);

	const handleModalOpen = (name, id, index) => {
		setReportPage((oldValue) => {
			const newValue = { ...oldValue, visible: true, name, id, index };
			return newValue;
		});
	};

	const handleModalDismiss = () => {
		setReportPage({
			visible: false,
			chosenReport: -1,
			name: "",
			id: 0,
			index: 0,
		});
	};

	const handleReportChange = (key) => {
		setReportPage((oldValue) => {
			const newValue = { ...oldValue, chosenReport: key };
			return newValue;
		});
	};

	const handleReport = async () => {
		const { id, chosenReport, index } = reportPage;
		const encryptedData = crypto.encrypt({
			userId: userId,
			sikayetEdilen: id,
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
		handleModalDismiss();
		swiperRef.current.jumpToCardIndex(index + 1);
		navigation.navigate("CustomModal", { modalType: "REPORT_FEEDBACK" });
	};

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
		x.value = 0;
		// x.value = withTiming(0);
	};

	const handleSwipe = ({ value, index }) => {
		// 0 = like, 1 = super like, 2 =  dislike
		// setPeopleIndex(index + peopleListIndex);
		isBackFace.value = false;
		console.log("\nUSER SWIPED: " + shownList[index].UserId + " " + shownList[index].Name + "\n");
		if (shownList[index].adCard != true) setPeopleIndex(idx + peopleListIndex);
		const likeDislike = crypto.encrypt({
			isLike: value,
			userSwiped: userId,
			otherUser: shownList[index].UserId,
			matchMode: eventId === 0 ? 0 : matchMode,
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
						name: otherUser.Name,
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

						navigation.navigate("LikeEndedModal", {
							hour: time.hour,
							minute: time.minute,
						});

						x.value = withSpring(0);
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
				<ActivityIndicator animating={true} color={"rgba(100, 60, 248, 1)"} size={"large"} />
			</View>
		);
	}
	return (
		<View style={commonStyles.Container}>
			<HomeHeader page={mode} />
			<View style={{ width: "100%", height: "100%" }}>
				<View
					style={{
						width: "100%",
						height: Math.min(width * 1.35, height * 0.7),
						marginTop: height * 0.05,
					}}
				>
					{/* <View
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
						<Text style={{ fontSize: normalize(18), color: colors.medium_gray, letterSpacing: 1 }}>
							Yeni kişiler aranıyor...
						</Text>
					</View> */}
					{shownList.length > 0 && (
						<Swiper
							ref={swiperRef}
							//swipeBackCard
							swipeAnimationDuration={80}
							onSwiping={handleSwipeAnimation}
							onSwiped={handleSwipeEnd}
							onSwipedAborted={handleSwipeEnd}
							onSwipedRight={(index) => {
								handleSwipe({ value: 0, index });
							}}
							onSwipedLeft={(index) => {
								handleSwipe({ value: 2, index });
							}}
							onSwipedAll={() => {
								navigation.navigate("ListEndedModal");
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
								if (card?.adCard) {
									return <AdCard card={card} />;
								}
								return (
									<Card
										handleReportButton={() => handleModalOpen(card.Name, card.UserId, idx)}
										card={card}
										index={idx}
										isBackFace={isBackFace}
										isScrollShowed={Session.ScrollShown}
										indexOfFrontCard={indexOfFrontCard}
									/>
								);
							}}
						/>
					)}
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

			<CustomModal visible={reportPage.visible} dismiss={handleModalDismiss} animationType="fade">
				<View style={styles.modal_container}>
					<View style={styles.header}>
						<Image
							source={require("../../assets/flag.png")}
							resizeMode="contain"
							style={{ height: height * 0.05, aspectRatio: 1, marginBottom: 10 }}
						/>
						<Text style={styles.header_text}>Bildirmek istiyor musun?</Text>
						<Text style={styles.header_subtext}>{capitalizedName} adlı kişiyi bildiriyorsun.</Text>
						<Text style={styles.header_subtext}>Bunu ona söylemeyeceğiz.</Text>
					</View>
					<ScrollView
						showsVerticalScrollIndicator={false}
						style={{ width: "100%" }}
						contentContainerStyle={{ paddingBottom: 10 }}
					>
						{Object.values(REPORT_REASONS).map(({ choice, key }) => {
							return (
								<CustomButton
									key={key}
									onPress={() => {
										handleReportChange(key);
									}}
									text={choice}
									buttonType={reportPage.chosenReport === key ? "white_selected" : "white"}
									style={{ fontSize: Math.min(16, width * 0.036) }}
								/>
							);
						})}
					</ScrollView>
					<CustomButton
						disabled={reportPage.chosenReport === -1}
						onPress={handleReport}
						buttonType={reportPage.chosenReport === -1 ? "transparent" : "gradient"}
						text={"Bildir"}
						style={{ fontSize: Math.min(16, width * 0.036) }}
					/>
				</View>
			</CustomModal>
		</View>
	);
}
const vars = {
	fontSizeHeader: Math.min(width * 0.045, 20),
};
const styles = StyleSheet.create({
	wrapper: {
		width: "100%",
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	absolute_fill: {
		...StyleSheet.absoluteFill,
		backgroundColor: "rgba(0,0,0,0.5)",
	},
	modal_container: {
		width: Math.min(width * 0.8, 360),
		height: height * 0.85,
		backgroundColor: colors.backgroundColor,
		alignItems: "center",
		justifyContent: "space-evenly",
		paddingVertical: Math.min(height * 0.05, 30),
		paddingHorizontal: Math.min(width * 0.05, 20),
		borderRadius: 16,
	},
	header: {
		alignItems: "center",
		marginBottom: 10,
	},
	header_text: {
		fontSize: vars.fontSizeHeader,
		fontFamily: "PoppinsSemiBold",
		letterSpacing: 0.2,
	},
	header_subtext: {
		textAlign: "center",
		color: colors.gray,
		fontSize: vars.fontSizeHeader * 0.72,
	},
	modal_exit_button: {
		zIndex: 1,
		position: "absolute",
		top: 10,
		right: "5%",
	},
});
