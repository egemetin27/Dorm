import { useContext, useState, useMemo, useEffect, useCallback } from "react";
import { View, Text, Image, Dimensions, Alert, Pressable, AppState } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SplashScreen from "expo-splash-screen";
import { NavigationContainer, TabActions } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import url from "../connection";
import axios from "axios";
import { CryptoDigestAlgorithm, digestStringAsync } from "expo-crypto";
import * as SecureStore from "expo-secure-store";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Notifications from "expo-notifications";

import { API, graphqlOperation } from "aws-amplify";
import { getMsgUser } from "../src/graphql/queries";
import { createMsgUser, updateMsgUser } from "../src/graphql/mutations";

import { colors, GradientText } from "../visualComponents/colors";

// AUTH PAGES
import Onboarding from "../Pages/Auth/Onboarding";
import WelcomePage from "../Pages/Auth/WelcomePage";
import Login from "../Pages/Auth/Login";
import ForgotPassword from "../Pages/Auth/ForgotPassword";
import Verification from "../Pages/Auth/Verification";
import Verification2 from "../Pages/Auth/Verification2";
import LetsMeet from "../Pages/Auth/LetsMeet";
import Register from "../Pages/Auth/Register";
import RMahremiyetPolitikasi from "../Pages/Auth/RMahremiyetPolitikasi";
import RKullaniciSozlesmesi from "../Pages/Auth/RKullaniciSozlesmesi";
import RToplulukKurallari from "../Pages/Auth/RToplulukKurallari";
import FirstPassword from "../Pages/Auth/FirstPassword";
import NewPassword from "../Pages/Auth/NewPassword";
import AfterRegister from "../Pages/Auth/AfterRegister";
import PhotoUpload from "../Pages/afterRegisteration/PhotoUpload";
import Hobbies from "../Pages/afterRegisteration/Hobbies";
/////
// USER PAGES
// import Messages from "../Pages/User/Messages";
import ProfilePhotos from "../Pages/User/ProfilePhotos";
/////
// OTHER SCREENS
import Settings from "../Pages/Settings";
import Chat from "../Pages/User/chat/chat.route";
// import Chat from "../Pages/User/Chat";
import Tutorial from "../Pages/Tutorial";
import MahremiyetPolitikasi from "../Pages/MahremiyetPolitikasi";
import KullaniciSozlesmesi from "../Pages/KullaniciSozlesmesi";
import ToplulukKurallari from "../Pages/ToplulukKurallari";
/////
// COMPONENTS
import { AuthContext } from "../contexts/auth.context";
import { Session } from "../nonVisualComponents/SessionVariables";
/////

// STACKS
import Tabbar from "./tabbar.stack";
/////

import LikeEndedModal from "../Pages/modals/LikeEndedModal";
import MatchModal from "../Pages/modals/MatchModal";
import ListEndedModal from "../Pages/modals/ListEndedModal";

import useKeyGenerator from "../hooks/useKeyGenerator";
import crypto from "../functions/crypto";
import UpdateNeededModal from "../Pages/modals/UpdateNeededModal";
import ModalPage from "../components/modal.component";

// SplashScreen.preventAutoHideAsync();

const Stack = createNativeStackNavigator();

async function registerForPushNotificationAsync() {
	let token;
	const { status: existingStatus } = await Notifications.getPermissionsAsync();
	let finalStatus = existingStatus;
	if (existingStatus != "granted") {
		const { status } = await Notifications.requestPermissionsAsync();
		finalStatus = status;
	}
	if (finalStatus != "granted") {
		return null;
	}
	token = (await Notifications.getExpoPushTokenAsync()).data;

	if (Platform.OS == "android") {
		Notifications.setNotificationChannelAsync("default", {
			name: "default",
			importance: Notifications.AndroidImportance.MAX,
			vibrationPattern: [0, 250, 250, 250],
			lightColor: "#FF231F7C",
		});
	}

	return token;
}

async function fetchUser(userName, userId, token, sesToken) {
	const newUser = {
		id: userId,
		name: userName,
		pushToken: null,
	};

	const userData = await API.graphql(graphqlOperation(getMsgUser, { id: userId }));

	if (userData.data.getMsgUser) {
		console.log("User is already registered in database");

		const encryptedToken = crypto.encrypt({ userId: userId, token: token });
		await axios
			.post(url + "/registerToken", encryptedToken, { headers: { "access-token": sesToken } })
			.then((res) => {
				// console.log(res.data);
			})
			.catch((err) => {
				console.log(err);
			});

		return;
	} else {
		console.log("User does not exists");
	}
	await API.graphql(graphqlOperation(createMsgUser, { input: newUser }));

	console.log("New user created");
}

