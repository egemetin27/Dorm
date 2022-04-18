import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Animated } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import MaskedView from "@react-native-masked-view/masked-view";
import axios from "axios";

import commonStyles from "../../visualComponents/styles";
import { url } from "../../connection";

export default function ForgotPassword({ navigation }) {
	const [email, onChangeEmail] = React.useState("");
	const [flag, onChangeFlag] = React.useState(false);

	const animRef = React.useRef(new Animated.Value(0)).current;

	const HandleButton = () => {
		axios
			.post(url + "/SendVerification", { Mail: email, isNewUser: false })
			.then((res) => {
				navigation.replace("Verification2", { email: email });
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
				<TouchableOpacity
					style={{ left: 35 }}
					onPress={() => {
						navigation.goBack();
					}}
				>
					<Ionicons name="arrow-back-outline" size={32} color="#B6B6B6" />
				</TouchableOpacity>
			</View>
			<View style={commonStyles.innerContainer}>
				<MaskedView
					style={styles.maskedViewStyle}
					maskElement={
						<Text
							style={{
								fontFamily: "PoppinsSemiBold",
								fontSize: 30,
							}}
						>
							Olur öyle
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
								fontFamily: "PoppinsSemiBold",
								fontSize: 30,
							}}
						>
							Olur öyle
						</Text>
					</LinearGradient>
				</MaskedView>

				<View style={{ position: "relative", marginTop: 10 }}>
					<Text style={styles.text}>Hangimiz şifremizi unutmadık ki!</Text>
					<Text style={styles.text}>
						Hiç sorun değil, sana mail atacağımız{"\n"}doğrulamaya tıklaman yeterli.
					</Text>
				</View>

				<View
					style={[
						commonStyles.inputContainer,
						{ marginTop: 30 },
						flag ? commonStyles.InvalidInput : commonStyles.ValidInput,
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
						Üniversite Mail Adresin
					</Animated.Text>
					<TextInput
						style={commonStyles.input}
						onChangeText={onChangeEmail}
						value={email}
						keyboardType="email-address"
						// placeholder={"Üniversite Mail Adresin"}
						onFocus={() => {
							handleFocus(animRef);
						}}
						onBlur={() => {
							if (email == "") handleBlur(animRef);
						}}
					/>
				</View>
				{flag && (
					<View style={{ marginTop: 8 }}>
						<Text style={{ color: "#FF4646", fontSize: 14, letterSpacing: 0.3 }}>
							Bu mail adresi geçersiz.
						</Text>
					</View>
				)}
				<TouchableOpacity
					style={[commonStyles.button, { marginTop: 30 }]}
					disabled={email == ""}
					onPress={HandleButton}
				>
					{!(email == "") ? (
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
							<Text style={commonStyles.buttonText}>Doğrulama Gönder</Text>
						</LinearGradient>
					) : (
						<Text style={commonStyles.buttonText}>Doğrulama Gönder</Text>
					)}
				</TouchableOpacity>

				<View style={{ alignSelf: "center", flexDirection: "row", marginTop: 15 }}>
					<Text style={{ color: "#4A4A4A", letterSpacing: 0.3, fontSize: 15 }}>
						Mailine ulaşamıyor musun?
					</Text>
					<TouchableOpacity style={{ left: 5 }}>
						<Text
							style={{
								color: "#6B46D2",
								fontFamily: "PoppinsSemiBold",
								letterSpacing: 0.3,
								fontSize: 15,
							}}
						>
							Bize Ulaş
						</Text>
					</TouchableOpacity>
				</View>
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
