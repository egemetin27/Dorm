import React from "react";

import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { API, graphqlOperation } from "aws-amplify";
import { createSentMsg, updateUserChat } from "../../src/graphql/mutations";
import * as SecureStore from "expo-secure-store";
import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";

const InputBox = (props) => {

	const [message, setMessage] = React.useState("");
	const [newNumber, setNewNumber] = React.useState(1);
	const [msgHeight, setMsgHeight] = React.useState(45);

	const sendMessage = async () => {
		try {
			const newMessageData = await API.graphql(
				graphqlOperation(createSentMsg, {
					input: {
						userChatMessagesId: props.chatID,
						sentMsgSenderId: props.myUserID,
						text: message.trim(),
						status: "Active",
					},
				})
			);
		} catch (e) {
			console.log(e);
		}
	};

	const updateChat = async () => {
		try {
			const newMessageData = await API.graphql(
				graphqlOperation(updateUserChat, {
					input: {
						id: props.chatID,
						lastMsg: message,
						lastMsgSender: props.myUserID,
						unreadMsg: newNumber,
					},
				})
			);
		} catch (e) {
			console.log(e);
		}
	};
	const sendNotification = async () => {
		try {
			let abortController = new AbortController();
			const userDataStr = await SecureStore.getItemAsync("userData");
			const userData = JSON.parse(userDataStr);
			const userName = userData.Name;
			console.log(userName);
			console.log(message);
			console.log(props.otherUser.pushToken);
			let response = fetch("https://exp.host/--/api/v2/push/send", {
				method: "POST",
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					to: props.otherUser.pushToken,
					sound: "default",
					title: userName,
					body: message,
				}),
			});
		} catch (e) {
			console.log(e);
		}
	};

	return (
		<View
			style={{
				flexDirection: "row",
				// alignItems: "flex-end",
			}}
		>
			<View
				style={{
					flex: 1,
					backgroundColor: "white",
					padding: 10,
					marginRight: 10,
					borderRadius: 25,
					height: msgHeight,
					minHeight: 20,
					maxHeight: 84,
				}}
			>
				<TextInput
					style={{ flex: 1, marginHorizontal: 10 }}
					multiline
					placeholder={"Mesajın..."}
					value={message}
					onChangeText={setMessage}
					onContentSizeChange= {(event) => {
						console.log(event.nativeEvent.contentSize.height);
						setMsgHeight(event.nativeEvent.contentSize.height+21);
					}}
				/>
			</View>
			<TouchableOpacity
				name={"sendMsgButton"}
				onPress={() => {
					if (message != "") {
						if (props.lastMsgSender == props.myUserID) {
							console.log("I sent the last msg");
							setNewNumber(props.unreadMsg + 1);
							console.log(newNumber);
						}
						sendMessage();
						updateChat();
						setMessage("");
						sendNotification();
					}
				}}
				style={{
					borderRadius: 45,
					width: 45,
					height: 45,
					justifyContent: "center",
					alignItems: "center",
				}}
			>
				<MaskedView
					style={{
						// width: "100%",
						// height: "100%",
						alignContent: "center",
						flex: 1,
						flexDirection: "row",
					}}
					maskElement={
						<View
							style={{
								justifyContent: "center",
								alignItems: "center",
							}}
						>
							<Ionicons name="send" size={30} color="white" style={styles.shadow} />
						</View>
					}
				>
					<LinearGradient colors={["#4136F1", "#8743FF"]} style={{ flex: 1 }} />
				</MaskedView>
			</TouchableOpacity>
		</View>
	);
};

export default InputBox;
