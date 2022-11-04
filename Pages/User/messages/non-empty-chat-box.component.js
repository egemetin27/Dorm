import { useCallback, useContext, useEffect, useState, useMemo, Fragment } from "react";
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

const fontSize = Math.min(18, height * 0.024);

const MATCH_TYPES = {
	event: "Etkinlik",
	flirt: "Flört",
	friend: "Arkadaşlık",
};

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

	const matchType = useMemo(() => {
		if (match?.eventId !== 0) return "event";
		if (match?.matchMode === 0) return "flirt";
		return "friend";
	}, [match]);

	const borderColor = useMemo(() => colors[matchType], [matchType]);

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
		<View style={[styles.container]}>
			<Swipeable renderRightActions={renderRightActions} overshootRight={false}>
				<Pressable
					style={[
						styles.pressable_container,
						{ backgroundColor: `${isUnreadMessage ? borderColor + "1a" : "transparent"}` },
					]}
					// style={[styles.pressable_container, { backgroundColor: "blue" }]}
					onPress={handlePress}
				>
					<View style={[styles.imageBorder, { borderColor }]}>
						<View style={styles.imageWrapper}>
							{imageUrl && <CustomImage url={imageUrl} style={styles.image} />}
						</View>
					</View>

					<View
						style={{ flex: 1, paddingHorizontal: width * 0.04, justifyContent: "space-between" }}
					>
						<View style={{ flex: 1, flexDirection: "row", justifyContent: "space-between" }}>
							<Text style={styles.name}>{Name}</Text>
							<Text style={styles.date}>{getWhen(date)}</Text>
						</View>
						<View
							style={{
								flex: 1,
								flexDirection: "row",
								justifyContent: "space-between",
								alignItems: "center",
							}}
						>
							<View style={{ flexShrink: 1, paddingRight: width * 0.04 }}>
								<Text numberOfLines={1} style={styles.text}>
									{message}
								</Text>
							</View>
							{isUnreadMessage && (
								<View
									style={[
										styles.numberOfMessagesContainer,
										{
											backgroundColor: borderColor,
										},
									]}
								>
									<Text style={styles.numberOfMessages}>
										{/* TODO: add the number of messages here */}
									</Text>
								</View>
							)}
						</View>
						<View
							style={{
								flex: 1,
								flexDirection: "row",
							}}
						>
							<View
								style={{
									height: fontSize * 1.6,
									flexDirection: "row",
									alignItems: "center",
									borderColor,
									borderWidth: 2,
									paddingHorizontal: fontSize * 0.4,
									borderRadius: fontSize * 0.8,
								}}
							>
								<Text style={[styles.matchModeBold, { color: borderColor }]}>
									{MATCH_TYPES[matchType]}
								</Text>
								{matchType === "event" && (
									<Fragment>
										<View
											style={{
												height: fontSize * 0.3,
												aspectRatio: 1,
												backgroundColor: borderColor,
												marginHorizontal: fontSize * 0.5,
												borderRadius: fontSize * 0.15,
											}}
										/>

										<Text style={[styles.matchMode, { color: borderColor }]}>
											{match.Description}
										</Text>
									</Fragment>
								)}
							</View>
						</View>
					</View>
					<View></View>
				</Pressable>
			</Swipeable>
		</View>
	);
};

export default NonEmptyChatBox;

const styles = StyleSheet.create({
	container: {
		marginLeft: width * 0.03,
	},
	pressable_container: {
		flexDirection: "row",
		padding: width * 0.016,
		borderTopLeftRadius: height * 0.06 + width * 0.016,
		borderBottomLeftRadius: height * 0.06 + width * 0.016,
	},

	swipeable_icon: {
		tintColor: colors.gray,
		height: "100%",
		width: "100%",
	},
	imageBorder: {
		justifyContent: "center",
		height: height * 0.12,
		aspectRatio: 1,
		padding: height * 0.006,
		borderRadius: height * 0.06,
		borderWidth: height * 0.004,
	},
	imageWrapper: {
		backgroundColor: "#653cf8",
		overflow: "hidden",
		borderRadius: height * 0.06,
	},
	image: {
		minHeight: "100%",
		minWidth: "100%",
		resizeMode: "cover",
	},
	name: {
		color: colors.black,
		fontSize: fontSize,
		letterSpacing: 0.24,
		fontFamily: "PoppinsBold",
		marginBottom: height * 0.005,
	},
	text: {
		color: colors.grayNew,
		fontSize: fontSize * 0.8,
	},
	date: {
		color: colors.grayNew,
		fontSize: fontSize * 0.8,
		letterSpacing: 0.2,
	},
	numberOfMessagesContainer: {
		height: fontSize * 1.3,
		aspectRatio: 1,
		alignItems: "center",
		justifyContent: "center",
		borderRadius: fontSize * 0.4,
	},
	numberOfMessages: {
		color: colors.white,
		fontFamily: "PoppinsBold",
		fontSize: fontSize * 0.8,
	},
	matchModeBold: {
		fontFamily: "PoppinsBold",
		letterSpacing: 0.5,
	},
	matchMode: {
		letterSpacing: 0.8,
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
});
