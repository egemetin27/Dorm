import { StatusBar } from "expo-status-bar";
import React from "react";
import { Text, View, TouchableOpacity, Image, Dimensions } from "react-native";
import commonStyles from "../../visualComponents/styles";
import { colors, Gradient, GradientText } from "../../visualComponents/colors";

const { width, height } = Dimensions.get("window");

export default function WelcomePage({ navigation }) {
	const [counter, counterChanger] = React.useState(0);

	return (
		<View style={commonStyles.Container}>
			<StatusBar style={"light"} />
			<Gradient style={{ justifyContent: "center", alignItems: "center" }}>
				<Image
					resizeMode="contain"
					style={{
						aspectRatio: 1,
						maxHeight: height * 0.25,
						maxWidth: width * 0.5,
						marginBottom: 20,
					}}
					source={require("../../assets/logo.png")}
				/>
				<Text
					style={{
						color: colors.white,
						fontSize: height * 0.05,
						lineHeight: height * 0.055,
						fontWeight: "bold",
						textAlign: "center",
					}}
				>
					Tanışmanın{"\n"}Yeni Yolu
				</Text>
				<TouchableOpacity
					style={[
						commonStyles.button,
						{
							aspectRatio: 5 / 1,
							width: width * 0.8,
							maxHeight: height * 0.075,
							marginTop: height * 0.03,
							backgroundColor: colors.white,
						},
					]}
					onPress={() => {
						navigation.navigate("Login");
					}}
				>
					<GradientText
						text={"Oturum Aç"}
						style={{ fontSize: 22, fontWeight: "bold", letterSpacing: 0.75 }}
					/>
				</TouchableOpacity>
				<TouchableOpacity
					style={[
						commonStyles.button,
						{
							aspectRatio: 5 / 1,
							width: width * 0.8,
							maxHeight: height * 0.075,
							backgroundColor: "transparent",
							borderColor: colors.white,
							borderWidth: 3,
							marginTop: height * 0.03,
						},
					]}
					onPress={() => {
						navigation.navigate("LetsMeet");
					}}
				>
					<Text
						style={{
							letterSpacing: 0.75,
							fontWeight: "bold",
							fontSize: 22,
							color: colors.white,
						}}
					>
						dorm'a Katıl
					</Text>
				</TouchableOpacity>
				<Text
					style={{
						color: colors.white,
						width: width / 1.5,
						textAlign: "center",
						marginTop: height * 0.03,
						lineHeight: height * 0.02,
						fontSize: height * 0.015,
					}}
				>
					Katılarak Topluluk Kurallarımızı ve Şartlarımızı kabul etmiş olursun. Verilerini nasıl
					işlediğimizi öğrenmek istersen Gizlilik Politikamızı ve Çerez Politikamızı
					inceleyebilirsin.
				</Text>
			</Gradient>
		</View>
	);
}
