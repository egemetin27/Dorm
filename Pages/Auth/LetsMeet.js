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
		<View
			style={[commonStyles.Container, { paddingHorizontal: width * 0.1, justifyContent: "center" }]}
		>
			<StatusBar style={"dark"} />
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
	);
}
