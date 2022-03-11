import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Animated } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import MaskedView from "@react-native-masked-view/masked-view";
import commonStyles from "../../visualComponents/styles";
import axios from "axios";
import { url } from "../../connection";

export default function NewPassword({ navigation, route }) {
	const [password, setPassword] = React.useState("");
	const [wrongInput, setWrongInput] = React.useState(false);

	const animRef = React.useRef(new Animated.Value(0)).current;

	const HandleButton = () => {
		axios
			.post(url + "/PasswordRegister", { password: password, UserId: userID })
			.then((res) => {
				console.log("Password Changed Successfully");
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
			<View style={commonStyles.Header}>
				<TouchableOpacity style={{ left: 35 }}>
					<Ionicons name="arrow-back-outline" size={32} color="#B6B6B6" />
				</TouchableOpacity>
			</View>
			<View style={commonStyles.innerContainer}>
				<MaskedView
					style={styles.maskedViewStyle}
					maskElement={
						<Text
							style={{
								fontWeight: "bold",
								fontSize: 30,
							}}
						>
							Hadi, yeni şifreni{"\n"}belirleyelim
						</Text>
					}
				>
					<LinearGradient
						colors={["#4136F1", "#8743FF"]}
						start={{ x: 0, y: 0 }}
						end={{ x: 1, y: 1 }}
						locations={[0, 1]}
					>
						<Text
							style={{
								opacity: 0,
								fontWeight: "bold",
								fontSize: 30,
							}}
						>
							Hadi, yeni şifreni{"\n"}belirleyelim
						</Text>
					</LinearGradient>
				</MaskedView>

				<View style={{ position: "relative", marginTop: 10 }}>
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
						keyboardType="email-address"
						// placeholder={"Üniversite Mail Adresin"}
						onFocus={() => {
							handleFocus(animRef);
						}}
						onBlur={() => {
							if (password == "") handleBlur(animRef);
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
					onPress={HandleButton}
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
