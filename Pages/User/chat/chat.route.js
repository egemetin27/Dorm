import { Fragment, useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, Dimensions, FlatList } from "react-native";

import ChatHeader from "./chat.header";
import ChatInput from "./chat.input";
import ChatMessage from "./chat.message";
import CustomImage from "../../../components/custom-image.component";

import { MessageContext } from "../../../contexts/message.context";
import { sort } from "../../../utils/array.utils";
import { AuthContext } from "../../../contexts/auth.context";

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
		if (index != 0) lastIndex = index;
		if (message.unread.toString() == "0" || message.sourceId.toString() == myId.toString())
			return false;
		return true;
	});
	return lastIndex;
};

const Chat = ({ route, navigation }) => {
	const { user } = useContext(AuthContext);
	const { chatsList, readMessages } = useContext(MessageContext);
	// const [chat, setChat] = useState(defaultChat);
	const [chat, setChat] = useState([]);
	const [lastReadMessageIndex, setLastReadMessageIndex] = useState(-1);

	const { otherUser } = route.params;
	const { otherId, MatchId } = otherUser;
	const { Name } = otherUser.userData;

	const imageUrl = otherUser.userData?.photos[0]?.PhotoLink ?? null;

	useEffect(() => {
		const unsortedChat = chatsList[MatchId] ?? [];
		const sortedChat = sort(unsortedChat, "date", false);
		setChat(sortedChat);
	}, [chatsList[MatchId]]);

	useEffect(() => {
		if (chat.length > 0) {
			const index = getLastReadMessage(chat, user.userId);
			setLastReadMessageIndex(index);
		}
	}, [chat]);

	useEffect(() => {
		if (lastReadMessageIndex != -1) {
			//TODO: send server that message has been read
		}
	}, [lastReadMessageIndex]);

	useEffect(() => {
		return () => {
			readMessages(MatchId, chat);
		};
	}, []);

	return (
		<View style={[styles.container]}>
			<ChatHeader name={Name} imageUrl={imageUrl} matchId={MatchId} />
			{chat.length == 0 ? (
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
					<FlatList
						showsVerticalScrollIndicator={false}
						data={chat}
						contentContainerStyle={{
							paddingHorizontal: 15,
							paddingVertical: height * 0.024,
						}}
						keyExtractor={(item, index) => index}
						ItemSeparatorComponent={() => {
							return <View style={{ height: height * 0.005 }} />;
						}}
						renderItem={({ item, index }) => {
							return (
								<Fragment>
									{index == lastReadMessageIndex && (
										<View style={styles.unread_container}>
											<View style={styles.unread_line}></View>
											<Text style={styles.unread_text}>Buradan sonrasını okumadın</Text>
											<View style={styles.unread_line}></View>
										</View>
									)}
									<ChatMessage message={item} />
								</Fragment>
							);
						}}
						inverted
					/>
				</View>
			)}
			<View
				style={chat.length == 0 ? styles.input_container_empty : styles.input_container_not_empty}
			>
				<ChatInput destId={otherId} matchId={MatchId} />
			</View>
		</View>
	);
};

export default Chat;

const styles = StyleSheet.create({
	container: {
		// backgroundColor: "#F4F3F3",
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
	input_container_empty: {
		position: "absolute",
		width: "100%",
		bottom: height * 0.024,
		paddingTop: height * 0.016,
	},
	input_container_not_empty: {
		width: "100%",
		marginBottom: height * 0.024,
		paddingTop: height * 0.016,
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
		height: 1,
		backgroundColor: "blue",
	},
	unread_text: {
		paddingHorizontal: width * 0.02,
	},
});
