import { useEffect, useState } from "react";
import { View, Dimensions, StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { colors, GradientText } from "../../visualComponents/colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSharedValue, withTiming } from "react-native-reanimated";
import { Session } from "../../nonVisualComponents/SessionVariables";

import Swiper from "react-native-deck-swiper";
import CardTutorial from "../../components/persontutorial-card-big.component";
import useBackHandler from "../../hooks/useBackHandler";

const { height, width } = Dimensions.get("window");

const PEOPLE_LIST_HEIGHT = height * 0.345;
const EVENT_HEADER_HEIGHT = height * 0.15;


const peopleList = [
	{
		Name: "Deniz",
		City: "İstanbul",
		Birth_Date: "2000-09-22",
		UserId: 11188,
		Gender: 0,
		Surname: "Günel",
		School: "Boğaziçi Üniversitesi",
		Major: "Psikoloji",
		Din: null,
		Burc: null,
		Beslenme: null,
		Alkol: null,
		Sigara: null,
		About: "Arada bi 90'lar pop, arada bi kahve",
		photos: [
			{
				UserId: 11188,
				Photo_Order: 1,
				PhotoLink: "../assets/Tutorial/tutorialboy.png",
			},
		],
		interest: [
			{
				InterestName: "☕ Kahve",
				UserId: 11188,
			},
			{
				InterestName: "🎸 Müzik",
				UserId: 11188,
			},
			{
				InterestName: "🎹 Klasik",
				UserId: 11188,
			},
			{
				InterestName: "🏳️‍🌈 LGBTQ+ destekçi",
				UserId: 11188,
			},
			{
				InterestName: "🥬 Vejetaryen",
				UserId: 11188,
			},
		],
	},
	{
		Name: "Erdem",
		City: "İstanbul",
		Birth_Date: "2001-09-22",
		UserId: 1188,
		Gender: 1,
		Surname: "Arı",
		School: "Mimar Sinan Üniversitesi",
		Major: "Mimarlık",
		Din: null,
		Burc: null,
		Beslenme: null,
		Alkol: null,
		Sigara: null,
		About: "Handpoke Tattoo Artist  ;)",
		photos: [
			{
				UserId: 1188,
				Photo_Order: 1,
				PhotoLink: "../assets/Tutorial/tutorialgirl.png",
			},
		],
		interest: [
			{
				InterestName: "🎸 Müzik",
				UserId: 1188,
			},
			{
				InterestName: "🎹 Klasik",
				UserId: 1188,
			},
			{
				InterestName: "🏀 Basketbol",
				UserId: 1188,
			},
			{
				InterestName: "☕ Kahve",
				UserId: 1188,
			},
		],
	}
];

export default function PeopleTutorialModal({ navigation, route }) {
	const [firstSwipeRight, setFirstSwipeRight] = useState(false);
	const [firstSwipeLeft, setFirstSwipeLeft] = useState(false);

	useBackHandler(() => navigation.goBack())
	
	const [index, setIndex] = useState(-1);
	//const [showTapIndicator, setShowTapIndicator] = useState(false);
	const insets = useSafeAreaInsets();

	const isBackFace = useSharedValue(false);
	const x = useSharedValue(0);
	//const face = useSharedValue(1);

	useEffect(() => {
		setTimeout(() => {
			navigation.navigate("BeginningTutorialModal", { index: 3, fromPeopleTutorial: true });
		}, 50);
	}, []);

	// useEffect(() => {
	// 	if (route.params.peopleTextTutorialDone == true) setShowTapIndicator(true);
	// }, [route]);

	// useEffect(() => {
	// 	setTimeout(() => {
	// 		setShowTapIndicator(route.params.peopleTextTutorialDone == true);
	// 	}, 100);

	// }, [route.params.peopleTextTutorialDone]);

	useEffect(() => {
		if (firstSwipeLeft) navigation.navigate("CustomModal", { modalType: "LEFT_SWIPE_LIKE_MESSAGE" });
	}, [firstSwipeLeft]);

	useEffect(() => {
		if (firstSwipeRight) navigation.navigate("CustomModal", { modalType: "RIGHT_SWIPE_LIKE_MESSAGE" });
	}, [firstSwipeRight]);

	const handleEnd = async () => {
		await AsyncStorage.getItem("Constants").then(async (res) => {
			const list = JSON.parse(res);
			//console.log(JSON.stringify(list, null, "\t"));
			const toSave = { ...list, tutorialShown: true };
			await AsyncStorage.setItem("Constants", JSON.stringify(toSave));
		});
		// await AsyncStorage.setItem("tutorialShown", "yes");
		//navigation.replace("MainScreen");
	};

	const handleSwipe = ({ value, index, likeTutorial }) => {
		isBackFace.value = false;
		console.log("\nTUTORIAL USER SWIPED: " + peopleList[index].UserId + " " + peopleList[index].Name + "\n");
		if (index == 1) handleEnd();
		setIndex(index + 1);
	};

	const handleSwipeAnimation = (event) => {
		x.value = event;
	};

	const handleSwipeEnd = () => {
		x.value = 0;
	};

	const handleDoubleTap = (face) => {
		setTimeout(() => {
			face.value = withTiming(-face.value);
		}, 100);
		isBackFace.value = !isBackFace.value;
		if (index == -1) {
			setIndex(index+1);
			setTimeout(() => {
				navigation.navigate("BeginningTutorialModal", { index: 8, fromPeopleTutorial: true });
			}, 150);
		}
		//setShowTapIndicator(false);
	};

	return (
		<View style={styles.wrapper}>
			<StatusBar />
			<View style={{ marginTop: height * 0.12 + insets.top }}>
				<Swiper
					swipeAnimationDuration={80}
					disableLeftSwipe={index == 0 || index == -1}
					disableRightSwipe={index == 1 || index == -1}
					onSwiping={handleSwipeAnimation}
					onSwiped={handleSwipeEnd}
					onSwipedAborted={handleSwipeEnd}
					onSwipedRight={(index) => {
						handleSwipe({ value: 0, index, setFirstSwipeRight });
						setFirstSwipeRight(true);						
					}}
					onSwipedLeft={(index) => {
						handleSwipe({ value: 2, index, setFirstSwipeLeft });
						setFirstSwipeLeft(true);
					}}
					cards={peopleList}
					keyExtractor={(card) => card.UserId}
					stackSize={2}
					useViewOverflow={false}
					verticalSwipe={false}
					backgroundColor="transparent"
					cardVerticalMargin={0}
					stackSeparation={0}
					renderCard={(card, idx) => {
						// if (showTapIndicator == true) {
						// 	return(<CardTutorial
						// 		card={{...card, Name: "hasan"}}
						// 		index={idx}
						// 		isBackFace={isBackFace}
						// 		isScrollShowed={Session.ScrollShown}
						// 		onDoubleTap={handleDoubleTap}
						// 		showTapIndicator={showTapIndicator}
						// 	/>);
						// }
						return (
							<CardTutorial
								card={card}
								index={idx}
								isBackFace={isBackFace}
								isScrollShowed={Session.ScrollShown}
								onDoubleTap={handleDoubleTap}
								//showTapIndicator={showTapIndicator}
							/>
						);
					}}
				/>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	wrapper: {
		width: "100%",
		height: "100%",
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
	tapIndicator: {
		alignSelf: "center",
		top: height * 0.3,
		color: colors.soft_red,
	},
	tutorialMessageText: {
		marginHorizontal: 15,
		color: colors.white,
		fontFamily: "PoppinsBold",
		marginVertical: 10,
		fontSize: Math.min(height * 0.028, 22),
	}
});
