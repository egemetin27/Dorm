import { useEffect, useMemo, useState } from "react";
import { View, Dimensions, StyleSheet, Pressable, Text, BackHandler } from "react-native";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Octicons } from "@expo/vector-icons";

import commonStyles from "../../visualComponents/styles";
import { colors, GradientText } from "../../visualComponents/colors";
import CustomButton from "../../components/button.components";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSharedValue, withTiming } from "react-native-reanimated";
import { Session } from "../../nonVisualComponents/SessionVariables";
import DoubleTap from "../../components/double-tap.component";
import Card from "../../components/person-card-big.component";
import Swiper from "react-native-deck-swiper";

const { height, width } = Dimensions.get("window");

const PEOPLE_LIST_HEIGHT = height * 0.345;
const EVENT_HEADER_HEIGHT = height * 0.15;

// const POSITIONS = [
// 	{
// 		gradientText: "Kişiler",
// 		Label: (
// 			<GradientText
// 				text={"Kişiler"}
// 				style={{
// 					fontSize: Math.min(height * 0.035, 35),
// 					fontFamily: "NowBold",
// 					letterSpacing: 1.2,
// 				}}
// 			/>
// 		),
// 		subText: {
// 			text: "“Kişiler”e dokunarak ortak zevklerin olan insanları bulabilirsin",
// 			style: { textAlign: "left" },
// 		},
// 		position: { top: 5, left: 5 },
// 	},
// 	{
// 		gradientText: "Etkinlikler",
// 		Label: (
// 			<GradientText
// 				text={"Etkinlikler"}
// 				style={{
// 					fontSize: Math.min(height * 0.035, 35),
// 					fontFamily: "NowBold",
// 					letterSpacing: 1.2,
// 				}}
// 			/>
// 		),
// 		subText: {
// 			text: "“Etkinlikler”e dokunarak şehirdeki en iyi etkinlikler arasından sana en çok uyanı seçerek etkinliği beğenenlerle eşleşmeye başlayabilirsin",
// 			style: { textAlign: "left" },
// 		},
// 		position: { top: PEOPLE_LIST_HEIGHT, left: 5 },
// 	},
// 	{
// 		Label: (
// 			<Octicons
// 				style={
// 					{
// 						transform: [{ rotate: "-90deg" }],
// 					}
// 				}
// 				name="filter"
// 				size={Math.min(height * 0.032, 30)}
// 				color={colors.cool_gray}
// 			/>
// 		),
// 		subText: {
// 			text: "Filtreleri kullanarak ortak zevklerin olan kişileri daha kolay bulabilirsin",
// 			style: { textAlign: "right" },
// 		},
// 		position: { top: 5, right: 14 },
// 	},
// 	{
// 		Label: null,
// 		subText: {
// 			text: "Kart alanına çift dokunarak etkinlik hakkında daha fazla bilgi edinebilir, bu etkinliğe giden kişileri görebilir ve onlarla eşleşebilirsin!",
// 			style: { textAlign: "left", maxWidth: width * 0.7 },
// 		},
// 		position: { top: height * 0.3, left: width * 0.15 },
// 	},
// 	{
// 		Label: null,
// 		subText: {
// 			text: "Gitmeyi düşündüğün etkinlikleri favorilerine ekleyebilir ve daha sonra “Favorilerim” sayfasından görüntüleyebilirsin.",
// 			style: { textAlign: "left", maxWidth: width * 0.7 },
// 		},
// 		position: { top: height * 0.3, left: width * 0.15 },
// 	},
// ];

