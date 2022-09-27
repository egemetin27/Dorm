import React, { useMemo } from "react";
import { View, Dimensions, StyleSheet, Pressable, Text } from "react-native";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Octicons } from "@expo/vector-icons";

import commonStyles from "../../visualComponents/styles";
import { colors, GradientText } from "../../visualComponents/colors";
import CustomButton from "../../components/button.components";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { height, width } = Dimensions.get("window");

const PEOPLE_LIST_HEIGHT = height * 0.345;
const EVENT_HEADER_HEIGHT = height * 0.15;

const POSITIONS = [
	{
		// gradientText: "Kişiler",
		Label: (
			<GradientText
				text={"Kişiler"}
				style={{
					fontSize: Math.min(height * 0.035, 35),
					fontFamily: "NowBold",
					letterSpacing: 1.2,
				}}
			/>
		),
		subText: {
			text: "“Kişiler”e dokunarak ortak zevklerin olan insanları bulabilirsin",
			style: { textAlign: "left" },
		},
		position: { top: 5, left: 5 },
	},
	{
		// gradientText: "Etkinlikler",
		Label: (
			<GradientText
				text={"Etkinlikler"}
				style={{
					fontSize: Math.min(height * 0.035, 35),
					fontFamily: "NowBold",
					letterSpacing: 1.2,
				}}
			/>
		),
		subText: {
			text: "“Etkinlikler”e dokunarak şehirdeki en iyi etkinlikler arasından sana en çok uyanı seçerek etkinliği beğenenlerle eşleşmeye başlayabilirsin",
			style: { textAlign: "left" },
		},
		position: { top: PEOPLE_LIST_HEIGHT, left: 5 },
	},
	{
		Label: (
			<Octicons
				style={
					{
						//transform: [{ rotate: "-90deg" }],
					}
				}
				name="filter"
				size={Math.min(height * 0.032, 30)}
				color={colors.cool_gray}
			/>
		),
		subText: {
			text: "Filtreleri kullanarak ortak zevklerin olan kişileri daha kolay bulabilirsin",
			style: { textAlign: "right" },
		},
		position: { top: 5, right: 14 },
	},
	// {
	// 	Label: null,
	// 	subText: {
	// 		text: "Kart alanına çift dokunarak etkinlik hakkında daha fazla bilgi edinebilir, bu etkinliğe giden kişileri görebilir ve onlarla eşleşebilirsin!",
	// 		style: { textAlign: "left", maxWidth: width * 0.7 },
	// 	},
	// 	position: { top: height * 0.3, left: width * 0.15 },
	// },
	// {
	// 	Label: null,
	// 	subText: {
	// 		text: "Gitmeyi düşündüğün etkinlikleri favorilerine ekleyebilir ve daha sonra “Favorilerim” sayfasından görüntüleyebilirsin.",
	// 		style: { textAlign: "left", maxWidth: width * 0.7 },
	// 	},
	// 	position: { top: height * 0.3, left: width * 0.15 },
	// },
];

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
	{
		Name: "zeynep",
		City: "İstanbul",
		Birth_Date: "2000-11-15",
		UserId: 1443,
		Gender: 0,
		Surname: "akyıldız",
		School: "Sabancı Üniversitesi",
		Major: "Bilgisayar Mühendisliği",
		Din: "",
		Burc: 1,
		Beslenme: 0,
		Alkol: 2,
		Sigara: 2,
		About: "",
		photos: [
			{
				UserId: 1443,
				Photo_Order: 1,
				PhotoLink: "https://d13pzveje1c51z.cloudfront.net/efbd1baefc14c782dcb84e16ddfbdde3",
			},
		],
		interest: [
			{
				InterestName: "🎸 Müzik",
				UserId: 1443,
			},
			{
				InterestName: "💃 Dans",
				UserId: 1443,
			},
			{
				InterestName: "📝 Yazı",
				UserId: 1443,
			},
			{
				InterestName: "🚶 Doğa Yürüyüşü",
				UserId: 1443,
			},
			{
				InterestName: "🧑‍🚀 Bilim Kurgu",
				UserId: 1443,
			},
		],
	},
];

export default function PeopleTutorialModal({ navigation, route }) {
	const [index, setIndex] = React.useState(route?.params?.index ?? 0);
	const insets = useSafeAreaInsets();

	const { Label, subText, position } = useMemo(() => POSITIONS[index], [index]);

	const handleEnd = async () => {
		await AsyncStorage.getItem("Constants").then(async (res) => {
			const list = JSON.parse(res);
			const toSave = { ...list, tutorialShown: true };
			await AsyncStorage.setItem("Constants", JSON.stringify(toSave));
		});
		// await AsyncStorage.setItem("tutorialShown", "yes");
		navigation.replace("MainScreen");
	};

	const handleProceed = () => {
		if (index === POSITIONS.length - 1) {
			navigation.replace("MainScreen");
			return;
		}

		if (index === 2) {
			navigation.replace("ProfileCards", {
				idx: 0,
				list: peopleList,
				// isTutorial: true,
				isTutorial: false,
			});
		}
		// if (index === 4) {
		// 	navigation.replace("EventCards", {
		// 		idx: 0,
		// 		list: eventList,
		// 		isTutorial: false,
		// 		// isTutorial: true,
		// 	});
		// }
		// if (index === 5) {
		// 	navigation.replace("MainScreen");
		// }

		setIndex((oldValue) => oldValue + 1);
	};

	const handleDoubleTap = (face) => {};

	return (
		<View style={styles.wrapper}>
			<StatusBar />
			<Pressable
				onPress={handleProceed}
				style={[commonStyles.Container, { backgroundColor: "transparent", marginTop: insets.top }]}
			>
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
					cards={shownList}
					keyExtractor={(card) => card.UserId}
					stackSize={2}
					useViewOverflow={false}
					verticalSwipe={false}
					backgroundColor="transparent"
					cardVerticalMargin={0}
					stackSeparation={0}
					renderCard={(card, idx) => {
						return (
							<Card
								handleReportButton={() => handleModalOpen(card.Name, card.UserId, idx)}
								card={card}
								index={idx}
								isBackFace={isBackFace}
								isScrollShowed={Session.ScrollShown}
								indexOfFrontCard={indexOfFrontCard}
								onDoubleTap={handleDoubleTap}
							/>
						);
					}}
				/>
				<DoubleTap singleTap={handleSingleTap} doubleTap={handleDoubleTap} delay={220} />
			</Pressable>
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
});
