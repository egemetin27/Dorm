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
import AsyncStorage from "@react-native-async-storage/async-storage";

export const AuthContext = createContext({
	user: null,
	isLoggedIn: null,
	peopleListIndex: null,
	setPeopleIndex: () => {},
	updateProfile: () => {},
	signIn: () => {},
	signOut: () => {},
	eventTutorialDone: null,
	peopleTutorialDone: null,
	eventCardTutorialDone: null,
	mySchoolCardTutorialDone: null,
	campusGhostCardTutorialDone: null,
	mainPageTutorialDone: null,
	seteventTutorialDone: () => {},
	setpeopleTutorialDone: () => {},
	seteventCardTutorialDone: () => {},
	setmySchoolCardTutorialDone: () => {},
	setcampusGhostCardTutorialDone: () => {},
	setmainPageTutorialDone: () => {},
});

const AuthProvider = ({ children }) => {
	const { updateLists } = useContext(ListsContext);
	const navigation = useNavigation();
	const [user, setUser] = useState(null);

	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [peopleListIndex, setPeopleListIndex] = useState(0);

	const [eventTutorialDone, setEventTutorialDone] = useState(false); // the bool which checks if tutorial needed when user click on event on main page
	const [peopleTutorialDone, setPeopleTutorialDone] = useState(false); // the bool which checks if tutorial needed when user click on person small card on main page
	const [eventCardTutorialDone, setEventCardTutorialDone] = useState(false); // the bool which checks if the event ad is needed when user is swiping other users' cards
	const [mySchoolCardTutorialDone, setMySchoolCardTutorialDone] = useState(false); // the bool which checks if the My School ad is needed when user is swiping other users' cards
	const [campusGhostCardTutorialDone, setCampusGhostCardTutorialDone] = useState(false); // the bool which checks if the Campus Ghost ad is needed when user is swiping other users' cards
	const [mainPageTutorialDone, setMainPageTutorialDone] = useState(false);

	const signIn = async ({ email, password, notLoading = () => {}, counter = 0 }) => {
		const encryptedPassword = await digestStringAsync(CryptoDigestAlgorithm.SHA256, password);
		const dataToBeSent = crypto.encrypt({ mail: email, password: encryptedPassword });
		var myTimeout;
		await axios
			.post(url + "/account/Login", dataToBeSent)
			.then(async (res) => {
				const data = crypto.decrypt(res.data);

				axios.defaults.headers.common["access-token"] = data.sesToken;

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

					updateLists(data.applists);
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

					// if (!mainPageTutorialDone || !eventTutorialDone || !peopleTutorialDone || !eventCardTutorialDone || !mySchoolCardTutorialDone || !campusGhostCardTutorialDone) {
					// 	AsyncStorage.getItem("Constants").then(async (res) => {
					// 		const list = JSON.parse(res);
					// setMainPageTutorialDone(list.mainPageTutorialDone);
					// setEventTutorialDone(list.eventTutorialDone);
					// setPeopleTutorialDone(list.peopleTutorialDone);
					// setEventCardTutorialDone(list.eventCardTutorialDone);
					// setMySchoolCardTutorialDone(list.mySchoolCardTutorialDone);
					// setCampusGhostCardTutorialDone(list.campusGhostCardTutorialDone);
					// 	});
					// }

					setUser(userData);
					setIsLoggedIn(true);
					if (
						!mainPageTutorialDone ||
						!eventTutorialDone ||
						!peopleTutorialDone ||
						!eventCardTutorialDone ||
						!mySchoolCardTutorialDone ||
						!campusGhostCardTutorialDone
					) {
						setPeopleTutorialDone(userData.tutorial1 == 1);
						setEventTutorialDone(userData.tutorial2 == 1);
						setMySchoolCardTutorialDone(userData.tutorial3 == 1);
						setCampusGhostCardTutorialDone(userData.tutorial4 == 1);
						setEventCardTutorialDone(userData.tutorial5 == 1);
						setMainPageTutorialDone(userData.tutorial6 == 1);
					}
				} else {
					console.log("else:", data);
					Alert.alert(data);
					notLoading();
				}
			})
			.catch(async (error) => {
				console.log("error on /login: ");
				console.log(error.response.status, error.response.data);

				if (counter < 10 && error?.response?.status !== 400) {
					myTimeout = setTimeout(
						() => signIn({ email, password, notLoading, counter: counter + 1 }),
						2000
					);
				} else {
					Alert.alert("Hata", error?.responsre?.data, [{ text: "Kontrol Edeyim" }]);
					await SecureStore.deleteItemAsync("credentials");
					setUser(null);
					setIsLoggedIn(false);
					notLoading();
				}
			});
		// clearTimeout(myTimeout);
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

	const setmainPageTutorialDone = () => {
		setMainPageTutorialDone(true);
	};

	const seteventTutorialDone = () => {
		setEventTutorialDone(true);
	};

	const setpeopleTutorialDone = () => {
		setPeopleTutorialDone(true);
	};

	const seteventCardTutorialDone = () => {
		setEventCardTutorialDone(true);
	};

	const setmySchoolCardTutorialDone = () => {
		setMySchoolCardTutorialDone(true);
	};

	const setcampusGhostCardTutorialDone = () => {
		setCampusGhostCardTutorialDone(true);
	};

	const value = {
		user,
		isLoggedIn,
		peopleListIndex,
		setPeopleIndex,
		updateProfile,
		signIn,
		signOut,
		mainPageTutorialDone,
		eventTutorialDone,
		peopleTutorialDone,
		eventCardTutorialDone,
		mySchoolCardTutorialDone,
		campusGhostCardTutorialDone,
		setmainPageTutorialDone,
		seteventTutorialDone,
		setpeopleTutorialDone,
		seteventCardTutorialDone,
		setmySchoolCardTutorialDone,
		setcampusGhostCardTutorialDone,
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
