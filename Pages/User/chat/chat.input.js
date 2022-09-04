import { useState, useContext } from "react";
import { View, Text, TextInput, Pressable, Dimensions, StyleSheet, Platform } from "react-native";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import MaskedView from "@react-native-masked-view/masked-view";

//import { Gradient } from "../../../visualComponents/colors";

import { SocketContext } from "../../../contexts/socket.context";

const { width, height } = Dimensions.get("screen");

const ChatInput = ({ destId, matchId }) => {

	const { sendMessage } = useContext(SocketContext);
	const [message, setMessage] = useState("");

	const handleSend = () => {
		if (!message.length) return;

		try {
			sendMessage({ destId, matchId, message: message.trim() }, "message");
		}
		catch (e) {
			console.log(e);
		}

		setMessage("");
	};

	return (
		<View style={styles.container}>
			<TextInput
				style={[
					styles.text_input,
					Platform.OS == "ios" && {
						paddingTop: (Math.min(width * 0.12, 60) - height * 0.027) / 2,
					},
				]}
				placeholder="Mesajın"
				multiline
				value={message}
				onChangeText={setMessage}
			/>
			<Pressable style={styles.send_button} onPress={handleSend}>
				<Ionicons name="send" size={Math.min(width * 0.06, 30)} color="#653cf8" />
			</Pressable>
		</View>
	);
};

export default ChatInput;

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		alignItems: "flex-end",
		width: "100%",
		paddingHorizontal: width * 0.032,
	},
	text_input: {
		backgroundColor: "white",
		flex: 1,
		minHeight: Math.min(width * 0.12, 60),
		fontSize: height * 0.018,
		paddingHorizontal: width * 0.05,
		paddingVertical: 5,
		borderRadius: height * 0.02,
		marginRight: width * 0.032,
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 1,
		},
		shadowOpacity: 0.22,
		shadowRadius: 2.22,
		elevation: 3,
	},
	send_button: {
		backgroundColor: "white",
		width: Math.min(width * 0.12, 60),
		justifyContent: "center",
		alignItems: "center",
		aspectRatio: 1,
		borderRadius: height * 0.02,
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 1,
		},
		shadowOpacity: 0.22,
		shadowRadius: 2.22,
		elevation: 3,
	},
});
