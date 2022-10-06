import { useContext, useMemo, useState } from "react";
import { View, Dimensions, StyleSheet, Pressable, Text } from "react-native";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Octicons } from "@expo/vector-icons";

import commonStyles from "../../visualComponents/styles";
import { colors, GradientText } from "../../visualComponents/colors";
import CustomButton from "../../components/button.components";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AuthContext } from "../../contexts/auth.context";

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
	{
		Label: null,
		subText: {
			text: "Kişinin kart alanına çift dokunarak kartın arka yüzünü görebilir ve onu daha yakından tanıyabilirsin",
			style: {
				marginHorizontal: 15,
				color: colors.white,
				fontFamily: "PoppinsBold",
				marginVertical: 10,
				fontSize: Math.min(height * 0.028, 22),
			},
			textContainer: {
				maxWidth: Math.min(width * 0.65, 263),
				width: width * 0.65,
				left: width * -0.06,
				bottom: height * -0.03,
				color: colors.soft_red,
				borderRadius: 10,
				opacity: 0.75,
				backgroundColor: colors.tutorialPurple,
			},
		},
		position: { top: height * 0.3, left: width * 0.15 },
	},
	{
		Label: null,
		subText: {
			text: "E hadi, sen de dene!",
			style: {
				marginHorizontal: 15,
				color: colors.white,
				fontFamily: "PoppinsBold",
				marginVertical: 10,
				fontSize: Math.min(height * 0.028, 22),
			},
			textContainer: {
				maxWidth: Math.min(width * 0.65, 263),
				width: width * 0.65,
				left: width * -0.06,
				bottom: height * -0.12,
				color: colors.soft_red,
				borderRadius: 10,
				opacity: 0.75,
				backgroundColor: colors.tutorialPurple,
			},
		},
		position: { top: height * 0.3, left: width * 0.15 },
	},
	{
		Label: null,
		subText: {
			text: "Eşleşmek istemediğin kişileri sola, eşleşmek istediğin kişileri sağa kaydırman gerektiğini unutma",
			style: { textAlign: "left", maxWidth: width * 0.7 },
		},
		position: { top: height * 0.3, left: width * 0.15 },
	},
	{
		Label: null,
		subText: {
			text: "Kart alanına çift dokunarak etkinlik hakkında daha fazla bilgi edinebilir, bu etkinliğe giden kişileri görebilir ve onlarla eşleşebilirsin!",
			style: {
				marginHorizontal: 15,
				color: colors.white,
				fontFamily: "PoppinsBold",
				marginVertical: 10,
				fontSize: Math.min(height * 0.027, 21),
			},
			textContainer: {
				maxWidth: Math.min(width * 0.65, 263),
				width: width * 0.65,
				left: width * -0.06,
				bottom: height * 0.07,
				color: colors.soft_red,
				borderRadius: 10,
				opacity: 0.75,
				backgroundColor: colors.tutorialPurple,
			},
		},
		position: { top: height * 0.3, left: width * 0.15 },
	},
	{
		Label: null,
		subText: {
			text: "Gitmeyi düşündüğün etkinlikleri favorilerine ekleyebilir ve daha sonra Anasayfada “Favorilerim” kısmından görüntüleyebilirsin.",
			style: {
				marginHorizontal: 15,
				color: colors.white,
				fontFamily: "PoppinsBold",
				marginVertical: 10,
				fontSize: Math.min(height * 0.026, 20),
			},
			textContainer: {
				maxWidth: Math.min(width * 0.65, 263),
				width: width * 0.65,
				left: width * -0.06,
				bottom: height * 0.06,
				color: colors.soft_red,
				borderRadius: 10,
				opacity: 0.75,
				backgroundColor: colors.tutorialPurple,
			},
		},
		position: { top: height * 0.3, left: width * 0.15 },
	},
	{
		Label: null,
		subText: {
			text: "Kartın arka kısmını inceledikten sonra sağa kaydır!",
			style: {
				marginHorizontal: 15,
				color: colors.white,
				fontFamily: "PoppinsBold",
				marginVertical: 10,
				fontSize: Math.min(height * 0.028, 22),
				textAlign: "center",
			},
			textContainer: {
				maxWidth: Math.min(width * 0.65, 263),
				width: width * 0.54,
				left: width * 0.145,
				bottom: height * -0.06,
				color: colors.soft_red,
				borderRadius: 10,
				opacity: 0.75,
				backgroundColor: colors.tutorialPurple,
			},
		},
		position: { top: height * 0.3, left: width * 0.15 },
	},
	{
		Label: null,
		subText: {
			text: "Haydi şimdi de sola kaydır!",
			style: {
				marginHorizontal: 15,
				color: colors.white,
				fontFamily: "PoppinsBold",
				marginVertical: 10,
				fontSize: Math.min(height * 0.028, 22),
				textAlign: "center",
			},
			textContainer: {
				maxWidth: Math.min(width * 0.65, 263),
				width: width * 0.65,
				left: width * -0.06,
				bottom: height * -0.03,
				color: colors.soft_red,
				borderRadius: 10,
				opacity: 0.75,
				backgroundColor: colors.tutorialPurple,
			},
		},
		position: { top: height * 0.3, left: width * 0.15 },
	},
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

