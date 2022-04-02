import React from "react";
import {
	View,
	Text,
	StyleSheet,
	Dimensions,
	Animated,
	TouchableOpacity,
	Image,
} from "react-native";
import Swipeable from "react-native-gesture-handler/Swipeable";
import { colors } from "../../visualComponents/colors";
import moment from "moment";
import { LinearGradient } from "expo-linear-gradient";

const { height, width } = Dimensions.get("window");

const ChatMsg = (props) => {
	const isMyMessage = () => {
		return props.data.sentMsgSenderId == props.myUserID;
	};

	return (
		<View style={styles.container}>
			{isMyMessage() ? (
				<View>
					<LinearGradient
						colors={["#4136F1", "#8743FF"]}
						start={{ x: 0, y: 0 }}
						end={{ x: 1, y: 1 }}
						style={{
							borderRadius: 18,
							borderBottomStartRadius: 0,
							padding: 10,
							marginLeft: 50,
							marginRight: 0,
							overflow: "hidden",
							alignSelf: "flex-end",
						}}
					>
						<Text style={{ color: "white", fontFamily: "Poppins"}}>{props.data.text}</Text>
						
					</LinearGradient>
					<Text style={{ alignSelf: "flex-end", color: "black", fontSize: 8, marginRight: 8, }}>
						{moment(props.data.updatedAt).fromNow()}
					</Text>
				</View>
			) : (
				<View>
					<View
						style={[
							styles.messageBox,
							{
								marginLeft: 0,
								marginRight: 50,
								borderTopLeftRadius: 20,
								borderTopRightRadius: 20,
								borderBottomLeftRadius: 0,
								borderBottomRightRadius: 20,
								alignSelf: "flex-start",
								padding: 10,
							},
						]}
					>
						<Text style={styles.name}>{props.data.sender.name}</Text>
						<Text style={styles.message}>{props.data.text}</Text>
					</View>
					<Text style={styles.time}>{moment(props.data.updatedAt).fromNow()}</Text>

				</View>
			)}
		</View>
	);
};

export default ChatMsg;

const styles = StyleSheet.create({
	container: {
		padding: 5,
	},
	messageBox: {
		borderRadius: 5,
		padding: 10,
	},
	name: {
		color: "black",
		fontFamily: "PoppinsSemiBold",
		marginBottom: 5,
	},
	message: {},
	time: {
		marginLeft: 8,
		fontSize: 8,
		alignSelf: "flex-start",
		color: "grey",
		fontFamily: "Poppins"
	},
});
