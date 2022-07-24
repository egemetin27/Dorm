import { useContext, useEffect } from "react";
import { View, Text, StyleSheet, Dimensions, Pressable } from "react-native";
import Swipeable from "react-native-gesture-handler/Swipeable";
import moment from "moment";
import { LinearGradient } from "expo-linear-gradient";

import { colors, Gradient } from "../../../visualComponents/colors";

import { AuthContext } from "../../../contexts/auth.context";

const { width, height } = Dimensions.get("screen");

const ChatMessage = ({ message }) => {
	const { user } = useContext(AuthContext);
	const { userId } = user ?? { userId: -1 };
	const myMessage = message.sourceId == userId;

	useEffect(() => {
		if (message.sourceId != user.userId) message.unread = 0;
	}, []);

	return (
		<View style={[styles.container]}>
			{myMessage ? (
				<View style={styles.my_message_container}>
					<Gradient style={styles.my_message_gradient}>
						<Text style={styles.my_message}>{message.message}</Text>
					</Gradient>
				</View>
			) : (
				<View style={styles.received_message_container}>
					<Text style={styles.received_message_text}>{message.message}</Text>
				</View>
			)}
		</View>
	);
};

export default ChatMessage;

const styles = StyleSheet.create({
	container: {
		// width: 100,
		// height: 60,
		// backgroundColor: "red",
	},
	my_message_container: {
		alignSelf: "flex-end",
		borderRadius: Math.min(width * 0.08, height * 0.024),
		borderBottomRightRadius: 0,
		overflow: "hidden",
	},
	my_message_gradient: {
		paddingVertical: height * 0.012,
		paddingHorizontal: width * 0.04,
	},
	my_message: {
		color: colors.white,
		fontSize: height * 0.018,
		// fontFamily: "Poppins",
	},
	received_message_container: {
		borderRadius: Math.min(width * 0.08, height * 0.024),
		borderBottomLeftRadius: 0,
		paddingVertical: height * 0.012,
		paddingHorizontal: width * 0.04,
		alignSelf: "flex-start",
		backgroundColor: colors.white,
	},
	received_message_name: {
		fontSize: height * 0.02,
		fontFamily: "PoppinsSemiBold",
	},
	received_message_text: {
		fontSize: height * 0.018,
		// fontFamily: "Poppins",
	},
});
