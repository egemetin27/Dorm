import { createContext, useMemo, useState } from "react";
import axios from "axios";
import { CryptoDigestAlgorithm, digestStringAsync } from "expo-crypto";

import crypto from "../functions/crypto";

export const AuthContext = createContext();

// const AuthProvider = ({ children }) => {
// 	const [user, setUser] = useState(null);
// 	const [newUser, setNewUser] = useState(false);

// 	const signIn = async ({
// 		email,
// 		password,
// 		isNewUser,
// 		navigation = null,
// 		notLoading = () => {},
// 	}) => {
// 		if (isNewUser) {
// 			setNewUser(true);
// 		} else {
// 			setNewUser(false);
// 		}

// 		const encryptedPassword = await digestStringAsync(CryptoDigestAlgorithm.SHA256, password);
// 		const dataToBeSent = crypto.encrypt({ mail: email, password: encryptedPassword });
// 		await axios
// 			.post(url + "/Login", dataToBeSent)
// 			.then(async (res) => {
// 				const data = crypto.decrypt(res.data);
// 				if (data.authentication == "true") {
// 					// console.log(data);
// 					if (navigation != null && data.onBoardingComplete == 0) {
// 						navigation.replace("PhotoUpload", {
// 							mail: email,
// 							password: password,
// 							userId: data.userId,
// 							sesToken: data.sesToken,
// 						});
// 						return;
// 					}
// 					// If signed in

// 					registerForPushNotificationAsync().then((token) => {
// 						fetchUser(data.Name, data.userId, token, data.sesToken);
// 					});

// 					const photoList = data.Photo.map((item) => {
// 						return {
// 							PhotoLink: item.PhotoLink,
// 							Photo_Order: item.Photo_Order,
// 						};
// 					});
// 					const userData = JSON.stringify({
// 						...data,
// 						password: password,
// 						email: email,
// 						Photo: photoList,
// 					});

// 					await SecureStore.setItemAsync("userData", userData);
// 					await SecureStore.setItemAsync("userId", data.userId.toString());
// 					Session.User = {
// 						...data,
// 						email: email,
// 						Photo: photoList,
// 					};

// 					await AsyncStorage.setItem("isLoggedIn", "yes");
// 					setIsLoggedIn(true);
// 				} else {
// 					console.log("else:", data);
// 					alert(data);
// 					notLoading();
// 				}
// 			})
// 			.catch(async (error) => {
// 				// if (error.response.status == 420) {
// 				// 	console.log(420);
// 				// }
// 				console.log("error on /login: ");
// 				console.log(error);
// 				Alert.alert("Hata", error?.response?.data, [{ text: "Kontrol Edeyim" }]);
// 				await SecureStore.deleteItemAsync("userData");
// 				await AsyncStorage.removeItem("isLoggedIn");
// 				setIsLoggedIn(false);
// 				notLoading();
// 			});
// 	};
// 	const signOut = async () => {
// 		try {
// 			await SecureStore.deleteItemAsync("userData");
// 			await AsyncStorage.removeItem("isLoggedIn");
// 		} catch (err) {
// 			console.log("Error Signing Out: ", err);
// 		} finally {
// 			setIsLoggedIn(false);
// 		}
// 	};

// 	const value = [signIn, signOut];

// 	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// };

// export default AuthProvider;
