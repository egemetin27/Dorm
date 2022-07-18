import { StatusBar } from "expo-status-bar";
import React from "react";
import {
	StyleSheet,
	Text,
	View,
	TouchableOpacity,
	TextInput,
	Animated,
	Dimensions,
	ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import commonStyles from "../../visualComponents/styles";

import { useFonts } from "@expo-google-fonts/inter";
import { AuthContext } from "../../contexts/auth.context";

const emailRegex = /^[\w-\.]+@([\w-]+\.)edu(\.[\w-]{2,4})?/;
const { width, height } = Dimensions.get("window");

export default function Login({ navigation }) {
	const [loading, setLoading] = React.useState(false);
	const [email, onChangeEmail] = React.useState("");
	const [password, onChangePassword] = React.useState("");
	const [wrongInput, setWrongInput] = React.useState({
		value: false,
		message: "",
	});
	const [passwordShown, setPasswordShown] = React.useState(false);

	const animRef1 = React.useRef(new Animated.Value(0)).current;
	const animRef2 = React.useRef(new Animated.Value(0)).current;

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

	const { signIn } = React.useContext(AuthContext);

	const handleLogin = async () => {
		setLoading(true);
		signIn({
			email: email.trim().toLowerCase(),
			password: password.trim(),
			isNewUser: false,
			navigation: navigation,
			notLoading: () => {
				setLoading(false);
			},
		});
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
			<View style={[commonStyles.innerContainer, { marginTop: 60 }]}>
				<View
					style={[
						commonStyles.inputContainer,
						wrongInput.value ? commonStyles.InvalidInput : commonStyles.ValidInput,
					]}
				>
					<Animated.Text
						style={[
							styles.placeHolder,
							{
								transform: [
									{
										translateY: animRef1.interpolate({
											inputRange: [0, 1],
											outputRange: [0, -width * 0.045],
										}),
									},
								],
								fontSize: animRef1.interpolate({
									inputRange: [0, 1],
									outputRange: [width * 0.035, width * 0.023],
								}),
							},
						]}
					>
						Üniversite Mail Adresin
					</Animated.Text>
					<TextInput
						style={commonStyles.input}
						onChangeText={(text) => {
							onChangeEmail(text);
						}}
						value={email}
						keyboardType="email-address"
						onFocus={() => {
							handleFocus(animRef1);
						}}
						onBlur={() => {
							if (email == "") handleBlur(animRef1);
						}}
					/>
				</View>
				<View
					style={[
						commonStyles.inputContainer,
						{ marginTop: 20, justifyContent: "center" },
						wrongInput.value ? commonStyles.InvalidInput : commonStyles.ValidInput,
					]}
				>
					<Animated.Text
						style={[
							styles.placeHolder,
							{
								transform: [
									{
										translateY: animRef2.interpolate({
											inputRange: [0, 1],
											outputRange: [0, -width * 0.045],
										}),
									},
								],
								fontSize: animRef2.interpolate({
									inputRange: [0, 1],
									outputRange: [width * 0.035, width * 0.023],
								}),
							},
						]}
					>
						Şifren
					</Animated.Text>
					<TextInput
						style={[commonStyles.input]}
						onChangeText={onChangePassword}
						value={password}
						secureTextEntry={!passwordShown}
						onFocus={() => {
							handleFocus(animRef2);
						}}
						onBlur={() => {
							if (password == "") handleBlur(animRef2);
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
				{wrongInput.value && (
					<View style={{ marginTop: 8, left: 2, position: "relative" }}>
						<Text style={{ color: "#FF4646", fontSize: 14, letterSpacing: 0.3 }}>
							{wrongInput.message}
						</Text>
					</View>
				)}

				<TouchableOpacity
					style={{ left: 2, marginTop: 12 }}
					onPress={() => {
						navigation.navigate("ForgotPassword");
					}}
				>
					<Text
						style={{
							color: "#6B46D2",
							letterSpacing: 0.3,
							fontSize: 15,
							fontWeight: "600",
						}}
					>
						Şifreni mi Unuttun?
					</Text>
				</TouchableOpacity>

				<TouchableOpacity
					style={[commonStyles.button, { marginTop: 30 }]}
					disabled={email == "" || password == "" || loading}
					onPress={handleLogin}
				>
					{!(email == "" || password == "") ? (
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
							{loading ? (
								<ActivityIndicator size={"small"} color="white" />
							) : (
								<Text style={commonStyles.buttonText}>Giriş Yap</Text>
							)}
						</LinearGradient>
					) : (
						<Text style={commonStyles.buttonText}>Giriş Yap</Text>
					)}
				</TouchableOpacity>

				<View
					style={{
						alignSelf: "center",
						marginTop: 15,
						flexDirection: "row",
					}}
				>
					<Text style={{ color: "#4A4A4A" }}>Henüz Hesabın Yok mu?</Text>
					<TouchableOpacity
						style={{ left: 5 }}
						onPress={() => {
							navigation.navigate("LetsMeet");
						}}
					>
						<Text style={{ color: "#6B46D2", fontFamily: "PoppinsSemiBold" }}>dorm'a Katıl</Text>
					</TouchableOpacity>
				</View>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	placeHolder: {
		position: "absolute",
		alignSelf: "flex-start",
		color: "#B6B6B6",
		marginLeft: 15,
		fontSize: 14,
	},
});
