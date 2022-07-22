import { createContext, useMemo, useState, useContext } from "react";
import { Alert } from "react-native";
import axios from "axios";
import { CryptoDigestAlgorithm, digestStringAsync } from "expo-crypto";
import * as SecureStore from "expo-secure-store";
import { useNavigation, NavigationContext } from "@react-navigation/native";

import url from "../connection";
import crypto from "../functions/crypto";

export const AuthContext = createContext({
	user: null,
	isLoggedIn: null,
	updateProfile: () => {},
	signIn: () => {},
	signOut: () => {},
});

const AuthProvider = ({ children }) => {
	const navigation = useNavigation();

	const [user, setUser] = useState(null);
	const [isLoggedIn, setIsLoggedIn] = useState(false);

	const signIn = async ({
		email,
		password,
		isNewUser = false,
		// navigation = null,
		notLoading = () => {},
	}) => {
		// if (isNewUser) {
		// 	setNewUser(true);
		// } else {
		// 	setNewUser(false);
		// }

		const encryptedPassword = await digestStringAsync(CryptoDigestAlgorithm.SHA256, password);
		const dataToBeSent = crypto.encrypt({ mail: email, password: encryptedPassword });
		await axios
			.post(url + "/Login", dataToBeSent)
			.then(async (res) => {
				const data = crypto.decrypt(res.data);
				if (data.authentication == "true") {
					// console.log(data);
					if (navigation != null && data.onBoardingComplete == 0) {
						navigation.reset({
							index: 0,
							routes: [
								{
									name: "PhotoUpload",
									params: {
										mail: email,
										password: password,
										userId: data.userId,
										sesToken: data.sesToken,
									},
								},
							],
						});

						// navigation.replace("PhotoUpload", {
						// 	mail: email,
						// 	password: password,
						// 	userId: data.userId,
						// 	sesToken: data.sesToken,
						// });
						return;
					}
					// If signed in

					// registerForPushNotificationAsync().then((token) => {
					// 	fetchUser(data.Name, data.userId, token, data.sesToken);
					// });

					const photoList = data.Photo.map((item) => {
						return {
							PhotoLink: item.PhotoLink,
							Photo_Order: item.Photo_Order,
						};
					});

					const userData = {
						...data,
						email: email,
						Photo: photoList,
					};

					const credentials = JSON.stringify({
						password: password,
						email: email,
					});

					SecureStore.setItemAsync("credentials", credentials);

					setUser(userData);
					setIsLoggedIn(true);
				} else {
					console.log("else:", data);
					Alert.alert(data);
					notLoading();
				}
			})
			.catch(async (error) => {
				console.log("error on /login: ");
				console.log(error);
				Alert.alert("Hata", error?.response?.data, [{ text: "Kontrol Edeyim" }]);
				await SecureStore.deleteItemAsync("credentials");
				setUser(null);
				setIsLoggedIn(false);
				notLoading();
			});
	};
	const signOut = async () => {
		try {
			await SecureStore.deleteItemAsync("credentials");
			// await AsyncStorage.removeItem("isLoggedIn");
		} catch (err) {
			console.log("Error Signing Out: ", err);
		} finally {
			setUser(null);
			setIsLoggedIn(false);
		}
	};

	const updateProfile = (newData) => {
		setUser((initialInfo) => {
			return { ...initialInfo, ...newData };
		});
	};

	const value = { user, isLoggedIn, updateProfile, signIn, signOut };

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;