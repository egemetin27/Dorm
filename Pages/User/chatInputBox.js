import React from 'react';
import { View, Text, TextInput } from 'react-native';
import {Ionicons, FontAwesome5} from "@expo/vector-icons"
const InputBox = () => {
    return (
        <View style = {{flexDirection: "row", margin: 10, alignItems: "flex-end"}}>
            <View style = {{flexDirection: "row", backgroundColor: "white", padding: 10, marginRight: 10, borderRadius: 25, flex:1, alignItems: "flex-end"}}>
                <FontAwesome5 name = "laugh-beam" size={24} color= "grey"/>
                <TextInput style = {{flex: 1, marginHorizontal: 10, }} 
                    multiline
                    placeholder = "Mesajın"

                />
                
            </View>
            <View style= {{backgroundColor: "blue", borderRadius: 45, width: 45, height: 45, justifyContent: "center", alignItems: "center"}}>
                <Ionicons name = "send" size = {22} color = "white"/>
            </View>
        </View>
    )
}

export default InputBox;