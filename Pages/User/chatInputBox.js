import React from 'react';
import { View, Text, TextInput } from 'react-native';
import {Ionicons, FontAwesome5} from "@expo/vector-icons"
import { TouchableOpacity } from 'react-native-gesture-handler';
import { API, graphqlOperation } from 'aws-amplify';
import {createSentMsg, updateSentMsg, updateUserChat} from "../../src/graphql/mutations";
import * as SecureStore from "expo-secure-store";

const InputBox = (props) => {
    const [message, setMessage] = React.useState("");

    const sendMessage = async() =>{
        try {
            
            const newMessageData = await API.graphql(
                graphqlOperation(
                    createSentMsg,
                    {
                        input: {
                            userChatMessagesId: props.chatID,
                            sentMsgSenderId: props.myUserID,
                            text: message,
                            status: "Active",
                        }

                    }
                )
            )
        } catch (e) {
            console.log(e);
        }
    }

    const updateChat = async() =>{
        try {
            const newMessageData = await API.graphql(
                graphqlOperation(
                    updateUserChat,
                    {
                        input: {
                            id: props.chatID,
                            lastMsg: message,
                        }

                    }
                )
            )
        } catch (e) {
            console.log(e);
        }
    }
    const sendNotification = async() =>{
        try {
            let abortController = new AbortController();
		    const userDataStr = await SecureStore.getItemAsync("userData");
		    const userData = JSON.parse(userDataStr);
		    const userName = userData.Name;
            console.log(userName);
            console.log(message);
            console.log(props.otherUser.pushToken);
            let response = fetch ('https://exp.host/--/api/v2/push/send', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    to: props.otherUser.pushToken,
                    sound: 'default',
                    title: userName,
                    body: message
                })
            });
            
        } catch (e) {
            console.log(e);
        }
    }

    return (
        <View style = {{flexDirection: "row", margin: 10, alignItems: "flex-end"}}>
            <View style = {{flexDirection: "row", backgroundColor: "white", padding: 10, marginRight: 10, borderRadius: 25, flex:1, alignItems: "flex-end"}}>
                <FontAwesome5 name = "laugh-beam" size={24} color= "grey"/>
                <TextInput style = {{flex: 1, marginHorizontal: 10, }} 
                    multiline
                    placeholder = {props.otherUser.name}
                    value={message}
                    onChangeText={setMessage}

                />
                
            </View>
            <TouchableOpacity 
                name = {"sendMsgButton"}
                onPress = {() => {
                    
                    if (message != "") {
                        
                        sendMessage();
                        updateChat();
                        setMessage("");
                        sendNotification();  
                        
                    }
                    
                    
                }}
                style= {{backgroundColor: "blue", borderRadius: 45, width: 45, height: 45, justifyContent: "center", alignItems: "center"}}
            >
               
                <Ionicons name = "send" size = {22} color = "white"/>
            </TouchableOpacity>
        </View>
    )
}

export default InputBox;