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
import { Session } from "../../nonVisualComponents/SessionVariables";

const { height, width } = Dimensions.get("window");

const NewMatchBox = (props) => {
	const [imageUri, setImageUri] = React.useState();

	const fetchImageUri = async () => {
		try {
			await axios
				.post(
					url + "/getProfilePic",
					{ UserId: Session.User.UserId, UserIdPic: props.data.id },
					{ headers: { "access-token": Session.User.sesToken } }
				)
				.then((res) => {
					//setPeopleList(res.data);
					//console.log(res.data);
					//console.log(res.data[0].PhotoLink);
					setImageUri(res.data[0].PhotoLink);
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
				<Image
					style={{ resizeMode: "cover", width: width * 0.15, height: "100%", borderRadius: 15 }}
					source={{
						uri: imageUri,
					}}
				/>
			</TouchableOpacity>
		</View>
	);
};

export default NewMatchBox;
