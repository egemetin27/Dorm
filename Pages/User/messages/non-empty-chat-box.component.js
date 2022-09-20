import { useCallback, useContext, useEffect, useState, useMemo } from "react";
import { View, Text, Image, Dimensions, Pressable, StyleSheet } from "react-native";
import Swipeable from "react-native-gesture-handler/Swipeable";
import { useNavigation } from "@react-navigation/native";

import CustomImage from "../../../components/custom-image.component";

import { MessageContext } from "../../../contexts/message.context";
import { AuthContext } from "../../../contexts/auth.context";

import { getWhen } from "../../../utils/date.utils";
import { colors, Gradient } from "../../../visualComponents/colors";
import { NotificationContext } from "../../../contexts/notification.context";

const { width, height } = Dimensions.get("window");

const SwipedPanel = ({ handleUnmatch, handleDeleteChat }) => {
	return (
		<View style={styles.swipeable_container}>
			<Pressable onPress={handleUnmatch} style={styles.swipeable_button}>
				<Image
					style={styles.swipeable_icon}
					resizeMode={"contain"}
					source={require("../../../assets/Union.png")}
				/>
			</Pressable>
			{/*<View style={{ height: "60%", width: 1.5, backgroundColor: colors.gray }} />
			 <Pressable onPress={handleDeleteChat} style={styles.swipeable_button}>
				<Image
					style={styles.swipeable_icon}
					resizeMode={"contain"}
					source={require("../../../assets/trashCan.png")}
				/>
			</Pressable> */}
		</View>
	);
};

const NonEmptyChatBox = ({ match }) => {
	const { getLastMessage, setunreadChatID } = useContext(MessageContext);
	const { setUnreadChecker } = useContext(NotificationContext);
	const { user } = useContext(AuthContext);
	const navigation = useNavigation();
	const [MatchId, setMatchId] = useState(match.MatchId);
	const { Name } = match.userData;
	const imageUrl = useMemo(
		() => match.userData.photos.find(({ Photo_Order }) => Photo_Order === 1)?.PhotoLink ?? null,
		[match]
	);

	const { message, date, unread, sourceId } = {
		message: "",
		date: 0,
		unread: 0,
		sourceId: 0,
		...getLastMessage(MatchId),
	};
	const [isUnreadMessage, setIsUnreadMessage] = useState(false);

	useEffect(() => {
		if (sourceId != user.userId) {
			setunreadChatID(MatchId, unread == 1);
			setUnreadChecker(unread == 1);
			setIsUnreadMessage(unread == 1);
		}
	}, [unread]);

	const renderRightActions = useCallback(() => {
		const handleUnmatch = () => {
			//TODO: unmatch
			navigation.navigate("CustomModal", {
				modalType: "UNMATCH_MODAL",
				buttonParamsList: [{ matchId: MatchId, userId: user.userId, sesToken: user.sesToken }],
			});
		};

		// const handleDeleteChat = () => {
		// 	//TODO: delete chat
		// 	navigation.navigate("CustomModal", {
		// 		image: "trash_can",
		// 		title: "Emin misin?",
		// 		body: "Silersen bunu geri alamazsın ancak bu kişiyi “Sohbet Etmek İsteyebilirsin”de bulabilirsin.",
		// 		buttons: [
		// 			{
		// 				text: "Konuşmayı Sil",
		// 				onPress: () => {
		// 					console.log("Siliniyor");
		// 				},
		// 			},
		// 		],
		// 	});
		// };

		return <SwipedPanel handleUnmatch={handleUnmatch} />;
	}, []);

	const handlePress = () => {
		navigation.navigate("Chat", { otherUser: match });
	};

	return (
		<View style={styles.container}>
			<Swipeable renderRightActions={renderRightActions} overshootRight={false}>
				<Pressable style={styles.pressable_container} onPress={handlePress}>
					<View style={styles.image_container}>
						{imageUrl && <CustomImage url={imageUrl} style={styles.image} />}
						{isUnreadMessage && (
							<View
								style={{
									position: "absolute",
									height: "100%",
									right: -width * 0.02,
									justifyContent: "center",
									backgroundColor: "transparent",
								}}
							>
								<View
									style={{
										width: width * 0.04,
										aspectRatio: 2 / 3,
										borderWidth: width * 0.006,
										borderColor: "white",
										borderRadius: width * 0.01,
										overflow: "hidden",
									}}
								>
									<Gradient
										style={{
											width: "100%",
											height: "100%",
										}}
									/>
								</View>
							</View>
						)}
					</View>
					<View style={{ flex: 1, marginLeft: width * 0.04 }}>
						<Text style={styles.name}>{Name}</Text>
						<Text numberOfLines={2} style={styles.text}>
							{message}
						</Text>
					</View>
					<View>
						<Text style={styles.date}>{getWhen(date)}</Text>
					</View>
				</Pressable>
			</Swipeable>
		</View>
	);
};

export default NonEmptyChatBox;

const styles = StyleSheet.create({
	container: {
		backgroundColor: colors.light_gray2,
		borderRadius: height * 0.01,
		elevation: 5,
		// overflow: "hidden",
		shadowColor: "black",
		shadowOffset: {
			width: 0,
			height: 0,
		},
		shadowOpacity: 0.2,
		shadowRadius: 5,
	},
	pressable_container: {
		backgroundColor: colors.full_white,
		height: height * 0.12,
		flexDirection: "row",
		paddingVertical: height * 0.01,
		paddingHorizontal: width * 0.02,
		borderRadius: height * 0.01,
		shadowColor: "black",
		shadowOffset: {
			width: 0,
			height: 0,
		},
		shadowOpacity: 0.2,
		shadowRadius: 10,
		elevation: 3,
		// overflow: "hidden",
	},
	swipeable_container: {
		backgroundColor: colors.light_gray,
		width: "20%",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		borderRadius: height * 0.01,
		overflow: "hidden",
	},
	swipeable_button: {
		// backgroundColor: "blue",
		width: "45%",
		height: "72%",
		alignItems: "center",
		justifyContent: "center",
		paddingVertical: "12%",
	},
	swipeable_icon: {
		tintColor: colors.gray,
		height: "100%",
		width: "100%",
	},

	image_container: {
		aspectRatio: 2 / 3,
		height: "100%",
		// borderRadius: height * 0.01,
		// overflow: "hidden",
	},
	image: {
		borderRadius: height * 0.01,
		minHeight: "100%",
		minWidth: "100%",
		resizeMode: "cover",
	},
	name: {
		color: "#4C525C",
		fontSize: Math.min(18, height * 0.024),
		letterSpacing: 0.24,
		fontFamily: "PoppinsBold",
		marginBottom: height * 0.005,
	},
	text: {
		color: "#B6B6B6",
		fontSize: Math.min(14, height * 0.018),
		letterSpacing: 0.2,
	},
	date: {
		color: "#B6B6B6",
		fontSize: Math.min(14, height * 0.019),
		letterSpacing: 0.2,
	},
});
