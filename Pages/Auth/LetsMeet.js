import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Animated, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import commonStyles from "../../visualComponents/styles";
import MaskedView from "@react-native-masked-view/masked-view";
import { Gradient, GradientText } from "../../visualComponents/colors";

import { Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

export default function LetsMeet({ navigation }) {
	return (
		<View style={commonStyles.Container}>
			<StatusBar style={"dark"} />
			<View
				style={{
					width: "100%",
					height: "100%",
					paddingHorizontal: width * 0.1,
					justifyContent: "center",
				}}
			>
				<GradientText
					text={"Hoş geldin\nTanışalım mı?"}
					style={{ fontSize: height * 0.05, fontWeight: "bold", height: height * 0.12 }}
				/>

				<Text
					style={{
						color: "#525A64",
						fontSize: height * 0.022,
						lineHeight: height * 0.025,
						letterSpacing: 0.4,
					}}
				>
					Seni yakından tanımak için sana{"\n"}kartlar hazırladık. Böylece profilin{"\n"}ve kaydın
					tamamlanmış olacak.
				</Text>

				<Image
					source={require("../../assets/LetsMeetIcon.png")}
					style={{
						alignSelf: "center",
						aspectRatio: 1,
						maxHeight: height * 0.4,
						maxWidth: width * 0.8,
					}}
					resizeMode={"contain"}
				/>

				<TouchableOpacity
					style={[
						commonStyles.button,
						{ width: width * 0.8, maxHeight: height * 0.1, marginTop: height * 0.03 },
					]}
					onPress={() => {
						navigation.replace("RMahremiyetPolitikasi");
					}}
				>
					<Gradient style={{ borderRadius: 8, justifyContent: "center" }}>
						<Text style={commonStyles.buttonText}>E Hadi!</Text>
					</Gradient>
				</TouchableOpacity>
			</View>
		</View>
	);
}


const styles = {

	container:{
	  marginTop: 20,
	  marginLeft: 10,
	  marginRight: 10
	},
	title: {
		fontSize: 22,
		alignSelf: 'center'
	},
	tcP: {
		marginTop: 10,
		marginBottom: 10,
		fontSize: 12
	},
	tcP:{
		marginTop: 10,
		fontSize: 12
	},
	tcL:{
		marginLeft: 10,
		marginTop: 10,
		marginBottom: 10,
		fontSize: 12
	},
	tcContainer: {
		marginTop: 15,
		marginBottom: 15,
		height: height * .7
	},
  
	button:{
		backgroundColor: '#136AC7',
		borderRadius: 5,
		padding: 10
	},
  
	buttonDisabled:{
	  backgroundColor: '#999',
	  borderRadius: 5,
	  padding: 10
   },
  
	buttonLabel:{
		fontSize: 14,
		color: '#FFF',
		alignSelf: 'center'
	}
  
  }