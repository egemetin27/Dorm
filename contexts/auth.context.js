import { createContext, useContext, useState } from "react";
import { Alert } from "react-native";
import axios from "axios";
import { CryptoDigestAlgorithm, digestStringAsync } from "expo-crypto";
import * as SecureStore from "expo-secure-store";
import { useNavigation } from "@react-navigation/native";

import url from "../connection";
import crypto from "../functions/crypto";
import { ListsContext } from "./lists.context";
import { sort } from "../utils/array.utils";

export const AuthContext = createContext({
	user: null,
	isLoggedIn: null,
	peopleListIndex: null,
	setPeopleIndex: () => {},
	updateProfile: () => {},
	signIn: () => {},
	signOut: () => {},
});

const AuthProvider = ({ children }) => {
	const { updateLists } = useContext(ListsContext);
	const navigation = useNavigation();

	const [user, setUser] = useState(null);
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [peopleListIndex, setPeopleListIndex] = useState(0);

	const signIn = async ({ email, password, notLoading = () => {} }) => {
		const encryptedPassword = await digestStringAsync(CryptoDigestAlgorithm.SHA256, password);
		const dataToBeSent = crypto.encrypt({ mail: email, password: encryptedPassword });
		await axios
			.post(url + "/account/Login", dataToBeSent)
			.then(async (res) => {
				const data = crypto.decrypt(res.data);
				updateLists(data.applists);
				if (data.authentication == "true") {
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
						return;
					}

					const photoList = data.Photo.map((item) => {
						return {
							PhotoLink: item.PhotoLink,
							Photo_Order: item.Photo_Order,
						};
					});

					const { applists, ...userData } = {
						...data,
						email: email,
						Photo: sort(photoList, "Photo_Order"),
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
			SecureStore.deleteItemAsync("credentials");
			const encryptedToken = crypto.encrypt({
				userId: user.userId,
				token: null,
			});

			axios
				.post("https://devmessage.meetdorm.com/registerToken", encryptedToken, {
					headers: { "access-token": user.sesToken },
				})
				.then()
				.catch((err) => console.log("error on /registerToken", err));
			// await AsyncStorage.removeItem("isLoggedIn");
		} catch (err) {
			console.log("Error Signing Out: ", err);
		} finally {
			setIsLoggedIn(false);
			setUser(null);
		}
	};

	const updateProfile = (newData) => {
		setUser((initialInfo) => {
			return { ...initialInfo, ...newData };
		});
	};

	const setPeopleIndex = (idx) => {
		setPeopleListIndex(idx + 1);
	};

	const value = {
		user,
		isLoggedIn,
		peopleListIndex,
		setPeopleIndex,
		updateProfile,
		signIn,
		signOut,
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
