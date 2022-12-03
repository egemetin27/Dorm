import { useContext } from "react";
import { View, Text, Image, Dimensions, Pressable, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import axios from "axios";

import CustomButton from "./button.components";

import { MessageContext } from "../contexts/message.context";

import { colors } from "../visualComponents/colors";
import crypto from "../functions/crypto";
import url from "../connection";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthContext } from "../contexts/auth.context";

const { width, height } = Dimensions.get("window");

const IMAGE_LIST = {
	sad_face: require("../assets/sadFace.png"),
	question_face: require("../assets/questionFace.png"),
	wave_hand: require("../assets/waveHand.png"),
	trash_can: require("../assets/biggerTrashCan.png"),
	dorm_text: require("../assets/dorm_text.png"),
	dorm_logo: require("../assets/logoGradient.png"),
	monkey: require("../assets/monkey.png"),
	unmatch: require("../assets/unmatch.png"),
	flag: require("../assets/flag.png"),
};

export default function ModalPage({ navigation, route }) {
	const { getMessagesList } = useContext(MessageContext);
	const {
		user: { userId, sesToken },
		setpeopleTutorialDone,
	} = useContext(AuthContext);
	const MODAL_TYPES = {
		UNMATCH_MODAL: {
			image: "unmatch",
			title: "Emin misin?",
			body: "Eşleşmeyi kaldırırsan bu kişiyi artık görüntüleyemezsin ve başka bir mesaj atamazsın.",
			buttons: [
				{
					text: "Eşleşmeyi Kaldır",
					onPress: async ({ matchId = 0, userId = 0, sesToken = "" }, getMessagesList) => {
						const encryptedData = crypto.encrypt({ userId, unmatchId: matchId });
						await axios
							.post(url + "/userAction/unmatch", encryptedData, {
								headers: { "access-token": sesToken },
							})
							.then((res) => {
								console.log(res.data);
								getMessagesList();
							})
							.catch((err) => {
								console.log(err);
							});
						navigation.replace("MainScreen", { screen: "Mesajlar" });
					},
				},
			],
		},
		NO_LIKES_ON_EVENT: {
			image: "sad_face",
			title: "Şu an için etkinliği beğenen kimse kalmadı gibi görünüyor",
			body: "Etkinliği paylaşarak beğenmeleri arttırmamıza yardımcı olabilirsin",
			buttons: [],
		},
		CANNOT_SEE_EVENT_LIKES: {
			image: "sad_face",
			title: "Görünmezliği Kapatmalısın",
			body: "Etkinliğe gidenleri görebilmek için diğer insanlar tarafından görülebilir olmalısın",
			buttons: [],
		},
		FILTER_DISABLED: {
			image: "sad_face",
			title: "Maalesef Filtre Aktif Değil",
			body: "Filtreyi kullanmayı çok istiyorsan bize iletebilir ve öncelikler arasına alınmasını sağlayabilirsin",
			buttons: [],
		},
		MAXHOBBIES: {
			image: "sad_face",
			title: "10'dan fazla ilgi alanı seçemezsin",
			body: "Lütfen en sevdiğin 10 hobini işaretle",
			buttons: [],
		},
		CONNECTION_ERROR: {
			image: "unmatch",
			title: "BAĞLANTI HATASI",
			body: "Lütfen internet bağlantını kontrol et",
			buttons: [],
		},
		REPORT_FEEDBACK: {
			image: "flag",
			// title: "BAĞLANTI HATASI",
			body: "Destek ekibimiz bu kişiyi en kısa sürede inceleyerek sana dönüş sağlayacak. Uyarın için teşekkürler!\n\ndorm senin sayende daha güvenli.",
			buttons: [
				{
					text: "Devam Et",
					onPress: () => {
						navigation.goBack();
					},
				},
			],
		},
		EVENT_LIKED_MESSAGE: {
			image: "dorm_text",
			title: "Bu eventi beğendiğine çok sevindik!",
			body: route.params?.body ?? "",
			buttons: [],
		},
		RIGHT_SWIPE_LIKE_MESSAGE: {
			image: null,
			containerStyle: {
				width: width * 0.84,
				height: height * 0.235,
				paddingTop: height * 0.02,
				paddingBottom: 0,
				paddingLeft: width * 0.065,
				paddingRight: width * 0.02,
			},
			title: "İlgileniyor musun?",
			titleStyle: {
				fontFamily: "PoppinsBold",
				fontSize: width * 0.048,
				color: "#000000",
				textAlign: "left",
				alignSelf: "flex-start",
			},
			body: "Bir kişiyi sağa kaydırmak onunla ilgilendiğin anlamına geliyor!",
			bodyStyle: {
				fontFamily: "Poppins",
				fontSize: width * 0.042,
				color: "#000000",
				textAlign: "left",
				alignSelf: "flex-start",
			},
			buttons: [
				{
					text: "ANLADIM",
					onPress: () => {
						navigation.goBack();
						setTimeout(() => {
							navigation.navigate("BeginningTutorialModal", { index: 9, fromPeopleTutorial: true });
						}, 100);
					},
					buttonType: "textButton",
				},
			],
			noExitButton: true,
			dismissFunction: () => {
				navigation.goBack();
			},
		},
		LEFT_SWIPE_LIKE_MESSAGE: {
			image: null,
			containerStyle: {
				width: width * 0.83,
				height: height * 0.235,
				paddingTop: height * 0.02,
				paddingBottom: 0,
				paddingLeft: width * 0.065,
				paddingRight: width * 0.02,
			},
			title: "İlgilenmiyor musun?",
			titleStyle: {
				fontFamily: "PoppinsBold",
				fontSize: width * 0.048,
				color: "#000000",
				textAlign: "left",
				alignSelf: "flex-start",
			},
			body: "Bir kişiyi sola kaydırmak onunla ilgilenmediğin anlamına geliyor!",
			bodyStyle: {
				fontFamily: "Poppins",
				fontSize: width * 0.042,
				color: "#000000",
				textAlign: "left",
				alignSelf: "flex-start",
			},
			buttons: [
				{
					text: "ANLADIM",
					onPress: () => {
						// const peopletutorialdone = async () => {
						// 	await AsyncStorage.getItem("Constants").then(async (res) => {
						// 		const list = JSON.parse(res);
						// 		const toSave = { ...list, peopleTutorialDone: true };
						// 		await AsyncStorage.setItem("Constants", JSON.stringify(toSave));
						// 	});
						// 	setpeopleTutorialDone();
						// }
						// peopletutorialdone();
						setpeopleTutorialDone();
						const dataToSent = crypto.encrypt({ userId: userId, tutorialName: "tutorial1" });
						axios
							.post(url + "/profile/updateTutorial", dataToSent, {
								headers: { "access-token": sesToken },
							})
							.then((res) => {
								console.log(res.data);
							})
							.catch((err) => {
								console.log(err);
							});
						navigation.goBack();
						navigation.goBack();
					},
					buttonType: "textButton",
				},
			],
			noExitButton: true,
			dismissFunction: () => {
				const peopletutorialdone = async () => {
					AsyncStorage.getItem("Constants").then(async (res) => {
						const list = JSON.parse(res);
						const toSave = { ...list, peopleTutorialDone: true };
						await AsyncStorage.setItem("Constants", JSON.stringify(toSave));
					});
					setpeopleTutorialDone();
				};
				peopletutorialdone();
				const dataToSent = crypto.encrypt({ userId: userId, tutorialName: "tutorial1" });
				axios
					.post(url + "/profile/updateTutorial", dataToSent, {
						headers: { "access-token": sesToken },
					})
					.then((res) => {
						console.log(res.data);
					})
					.catch((err) => {
						console.log(err);
					});
				navigation.goBack();
				navigation.goBack();
			},
		},
		EMPTY_NAME: {
			image: "sad_face",
			title: "Gerekli yerleri doldurun",
			body: "Adınızı veya soyadınızı boş bırakamazsınız.",
			buttons: [],
		},
		MAX_BLUR: {
			image: "sad_face",
			title: "Hakkınız kalmadı",
			body: "Her 24 saate sizi beğenen sadece 1 kişiyi görebilirsiniz",
			buttons: [],
		},
	};

	const { modalType, buttonParamsList } = {
		modalType: "NO_LIKES_ON_EVENT",
		buttonParamsList: [],
		...route.params,
	};
	const {
		title,
		body,
		buttons,
		image,
		titleStyle,
		noExitButton,
		bodyStyle,
		containerStyle,
		dismissFunction,
	} = MODAL_TYPES[modalType];
	const imageUrl = image ? IMAGE_LIST[image] : null;

	const handleDismiss = () => {
		try {
			// dismiss();
			route.params.dismiss ? route.params.dismiss() : navigation.goBack();
		} catch (err) {
			console.log("error on ModalPage > handleDismiss():", err);
		}
	};

	return (
		<Pressable onPress={dismissFunction ?? handleDismiss} style={styles.wrapper}>
			{/* <BlurView tint={"dark"} intensity={20} style={styles.wrapper}> */}
			<Pressable onPress={null}>
				<View style={[styles.modal_container, containerStyle]}>
					{noExitButton != true && (
						<Pressable style={styles.modal_exit_button} onPress={handleDismiss}>
							<Feather
								style={{ color: "#9D9D9D" }}
								name="x"
								size={Math.min(32, width * 0.06)}
								color="black"
							/>
						</Pressable>
					)}
					{imageUrl && <Image source={imageUrl} style={styles.icon} />}
					{title && <Text style={[styles.title, titleStyle]}>{title}</Text>}
					{body && <Text style={[styles.body, bodyStyle]}>{body}</Text>}
					{buttons.map(({ buttonType, text, onPress }, index) => {
						return (
							<CustomButton
								key={index}
								buttonType={buttonType}
								text={text}
								onPress={() => {
									onPress(buttonParamsList[index], getMessagesList);
								}}
							/>
						);
					})}
				</View>
			</Pressable>
			{/* </BlurView> */}
		</Pressable>
	);
}

const styles = StyleSheet.create({
	wrapper: {
		width: "100%",
		flex: 1,
		backgroundColor: "rgba(0,0,0,0.5)",
		justifyContent: "center",
		alignItems: "center",
	},

	modal_container: {
		width: Math.min(width * 0.9, 360),
		backgroundColor: "#F4F3F3",
		alignItems: "center",
		justifyContent: "space-evenly",
		paddingVertical: Math.min(height * 0.05, 30),
		paddingHorizontal: Math.min(width * 0.05, 20),
		borderRadius: 16,
	},

	modal_exit_button: {
		zIndex: 5,
		position: "absolute",
		top: "5%",
		right: "5%",
	},
	icon: {
		height: height * 0.08,
		maxWidth: "50%",
		marginBottom: 20,
		resizeMode: "contain",
	},
	title: {
		textAlign: "center",
		fontSize: Math.min(24, width * 0.06),
		fontFamily: "PoppinsExtraBold",
		color: "#666666",
		marginBottom: 10,
	},
	body: {
		textAlign: "center",
		color: colors.medium_gray,
		fontSize: Math.min(16, width * 0.04),
	},
});
