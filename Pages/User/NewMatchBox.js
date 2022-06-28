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
import axios from "axios";
import { url } from "../../connection";
import * as SecureStore from "expo-secure-store";
import FastImage from "react-native-fast-image";
import crypto from "../../functions/crypto";
import { Session } from "../../nonVisualComponents/SessionVariables";

const { height, width } = Dimensions.get("window");

const NewMatchBox = (props) => {
	const [imageUri, setImageUri] = React.useState();

	const fetchImageUri = async () => {
		try {
			const encryptedData = crypto.encrypt({ userId: Session.User.userId, otherId: props.data.id });
			await axios
				.post(url + "/getProfilePic", encryptedData, {
					headers: { "access-token": Session.User.sesToken },
				})
				.then((res) => {
					setImageUri(res.data[0].PhotoLink);
					// setImageUri(data.PhotoLink);
				})
				.catch((err) => {
					console.log(err);
				});
		} catch (e) {
			console.log(e);
		}
	};

	React.useEffect(async () => {
		/*
		console.log("+++++++++++++++++++++++++++");
		console.log(otherUser);
		console.log("+++++++++++++++++++++++++++");
		*/
		await fetchImageUri();
	}, []);
	return (
		<View
			style={{
				padding: 2,
			}}
		>
			<TouchableOpacity
				onPress={props.openChat}
				style={{
					flexDirection: "row",
					alignItems: "stretch",
					justifyContent: "space-evenly",
					backgroundColor: colors.white,
					height: height * 0.11,
					width: width * 0.15,
					borderRadius: 15,
				}}
			>
				{__DEV__ ? (
					<Image
						style={{ resizeMode: "cover", width: width * 0.15, height: "100%", borderRadius: 15 }}
						source={{
							uri: imageUri,
						}}
					/>
				) : (
					<FastImage
						style={{ resizeMode: "cover", width: width * 0.15, height: "100%", borderRadius: 15 }}
						source={{
							uri: imageUri ?? null,
							priority: FastImage.priority.high,
						}}
					/>
				)}
			</TouchableOpacity>
		</View>
	);
};

export default NewMatchBox;
