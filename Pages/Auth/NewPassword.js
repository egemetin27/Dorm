import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Animated, Alert } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { CryptoDigestAlgorithm, digestStringAsync } from "expo-crypto";

import { GradientText } from "../../visualComponents/colors";
import commonStyles from "../../visualComponents/styles";
import { url } from "../../connection";

export default function FirstPassword({ navigation, route }) {
	const [password, setPassword] = React.useState("");
	const [password2, setPassword2] = React.useState("");
	const [wrongInput, setWrongInput] = React.useState(false);
	const [passwordShown, setPasswordShown] = React.useState(false);

	const animRef = React.useRef(new Animated.Value(0)).current;
	const animRef2 = React.useRef(new Animated.Value(0)).current;

	const handleSubmit = async () => {
		const { email } = route.params;

		if (password.length < 8) {
			Alert.alert("Şifren en az 8 karakterli olmalı");
			return;
		}
		if (password != password2) {
			Alert.alert("İki şifre aynı olmalı");
			return;
		}

		const encryptedPassword = await digestStringAsync(CryptoDigestAlgorithm.SHA256, password);

		const dataToBeSent = { password: encryptedPassword, mail: email }; //TODO: userID should be come from route.params.id

		axios
			.post(url + "/PasswordRegister", dataToBeSent)
			.then((res) => {
				console.log(res.data);
				console.log("Password Updated Successfully");
				navigation.replace("Login");
			})
			.catch((error) => {
				console.log({ error });
			});
	};

	const handleFocus = (ref) => {
		Animated.timing(ref, {
			useNativeDriver: false,
			toValue: 1,
			duration: 150,
		}).start();
	};

	const handleBlur = (ref) => {
		Animated.timing(ref, {
			useNativeDriver: false,
			toValue: 0,
			duration: 150,
		}).start();
	};

	return (
		<View style={commonStyles.Container}>
			<StatusBar style={"dark"} />
			<View style={commonStyles.Header} />
			<View style={commonStyles.innerContainer}>
				<GradientText
					text={"Hadi, yeni şifreni\nbelirleyelim"}
					style={{ fontFamily: "NowBold", fontSize: 30, paddingBottom: 20 }}
				/>

				<View style={{ position: "relative" }}>
					<Text style={styles.text}>
						Güvenliğin için en az 8 karakterli şifre{"\n"}oluşturmanı istiyoruz.
					</Text>
				</View>

				<View
					style={[
						commonStyles.inputContainer,
						{ marginTop: 30 },
						wrongInput ? commonStyles.InvalidInput : commonStyles.ValidInput,
					]}
				>
					<Animated.Text
						style={[
							styles.placeHolder,
							{
								transform: [
									{
										translateY: animRef.interpolate({ inputRange: [0, 1], outputRange: [0, -20] }),
									},
								],
								fontSize: animRef.interpolate({ inputRange: [0, 1], outputRange: [14, 11] }),
							},
						]}
					>
						Şifren
					</Animated.Text>
					<TextInput
						style={commonStyles.input}
						onChangeText={setPassword}
						value={password}
						secureTextEntry={!passwordShown}
						onFocus={() => {
							handleFocus(animRef);
						}}
						onBlur={() => {
							if (password == "") handleBlur(animRef);
						}}
					/>
					<TouchableOpacity
						style={{ alignSelf: "flex-end", position: "absolute", right: 15 }}
						onPress={() => {
							setPasswordShown(!passwordShown);
						}}
					>
						{passwordShown ? (
							<Ionicons name="eye" size={27} color="#B6B6B6" />
						) : (
							<Ionicons name="eye-off" size={27} color="#B6B6B6" />
						)}
					</TouchableOpacity>
				</View>
				<View
					style={[
						commonStyles.inputContainer,
						{ marginTop: 30 },
						wrongInput ? commonStyles.InvalidInput : commonStyles.ValidInput,
					]}
				>
					<Animated.Text
						style={[
							styles.placeHolder,
							{
								transform: [
									{
										translateY: animRef2.interpolate({ inputRange: [0, 1], outputRange: [0, -20] }),
									},
								],
								fontSize: animRef2.interpolate({ inputRange: [0, 1], outputRange: [14, 11] }),
							},
						]}
					>
						Şifre Kontrolü
					</Animated.Text>
					<TextInput
						style={commonStyles.input}
						onChangeText={setPassword2}
						value={password2}
						secureTextEntry={!passwordShown}
						onFocus={() => {
							handleFocus(animRef2);
						}}
						onBlur={() => {
							if (password2 == "") handleBlur(animRef2);
						}}
					/>
				</View>
				{wrongInput && (
					<View style={{ marginTop: 8 }}>
						<Text style={{ color: "#FF4646", fontSize: 14, letterSpacing: 0.3 }}>
							Şifren yetersiz sayıda karakter içeriyor
						</Text>
					</View>
				)}
				<TouchableOpacity
					style={[commonStyles.button, { marginTop: 30 }]}
					disabled={password == ""}
					onPress={handleSubmit}
				>
					{!(password == "") ? (
						<LinearGradient
							colors={["#4136F1", "#8743FF"]}
							start={{ x: 0, y: 0 }}
							end={{ x: 1, y: 1 }}
							locations={[0, 1]}
							style={{
								height: "100%",
								width: "100%",
								borderRadius: 8,
								justifyContent: "center",
								alignItems: "center",
							}}
						>
							<Text style={commonStyles.buttonText}>Şifre Oluştur</Text>
						</LinearGradient>
					) : (
						<Text style={commonStyles.buttonText}>Şifre Oluştur</Text>
					)}
				</TouchableOpacity>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	maskedViewStyle: {
		position: "relative",
		alignItems: "flex-start",
	},
	text: {
		color: "#525A64",
		fontSize: 18,
		alignContent: "flex-start",
		letterSpacing: 0.3,
	},
	placeHolder: {
		position: "absolute",
		alignSelf: "flex-start",
		color: "#B6B6B6",
		marginLeft: 15,
		fontSize: 14,
	},
});
