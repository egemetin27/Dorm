import React, {useState} from "react";
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
    FlatList
} from "react-native";
import { Feather, Octicons } from "@expo/vector-icons";
import Animated from "react-native-reanimated";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import KeyboardSpacer from 'react-native-keyboard-spacer'


import commonStyles from "../../visualComponents/styles";
import { colors, Gradient, GradientText } from "../../visualComponents/colors";
import KeyboardAvoidingWrapper from "./KeyboardAvoidingWrapper";

const { width, height } = Dimensions.get("window");


import MsgBox from "./MsgBox";
import { msgData } from "../msgData";
import InputBox from "./chatInputBox";


import {
	API,
	graphqlOperation,
	Auth,
  } from 'aws-amplify';

import { listMsgUsers, listSentMsgs, msgByDate  } from "../../src/graphql/queries";
import { onCreateSentMsg } from "../../src/graphql/subscriptions"
import ChatMsg from "./ChatMsg";
import { decompose2d } from "react-native-redash";

export default function Chat({ navigation, route }) {
	const [chatMessages, setChatMessages] = useState([]);

	const {
        otherUser,
		myUserID,
		chatID,
	} = route.params;

	const fetchMsg = async () => {
		try {
			const chatMsgData = await API.graphql(
				graphqlOperation(
					msgByDate,{
						status: "Active",
						sortDirection: "DESC",
					}
				)
			)
			

		} catch (error) {
			console.log(error);
		}

	}

	const fetchNewMessages = async () => {
		try {
			const chatMsgData = await API.graphql(
				graphqlOperation(
					msgByDate,{
						status: "Active",
						sortDirection: "DESC",
						filter:{
							userChatMessagesId: {eq: chatID}
						}
					}
				)
			)
			await setChatMessages(chatMsgData.data.msgByDate.items)
		} catch (error) {
			console.log(error);
		}
	}

	React.useEffect(async () => {
		fetchNewMessages();
		fetchMsg();
	}, [])

	React.useEffect(async () => {
		try {
			const subscription = API.graphql(
				graphqlOperation(onCreateSentMsg)
			).subscribe({
				next: (data) => {
					
					console.log("------------------------");
					console.log(data.value.data.onCreateSentMsg);
					console.log("------------------------");

					if (data.value.data.onCreateSentMsg.userChatMessagesId != chatID ) {
						console.log("Message is in another chat")
						return;
					}
					else{
						console.log("Message is in your chat")
					}

					fetchNewMessages();

				}
			});
			return () => subscription.unsubscribe();

		} catch (error) {
			console.log(error);
		}
		
	}, [])
	

	/*
	React.useEffect(async () => {
		
		const subscription = API.graphql(
		graphqlOperation(onCreateSentMsg)
		).subscribe({
			next: (data) => {
			console.log("---------------------------");
			console.log(data.value.data.onCreateSentMsg);
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
	*/

	return (
        <View style={styles.inner}>
            <View name={"Header"} style={[styles.header]}>
				<TouchableOpacity
					style = {{width: "12%", paddingBottom: 5}}
					name={"backButton"}
					onPress={() => {
						navigation.goBack();
					}}
				>
					<Feather name="chevron-left" size={36} color="#4A4A4A" />
				</TouchableOpacity>
				<Image
                    style = {{resizeMode: "contain", width: "10%", height: "60%", borderRadius: 40}}
                    source = {{
                        uri: "https://m.media-amazon.com/images/M/MV5BMTg0MzkzMTQtNWRlZS00MGU2LTgwYTktMjkyNTZkZTAzNTQ3XkEyXkFqcGdeQXVyMTM1MTE1NDMx._V1_FMjpg_UY720_.jpg"
                    }}
                />
				<View style = {{width: "2%"}}>

				</View>
				<View style = {{flexDirection: "column", width: "55%", marginLeft: 10,justifyContent: "space-between"}}>
                    <GradientText
						text = {otherUser.name}
						style={{ fontSize: 18, fontWeight: "bold", paddingLeft: 0 }}
                    />
                    <Text style = {{fontSize: 10, marginBottom: 10}}>
                    	{"-"}
                    </Text>
                </View>
				<TouchableOpacity
					style = {{paddingBottom: 8}}
					name = {"reportButton"}
					onPress= {() => {

					}}
				>
					<Octicons name = "report" size={32} color="#4A4A4A"/>
				</TouchableOpacity>
			</View>
            <FlatList
			    style = {{
			    	flexDirection: "column",
			    	borderRadius: 8,
                    height: height * 0.75
			    }}
				data={chatMessages}
				renderItem={({item,index}) => {
					return <ChatMsg data = {item}  myUserID = {myUserID}/>
					
					/*
					if (item.mode == 0 && item.lastMsg == null && item.firstUser.id == myUserID) {
						return <NewMatchBox data= {item.secondUser} openChat = {() => openChat(item.secondUser, myUserID, item.id)} userID = {myUserID}/>;
					}
					if (item.mode == 0 && item.lastMsg == null && item.secondUser.id == myUserID) {
						return <NewMatchBox data= {item.firstUser} openChat = {() => openChat(item.firstUser, myUserID, item.id)} userID = {myUserID}/>;
					}
					*/
				}}
				inverted
			/>
          <InputBox myUserID = {myUserID} chatID = {chatID}/>
          <KeyboardSpacer/>
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
        flex: 1
    },
});