const peopleList = [
	{
		Name: "engin",
		City: "İstanbul",
		Birth_Date: "2001-09-22",
		UserId: 1188,
		Gender: 2,
		Surname: "günel",
		School: "Boğaziçi Üniversitesi",
		Major: null,
		Din: null,
		Burc: null,
		Beslenme: null,
		Alkol: null,
		Sigara: null,
		About: null,
		photos: [
			{
				UserId: 1188,
				Photo_Order: 1,
				PhotoLink: "https://d13pzveje1c51z.cloudfront.net/736ff14fda7cdf1a076331383ca3a016",
			},
		],
		interest: [
			{
				InterestName: "☕ Kahve",
				UserId: 1188,
			},
			{
				InterestName: "🎸 Müzik",
				UserId: 1188,
			},
			{
				InterestName: "🎹 Klasik",
				UserId: 1188,
			},
			{
				InterestName: "🏳️‍🌈 LGBTQ+ destekçi",
				UserId: 1188,
			},
			{
				InterestName: "🥬 Vejetaryen",
				UserId: 1188,
			},
		],
	},
];
const tutorialMessages = ["asdasd", "bv gfbgf"];
export default function PeopleTutorialModal({ navigation, route }) {
	const [index, setIndex] = useState(0);
	const insets = useSafeAreaInsets();

	const isBackFace = useSharedValue(false);
	const x = useSharedValue(0);
	const face = useSharedValue(1);

	const handleEnd = async () => {
		await AsyncStorage.getItem("Constants").then(async (res) => {
			const list = JSON.parse(res);
			const toSave = { ...list, tutorialShown: true };
			await AsyncStorage.setItem("Constants", JSON.stringify(toSave));
		});
		// await AsyncStorage.setItem("tutorialShown", "yes");
		navigation.replace("MainScreen");
	};

	const handleSwipe = ({ value, index }) => {
		// 0 = like, 1 = super like, 2 =  dislike
		// setPeopleIndex(index + peopleListIndex);
		isBackFace.value = false;
		console.log("\nTUTORIAL USER SWIPED: " + peopleList[index].UserId + " " + peopleList[index].Name + "\n");
		navigation.goBack();
		// console.log(value == 0 ? "liked:" : "disliked:");
		// console.log(shownList[index]);
	};

	const handleSwipeAnimation = (event) => {
		x.value = event;
	};

	const handleSwipeEnd = () => {
		x.value = 0;
		// x.value = withTiming(0);
	};

	const handleDoubleTap = (face) => {
		setTimeout(() => {
			face.value = withTiming(-face.value);
		}, 60);
		isBackFace.value = !isBackFace.value;
	};

	useEffect(() => {
		setTimeout(() => {
			navigation.navigate("BeginningTutorialModal", { index: 3, fromPeopleTutorial: true });
		}, 200);
	}, []);

	return (
		<View style={styles.wrapper}>
			<StatusBar />
			<DoubleTap
				doubleTap={handleDoubleTap}
				style={[commonStyles.Container, { backgroundColor: "transparent", marginTop: insets.top }]}
			>
				<View style={{ marginTop: height * 0.15 }}>
					<Swiper
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
						cards={peopleList}
						keyExtractor={(card) => card.UserId}
						stackSize={1}
						useViewOverflow={false}
						verticalSwipe={false}
						backgroundColor="transparent"
						cardVerticalMargin={0}
						stackSeparation={0}
						renderCard={(card, idx) => {
							return (
								<Card
									card={card}
									index={idx}
									isBackFace={isBackFace}
									isScrollShowed={Session.ScrollShown}
									onDoubleTap={handleDoubleTap(face)}
								/>
							);
						}}
					/>
					{/* <View style={styles.tutorialMessage}>
						<Text style={styles.tutorialMessageText}>
							{tutorialMessages[index]}
						</Text>
					</View> */}
				</View>
			</DoubleTap>
		</View>
	);
}

const styles = StyleSheet.create({
	wrapper: {
		width: "100%",
		height: height,
		backgroundColor: "rgba(0,0,0,0.5)",
	},
	label: {
		backgroundColor: colors.backgroundColor,
		paddingVertical: 5,
		paddingHorizontal: 8,
		borderRadius: 10,
		marginBottom: 10,
	},
	subTextWrapper: {
		maxWidth: width * 0.8,
	},
	subText: {
		color: colors.backgroundColor,
		fontSize: 20,
		fontFamily: "PoppinsSemiBold",
	},
	tutorialMessage: {
		maxWidth: Math.min(width * 0.65, 263),
		width: width * 0.65,
		left: width * 0.09,
		top: height * 0.28,
		color: colors.soft_red,
		borderRadius: 10,
		opacity: 0.75,
		backgroundColor: colors.tutorialPurple,
	},
	tutorialMessageText: {
		marginHorizontal: 15,
		color: colors.white,
		fontFamily: "PoppinsBold",
		marginVertical: 10,
		fontSize: Math.min(height * 0.028, 22),
	}
});
