import React, { useState } from "react";
import {
	View,
	Text,
	ScrollView,
	StyleSheet,
	TouchableOpacity,
	Dimensions,
	Image,
	KeyboardAvoidingView,
	Platform,
	TouchableWithoutFeedback,
	Keyboard,
	TextInput,
	FlatList,
} from "react-native";
import { Feather, Octicons } from "@expo/vector-icons";
import Animated from "react-native-reanimated";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import KeyboardSpacer from "react-native-keyboard-spacer";
import { url } from "../../connection";

import commonStyles from "../../visualComponents/styles";
import { colors, Gradient, GradientText } from "../../visualComponents/colors";
import KeyboardAvoidingWrapper from "./KeyboardAvoidingWrapper";

const { width, height } = Dimensions.get("window");

import MsgBox from "./MsgBox";
import { msgData } from "../msgData";
import InputBox from "./chatInputBox";

import { API, graphqlOperation, Auth } from "aws-amplify";

import { listMsgUsers, listSentMsgs, msgByDate } from "../../src/graphql/queries";
import { onCreateSentMsg } from "../../src/graphql/subscriptions";
import ChatMsg from "./ChatMsg";
import { decompose2d } from "react-native-redash";

export default function Chat({ navigation, route }) {
	const [chatMessages, setChatMessages] = useState([]);
	const [imageUri, setImageUri] = useState();

	const { otherUser, myUserID, chatID } = route.params;
	


	const fetchNewMessages = async () => {
		try {
			const chatMsgData = await API.graphql(
				graphqlOperation(msgByDate, {
					status: "Active",
					sortDirection: "DESC",
					limit: 1000,
					filter: {
						userChatMessagesId: { eq: chatID },
					},
				})
			);
			await setChatMessages(chatMsgData.data.msgByDate.items);
		} catch (error) {
			console.log(error);
		}
	};
	/*
	async function prepare() {
		await axios
			.post(url + "/Swipelist", { UserId: userID }, { headers: { "access-token": myToken } })
			.then((res) => {
				setPeopleList(res.data);
				console.log(res.data);
			})
			.catch((err) => {
				console.log(err);
			});
		await axios
			.post(url + "/EventList", { UserId: userID }, { headers: { "access-token": myToken } })
			.then((res) => {
				setEventList(res.data);
				setShownEvents(res.data);
			})
			.catch((err) => {
				console.log(err);
			});
	}
	//getProfilePic
	*/

	const fetchImageUri = async () => {
		try {
			let abortController = new AbortController();
			const userDataStr = await SecureStore.getItemAsync("userData");
			const userData = JSON.parse(userDataStr);
			const userID = userData.UserId.toString();
			const myToken = userData.sesToken;
			await axios
				.post(
					url + "/getProfilePic",
					{ UserId: otherUser.id },
					{ headers: { "access-token": myToken } }
				)
				.then((res) => {
					//setPeopleList(res.data);
					//console.log(res.data);
					//console.log(res.data[0].PhotoLink);
					setImageUri(res.data[0].PhotoLink);
					console.log(res);
					
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

		fetchNewMessages();
		//console.log(route.params);
	}, []);

	React.useEffect(async () => {
		try {
			const subscription = API.graphql(graphqlOperation(onCreateSentMsg)).subscribe({
				next: (data) => {
					/*
					console.log("------------------------");
					console.log(data.value.data.onCreateSentMsg);
					console.log("------------------------");
					*/
					if (data.value.data.onCreateSentMsg.userChatMessagesId != chatID) {
						console.log("Message is in another chat");
						return;
					} else {
						console.log("Message is in your chat");
					}

					fetchNewMessages();
				},
			});
			return () => subscription.unsubscribe();
		} catch (error) {
			console.log(error);
		}
	}, []);

	const openProfile= async () => {
		alert("Bu özellik ilerleyen güncellemelerde gelecektir.");

	};

	return (
		<View style={styles.inner}>
			<View name={"Header"} style={[styles.header]}>
				<TouchableOpacity
					style={{ width: "12%", paddingBottom: 5 }}
					name={"backButton"}
					onPress={() => {
						navigation.goBack();
					}}
				>
					<Feather name="chevron-left" size={36} color="#4A4A4A" />
				</TouchableOpacity>
				<Image
					style={{ resizeMode: "cover", width: "12%", height: "65%", borderRadius: 15 }}
					source={{
						uri: imageUri,
					}}
				/>
				<View style={{ width: "2%" }}></View>
				<View
					style={{
						flexDirection: "column",
						width: "55%",
						marginLeft: 10,
						justifyContent: "space-between",
					}}
				>
					<TouchableOpacity
						onPress={openProfile}
					>
						<GradientText
							text={otherUser.name}
							style={{ fontSize: 18, fontFamily: "PoppinsSemiBold", paddingLeft: 0 }}
						/>
						<Text style={{ fontSize: 10, marginBottom: 10 }}>{"-"}</Text>
					</TouchableOpacity>
				</View>
				<TouchableOpacity style={{ paddingBottom: 8 }} name={"reportButton"} onPress={() => {}}>
					<Octicons name="report" size={32} color="#4A4A4A" />
				</TouchableOpacity>
			</View>
			<FlatList
				style={{
					flexDirection: "column",
					borderRadius: 8,
					height: height * 0.75,
				}}
				data={chatMessages}
				renderItem={({ item, index }) => {
					return <ChatMsg data={item} myUserID={myUserID} />;
				}}
				inverted
			/>
			<InputBox myUserID={myUserID} chatID={chatID} otherUser={otherUser} />
			{Platform.OS == "ios" ? <KeyboardSpacer /> : null}
		</View>
	);
}

const styles = StyleSheet.create({
	header: {
		backgroundColor: colors.white,
		width: "100%",
		height: 100,
		elevation: 20,
		flexDirection: "row",
		alignItems: "flex-end",
		paddingLeft: 10,
		paddingBottom: 10,
	},
	buttonContainer: {
		width: width,
		flexDirection: "row",
		justifyContent: "space-between",
		paddingVertical: 16,
		paddingHorizontal: 20,
		alignItems: "center",
	},
	buttonText: {
		fontSize: 20,
		color: "#4A4A4A",
		fontWeight: "600",
	},
	inner: {
		flex: 1,
	},
	container: {
		flex: 1,
	},
});
