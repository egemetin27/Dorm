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
import { Feather } from "@expo/vector-icons";
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

export default function Chat({ navigation, route }) {
	const {
        chatUserID,
		chatID,
	} = route.params;


    const [chatMode, setChatMode] = React.useState([1, 0]);
		const [lists, setLists] = useState(msgData);
	
		const deleteItem = (index) => {
			const arr = [...lists];
			arr.splice(index,1);
			setLists(arr);
		};

		const openChat = async () => {
			
		};

	return (
        <View style={styles.inner}>
            <View name={"Header"} style={styles.header}>
				<TouchableOpacity
					name={"backButton"}
					onPress={() => {
						navigation.goBack();
					}}
				>
					<Feather name="chevron-left" size={36} color="#4A4A4A" />
				</TouchableOpacity>
				<GradientText
					text={"Chat"}
					style={{ fontSize: 36, fontWeight: "bold", paddingLeft: 0 }}
				/>
			</View>
            <FlatList
			    style = {{
			    	flexDirection: "column",
			    	borderRadius: 8,
                    height: height * 0.75
			    }}
			    
                
			/>
            
          <InputBox/>
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
