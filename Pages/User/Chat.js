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
	Modal,
	BackHandler,
} from "react-native";
import { Feather, Octicons, MaterialIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated from "react-native-reanimated";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import FastImage from "react-native-fast-image";

import KeyboardSpacer from "react-native-keyboard-spacer";
import { url } from "../../connection";

import commonStyles from "../../visualComponents/styles";
import { colors, Gradient, GradientText } from "../../visualComponents/colors";

const { width, height } = Dimensions.get("window");

import MsgBox from "./MsgBox";
import InputBox from "./chatInputBox";

import { API, graphqlOperation, Auth } from "aws-amplify";

import { listMsgUsers, listSentMsgs, msgByDate } from "../../src/graphql/queries";
import { updateUserChat } from "../../src/graphql/mutations";
import { onCreateSentMsg } from "../../src/graphql/subscriptions";
import ChatMsg from "./ChatMsg";
import { decompose2d } from "react-native-redash";
import { CustomModal } from "../../visualComponents/customComponents";
import ChatProfile from "./ChatProfile";
import { Session } from "../../nonVisualComponents/SessionVariables";

export default function Chat({ navigation, route }) {
	const [chatMessages, setChatMessages] = useState([]);
	const [imageUri, setImageUri] = useState();

	const [cardData, setCardData] = React.useState(null);

	const [reportText, changeReportText] = React.useState(null);

	const { otherUser, myUserID, chatID, unreadMsg, lastMsgSender } = route.params;

	const [profilePage, setProfilePage] = React.useState(false);
	const [reportPage, setReportPage] = React.useState(false);
	const [chosenReport, setChosenReport] = React.useState(0);

	const [deleteChatModal, setDeleteChatModal] = React.useState(false);

	const insets = useSafeAreaInsets();

	React.useEffect(() => {
		const backAction = () => {
			navigation.goBack();
			return true;
		};

		const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);

		return () => backHandler.remove();
	}, []);

	const deleteChat = async () => {
		console.log(chatID);
		const userDataStr = await SecureStore.getItemAsync("userData");
		const userData = JSON.parse(userDataStr);
		const myToken = userData.sesToken;
		try {
			API.graphql(
				graphqlOperation(updateUserChat, {
					input: { id: chatID, status: "Deactive" },
				})
			);
			axios
				.post(
					url + "/unmatch",
					{
						UserId: myUserID,
					},
					{ headers: { "access-token": myToken } }
				)
				.catch((error) => {
					console.log(error);
				});
			navigation.goBack();
		} catch (error) {
			console.log(error);
		}
	};

	const closeProfile = () => {
		setProfilePage(false);
	};
	const fetchNewMessages = async () => {
		try {
			const chatMsgData = await API.graphql(
				graphqlOperation(msgByDate, {
					status: "Active",
					sortDirection: "DESC",
					limit: 100000000,
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

	const fetchImageUri = async () => {
		try {
			const userDataStr = await SecureStore.getItemAsync("userData");
			const userData = JSON.parse(userDataStr);
			const userID = userData.UserId.toString();
			const myToken = userData.sesToken;
			await axios
				.post(
					url + "/getProfilePic",
					{ UserId: Session.User.UserId, UserIdPic: otherUser.id },
					{ headers: { "access-token": myToken } }
				)
				.then((res) => {
					//setPeopleList(res.data);
					//console.log(res.data);
					//console.log(res.data[0].PhotoLink);
					setImageUri(res.data[0].PhotoLink);
					//console.log(res);
				})
				.catch((err) => {
					console.log(err);
				});
		} catch (e) {
			console.log(e);
		}
	};

	const updateChat = async () => {
		try {
			const newMessageData = await API.graphql(
				graphqlOperation(updateUserChat, {
					input: {
						id: chatID,
						unreadMsg: 0,
					},
				})
			);
		} catch (e) {
			console.log(e);
		}
	};

	const fetchProfile = async () => {
		try {
			const userDataStr = await SecureStore.getItemAsync("userData");
			const userData = JSON.parse(userDataStr);
			const myToken = userData.sesToken;
			console.log(otherUser.id);
			console.log(myToken);
			await axios
				.post(
					url + "/profileinfo",
					{ userId: otherUser.id },
					//{ userId: "5" },
					{ headers: { "access-token": myToken } }
				)
				.then((res) => {
					//setPeopleList(res.data);
					setCardData(res.data);

					//console.log(res.data[0].PhotoLink);
					//console.log(res);
				})
				.catch((err) => {
					console.log(err);
				});
		} catch (error) {
			console.log(error);
		}
	};

	React.useEffect(async () => {
		/*
		console.log("+++++++++++++++++++++++++++");
		console.log(otherUser);
		console.log("+++++++++++++++++++++++++++");
		*/
		await fetchImageUri();
		await fetchProfile();
		await fetchNewMessages();
		//console.log(lastMsgSender);
		if (lastMsgSender != myUserID && unreadMsg != 0) {
			updateChat();
		}
		//console.log(unreadMsg);
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

	const openProfile = async () => {
		try {
			//console.log(cardData);
			Keyboard.dismiss();
			setProfilePage(true);
		} catch (error) {
			console.log(error);
		}
	};

	const reportProfile = async () => {
		//console.log(chosenReport);
		//console.log(myUserID);
		//console.log(otherUser.id);
		//console.log(chatID);
		const userDataStr = await SecureStore.getItemAsync("userData");
		const userData = JSON.parse(userDataStr);
		const myToken = userData.sesToken;

		try {
			await axios
				.post(
					url + "/report",
					{
						UserId: myUserID,
						sikayetEdilen: otherUser.id,
						sikayetKodu: chosenReport,
						aciklama: "",
					},
					{ headers: { "access-token": myToken } }
				)
				.catch((err) => {
					console.log(err);
				});

			API.graphql(
				graphqlOperation(updateUserChat, {
					input: { id: chatID, status: "Reported" },
				})
			);
			navigation.goBack();
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<View style={[styles.container, { marginTop: insets.top, marginBottom: insets.bottom }]}>
			<View
				name={"Header"}
				style={[
					styles.header,
					{
						zIndex: 1,
						alignItems: "baseline",
					},
				]}
			>
				<View style={{ flexDirection: "row", height: "100%", alignItems: "center" }}>
					<TouchableOpacity
						style={{ width: "12%" }}
						name={"backButton"}
						onPress={() => {
							navigation.goBack();
						}}
					>
						<Feather name="chevron-left" size={36} color="#4A4A4A" />
					</TouchableOpacity>
					<TouchableOpacity onPress={openProfile}>
						<View style={{ height: "100%", flexDirection: "row", alignItems: "center" }}>
							{__DEV__ ? (
								<Image
									style={{
										resizeMode: "cover",
										aspectRatio: 2 / 3,
										height: "90%",
										borderRadius: 15,
									}}
									source={{
										uri: imageUri,
									}}
								/>
							) : (
								<FastImage
									style={{
										resizeMode: "cover",
										aspectRatio: 2 / 3,
										height: "90%",
										borderRadius: 15,
									}}
									source={{
										uri: imageUri,
									}}
								/>
							)}
							<View style={{ width: "2%" }} />
							<View
								style={{
									flexDirection: "column",
									width: "45%",
									marginLeft: 10,
									justifyContent: "flex-start",
								}}
							>
								<GradientText
									text={otherUser.name}
									style={{ fontSize: 18, fontFamily: "PoppinsSemiBold", paddingLeft: 0 }}
								/>
							</View>
						</View>
					</TouchableOpacity>
				</View>
				<TouchableOpacity
					style={{ paddingBottom: 16 }}
					onPress={() => {
						setDeleteChatModal(true);
					}}
				>
					<Feather name="trash" size={32} color="#4A4A4A" />
				</TouchableOpacity>
				<View style={{ paddingHorizontal: "2%" }} />
				<TouchableOpacity
					style={{ paddingBottom: 16 }}
					name={"reportButton"}
					onPress={() => {
						setReportPage(true);
					}}
				>
					<MaterialIcons name="outlined-flag" size={32} color="#4A4A4A" />
				</TouchableOpacity>
			</View>
			{lastMsgSender == "" && chatMessages.length == 0 ? (
				<View
					style={{
						position: "relative",
						flex: 1,
						width: width,
						justifyContent: "center",
						alignItems: "center",
					}}
				>
					<Image
						blurRadius={20}
						style={{
							minHeight: "100%",
							minWidth: width,
							resizeMode: "cover",
						}}
						source={{
							uri: imageUri,
						}}
					/>
					<View
						style={{
							position: "absolute",
							width: width,
							top: "40%",
							// justifyContent: "center",
							// alignItems: "center",
						}}
					>
						<Text
							style={{
								color: colors.white,
								textAlign: "center",
								fontSize: Math.min(18, width * 0.04),
								lineHeight: Math.min(18, width * 0.04) + 5,
								letterSpacing: 1,
								paddingHorizontal: width * 0.125,
							}}
						>
							Çekinme! O da senden mesaj bekliyor. Sohbeti başlatmak için bir şaka patlatabilir ya
							da klasiklerden giderek selam yazabilirsin.
						</Text>
					</View>
					<View
						style={{
							position: "absolute",
							width: width,
							bottom: 20,
							paddingHorizontal: 10,
						}}
					>
						<InputBox
							myUserID={myUserID}
							chatID={chatID}
							otherUser={otherUser}
							lastMsgSender={lastMsgSender}
							unreadMsg={unreadMsg}
						/>
					</View>
				</View>
			) : (
				<View style={{ flex: 1 }}>
					<View
						style={{
							width: width,
							flex: 1,
						}}
					>
						<FlatList
							showsVerticalScrollIndicator={false}
							contentContainerStyle={{ paddingHorizontal: 15, paddingBottom: 20 }}
							data={chatMessages}
							renderItem={({ item, index }) => {
								return <ChatMsg data={item} myUserID={myUserID} />;
							}}
							inverted
						/>
					</View>
					<View
						style={{
							position: "relative",
							width: width,
							paddingVertical: 20,
							paddingHorizontal: 10,
						}}
					>
						<InputBox
							myUserID={myUserID}
							chatID={chatID}
							otherUser={otherUser}
							lastMsgSender={lastMsgSender}
							unreadMsg={unreadMsg}
						/>
					</View>
				</View>
			)}
			{Platform.OS == "ios" ? <KeyboardSpacer /> : null}
			{/* Report page custom modal */}
			<CustomModal
				visible={reportPage}
				dismiss={() => {
					setReportPage(false);
				}}
			>
				<View
					style={{
						maxWidth: width * 0.9,
						height: height * 0.9,
						backgroundColor: colors.white,
						borderRadius: 10,
						alignItems: "center",
						paddingHorizontal: 36,
					}}
				>
					<TouchableOpacity
						onPress={() => {
							setReportPage(false);
						}}
						style={{
							position: "absolute",
							alignSelf: "flex-end",
							padding: 16,
						}}
					>
						<Text style={{ fontSize: 22, color: colors.medium_gray }}>İptal</Text>
					</TouchableOpacity>
					<View
						style={{
							width: "100%",
							marginTop: 20,
						}}
					>
						<View
							style={{
								flexDirection: "row",
								width: "100%",
								alignContent: "center",
								justifyContent: "center",
								marginVertical: 10,
							}}
						>
							<Image source={require("../../assets/report.png")} />
						</View>
						<View
							style={{
								flexDirection: "row",
								width: "100%",
								alignItems: "center",
								justifyContent: "center",
								marginVertical: 5,
							}}
						>
							<Text
								style={{
									color: colors.black,
									fontSize: 20,
									lineHeight: 24,
									fontFamily: "PoppinsSemiBold",
									fontWeight: "500",
								}}
							>
								Bildirmek istiyor musun ?
							</Text>
						</View>
						<View
							style={{
								flexDirection: "row",
								width: "100%",
								alignItems: "center",
								justifyContent: "center",
								marginVertical: 10,
							}}
						>
							<Text
								style={{
									color: colors.dark_gray,
									fontSize: 13,
									fontFamily: "Poppins",
									fontWeight: "400",
									textAlign: "center",
								}}
							>
								{otherUser.name} adlı kişiyi bildiriyorsun. Bunu ona söylemeyeceğiz.
							</Text>
						</View>
						<TouchableOpacity
							onPress={() => {
								chosenReport == 1 ? setChosenReport(0) : setChosenReport(1);
							}}
							style={{
								maxWidth: "100%",
								maxHeight: "20%",
								aspectRatio: 22 / 2,
								borderRadius: 12,
								overflow: "hidden",
								justifyContent: "center",
								alignItems: "center",
								borderColor: colors.black,
								borderWidth: 1,
								marginBottom: 10,
							}}
						>
							{chosenReport == 1 ? (
								<GradientText
									text={"Sahte Profil/Spam"}
									style={{ fontSize: 18, fontWeight: "bold", padding: 5 }}
								/>
							) : (
								<Text style={{ fontSize: 18, fontWeight: "bold", padding: 5 }}>
									Sahte Profil/Spam
								</Text>
							)}
						</TouchableOpacity>
						<TouchableOpacity
							onPress={() => {
								chosenReport == 2 ? setChosenReport(0) : setChosenReport(2);
							}}
							style={{
								maxWidth: "100%",
								maxHeight: "20%",
								aspectRatio: 22 / 2,
								borderRadius: 12,
								overflow: "hidden",
								justifyContent: "center",
								alignItems: "center",
								borderColor: colors.black,
								borderWidth: 1,
								marginBottom: 10,
							}}
						>
							{chosenReport == 2 ? (
								<GradientText
									text={"Uygunsuz Mesaj"}
									style={{ fontSize: 18, fontWeight: "bold", padding: 5 }}
								/>
							) : (
								<Text style={{ fontSize: 18, fontWeight: "bold", padding: 5 }}>Uygunsuz Mesaj</Text>
							)}
						</TouchableOpacity>
						<TouchableOpacity
							onPress={() => {
								chosenReport == 3 ? setChosenReport(0) : setChosenReport(3);
							}}
							style={{
								maxWidth: "100%",
								maxHeight: "20%",
								aspectRatio: 22 / 2,
								borderRadius: 12,
								overflow: "hidden",
								justifyContent: "center",
								alignItems: "center",
								borderColor: colors.black,
								borderWidth: 1,
								marginBottom: 10,
							}}
						>
							{chosenReport == 3 ? (
								<GradientText
									text={"Uygunsuz Fotoğraf"}
									style={{ fontSize: 18, fontWeight: "bold", padding: 5 }}
								/>
							) : (
								<Text style={{ fontSize: 18, fontWeight: "bold", padding: 5 }}>
									Uygunsuz Fotoğraf
								</Text>
							)}
						</TouchableOpacity>
						<TouchableOpacity
							onPress={() => {
								chosenReport == 4 ? setChosenReport(0) : setChosenReport(4);
							}}
							style={{
								maxWidth: "100%",
								maxHeight: "20%",
								aspectRatio: 22 / 2,
								borderRadius: 12,
								overflow: "hidden",
								justifyContent: "center",
								alignItems: "center",
								borderColor: colors.black,
								borderWidth: 1,
								marginBottom: 10,
							}}
						>
							{chosenReport == 4 ? (
								<GradientText
									text={"Uygunsuz Biyografi"}
									style={{ fontSize: 18, fontWeight: "bold", padding: 5 }}
								/>
							) : (
								<Text style={{ fontSize: 18, fontWeight: "bold", padding: 5 }}>
									Uygunsuz Biyografi
								</Text>
							)}
						</TouchableOpacity>
						<TouchableOpacity
							onPress={() => {
								chosenReport == 5 ? setChosenReport(0) : setChosenReport(5);
							}}
							style={{
								maxWidth: "100%",
								maxHeight: "20%",
								aspectRatio: 22 / 2,
								borderRadius: 12,
								overflow: "hidden",
								justifyContent: "center",
								alignItems: "center",
								borderColor: colors.black,
								borderWidth: 1,
								marginBottom: 10,
							}}
						>
							{chosenReport == 5 ? (
								<GradientText
									text={"Reşit olmayan kullanıcı"}
									style={{ fontSize: 18, fontWeight: "bold", padding: 5 }}
								/>
							) : (
								<Text style={{ fontSize: 18, fontWeight: "bold", padding: 5 }}>
									Reşit Olmayan Kullanıcı
								</Text>
							)}
						</TouchableOpacity>
						<TouchableOpacity
							onPress={() => {
								chosenReport == 6 ? setChosenReport(0) : setChosenReport(6);
							}}
							style={{
								maxWidth: "100%",
								maxHeight: "20%",
								aspectRatio: 22 / 2,
								borderRadius: 12,
								overflow: "hidden",
								justifyContent: "center",
								alignItems: "center",
								borderColor: colors.black,
								borderWidth: 1,
								marginBottom: 10,
							}}
						>
							{chosenReport == 6 ? (
								<GradientText
									text={"Diğer"}
									style={{ fontSize: 18, fontWeight: "bold", padding: 5 }}
								/>
							) : (
								<Text style={{ fontSize: 18, fontWeight: "bold", padding: 5 }}>Diğer</Text>
							)}
						</TouchableOpacity>

						<TouchableOpacity
							onPress={reportProfile}
							style={{
								maxWidth: "100%",
								maxHeight: "20%",
								aspectRatio: 22 / 2,
								borderRadius: 12,
								overflow: "hidden",
								marginTop: 20,
								justifyContent: "center",
								alignItems: "center",
							}}
						>
							<Gradient
								style={{
									justifyContent: "center",
									alignItems: "center",
									width: "100%",
								}}
							>
								<Text
									style={{
										color: colors.white,
										fontSize: 22,
										fontFamily: "PoppinsSemiBold",
										padding: 10,
									}}
								>
									Bildir
								</Text>
							</Gradient>
						</TouchableOpacity>
					</View>
				</View>
			</CustomModal>
			{/* Report page custom modal */}

			{/* Unmatch page custom modal */}
			<CustomModal
				visible={deleteChatModal}
				dismiss={() => {
					setDeleteChatModal(false);
				}}
			>
				<View
					style={{
						maxWidth: width * 0.84,
						backgroundColor: colors.white,
						borderRadius: 10,
						alignItems: "center",
						paddingHorizontal: 36,
					}}
				>
					<TouchableOpacity
						onPress={() => {
							setDeleteChatModal(false);
						}}
						style={{
							position: "absolute",
							alignSelf: "flex-end",
							padding: 16,
						}}
					>
						<Text style={{ fontSize: 22, color: colors.medium_gray }}>İptal</Text>
					</TouchableOpacity>
					<View
						style={{
							width: "100%",
							marginTop: 20,
						}}
					>
						<View
							style={{
								flexDirection: "row",
								width: "100%",
								alignContent: "center",
								justifyContent: "center",
								marginVertical: 10,
							}}
						>
							<Image source={require("../../assets/biggerTrashCan.png")} />
						</View>
						<View
							style={{
								flexDirection: "row",
								width: "100%",
								alignItems: "center",
								justifyContent: "center",
								marginVertical: 10,
							}}
						>
							<Text
								style={{
									color: colors.black,
									fontSize: 26,
									lineHeight: 36,
									fontFamily: "PoppinsSemiBold",
									fontWeight: "800",
								}}
							>
								Emin misin ?
							</Text>
						</View>
						<View
							style={{
								flexDirection: "row",
								width: "100%",
								alignItems: "center",
								justifyContent: "center",
								marginVertical: 10,
							}}
						>
							<Text
								style={{
									color: colors.dark_gray,
									fontSize: 13,
									fontFamily: "Poppins",
									fontWeight: "400",
									textAlign: "center",
								}}
							>
								Eşleşmeyi kaldırırsan bu kişiyi artık görüntüleyemezsin ve başka bir mesaj
								atamazsın.
							</Text>
						</View>
					</View>
					<TouchableOpacity
						onPress={deleteChat}
						style={{
							maxWidth: "90%",
							height: "15%",
							maxHeight: 60,
							aspectRatio: 9 / 2,
							borderRadius: 12,
							overflow: "hidden",
							marginTop: 20,
						}}
					>
						<Gradient
							style={{
								justifyContent: "center",
								alignItems: "center",
								width: "100%",
								height: "100%",
							}}
						>
							<Text style={{ color: colors.white, fontSize: 20, fontFamily: "PoppinsSemiBold" }}>
								Eşleşmeyi Kaldır
							</Text>
						</Gradient>
					</TouchableOpacity>
				</View>
			</CustomModal>
			{/* Unmatvh page custom modal */}

			{/* Profil page custom modal */}
			{profilePage ? (
				<View
					style={{
						position: "absolute",
						height: height,
						width: width,
						zIndex: 3,
					}}
				>
					<View
						style={{
							position: "absolute",
							height: height,
							width: width,
							zIndex: 4,
							backgroundColor: colors.dark_gray,
							opacity: 0.5,
						}}
					/>

					<View
						style={{
							position: "absolute",
							zIndex: 5,
							top: 0,
							left: 0,
							right: 0,
							bottom: height * 0.06,
							alignItems: "center",
							justifyContent: "center",
						}}
					>
						<ChatProfile data={cardData} close={closeProfile} />
					</View>
				</View>
			) : null}

			{/* Profil page custom modal */}
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
		paddingHorizontal: 10,
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
