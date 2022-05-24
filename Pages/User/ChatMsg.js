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
	
	const [showTime, setShowTime] = React.useState(false);

	return (
		<View style={styles.container}>
			{isMyMessage() ? (
				<View>
					<TouchableOpacity
						onPress={()=>{
							setShowTime(!showTime);
						}}
					>
						<LinearGradient
							colors={["#4136F1", "#8743FF"]}
							start={{ x: 0, y: 0 }}
							end={{ x: 1, y: 1 }}
							style={{
								borderRadius: 20,
								borderBottomRightRadius: 0,
								paddingHorizontal: 12,
								paddingVertical: 10,
								alignSelf: "flex-end",
							}}
						>
							<Text style={{ color: "white", fontFamily: "Poppins" }}>{props.data.text}</Text>
						</LinearGradient>
						{showTime ? 
							(
								<Text style={{ alignSelf: "flex-end", color: "black", fontSize: 8, marginRight: 8 }}>
									{moment(props.data.updatedAt).fromNow()}
								</Text>
							)
							:
							(null)
						}
					</TouchableOpacity>
				</View>
			) : (
				<View>
					<TouchableOpacity
						onPress={()=>{
							setShowTime(!showTime);
						}}
					>
						<View
							style={[
								styles.messageBox,
								{
									borderRadius: 20,
									borderBottomLeftRadius: 0,
									paddingHorizontal: 12,
									paddingVertical: 10,
									alignSelf: "flex-start",
									backgroundColor: colors.white,
								},
							]}
						>
							<Text style={styles.name}>{props.data.sender.name}</Text>
							<Text style={styles.message}>{props.data.text}</Text>
						</View>
						{showTime ?
							(
								<Text style={styles.time}>{moment(props.data.updatedAt).fromNow()}</Text>
							)
							:
							(null)
						}	
					</TouchableOpacity>
				</View>
			)}
		</View>
	);
};

export default ChatMsg;

const styles = StyleSheet.create({
	container: {
		paddingVertical: 5,
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
		fontFamily: "Poppins",
	},
});
