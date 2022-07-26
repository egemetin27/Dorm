import { View, Text, StyleSheet, Dimensions, Pressable, Image } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { GradientText } from "../../../visualComponents/colors";
import CustomImage from "../../../components/custom-image.component";
import { useContext } from "react";
import { AuthContext } from "../../../contexts/auth.context";
import { MessageContext } from "../../../contexts/message.context";

const { width, height } = Dimensions.get("screen");

const ChatHeader = ({ userData, matchId }) => {
	const { user } = useContext(AuthContext);
	const insets = useSafeAreaInsets();
	const navigation = useNavigation();

	const { Name } = userData;
	const imageUrl = userData?.photos[0]?.PhotoLink ?? null;

	const handleBack = () => {
		navigation.goBack();
	};

	const handleOpenProfile = () => {
		navigation.navigate("ProfileCardModal", {
			data: userData,
		});
	};

	const handleReport = () => {
		console.log("Reporting");
	};

	const handleUnmatch = () => {
		navigation.navigate("CustomModal", {
			modalType: "UNMATCH_MODAL",
			buttonParamsList: [{ matchId, userId: user.userId, sesToken: user.sesToken }],
		});
	};

	return (
		<View style={[styles.header, { paddingTop: insets.top + height * 0.01 }]}>
			<View style={styles.left_side}>
				<Pressable onPress={handleBack}>
					<Feather name="chevron-left" size={height * 0.05} color="#4A4A4A" />
				</Pressable>
				<Pressable style={styles.profile_container} onPress={handleOpenProfile}>
					<View style={styles.image_container}>
						{imageUrl && <CustomImage style={styles.image} url={imageUrl} />}
					</View>
					<GradientText text={Name} style={styles.name} />
				</Pressable>
			</View>
			<View style={styles.right_side}>
				<Pressable name={"delete button"} onPress={handleUnmatch}>
					<Image
						source={require("../../../assets/unmatch.png")}
						style={{
							height: height * 0.036,
							aspectRatio: 1,
							resizeMode: "contain",
							tintColor: "#4A4A4A",
						}}
					/>
					{/* <Feather name="trash" size={height * 0.036} color="#4A4A4A" /> */}
				</Pressable>
				<View style={{ width: width * 0.02 }} />
				<Pressable name={"reportButton"} onPress={handleReport}>
					<Feather name="flag" size={height * 0.036} color="#4A4A4A" />
				</Pressable>
			</View>
		</View>
	);
};

export default ChatHeader;

const styles = StyleSheet.create({
	header: {
		// backgroundColor: "transparent",
		backgroundColor: "#F8F8F8",
		flexDirection: "row",
		justifyContent: "space-between",
		paddingTop: height * 0.01,
		paddingBottom: height * 0.01,
		paddingHorizontal: width * 0.036,
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 5,
	},
	left_side: {
		alignItems: "center",
		flexDirection: "row",
	},
	profile_container: {
		flexDirection: "row",
		alignItems: "center",
	},
	image_container: {
		backgroundColor: "gray",
		height: height * 0.12,
		aspectRatio: 2 / 3,
		borderRadius: height * 0.012,
		marginRight: width * 0.03,
		elevation: 30,
		overflow: "hidden",
		marginLeft: width * 0.02,
	},
	image: {
		resizeMode: "cover",
		minWidth: "100%",
		minHeight: "100%",
	},
	name: {
		fontFamily: "NowBold",
		fontSize: height * 0.027,
		letterSpacing: 0.5,
	},
	right_side: {
		flexDirection: "row",
		alignItems: "center",
	},
});