const eventList = [
	{
		Location: "",
		Description: "Zeytin Ağacı",
		Date: "9",
		click: 67,
		detailClick: 16,
		LinkClickCount: 0,
		EventId: 560,
		StartTime: "",
		endDate: "",
		Category: "Film",
		Organizator: "",
		BuyLink: "",
		Culture: 0,
		Konser: 0,
		Film: 1,
		Kacmaz: 0,
		experience: null,
		Kampus: "0",
		Gece: 0,
		festival: "0",
		director: "Nuran Evren Şit",
		genre: "Dizi",
		lineUp: "Tuba Büyüküstün, Seda Bakan, Boncuk Yılmaz...",
		visible: 1,
		deleted: 0,
		platform: null,
		isLiked: "1",
		photos: [
			"https://dorm-img-dev.s3.eu-central-1.amazonaws.com/5dfdb0dbb1b4d4de2b92c2e7e508fbda",
			"https://dorm-img-dev.s3.eu-central-1.amazonaws.com/d0fe4c2a982bfa792c02695232a8036d",
		],
	},
	{
		Location: "",
		Description: "Echoes",
		Date: "9",
		click: 53,
		detailClick: 11,
		LinkClickCount: 0,
		EventId: 561,
		StartTime: "",
		endDate: "",
		Category: "Film",
		Organizator: "",
		BuyLink: "",
		Culture: 0,
		Konser: 0,
		Film: 1,
		Kacmaz: 0,
		experience: null,
		Kampus: "0",
		Gece: 0,
		festival: "0",
		director: "Vanessa Gazy",
		genre: "Minidizi",
		lineUp: "Michelle Monaghan, Matt Bomer, Karen Robinson",
		visible: 1,
		deleted: 0,
		platform: null,
		isLiked: "0",
		photos: ["https://dorm-img-dev.s3.eu-central-1.amazonaws.com/e5ac5349666fdb2b3442f8f2983bf6bd"],
	},
];

export default function BeginningTutorialModal({ navigation, route }) {
	const [index, setIndex] = useState(route?.params?.index ?? 0);
	const { seteventTutorialDone, setmainPageTutorialDone } = useContext(AuthContext);
	const insets = useSafeAreaInsets();

	const { Label, subText, position } = useMemo(() => POSITIONS[index], [index]);

	// const handleEnd = async () => {
	// 	await AsyncStorage.getItem("Constants").then(async (res) => {
	// 		const list = JSON.parse(res);
	// 		const toSave = { ...list, tutorialShown: true };
	// 		await AsyncStorage.setItem("Constants", JSON.stringify(toSave));
	// 	});
	// 	// await AsyncStorage.setItem("tutorialShown", "yes");
	// 	navigation.replace("MainScreen");
	// };

	const handleProceed = () => {
		// if (index === 2) {
		// 	navigation.replace("ProfileCards", {
		// 		idx: 0,
		// 		list: peopleList,
		// 		isTutorial: false,
		// 	});
		// }
		if (index == 2) {
			AsyncStorage.getItem("Constants").then(async (res) => {
				const list = JSON.parse(res);
				const toSave = { ...list, mainPageTutorialDone: true };
				await AsyncStorage.setItem("Constants", JSON.stringify(toSave));
			});
			setmainPageTutorialDone();
			navigation.goBack();
			return;
		}
		if (index == 4 && route.params.fromPeopleTutorial == true) { 
			navigation.navigate("PeopleTutorialModal", { peopleTextTutorialDone: true }); 
			return; 
		}
		if (index == 7) {
			const eventtutorialdone = async () => {
				await AsyncStorage.getItem("Constants").then(async (res) => {
					const list = JSON.parse(res);
					const toSave = { ...list, eventTutorialDone: true };
					await AsyncStorage.setItem("Constants", JSON.stringify(toSave));
				});
			}
			eventtutorialdone();
			seteventTutorialDone();
			navigation.goBack();
			return;
		}
		if (index == 8 || index == 9) { navigation.goBack(); return; }
		if (index === POSITIONS.length - 1) {
			navigation.replace("MainScreen");
			return;
		}
		setIndex(index + 1);
	};

	return (
		<View style={[styles.wrapper, { height: height + insets.top }]}>
			<StatusBar />
			<Pressable
				onPress={handleProceed}
				style={[commonStyles.Container, { backgroundColor: "transparent", marginTop: insets.top }]}
			>
				<View style={[{ position: "absolute" }, position]}>
					{Label && <View style={styles.label}>{Label}</View>}
				</View>
				<View
					style={[{ position: "absolute", marginTop: Math.min(height * 0.035, 35) * 2 }, position]}
				>
					<View style={[styles.subTextWrapper, subText.textContainer]}>
						<Text style={[styles.subText, subText.style]}>{subText.text}</Text>
					</View>
				</View>
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
