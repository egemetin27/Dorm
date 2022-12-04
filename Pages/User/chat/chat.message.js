import { useContext, useEffect } from "react";
import { View, Text, StyleSheet, Dimensions, Pressable } from "react-native";
import Swipeable from "react-native-gesture-handler/Swipeable";
import moment from "moment";
import { LinearGradient } from "expo-linear-gradient";
import { getHourMinute } from "../../../utils/date.utils";

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
						<Text selectable style={styles.my_message}>
							{message.message}
						</Text>
						<Text style={styles.my_message_time}>{getHourMinute(message.date)}</Text>
					</Gradient>
				</View>
			) : (
				<View style={styles.received_message_container}>
					<Text selectable style={styles.received_message_text}>
						{message.message}
					</Text>
					<Text style={styles.received_message_time}>{getHourMinute(message.date)}</Text>
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
		borderRadius: Math.min(width * 0.05, height * 0.024),
		borderBottomRightRadius: 0,
		overflow: "hidden",
	},
	my_message_gradient: {
		paddingVertical: height * 0.0095,
		paddingLeft: width * 0.035,
		paddingRight: width * 0.053,
	},
	my_message: {
		color: colors.white,
		fontSize: height * 0.018,
		// fontFamily: "Poppins",
	},
	my_message_time: {
		textAlign: "right",
		fontSize: width * 0.02,
		color: "#dddddd",
		//marginBottom: height * 0.0055,
		position: "absolute",
		right: width * 0.012,
		bottom: height * 0,
		width: width * 0.065,
	},
	received_message_container: {
		borderRadius: Math.min(width * 0.05, height * 0.024),
		borderBottomLeftRadius: 0,
		paddingVertical: height * 0.01,
		paddingLeft: width * 0.032,
		paddingRight: width * 0.065,
		alignSelf: "flex-start",
		backgroundColor: colors.white,
	},
	received_message_time: {
		textAlign: "right",
		fontSize: width * 0.02,
		color: "#999999",
		//marginBottom: height * 0.0055,
		position: "absolute",
		right: width * 0.025,
		bottom: height * 0.0016,
		width: width * 0.065,
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