export default function StackNavigator() {
	const [appIsReady, setAppIsReady] = useState(false); // is the background fetching done
	const [introShown, setIntroShown] = useState(); // is this the firs time the app is opened
	const [tutorialShown, setTutorialShown] = useState(); // is the tutorial screen shown before
	const [newUser, setNewUser] = useState(false);

	const { user, isLoggedIn, signIn, signOut } = useContext(AuthContext);

	const updateNeeded = useKeyGenerator();

	useEffect(async () => {
		axios.interceptors.response.use(
			function (response) {
				// Any status code that lie within the range of 2xx cause this function to trigger
				// Do something with response data
				return response;
			},
			async (error) => {
				const status = error?.response?.status;
				if (status === 420) {
					// await refreshToken(store);
					//   error.config.headers[
					// 	 "Authorization"
					//   ] = `Bearer ${store.state.auth.token}`;
					// error.config.baseURL = url;
					return axios.request(error.config);
				}
				return Promise.reject(error);
			}
		);

		async function prepare() {
			try {
				// Keep the splash screen visible while we fetch resources

				await AsyncStorage.getItem("Constants").then(async (res) => {
					var constants = JSON.parse(res);
					if (res == null) {
						constants = { introShown: false, tutorialShown: false };
						AsyncStorage.setItem("scrollNotShowed", "0"); //scroll not shown
					}
					AsyncStorage.getItem("scrollNotShowed").then((res) => {
						if (res == null) {
							Session.ScrollShown = true;
						} else {
							Session.ScrollNumber = parseInt(res);
						}
					});
					setIntroShown(constants.introShown);
					setTutorialShown(constants.tutorialShown);
				});

				if (!isLoggedIn) {
					const credsStr = await SecureStore.getItemAsync("credentials");
					if (credsStr) {
						const { email, password } = JSON.parse(credsStr);
						await signIn({ email, password });
					}
				}
			} catch (e) {
				console.warn(e);
			} finally {
				setAppIsReady(true); // app is ready
			}
		}

		await prepare();
	}, []);

	const onLayoutRootView = useCallback(async () => {
		if (appIsReady) {
			await SplashScreen.hideAsync(); // hide splash screen if the app is ready
		}
	}, [appIsReady]);

	if (!appIsReady) {
		return <StatusBar stlye={"light"} />;
	}
	return (
		<GestureHandlerRootView style={{ flex: 1 }} onLayout={onLayoutRootView}>
			<Stack.Navigator mode={"modal"}>
				{updateNeeded ? (
					<Stack.Group screenOptions={{ headerShown: false }}>
						<Stack.Screen
							name="UpdateNeededModal"
							component={UpdateNeededModal}
							// options={{ presentation: "transparentModal" }}
						/>
					</Stack.Group>
				) : user ? (
					// Screens for logged in users
					<Stack.Group
						screenOptions={{ headerShown: false }}
						navigationKey={newUser ? "new" : "old"}
					>
						{!tutorialShown && <Stack.Screen name="Tutorial" component={Tutorial} />}
						<Stack.Screen name="MainScreen" component={Tabbar} />
						<Stack.Screen name="Settings" component={Settings} />
						<Stack.Screen name="MahremiyetPolitikasi" component={MahremiyetPolitikasi} />
						<Stack.Screen name="KullaniciSozlesmesi" component={KullaniciSozlesmesi} />
						<Stack.Screen name="ToplulukKurallari" component={ToplulukKurallari} />
						<Stack.Screen name="Chat" component={Chat} />
						<Stack.Screen name="ProfilePhotos" component={ProfilePhotos} />
						<Stack.Screen name="Hobbies" component={Hobbies} />
					</Stack.Group>
				) : (
					// Screens for non-logged in users
					<Stack.Group screenOptions={{ headerShown: false }}>
						{!introShown && <Stack.Screen name="Onboarding" component={Onboarding} />}
						<Stack.Screen name="WelcomePage" component={WelcomePage} />
						<Stack.Screen name="Login" component={Login} />
						<Stack.Screen name="LetsMeet" component={LetsMeet} />
						<Stack.Screen name="Register" component={Register} />
						<Stack.Screen name="RMahremiyetPolitikasi" component={RMahremiyetPolitikasi} />
						<Stack.Screen name="RKullaniciSozlesmesi" component={RKullaniciSozlesmesi} />
						<Stack.Screen name="RToplulukKurallari" component={RToplulukKurallari} />
						<Stack.Screen name="Verification" component={Verification} />
						<Stack.Screen name="Verification2" component={Verification2} />
						<Stack.Screen name="FirstPassword" component={FirstPassword} />
						<Stack.Screen name="ForgotPassword" component={ForgotPassword} />
						<Stack.Screen name="NewPassword" component={NewPassword} />
						<Stack.Screen name="AfterRegister" component={AfterRegister} />
						<Stack.Screen name="PhotoUpload" component={PhotoUpload} />
						<Stack.Screen name="Hobbies" component={Hobbies} />
					</Stack.Group>
				)}

				<Stack.Group name={"Modals"} screenOptions={{ headerShown: false }}>
					<Stack.Screen
						name="LikeEndedModal"
						component={LikeEndedModal}
						options={{ presentation: "transparentModal" }}
					/>
					<Stack.Screen
						name="MatchModal"
						component={MatchModal}
						options={{ presentation: "transparentModal" }}
					/>
					<Stack.Screen
						name="ListEndedModal"
						component={ListEndedModal}
						options={{ presentation: "transparentModal" }}
					/>
					<Stack.Screen
						name="CustomModal"
						component={ModalPage}
						options={{
							presentation: "transparentModal",
							animation: "fade",
						}}
					/>
				</Stack.Group>
			</Stack.Navigator>
		</GestureHandlerRootView>
	);
}
