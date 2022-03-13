import React from 'react';
import { View, Text, TextInput } from 'react-native';
import {Ionicons, FontAwesome5} from "@expo/vector-icons"
import { TouchableOpacity } from 'react-native-gesture-handler';
import { API, graphqlOperation } from 'aws-amplify';


import {createSentMsg, updateSentMsg, updateUserChat} from "../../src/graphql/mutations";

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

    return (
        <View style = {{flexDirection: "row", margin: 10, alignItems: "flex-end"}}>
            <View style = {{flexDirection: "row", backgroundColor: "white", padding: 10, marginRight: 10, borderRadius: 25, flex:1, alignItems: "flex-end"}}>
                <FontAwesome5 name = "laugh-beam" size={24} color= "grey"/>
                <TextInput style = {{flex: 1, marginHorizontal: 10, }} 
                    multiline
                    placeholder = "Mesajın"
                    value={message}
                    onChangeText={setMessage}

                />
                
            </View>
            <TouchableOpacity 
                name = {"sendMsgButton"}
                onPress = {() => {
                    //console.log(message);
                    sendMessage();
                    updateChat();
                    setMessage("");
                }}
                style= {{backgroundColor: "blue", borderRadius: 45, width: 45, height: 45, justifyContent: "center", alignItems: "center"}}
            >
               
                <Ionicons name = "send" size = {22} color = "white"/>
            </TouchableOpacity>
        </View>
    )
}

export default InputBox;