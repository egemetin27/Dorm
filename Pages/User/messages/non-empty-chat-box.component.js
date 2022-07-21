import { useContext } from "react";
import { View, Text, Image, Dimensions, Pressable, StyleSheet } from "react-native";
import Swipeable from "react-native-gesture-handler/Swipeable";

import { useNavigation } from "@react-navigation/native";

import { colors, Gradient } from "../../../visualComponents/colors";
import { MessageContext } from "../../../contexts/message.context";
import { getWhen } from "../../../utils/date.utils";
import CustomImage from "../../../components/custom-image.component";

const { width, height } = Dimensions.get("screen");

const renderRightActions = () => {
	const handleUnmatch = () => {
		//TODO: unmatch
		console.log("unmatching");
	};

	const handleDeleteChat = () => {
		//TODO: delete chat
		console.log("deleting chat");
	};

	return (
		<View style={styles.swipeable_container}>
			<Pressable onPress={handleUnmatch} style={styles.swipeable_button}>
				<Image
					style={styles.swipeable_icon}
					resizeMode={"contain"}
					source={require("../../../assets/Union.png")}
				/>
			</Pressable>
			<View style={{ height: "60%", width: 1.5, backgroundColor: colors.gray }} />
			<Pressable onPress={handleDeleteChat} style={styles.swipeable_button}>
				<Image
					style={styles.swipeable_icon}
					resizeMode={"contain"}
					source={require("../../../assets/trashCan.png")}
				/>
			</Pressable>
		</View>
	);
};

const NonEmptyChatBox = ({ match }) => {
	const { getLastMessage } = useContext(MessageContext);
	const navigation = useNavigation();

	const { MatchId } = match;
	const { Name } = match.userData;
	const imageUrl = match.userData.photos[0]?.PhotoLink ?? null;

	const { message, date } = getLastMessage(MatchId);

	const isUnreadMessage = false;

	const handlePress = () => {
		navigation.navigate("Chat", { user: match });
	};

	return (
		<View
			style={{
				backgroundColor: colors.light_gray2,
				borderRadius: height * 0.01,
				elevation: 5,
				overflow: "hidden",
			}}
		>
			<Swipeable renderRightActions={renderRightActions} overshootRight={false}>
				<View>
					<Pressable style={styles.container} onPress={handlePress}>
						<View style={styles.image_container}>
							{imageUrl && <CustomImage url={imageUrl} style={styles.image} />}
							{isUnreadMessage && (
								<View
									style={{
										position: "absolute",
										height: "100%",
										right: -width * 0.02,
										justifyContent: "center",
										backgroundColor: "transparent",
									}}
								>
									<View
										style={{
											width: width * 0.04,
											aspectRatio: 2 / 3,
											borderWidth: width * 0.006,
											borderColor: "white",
											borderRadius: width * 0.01,
											overflow: "hidden",
										}}
									>
										<Gradient
											style={{
												width: "100%",
												height: "100%",
											}}
										/>
									</View>
								</View>
							)}
						</View>
						<View style={{ flex: 1, marginLeft: width * 0.04 }}>
							<Text style={styles.name}>{Name}</Text>
							<Text style={styles.text}>{message}</Text>
						</View>
						<View>
							<Text style={styles.date}>{getWhen(date)}</Text>
						</View>
					</Pressable>
				</View>
			</Swipeable>
		</View>
	);
};

export default NonEmptyChatBox;

const styles = StyleSheet.create({
	container: {
		backgroundColor: colors.full_white,
		height: height * 0.12,
		flexDirection: "row",
		paddingVertical: height * 0.01,
		paddingHorizontal: width * 0.02,
		borderRadius: height * 0.01,
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 1,
		},
		shadowOpacity: 0.22,
		shadowRadius: 2.22,
		elevation: 3,
		overflow: "hidden",
	},
	swipeable_container: {
		backgroundColor: colors.light_gray,
		width: "32%",
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
	swipeable_icon: {
		tintColor: colors.gray,
		height: "100%",
		width: "100%",
	},

	image_container: {
		aspectRatio: 2 / 3,
		height: "100%",
		// borderRadius: height * 0.01,
		// overflow: "hidden",
	},
	image: {
		borderRadius: height * 0.01,
		minHeight: "100%",
		minWidth: "100%",
		resizeMode: "cover",
	},
	name: {
		color: "#4C525C",
		fontSize: Math.min(18, height * 0.024),
		letterSpacing: 0.24,
		fontFamily: "PoppinsBold",
		marginBottom: height * 0.005,
	},
	text: {
		color: "#B6B6B6",
		fontSize: Math.min(15, height * 0.02),
		letterSpacing: 0.2,
	},
	date: {
		color: "#B6B6B6",
		fontSize: Math.min(15, height * 0.02),
		letterSpacing: 0.2,
	},
});
