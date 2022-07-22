import { Pressable, Image, StyleSheet, Dimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";
import CustomImage from "../../../components/custom-image.component";

const { width, height } = Dimensions.get("screen");

const EmptyChatBox = ({ match }) => {
	const navigation = useNavigation();

	const { otherId } = match;
	const imageUrl = match.userData.photos[0]?.PhotoLink ?? null;

	const handlePress = () => {
		navigation.navigate("Chat", { user: match });
	};
	const handleLongPress = () => {
		// TODO: open popup for delete message / unmatch
		console.log("handling long press");
		// navigation.navigate("CustomModal", {
		// 	buttons: [
		// 		{
		// 			text: "Unmatch",
		// 		},
		// 		{
		// 			text: "Delete",
		// 		},
		// 	],
		// });
	};

	return (
		<Pressable style={styles.container} onPress={handlePress} onLongPress={handleLongPress}>
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
		</Pressable>
	);
};

const styles = StyleSheet.create({
	container: {
		backgroundColor: "#653cf8",
		height: "100%",
		aspectRatio: 2 / 3,
		borderRadius: height * 0.01,
		overflow: "hidden",
		elevation: 5,
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 1,
		},
		shadowOpacity: 0.22,
		shadowRadius: 2.22,
	},
});

export default EmptyChatBox;
