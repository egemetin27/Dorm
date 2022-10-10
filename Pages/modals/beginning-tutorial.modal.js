import { useContext, useMemo, useState } from "react";
import { View, Dimensions, StyleSheet, Pressable, Text, Image } from "react-native";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Octicons } from "@expo/vector-icons";

import commonStyles from "../../visualComponents/styles";
import { colors, GradientText } from "../../visualComponents/colors";
import CustomButton from "../../components/button.components";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AuthContext } from "../../contexts/auth.context";
import axios from "axios";
import crypto from "../../functions/crypto";
import url from "../../connection";
import { TouchableOpacity } from "react-native-gesture-handler";
import { NotificationContext } from "../../contexts/notification.context";
import { color } from "react-native-reanimated";
import useBackHandler from "../../hooks/useBackHandler";

const { height, width } = Dimensions.get("window");

const PEOPLE_LIST_HEIGHT = height * 0.345;
const EVENT_HEADER_HEIGHT = height * 0.15;

export default function BeginningTutorialModal({ navigation, route }) {

	const [index, setIndex] = useState(route?.params?.index ?? 0);
	const { user: { userId, sesToken }, seteventTutorialDone, setmainPageTutorialDone } = useContext(AuthContext);
	const { setEventLike } = useContext(NotificationContext);

	const insets = useSafeAreaInsets();

	const [favFlag, setFavFlag] = useState(false);

	const [POSITIONS, setPOSITIONS] = useState([
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
		{
			Label: (
				<TouchableOpacity onPress={async () => {
					const id = userId;
					const encryptedData = crypto.encrypt({ userId: id, eventId: route.params.EventId, likeMode: 1 });
					setEventLike(true);
					setFavFlag(true);
					await axios
						.post(url + "/userAction/likeEvent", encryptedData, {
							headers: { "access-token": sesToken },
						})
						.then((res) => {
							if (likeMessage.length > 0) {
								navigation.navigate("CustomModal", {
									modalType: "EVENT_LIKED_MESSAGE",
									body: likeMessage,
								});
							}
						})
						.catch((err) => {
							setEventLike(false);
							setFavFlag(false);
						});
					navigation.goBack();
				}}>
					<View
						style={{
							backgroundColor: colors.white,
							height: height * 0.098,
							aspectRatio: 1 / 1,
							borderRadius: Math.max(Math.min(width * 0.1, height * 0.08), 60),
							justifyContent: "center",
							alignItems: "center",
						}}
					>
						{favFlag ? (
							<Image
								style={{
									aspectRatio: 1,
									height: (Math.max(Math.min(width * 0.13, height * 0.1), 60) * 2) / 3,
									resizeMode: "contain",
									marginBottom:  0.190983 * 20,
								}}
								source={require("../../assets/Fav_filled.png")}
							/>
						) : (
							<Image
								style={{
									aspectRatio: 1,
									height: (Math.max(Math.min(width * 0.13, height * 0.1), 60) * 2) / 3,
									resizeMode: "contain",
									marginBottom: 0.190983 * 20,
								}}
								source={require("../../assets/Fav.png")}
							/>
						)}
					</View>
				</TouchableOpacity>
			),
			labelStyle: {
				backgroundColor: null,
			},
			subText: {
				text: "Şimdi etkiniği beğen ve sonrasında karta çift tıklayarak detayları gör",
				style: { textAlign: "left", paddingVertical: height * 0.01 },
			},
			position: { top: Math.min(height * 0.7, width * 1.36), left: width * 0.73 },
			parentStyle: {
				backgroundColor: "rgba(0,0,0,0.8)",
			},
			positionSubText: { top: height * 0.4, left: width * 0.1 },
		},
		{
			Label: (
				<TouchableOpacity onPress={async () => {
					const encryptedData = crypto.encrypt({
						eventId: route.params.EventId,
						userId: userId,
					});
					navigation.goBack();
					await axios
						.post(url + "/lists/eventParticipants", encryptedData, {
							headers: { "access-token": sesToken },
						})
						.then((res) => {
							const data =
								typeof res.data == "object" && Object.keys(res.data).length == 0
									? res.data
									: crypto.decrypt(res.data);
							if (data.length > 0) {
								navigation.push("ProfileCards", {
									idx: 0,
									list: data,
									myID: userId,
									sesToken: sesToken,
									fromEvent: true,
									eventId: route.params.EventId,
									eventName: route.params.name,
								});
							} else {
								navigation.navigate("CustomModal", {
									modalType: "NO_LIKES_ON_EVENT",
								});
							}
						})
						.catch((err) => {
							if (err?.response?.status == 410) {
								Alert.alert("Oturumunuzun süresi doldu!");
								signOut();
								return;
							}
							console.log(err);
						});
					seteventTutorialDone();
					const dataToSent = crypto.encrypt({ userId: userId, "tutorialName": "tutorial2" });
					axios.post(url + "/profile/updateTutorial", dataToSent, { headers: { "access-token": sesToken }, })
						.then((res) => {
							console.log(res.data);
						}).catch((err) => {
							console.log(err);
						});
				}}>
					<View
						style={{
							paddingHorizontal: 10,
							paddingVertical: 15,
							borderRadius: 10,
							borderWidth: 1,
							borderColor: colors.light_gray,
							justifyContent: "center",
							alignItems: "center",
							//marginTop: 10,
						}}
					>
						<Text
							numberOfLines={1}
							adjustsFontSizeToFit={true}
							style={{
								fontSize: Math.min(width * 0.053, 21),
								color: colors.light_gray,
							}}
						>
							Etkinliği Beğenen Kişileri Keşfet
						</Text>
					</View>
				</TouchableOpacity>
			),
			labelStyle: {
				backgroundColor: "#000000",
				paddingVertical: 0,
				paddingHorizontal: 0,
			},
			subText: {
				text: "Üstteki butona basarak etkinliğe giden kişileri kaydırmaya başla!",
				style: { textAlign: "left", paddingVertical: height * 0.085 },
			},
			position: { top: Math.min(height * 0.68, width * 1.323), left: width * 0.09 },
			// position: { top: height * 0.655, left: width * 0.12 },
			parentStyle: {
				backgroundColor: "rgba(0,0,0,0.78)",
			},
		},
	]);

	// const handleEnd = async () => {
	// 	await AsyncStorage.getItem("Constants").then(async (res) => {
	// 		const list = JSON.parse(res);
	// 		const toSave = { ...list, tutorialShown: true };
	// 		await AsyncStorage.setItem("Constants", JSON.stringify(toSave));
	// 	});
	// 	// await AsyncStorage.setItem("tutorialShown", "yes");
	// 	navigation.replace("MainScreen");
	// };
	const { Label, subText, position, labelStyle = null, parentStyle = null, positionSubText = null } = useMemo(() => POSITIONS[index], [index]);

	useBackHandler(() => navigation.goBack())

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

			const dataToSent = crypto.encrypt({ userId: userId, "tutorialName": "tutorial6" });
			axios.post(url + "/profile/updateTutorial", dataToSent, { headers: { "access-token": sesToken } })
				.then((res) => {
					console.log(res.data);
				}).catch((err) => {
					console.log(err);
				});

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
			setIndex(10);
			// seteventTutorialDone();
			// const dataToSent = crypto.encrypt({ userId: userId, "tutorialName": "tutorial2" });
			// axios.post(url + "/profile/updateTutorial", dataToSent, { headers: { "access-token": sesToken }, })
			// 	.then((res) => {
			// 		console.log(res.data);
			// 	}).catch((err) => {
			// 		console.log(err);
			// 	});
			//navigation.goBack();
			return;
		}
		if (index == 8 || index == 9) { navigation.goBack(); return; }
		// if (index === POSITIONS.length - 1) {
		// 	navigation.replace("MainScreen");
		// 	return;
		// }
		if (index == 10) {
			return;
		}
		if (index == 11) {
			return;
		}
		setIndex(index + 1);
	};

	return (
		<View style={[styles.wrapper, { height: height + insets.top }, parentStyle]}>
			<StatusBar />
			<Pressable
				onPress={handleProceed}
				style={[commonStyles.Container, {  backgroundColor: "transparent", marginTop: insets.top }]}
			>
				<View style={[{ position: "absolute" }, position]}>
					{Label && <View style={[styles.label, labelStyle]}>{Label}</View>}
				</View>
				<View
					style={[{ position: "absolute", marginTop: Math.min(height * 0.035, 35) * 2 }, position, positionSubText]}
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
