import { useCallback, useContext, useEffect, useState, useMemo } from "react";
import {
	View,
	Text,
	StyleSheet,
	Dimensions,
	FlatList,
	KeyboardAvoidingView,
	Platform,
} from "react-native";

import ChatHeader from "./chat.header";
import ChatInput from "./chat.input";
import ChatMessage from "./chat.message";
import CustomImage from "../../../components/custom-image.component";

import { AuthContext } from "../../../contexts/auth.context";
import { MessageContext } from "../../../contexts/message.context";
import { SocketContext } from "../../../contexts/socket.context";

import { sort } from "../../../utils/array.utils";
import { colors } from "../../../visualComponents/colors";
import { useFocusEffect } from "@react-navigation/native";
import useBackHandler from "../../../hooks/useBackHandler";

const { width, height } = Dimensions.get("screen");

// const defaultChat = [
// 	{
// 		date: "2022-07-22T20:34:32.90",
// 		destId: 31,
// 		matchId: 900,
// 		message: "heyyoo",
// 		sourceId: 32,
// 		unread: 1,
// 	},
// 	{
// 		date: "2022-07-22T20:33:04.32",
// 		destId: 32,
// 		matchId: 900,
// 		message: "Deneme",
// 		sourceId: 31,
// 		unread: 1,
// 	},
// 	{
// 		date: "2022-07-22T20:33:04.32",
// 		destId: 31,
// 		matchId: 900,
// 		message: "Deneme1",
// 		sourceId: 32,
// 		unread: 1,
// 	},
// 	{
// 		date: "2022-07-22T20:33:04.32",
// 		destId: 31,
// 		matchId: 900,
// 		message: "Deneme2",
// 		sourceId: 32,
// 		unread: 0,
// 	},
// 	{
// 		date: "2022-07-22T20:33:04.32",
// 		destId: 31,
// 		matchId: 900,
// 		message: "Deneme3",
// 		sourceId: 32,
// 		unread: 0,
// 	},
// 	{
// 		date: "2022-07-22T20:32:45.52",
// 		destId: 31,
// 		matchId: 900,
// 		message: "Fhjeifiejdj",
// 		sourceId: 32,
// 		unread: 0,
// 	},
// ];

const getLastReadMessage = (messagesList, myId) => {
	var lastIndex = -1;
	if (messagesList[0].sourceId.toString() == myId.toString()) return lastIndex;

	messagesList.every((message, index) => {
		if (message.unread.toString() == "0" || message.sourceId.toString() == myId.toString())
			return false;
		lastIndex = index;
		return true;
	});
	return lastIndex;
};

