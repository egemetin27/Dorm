import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
	Text,
	View,
	Dimensions,
	Pressable,
	TouchableOpacity,
	FlatList,
	BackHandler,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { API, graphqlOperation, Auth } from "aws-amplify";

import { getMsgUser, chatByDate } from "../../src/graphql/queries";
import {
	onCreateUserChat,
	onDeleteUserChat,
	onUpdateUserChat,
} from "../../src/graphql/subscriptions";
import MsgBox from "./MsgBox";
import NewMatchBox from "./NewMatchBox";
import { colors, GradientText, Gradient } from "../../visualComponents/colors";

import commonStyles from "../../visualComponents/styles";
// import { url } from "../../connection";
import { Session } from "../../nonVisualComponents/SessionVariables";

const { height, width } = Dimensions.get("window");

export default function Messages({ route, navigation }) {
	const [chatMod, setChatMod] = React.useState([1, 0]);
	const [imgUri, setImgUri] = React.useState();
	const [noMatch, setNoMatch] = React.useState(false);
	const [msgBoxHeight, setMsgBoxHeight] = React.useState(0);

	const [unreadMsgInFlirt, setUnreadMsgInFlirt] = React.useState(0);
	const [unreadMsgInFriend, setUnreadMsgInFriend] = React.useState(0);

	const openChat = async (userInfo, myUserID, chatID, unreadMsg, lastMsgSender) => {
		navigation.navigate("Chat", {
			otherUser: userInfo,
			myUserID: myUserID,
			chatID: chatID,
			unreadMsg: unreadMsg,
			lastMsgSender: lastMsgSender,
		});
	};

	const [chatRooms, setChatRooms] = useState([]);
	const [myUserID, setmyUserID] = useState("");
	const [otherUser, setotherUser] = useState([]);

	React.useEffect(() => {
		const backAction = () => {
			navigation.replace("MainScreen", { screen: "AnaSayfa" });
			return true;
		};
		const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);
		return () => backHandler.remove();
	}, []);

	const fetchNewUsers = async (myUserID) => {
		try {
			const userId = Session.User.userId.toString();

			const msgBoxData = await API.graphql(
				graphqlOperation(chatByDate, {
					status: "Active",
					sortDirection: "DESC",
					limit: 100000,
					filter: {
						or: [{ userChatFirstUserId: { eq: userId } }, { userChatSecondUserId: { eq: userId } }],
					},
				})
			);
			//console.log(msgBoxData.data.chatByDate.items);
			setNoMatch(false);
			await setChatRooms(msgBoxData.data.chatByDate.items);
			//console.log(chatRooms);
		} catch (error) {
			console.log(error);
		}
	};

	React.useEffect(async () => {
		let abortController = new AbortController();
		try {
			const userId = Session.User.userId.toString();
			const userName = Session.User.Name;
			const fetchUser = async () => {
				const userData = await API.graphql(graphqlOperation(getMsgUser, { id: userId }));

				const msgBoxData = await API.graphql(
					graphqlOperation(chatByDate, {
						status: "Active",
						sortDirection: "DESC",
						limit: 100000,
						filter: {
							or: [
								{ userChatFirstUserId: { eq: userId } },
								{ userChatSecondUserId: { eq: userId } },
							],
						},
					})
				);
				//console.log(msgBoxData.data.chatByDate.items.length);
				if (msgBoxData.data.chatByDate.items.length == 0) {
					setNoMatch(true);
				}
				await setChatRooms(msgBoxData.data.chatByDate.items);
				await setmyUserID(userId);
				//console.log(chatRooms);
			};

			await fetchUser();
		} catch (error) {}
		return () => {
			abortController.abort();
		};
	}, []);

	React.useEffect(async () => {
		let abortController = new AbortController();

		try {
			const userId = Session.User.userId.toString();
			const subscription = API.graphql(graphqlOperation(onCreateUserChat)).subscribe({
				next: (data) => {
					/*
					console.log("---------------------------");
					console.log(data.value.data.onCreateUserChat.firstUser.id);
					console.log("---------------------------");
					*/
					if (
						data.value.data.onCreateUserChat.firstUser.id != userId &&
						data.value.data.onCreateUserChat.secondUser.id != userId
					) {
						console.log("Message is in another chat");
						return;
					} else {
						console.log("Message is in your chat");
						fetchNewUsers();
					}

					// setMessages([newMessage, ...messages]);
				},
			});
		} catch (error) {}
		return () => {
			abortController.abort();
			subscription.unsubscribe();
		};
	}, []);

	React.useEffect(async () => {
		let abortController = new AbortController();

		try {
			const userId = Session.User.userId.toString();
			const subscription = API.graphql(graphqlOperation(onUpdateUserChat)).subscribe({
				next: (data) => {
					/*
					console.log("++++++++++++++++++++++++");
					console.log(data.value.data.onUpdateUserChat.firstUser.id);
					console.log("++++++++++++++++++++++++");
					*/
					if (
						data.value.data.onUpdateUserChat.firstUser.id != userId &&
						data.value.data.onUpdateUserChat.secondUser.id != userId
					) {
						console.log("Message is in another chat");
						return;
					} else {
						console.log("Message is in your chat");
					}

					fetchNewUsers();
					// setMessages([newMessage, ...messages]);
				},
			});
		} catch (error) {}
		return () => {
			subscription.unsubscribe();
			abortController.abort();
		};
	}, []);

	return (
		<View style={{ width: width, height: height }}>
			<StatusBar style="dark" backgroundColor={"#F4F3F3"} />
			<View name={"Header"} style={[commonStyles.Header, { marginTop: height * 0.02 }]}>
				<View style={{ marginLeft: 20 }}>
					{
						<GradientText
							style={{ fontSize: height * 0.035, fontFamily: "NowBold", letterSpacing: 1.2 }}
							text={"Sohbetlerim"}
						/>
					}
				</View>
				<View style={{ flexDirection: "row", alignSelf: "center" }}>
					<TouchableOpacity onPress={() => {}}></TouchableOpacity>
				</View>
			</View>
			<View
				style={{
					Container: { width: "100%" },
					flexDirection: "row",
					justifyContent: "center",
					marginTop: 10,
					height: height * 0.051,
				}}
			>
				<View style={{ flex: 1 }}>
					{chatMod[0] == 1 ? (
						<Gradient style={{ height: height * 0.06, width: "100%" }}>
							<TouchableOpacity
								style={{
									backgroundColor: "#F4F3F3",
									paddingBottom: 16,
								}}
							>
								<GradientText
									style={{
										marginLeft: width * 0.1,
										fontSize: 18,
										fontFamily: "PoppinsSemiBold",
										letterSpacing: 1.2,
										justifyContent: "center",
										alignItems: "center",
									}}
									text={"Flört Modu"}
								/>
							</TouchableOpacity>
						</Gradient>
					) : (
						<Pressable
							style={{ alignItems: "center", justifyContent: "center" }}
							onPress={() => {
								setChatMod([1, 0]);
								setMsgBoxHeight(0);
								setUnreadMsgInFlirt(0);
							}}
						>
							<View flexDirection="row">
								<Text style={{ fontSize: 20, color: colors.cool_gray, paddingRight: 5 }}>
									Flört Modu
								</Text>
								{unreadMsgInFlirt == 1 ? (
									<LinearGradient
										colors={["#4136F1", "#8743FF"]}
										start={{ x: 0, y: 0 }}
										end={{ x: 1, y: 1 }}
										style={{
											borderColor: colors.white,
											borderWidth: 2,
											height: width * 0.03,
											width: width * 0.03,
											borderRadius: 6,
											borderBottomStartRadius: 0,
											overflow: "hidden",
											alignSelf: "center",
										}}
									/>
								) : null}
							</View>
						</Pressable>
					)}
				</View>
				<View style={{ flex: 1 }}>
					{chatMod[1] == 1 ? (
						<Gradient style={{ height: height * 0.06, width: "100%" }}>
							<TouchableOpacity
								style={{
									backgroundColor: "#F4F3F3",
									paddingBottom: 16,
								}}
							>
								<GradientText
									style={{
										marginLeft: width * 0.05,
										fontSize: 18,
										fontFamily: "PoppinsSemiBold",
										letterSpacing: 1.2,
										justifyContent: "center",
										alignItems: "center",
									}}
									text={"Arkadaş Modu"}
								/>
							</TouchableOpacity>
						</Gradient>
					) : (
						<Pressable
							style={{ alignItems: "center", justifyContent: "center" }}
							onPress={() => {
								setChatMod([0, 1]);
								setMsgBoxHeight(0);
								setUnreadMsgInFriend(0);
							}}
						>
							<View flexDirection="row">
								<Text style={{ fontSize: 20, color: colors.cool_gray, paddingRight: 5 }}>
									Arkadaş Modu
								</Text>
								{unreadMsgInFriend == 1 ? (
									<LinearGradient
										colors={["#4136F1", "#8743FF"]}
										start={{ x: 0, y: 0 }}
										end={{ x: 1, y: 1 }}
										style={{
											borderColor: colors.white,
											borderWidth: 2,
											height: width * 0.03,
											width: width * 0.03,
											borderRadius: 6,
											borderBottomStartRadius: 0,
											overflow: "hidden",
											alignSelf: "center",
										}}
									/>
								) : null}
							</View>
						</Pressable>
					)}
				</View>
			</View>

			<View>
				{noMatch == true ? (
					<View
						style={{
							paddingTop: "5%",
						}}
					>
						<Text
							style={{
								textAlign: "center",
								fontSize: 12,
								lineHeight: 15,
								letterSpacing: 1,
								paddingHorizontal: 15,
							}}
						>
							Keşfetmeye Başla. Ana sayfaya giderek diğer kullanıcılarla eşleştiğinde buradan onlara
							mesaj atabileceksin. Sana mesaj atmak isteyen bir sürü kişi var, sadece senin
							kaydırmanı bekliyorlar.
						</Text>
					</View>
				) : null}
				{chatMod[0] == 1 ? (
					<View>
						<View style={{ marginBottom: 10 }} />
						<View>
							<FlatList
								style={{
									width: width,
								}}
								horizontal={true}
								showsHorizontalScrollIndicator={false}
								data={chatRooms}
								renderItem={({ item, index }) => {
									if (
										item.mod == 1 &&
										item.lastMsg != null &&
										item.firstUser.id == myUserID &&
										item.status == "Active" &&
										item.unreadMsg != 0 &&
										item.lastMsgSender != myUserID
									) {
										setUnreadMsgInFriend(1);
									}
									if (
										item.mod == 1 &&
										item.lastMsg != null &&
										item.secondUser.id == myUserID &&
										item.status == "Active" &&
										item.unreadMsg != 0 &&
										item.lastMsgSender != myUserID
									) {
										setUnreadMsgInFriend(1);
									}
									if (
										item.mod == 0 &&
										item.lastMsg == null &&
										item.firstUser.id == myUserID &&
										item.status == "Active"
									) {
										setMsgBoxHeight(height * 0.11);

										return (
											<NewMatchBox
												data={item.secondUser}
												openChat={() =>
													openChat(
														item.secondUser,
														myUserID,
														item.id,
														item.unreadMsg,
														item.lastMsgSender
													)
												}
												userId={myUserID}
											/>
										);
									}
									if (
										item.mod == 0 &&
										item.lastMsg == null &&
										item.secondUser.id == myUserID &&
										item.status == "Active"
									) {
										setMsgBoxHeight(height * 0.11);

										return (
											<NewMatchBox
												data={item.firstUser}
												openChat={() =>
													openChat(
														item.firstUser,
														myUserID,
														item.id,
														item.unreadMsg,
														item.lastMsgSender
													)
												}
												userId={myUserID}
											/>
										);
									}
								}}
							/>
						</View>
						<View style={{ marginBottom: 10 }} />
						<View>
							<FlatList
								style={{
									borderRadius: 8,
									height: height - 35 - height * 0.051 - msgBoxHeight - height * 0.08 - 50,
									flexGrow: 1,
								}}
								data={chatRooms}
								renderItem={({ item, index }) => {
									if (
										item.mod == 0 &&
										item.lastMsg != null &&
										item.firstUser.id == myUserID &&
										item.status == "Active"
									) {
										return (
											<MsgBox
												data={item.secondUser}
												lastMsg={item.lastMsg}
												lastTime={item.updatedAt}
												openChat={() =>
													openChat(
														item.secondUser,
														myUserID,
														item.id,
														item.unreadMsg,
														item.lastMsgSender
													)
												}
												userId={myUserID}
												chatID={item.id}
												unreadMsg={item.unreadMsg}
												lastMsgSender={item.lastMsgSender}
											/>
										);
									}
									if (
										item.mod == 0 &&
										item.lastMsg != null &&
										item.secondUser.id == myUserID &&
										item.status == "Active"
									) {
										return (
											<MsgBox
												data={item.firstUser}
												lastMsg={item.lastMsg}
												lastTime={item.updatedAt}
												openChat={() =>
													openChat(
														item.firstUser,
														myUserID,
														item.id,
														item.unreadMsg,
														item.lastMsgSender
													)
												}
												userId={myUserID}
												chatID={item.id}
												unreadMsg={item.unreadMsg}
												lastMsgSender={item.lastMsgSender}
											/>
										);
									}
								}}
							/>
						</View>
					</View>
				) : (
					<View>
						<View style={{ marginBottom: 10 }} />
						<View>
							<FlatList
								style={{
									width: width,
								}}
								horizontal={true}
								showsHorizontalScrollIndicator={false}
								data={chatRooms}
								renderItem={({ item, index }) => {
									if (
										item.mod == 0 &&
										item.lastMsg != null &&
										item.firstUser.id == myUserID &&
										item.status == "Active" &&
										item.unreadMsg != 0 &&
										item.lastMsgSender != myUserID
									) {
										console.log(item.lastMsg);
										console.log(item.id);
										console.log(item.unreadMsg);

										setUnreadMsgInFlirt(1);
									}
									if (
										item.mod == 0 &&
										item.lastMsg != null &&
										item.secondUser.id == myUserID &&
										item.status == "Active" &&
										item.unreadMsg != 0 &&
										item.lastMsgSender != myUserID
									) {
										console.log(item.lastMsg);
										console.log(item.id);
										console.log(item.unreadMsg);
										setUnreadMsgInFlirt(1);
									}
									if (
										item.mod == 1 &&
										item.lastMsg == null &&
										item.firstUser.id == myUserID &&
										item.status == "Active"
									) {
										setMsgBoxHeight(height * 0.11);

										return (
											<NewMatchBox
												data={item.secondUser}
												openChat={() =>
													openChat(
														item.secondUser,
														myUserID,
														item.id,
														item.unreadMsg,
														item.lastMsgSender
													)
												}
												userId={myUserID}
											/>
										);
									}
									if (
										item.mod == 1 &&
										item.lastMsg == null &&
										item.secondUser.id == myUserID &&
										item.status == "Active"
									) {
										setMsgBoxHeight(height * 0.11);

										return (
											<NewMatchBox
												data={item.firstUser}
												openChat={() =>
													openChat(
														item.firstUser,
														myUserID,
														item.id,
														item.unreadMsg,
														item.lastMsgSender
													)
												}
												userId={myUserID}
											/>
										);
									}
								}}
							/>
						</View>
						<View style={{ marginBottom: 10 }} />
						<View>
							<FlatList
								horizontal={false}
								style={{
									borderRadius: 8,
									height: height - 35 - height * 0.051 - msgBoxHeight - height * 0.08 - 50,
									flexGrow: 1,
								}}
								data={chatRooms}
								renderItem={({ item, index }) => {
									if (
										item.mod == 1 &&
										item.lastMsg != null &&
										item.firstUser.id == myUserID &&
										item.status == "Active"
									) {
										console.log(msgBoxHeight);
										return (
											<MsgBox
												data={item.secondUser}
												lastMsg={item.lastMsg}
												lastTime={item.updatedAt}
												openChat={() =>
													openChat(
														item.secondUser,
														myUserID,
														item.id,
														item.unreadMsg,
														item.lastMsgSender
													)
												}
												userId={myUserID}
												chatID={item.id}
												unreadMsg={item.unreadMsg}
												lastMsgSender={item.lastMsgSender}
											/>
										);
									}
									if (
										item.mod == 1 &&
										item.lastMsg != null &&
										item.secondUser.id == myUserID &&
										item.status == "Active"
									) {
										return (
											<MsgBox
												data={item.firstUser}
												lastMsg={item.lastMsg}
												lastTime={item.updatedAt}
												openChat={() =>
													openChat(
														item.firstUser,
														myUserID,
														item.id,
														item.unreadMsg,
														item.lastMsgSender
													)
												}
												userId={myUserID}
												chatID={item.id}
												unreadMsg={item.unreadMsg}
												lastMsgSender={item.lastMsgSender}
											/>
										);
									}
								}}
							/>
						</View>
					</View>
				)}
			</View>
		</View>
	);
}
