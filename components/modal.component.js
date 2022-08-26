import { useContext } from "react";
import { View, Text, Image, Dimensions, Pressable, StyleSheet } from "react-native";
import { BlurView } from "expo-blur";
import { Feather } from "@expo/vector-icons";
import axios from "axios";

import CustomButton from "./button.components";

import { MessageContext } from "../contexts/message.context";

import { colors } from "../visualComponents/colors";
import crypto from "../functions/crypto";
import url from "../connection";

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
};

const MODAL_TYPES = {
	UNMATCH_MODAL: {
		image: "unmatch",
		title: "Emin misin?",
		body: "Eşleşmeyi kaldırırsan bu kişiyi artık görüntüleyemezsin ve başka bir mesaj atamazsın.",
		buttons: [
			{
				text: "Eşleşmeyi Kaldır",
				onPress: ({ matchId = 0, userId = 0, sesToken = "" }, getMessagesList) => {
					const encryptedData = crypto.encrypt({ userId, unmatchId: matchId });
					axios
						.post(url + "/unmatch", encryptedData, {
							headers: { "access-token": sesToken },
						})
						.then((res) => {
							console.log(res.data);
							getMessagesList();
						})
						.catch((err) => {
							console.log(err);
						});
				},
			},
		],
	},
	NO_LIKES_ON_EVENT: {
		image: "sad_face",
		title: "Maalesef Etkinliği Kimse Beğenmemiş",
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
};

export default function ModalPage({ navigation, route }) {
	const { getMessagesList } = useContext(MessageContext);

	const { modalType, buttonParamsList } = {
		modalType: "NO_LIKES_ON_EVENT",
		buttonParamsList: [],
		...route.params,
	};
	const { title, body, buttons, image } = MODAL_TYPES[modalType];
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
		<Pressable onPress={handleDismiss} style={styles.wrapper}>
			{/* <BlurView tint={"dark"} intensity={20} style={styles.wrapper}> */}
			<Pressable onPress={null}>
				<View style={styles.modal_container}>
					<Pressable style={styles.modal_exit_button} onPress={handleDismiss}>
						<Feather
							style={{ color: "#9D9D9D" }}
							name="x"
							size={Math.min(32, width * 0.06)}
							color="black"
						/>
					</Pressable>
					{imageUrl && <Image source={imageUrl} style={styles.icon} />}
					{title && <Text style={styles.title}>{title}</Text>}
					{body && <Text style={styles.body}>{body}</Text>}
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
		marginBottom: 10,
		resizeMode: "contain",
	},
	title: {
		textAlign: "center",
		fontSize: Math.min(24, width * 0.06),
		fontFamily: "PoppinsExtraBold",
		color: "#666666",
	},
	body: {
		textAlign: "center",
		color: colors.medium_gray,
		fontSize: Math.min(16, width * 0.04),
	},
});
