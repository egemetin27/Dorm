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
import TapIndicator from "../../components/tap-indicator.component";

const { height, width } = Dimensions.get("window");

const PEOPLE_LIST_HEIGHT = height * 0.345;
const EVENT_HEADER_HEIGHT = height * 0.15;


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

export default function PeopleTutorialModal({ navigation, route }) {
	const [index, setIndex] = useState(0);
	const [showTapIndicator, setShowTapIndicator] = useState(false);
	const insets = useSafeAreaInsets();

	const isBackFace = useSharedValue(false);
	const x = useSharedValue(0);
	const face = useSharedValue(1);

	useEffect(() => {
		setShowTapIndicator(route.params.peopleTextTutorialDone == true);
		console.log("YES");
	}, [route.params.peopleTextTutorialDone]);

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
		isBackFace.value = false;
		console.log("\nTUTORIAL USER SWIPED: " + peopleList[index].UserId + " " + peopleList[index].Name + "\n");
		navigation.goBack();
	};

	const handleSwipeAnimation = (event) => {
		x.value = event;
	};

	const handleSwipeEnd = () => {
		x.value = 0;
		// x.value = withTiming(0);
	};

	const handleDoubleTap = (face) => {
		setShowTapIndicator(false);
		setTimeout(() => {
			face.value = withTiming(-face.value);
		}, 100);
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
					{(showTapIndicator === true) ?
						<View style={styles.tapIndicator}>
							<TapIndicator />
						</View> :
						<View></View>
					}
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
