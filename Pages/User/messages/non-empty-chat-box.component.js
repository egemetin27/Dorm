import { View, Text, Image, Dimensions, Pressable, StyleSheet } from "react-native";
import FastImage from "react-native-fast-image";

import { Gradient } from "../../../visualComponents/colors";

const { width, height } = Dimensions.get("screen");

const NonEmptyChatBox = ({ user }) => {
	const { imageUrl } = user;

	const isUnreadMessage = false;

	return (
		<Pressable style={styles.container}>
			<View style={styles.image_container}>
				{__DEV__ ? (
					<Image
						source={{
							uri: imageUrl,
						}}
						style={styles.image}
					/>
				) : (
					<FastImage
						source={{
							uri: imageUrl,
						}}
						style={styles.image}
					/>
				)}
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
				<Text style={styles.name}>Mehtap Garip</Text>
				<Text style={styles.text}>Yarın Geleceğim</Text>
			</View>
			<View>
				<Text style={styles.date}>Cumartesi</Text>
			</View>
		</Pressable>
	);
};

export default NonEmptyChatBox;

const styles = StyleSheet.create({
	container: {
		backgroundColor: "white",
		height: height * 0.14,
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
		fontFamily: "Poppins",
	},
	date: {
		color: "#B6B6B6",
		fontSize: Math.min(15, height * 0.02),
		letterSpacing: 0.2,
		fontFamily: "Poppins",
	},
});
