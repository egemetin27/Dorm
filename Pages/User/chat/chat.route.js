import { useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, Dimensions, FlatList } from "react-native";

import ChatHeader from "./chat.header";
import ChatInput from "./chat.input";
import ChatMessage from "./chat.message";
import CustomImage from "../../../components/custom-image.component";

import { MessageContext } from "../../../contexts/message.context";

const { width, height } = Dimensions.get("screen");

const url = `https://helpx.adobe.com/content/dam/help/en/photoshop/using/convert-color-image-black-white/jcr_content/main-pars/before_and_after/image-before/Landscape-Color.jpg`;
const chatMessages = [];
// const chatMessages = [1, 2, 3, 4, 4, 5, 5, 5, 7, 8, 0, 1, 2, 1];

const Chat = ({ route, navigation }) => {
	const { chatsList } = useContext(MessageContext);
	const [chat, setChat] = useState([]);

	const { user } = route.params;
	const { otherId, MatchId } = user;
	const { Name } = user.userData;

	const imageUrl = user.userData?.photos[0]?.PhotoLink ?? null;

	useEffect(() => {
		setChat(chatsList[MatchId] ?? []);
	}, [chatsList[MatchId]]);

	// const chatEmpty = chatMessages.length == 0;

	return (
		<View style={[styles.container]}>
			<ChatHeader name={Name} imageUrl={imageUrl} />
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
							return <ChatMessage message={item} />;
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
});
