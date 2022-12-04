import { useContext, useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SplashScreen from "expo-splash-screen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import axios from "axios";
import * as SecureStore from "expo-secure-store";

import LoggedInStack from "./logged-in-stack/logged-in.stack";
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
// import RToplulukKurallari from "../Pages/Auth/RToplulukKurallari";
import FirstPassword from "../Pages/Auth/FirstPassword";
import NewPassword from "../Pages/Auth/NewPassword";
import AfterRegister from "../Pages/Auth/AfterRegister";
import PhotoUpload from "../Pages/afterRegisteration/PhotoUpload";
import Hobbies from "../Pages/afterRegisteration/Hobbies";
/////
// COMPONENTS
import { AuthContext } from "../contexts/auth.context";
import { Session } from "../nonVisualComponents/SessionVariables";
/////
// MODALS
import LikeEndedModal from "../Pages/modals/LikeEndedModal";
import MatchModal from "../Pages/modals/MatchModal";
import ListEndedModal from "../Pages/modals/ListEndedModal";
import UpdateNeededModal from "../Pages/modals/UpdateNeededModal";
import BeginningTutorialModal from "../Pages/modals/beginning-tutorial.modal";
import EventTutorialModal from "../Pages/modals/event-tutorial.modal";
import PeopleTutorialModal from "../Pages/modals/people-tutorial.modal";
import ChatProfile from "../Pages/User/ChatProfile";
/////

import useKeyGenerator from "../hooks/useKeyGenerator";

SplashScreen.preventAutoHideAsync();

const Stack = createNativeStackNavigator();

export default function StackNavigator() {
	const [appIsReady, setAppIsReady] = useState(false); // is the background fetching done
	const [introShown, setIntroShown] = useState(false); // is this the firs time the app is opened
	const [tutorialShown, setTutorialShown] = useState(false); // is the tutorial screen shown before

	const { user, isLoggedIn, signIn } = useContext(AuthContext);

	const updateNeeded = useKeyGenerator();

	useEffect(() => {
		const stackready = async () => {
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
							constants = {
								introShown: false,
								tutorialShown: false,
							};
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
		};
		stackready().catch(console.error);
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
					<Stack.Screen
						name="LoggedInStack"
						component={LoggedInStack}
						options={{ headerShown: false }}
					/>
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
						{/* <Stack.Screen name="RToplulukKurallari" component={RToplulukKurallari} /> */}
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
				{/* <Stack.Group name="Common-Pages" screenOptions={{ headerShown: false }}></Stack.Group> */}

				<Stack.Group name={"Modals"} screenOptions={{ headerShown: false }}>
					<Stack.Screen
						name="BeginningTutorialModal"
						component={BeginningTutorialModal}
						options={{
							presentation: "transparentModal",
							animation: "fade",
						}}
					/>
					<Stack.Screen
						name="PeopleTutorialModal"
						component={PeopleTutorialModal}
						options={{
							presentation: "transparentModal",
							animation: "fade",
						}}
					/>
					<Stack.Screen
						name="EventTutorialModal"
						component={EventTutorialModal}
						options={{
							presentation: "transparentModal",
							animation: "fade",
						}}
					/>
					<Stack.Screen
						name="LikeEndedModal"
						component={LikeEndedModal}
						options={{
							presentation: "transparentModal",
							animation: "fade",
						}}
					/>
					<Stack.Screen
						name="MatchModal"
						component={MatchModal}
						options={{
							presentation: "transparentModal",
							animation: "fade",
						}}
					/>
					<Stack.Screen
						name="ListEndedModal"
						component={ListEndedModal}
						options={{
							presentation: "transparentModal",
							animation: "fade",
						}}
					/>
					<Stack.Screen
						name="ProfileCardModal"
						component={ChatProfile}
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
