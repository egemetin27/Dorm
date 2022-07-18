import { Pressable, Image, StyleSheet, Dimensions } from "react-native";
import FastImage from "react-native-fast-image";

const { width, height } = Dimensions.get("screen");

const EmptyChatBox = ({ user }) => {
	const { imageUrl, otherId } = user;

	const handlePress = () => {
		console.log(`opening chat with id: ${otherId}`);
	};

	return (
		<Pressable style={styles.container} onPress={handlePress}>
			{__DEV__ ? (
				<Image
					source={{
						uri: imageUrl,
					}}
					resizeMode="cover"
					style={{
						minHeight: "100%",
						minWidth: "100%",
					}}
				/>
			) : (
				<FastImage
					source={{
						uri: imageUrl,
					}}
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
		backgroundColor: "gray",
		height: "100%",
		aspectRatio: 2 / 3,
		borderRadius: height * 0.01,
		overflow: "hidden",
		elevation: 3,
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