const Chat = ({ route, navigation }) => {
	const { user } = useContext(AuthContext);
	const { chatsList, readMessagesLocally, getPreviousMessages } = useContext(MessageContext);
	const { connect, disconnect, readMessage } = useContext(SocketContext);

	useBackHandler(() => navigation.goBack());

	const [chatMessages, setChatMessages] = useState([]);
	const [lastReadMessageIndex, setLastReadMessageIndex] = useState(null);

	const { otherUser } = route.params;
	const { otherId, MatchId } = otherUser;
	const { Name } = otherUser.userData;
	const imageUrl = useMemo(
		() => otherUser.userData.photos.find(({ Photo_Order }) => Photo_Order === 1)?.PhotoLink ?? null,
		[otherUser]
	);

	console.log(
		"SSADEAWD",
		otherUser.userData.photos.find(({ Photo_Order }) => Photo_Order === 1)
	);

	useFocusEffect(
		useCallback(() => {
			connect();

			return disconnect;
		}, [])
	);

	useEffect(() => {
		const unsortedChat = chatsList[MatchId] ?? [];
		const sortedChat = sort(unsortedChat, "date", false);
		setChatMessages(sortedChat);
		readMessage(MatchId, otherId);

		if (lastReadMessageIndex !== null) {
			setLastReadMessageIndex(-1);
		}
		if (lastReadMessageIndex == null && sortedChat.length > 0) {
			const index = getLastReadMessage(sortedChat, user.userId);
			setLastReadMessageIndex(index);
		}
	}, [chatsList[MatchId]]);

	useEffect(() => {
		return () => {
			readMessagesLocally(MatchId);
			// readMessagesLocally(MatchId, chatMessages);
		};
	}, []);

	const handleOnEndReached = (event) => {
		if (chatMessages && chatMessages.length < 10) return;
		getPreviousMessages(MatchId, chatMessages[chatMessages.length - 1]?.date);
	};

	console.log({ lastReadMessageIndex });

	return (
		<View style={[styles.container]}>
			<ChatHeader userData={otherUser.userData} matchId={MatchId} />
			{chatMessages.length == 0 ? (
				<View style={styles.no_message_container}>
					{imageUrl && (
						<CustomImage blurRadius={10} style={styles.background_image} url={imageUrl} />
					)}
					<View style={styles.background_image} />
					<Text style={styles.no_message_placeholder}>
						Çekinme! O da senden mesaj bekliyor. Sohbeti başlatmak için bir şaka patlatabilir ya da
						klasiklerden giderek selam yazabilirsin.
					</Text>
				</View>
			) : (
				<View style={styles.chat_container}>
					{chatMessages.length > 0 && (
						<FlatList
							removeClippedSubviews={false}
							onEndReachedThreshold={0}
							onEndReached={handleOnEndReached}
							showsVerticalScrollIndicator={false}
							data={chatMessages}
							contentContainerStyle={{
								paddingHorizontal: 15,
								paddingVertical: height * 0.008,
							}}
							keyExtractor={(item, index) => index}
							ItemSeparatorComponent={() => {
								return <View style={{ height: height * 0.005 }} />;
							}}
							renderItem={({ item, index }) => {
								return (
									<View>
										{lastReadMessageIndex >= 0 && index == lastReadMessageIndex && (
											<View style={styles.unread_container}>
												<View style={styles.unread_line}></View>
												<Text style={styles.unread_text}>{`Okunmamış ${
													lastReadMessageIndex + 1
												} mesajın var`}</Text>
												<View style={styles.unread_line}></View>
											</View>
										)}
										<ChatMessage message={item} />
									</View>
								);
							}}
							inverted
						/>
					)}
				</View>
			)}
			<KeyboardAvoidingView
				behavior={
					Platform.OS === "ios" ? "padding" : "height"
					// Platform.OS === "ios" ? (chatMessages.length == 0 ? "position" : "padding") : "height"
				}
				style={
					chatMessages.length == 0
						? styles.empty_chat_keyboard_avoiding_view
						: styles.not_empty_chat_keyboard_avoiding_view
				}
			>
				<View
					style={
						chatMessages.length == 0
							? styles.input_container_empty_chat
							: styles.input_container_not_empty_chat
					}
				>
					<ChatInput destId={otherId} matchId={MatchId} />
				</View>
			</KeyboardAvoidingView>
		</View>
	);
};

export default Chat;

const styles = StyleSheet.create({
	container: {
		backgroundColor: "#D6D6D6",
		flex: 1,
	},
	no_message_container: {
		flex: 1,
		width: width,
		justifyContent: "center",
		alignItems: "center",
	},
	no_message_placeholder: {
		color: "#FFFFFF",
		textAlign: "center",
		fontFamily: "Poppins",
		fontSize: width * 0.04,
		width: Math.min(width * 0.8, 320),
	},
	background_image: {
		position: "absolute",
		bottom: 0,
		top: 0,
		minWidth: width,
		resizeMode: "cover",
		backgroundColor: "rgba(0,0,0,0.25)",
	},
	empty_chat_keyboard_avoiding_view: {
		position: "absolute",
		width: "100%",
		bottom: 0,
	},
	not_empty_chat_keyboard_avoiding_view: {},
	input_container_empty_chat: {
		width: "100%",
		paddingBottom: height * 0.024,
		paddingTop: height * 0.016,
	},
	input_container_not_empty_chat: {
		width: "100%",
		paddingBottom: height * 0.024,
		paddingTop: height * 0.008,
	},
	chat_container: {
		flex: 1,
		width: width,
	},
	unread_container: {
		width: "100%",
		alignItems: "center",
		flexDirection: "row",
	},
	unread_line: {
		flex: 1,
		height: 0.5,
		backgroundColor: colors.medium_gray,
	},
	unread_text: {
		color: colors.medium_gray,
		fontSize: Math.min(height * 0.016, 10),
		paddingHorizontal: width * 0.02,
	},
});
