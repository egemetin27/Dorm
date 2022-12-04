import { useMemo } from "react";
import { Pressable, StyleSheet, Dimensions, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import CustomImage from "../../../components/custom-image.component";
import { useContext } from "react";
import { AuthContext } from "../../../contexts/auth.context";
import { colors } from "../../../visualComponents/colors";

const { width, height } = Dimensions.get("screen");

const EmptyChatBox = ({ match }) => {
	const colorName = useMemo(() => {
		if (match?.eventId !== 0) return "event";
		if (match?.matchMode === 0) return "flirt";
		return "friend";
	}, [match]);

	const borderColor = useMemo(() => colors[colorName], [colorName]);
	const navigation = useNavigation();
	const { user } = useContext(AuthContext);

	const { MatchId } = match;
	const imageUrl = useMemo(
		() => match.userData.photos.find(({ Photo_Order }) => Photo_Order === 1)?.PhotoLink ?? null,
		[match]
	);

	const handlePress = () => {
		navigation.navigate("Chat", { otherUser: match });
	};

	const handleLongPress = () => {
		navigation.navigate("CustomModal", {
			modalType: "UNMATCH_MODAL",
			buttonParamsList: [{ matchId: MatchId, userId: user.userId, sesToken: user.sesToken }],
		});
	};

	return (
		<Pressable onPress={handlePress} onLongPress={handleLongPress}>
			<View style={[styles.imageBorder, { borderColor }]}>
				<View style={styles.imageWrapper}>
					{imageUrl && (
						<CustomImage
							url={imageUrl}
							style={{
								minHeight: "100%",
								minWidth: "100%",
								resizeMode: "cover",
							}}
						/>
					)}
				</View>
			</View>
		</Pressable>
	);
};

const styles = StyleSheet.create({
	imageBorder: {
		height: height * 0.1,
		aspectRatio: 1,
		padding: height * 0.008,
		borderRadius: height * 0.06,
		borderWidth: height * 0.008,
	},
	imageWrapper: {
		backgroundColor: "#653cf8",
		overflow: "hidden",
		borderRadius: height * 0.06,
	},
});

export default EmptyChatBox;
