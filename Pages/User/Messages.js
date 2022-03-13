import React, { useEffect, useState } from "react";


import {
	StyleSheet,
	Text,
	View,
	TextInput,
	Dimensions,
	Pressable,
	Animated,
	TouchableOpacity,
	ScrollView,
	KeyboardAvoidingView,
	FlatList,
	Image,
	Button,
r} from "react-native";
import commonStyles from "../../visualComponents/styles";
import { Ionicons, MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import { colors, GradientText, Gradient } from "../../visualComponents/colors";
const { height, width } = Dimensions.get("window");
import { color } from "react-native-reanimated";
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { msgData } from "../msgData";
import MsgBox from "./MsgBox";
import NewMatchBox from "./NewMatchBox";
import { SafeAreaView } from "react-native-safe-area-context";
import { render } from "react-dom";
import { red } from "react-native-redash";
import * as SecureStore from "expo-secure-store";


import {
	API,
	graphqlOperation,
	Auth,
  } from 'aws-amplify';

import { listUserChats, getMsgUser } from "../../src/graphql/queries";
import { onCreateUserChat, onDeleteUserChat, onUpdateUserChat} from "../../src/graphql/subscriptions"

	export default function Messages({ route, navigation }) {
		const [chatMode, setChatMode] = React.useState([1, 0]);
		const deleteItem = (index) => {
			
		};

		const openChat = async () => {
			navigation.navigate("Chat", {
				
				chatUserID: 1,
				chatID: 1,
			});
		};

		const [chatRooms, setChatRooms] = useState([]);
		const [myUserID, setmyUserID] = useState("");
		const [otherUser, setotherUser] = useState([]);

		const fetchNewUsers = async (myUserID) => {	
			const dataStr = await SecureStore.getItemAsync("userData");
			const data = JSON.parse(dataStr);
			//console.log(data);
	
			const userID = data.UserId.toString();
					
			const msgBoxData = await API.graphql(
				graphqlOperation(
				  listUserChats,
				  { filter: {
					  or: [
						  { userChatFirstUserId: {eq: userID}},
						  { userChatSecondUserId: {eq: userID}}
					  ]
				  }}
				  )
			)
			//console.log(msgBoxData.data.listUserChats.items);
			await setChatRooms(msgBoxData.data.listUserChats.items)
			//console.log(chatRooms);
		}

		React.useEffect(async () => {

			const dataStr = await SecureStore.getItemAsync("userData");
			const data = JSON.parse(dataStr);
			//console.log(data);
	
			const userID = data.UserId.toString();
			const userName = data.Name;
			const fetchUser = async () => {	
			  
				const userData = await API.graphql(
				  graphqlOperation(
					getMsgUser,
					{ id: userID }
					)
				)
						
				const msgBoxData = await API.graphql(
					graphqlOperation(
					  listUserChats,
					  { filter: {
						  or: [
							  { userChatFirstUserId: {eq: userID}},
							  { userChatSecondUserId: {eq: userID}}
						  ]
					  }}
					  )
				)


				await setChatRooms(msgBoxData.data.listUserChats.items)
				await setmyUserID(userID)
				//console.log(chatRooms);
			}

			fetchUser();
		}, [])

		React.useEffect(async () => {
			const dataStr = await SecureStore.getItemAsync("userData");
			const data = JSON.parse(dataStr);
			//console.log(data);
	
			const userID = data.UserId.toString();
			const subscription = API.graphql(
			  graphqlOperation(onCreateUserChat)
			).subscribe({
			  next: (data) => {
				console.log("---------------------------");
				console.log(data.value.data.onCreateUserChat.firstUser.id);
				console.log("---------------------------");

				
				if (data.value.data.onCreateUserChat.firstUser.id != userID && data.value.data.onCreateUserChat.secondUser.id != userID) {
				  console.log("Message is in another chat")
				  return;
				}
				else{
					console.log("Message is in your chat")
				}
				
		
				fetchNewUsers();
				// setMessages([newMessage, ...messages]);
			  }
			});
		
			return () => subscription.unsubscribe();
		}, [])


	
		return (
			<View style={{width: width, height: height}}>
				<View name={"Header"} style={commonStyles.Header}>
					<View style={{ marginLeft: 20 }}>
						{
							<GradientText
								style={{ fontSize: 27, fontWeight: "bold", letterSpacing: 1.2 }}
								text={"Sohbetlerim"}
							/>
						}
					</View>
					<View style={{ flexDirection: "row", alignSelf: "center" }}>
						<TouchableOpacity onPress={() =>{}}>
							
							<Feather
								name="search"
								size={27}
								color={colors.gray}
								style={{ paddingRight: 15 }}
							/>
							
						</TouchableOpacity>
					</View>
				</View>
				<View style = {{
					Container: {width: "100%"},
					flexDirection: "row",
					justifyContent: "center",
					marginTop: 10
				}}>
					<View style = {{flex: 1}}>
						{
							chatMode[0] == 1 ? (
								<Gradient style = {{ height: height * 0.06}}>
									<TouchableOpacity style= {{
										backgroundColor: "#F4F3F3",
										paddingBottom: 16,
										
									}}>
										<GradientText
											style={{ marginLeft: width * 0.1, fontSize: 18, fontWeight: "bold", letterSpacing: 1.2, justifyContent: "center", alignItems: "center" }}
											text={"Flört Modu"}
										/>
									</TouchableOpacity>
	
								</Gradient>
	
							) : (
								<Pressable style = {{alignItems: "center", justifyContent: "center"}} onPress={() => {setChatMode([1, 0]);}}>
									  <Text style={{fontSize: 20, color: colors.cool_gray}}>
										  Flört Modu
									</Text>
								</Pressable>
	
						)}
					</View>
					<View style = {{flex: 1}}>
						{
							chatMode[1] == 1 ? (
								<Gradient style = {{ height: height * 0.06}}>
									<TouchableOpacity style= {{
										backgroundColor: "#F4F3F3",
										paddingBottom: 16,
										
									}}>
										<GradientText
											style={{ marginLeft: width * 0.05, fontSize: 18, fontWeight: "bold", letterSpacing: 1.2, justifyContent: "center", alignItems: "center" }}
											text={"Arkadaş Modu"}
										/>
									</TouchableOpacity>
	
								</Gradient>
	
							) : (
								<Pressable style = {{alignItems: "center", justifyContent: "center"}} onPress={() => {setChatMode([0, 1]);}}>
									  <Text style={{fontSize: 20, color: colors.cool_gray}}>
										  Arkadaş Modu
									</Text>
								</Pressable>
	
						)}
					</View>
	
	
				</View>
	
				<View>
					{
						chatMode[0] == 1 ? (
							<View>
								<View style={{marginBottom:10}} />
	
								<View>
									<FlatList
										horizontal = {true}
										showsHorizontalScrollIndicator={false}
										data={chatRooms}
										renderItem={({item,index}) => {
											if (item.mode == 0 && item.lastMsg == null) {
												return <NewMatchBox data= {item} openChat = {() => openChat()} userID = {myUserID}/>;
											}
										}}
	
									/>
								</View>
								<View style={{marginBottom:10}} />
								<View>
									<FlatList
										style = {{
											flexDirection: "row",
											borderRadius: 8,
										}}
										data = {chatRooms}
										renderItem={({item,index}) => {
											if (item.mode == 0 && item.lastMsg != null && item.firstUser.id == myUserID) {
												return <MsgBox data= {item.secondUser} lastMsg = {item.lastMsg} lastTime = {item.updatedAt} handleDelete = {() => deleteItem(index)} openChat = {() => openChat()} userID = {myUserID}/>;
											}
											if (item.mode == 0 && item.lastMsg != null && item.secondUser.id == myUserID) {
												return <MsgBox data= {item.firstUser} lastMsg = {item.lastMsg} lastTime = {item.updatedAt} handleDelete = {() => deleteItem(index)} openChat = {() => openChat()} userID = {myUserID}/>;
											}
										}}
									/>
								</View>
							</View>
							
							
						) : (
							<View>
								<View style={{marginBottom:10}} />
								<View>
	
									<FlatList
										horizontal = {true}
										showsHorizontalScrollIndicator={false}
										data={chatRooms}
										renderItem={({item,index}) => {
											if (item.mode == 1 && item.lastMsg == null) {
												return <NewMatchBox data= {item} openChat = {() => openChat()} userID = {myUserID}/>;
											}
										}}
	
									/>
								</View>
								<View style={{marginBottom:10}} />
								<View>
									<FlatList
										style = {{
											flexDirection: "row",
											borderRadius: 8,
										}}
										data = {chatRooms}
										renderItem={({item,index}) => {
											if (item.mode == 1 && item.lastMsg != null && item.firstUser.id == myUserID) {
												return <MsgBox data= {item.secondUser} lastMsg = {item.lastMsg} lastTime = {item.updatedAt} handleDelete = {() => deleteItem(index)} openChat = {() => openChat()} userID = {myUserID}/>;
											}
											if (item.mode == 1 && item.lastMsg != null && item.secondUser.id == myUserID) {
												return <MsgBox data= {item.firstUser} lastMsg = {item.lastMsg} lastTime = {item.updatedAt} handleDelete = {() => deleteItem(index)} openChat = {() => openChat()} userID = {myUserID}/>;
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
