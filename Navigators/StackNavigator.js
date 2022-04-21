import * as React from "react";
import { View, Text, Image, Dimensions, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SplashScreen from "expo-splash-screen";
import { NavigationContainer, NavigationContext } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { url } from "../connection";
import axios from "axios";
import { CryptoDigestAlgorithm, digestStringAsync } from "expo-crypto";
import * as SecureStore from "expo-secure-store";
import { loadAsync } from "expo-font";
import { setCustomText, setCustomTextInput } from "react-native-global-props";

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
import Profile from "../Pages/User/Profile";
import Home from "../Pages/User/Home";
import Messages from "../Pages/User/Messages";
import ProfilePhotos from "../Pages/User/ProfilePhotos";
import ProfileCards from "../Pages/User/ProfileCards";
import EventCards from "../Pages/User/EventCards";
/////
// OTHER SCREENS
import Settings from "../Pages/Settings";
import Chat from "../Pages/User/Chat";
import Tutorial from "../Pages/Tutorial";
import MahremiyetPolitikasi from "../Pages/MahremiyetPolitikasi";
import KullaniciSozlesmesi from "../Pages/KullaniciSozlesmesi";
import ToplulukKurallari from "../Pages/ToplulukKurallari";
/////
// COMPONENTS
import { AuthContext } from "../nonVisualComponents/Context";
/////
function MainScreen({ route, navigation }) {
	const { width, height } = Dimensions.get("window");
	const Tab = createBottomTabNavigator();
	const [pList, setPList] = React.useState(route.params?.photoList || null); //Photo list

	React.useEffect(async () => {
		setPList(route.params?.photoList);
	}, [route]);

	return (
		<Tab.Navigator
			backBehavior="initialRoute"
			screenOptions={{
				tabBarStyle: { height: height * 0.08, paddingBottom: height * 0.008 },
				headerShown: false,
				tabBarShowLabel: false,
				tabBarHideOnKeyboard: true,
			}}
			initialRouteName={"AnaSayfa"}
		>
			<Tab.Screen
				name="Profil"
				component={Profile}
				initialParams={{ photoList: pList }}
				options={{
					tabBarIcon: ({ focused }) => (
						<View
							style={{
								alignItems: "center",
								justifyContent: "flex-end",
								flex: 1,
								width: width * 0.33,
							}}
						>
							<Image
								source={require("../assets/TabBarIcons/profile.png")}
								resizeMode="contain"
								style={{
									tintColor: focused ? {} : colors.cool_gray,
									height: height / 36,
								}}
							/>
							{focused ? (
								<GradientText style={{ fontSize: 13, fontWeight: "bold" }} text={"Profil"} />
							) : (
								<Text
									style={{
										fontSize: 13,
										fontWeight: "bold",
										color: colors.cool_gray,
									}}
								>
									Profil
								</Text>
							)}
						</View>
					),
				}}
			/>
			<Tab.Screen
				name="AnaSayfa"
				component={Home}
				options={{
					tabBarIcon: ({ focused }) => (
						<View
							style={{
								alignItems: "center",
								justifyContent: "flex-end",
								flex: 1,
								width: width * 0.33,
							}}
						>
							<Image
								source={require("../assets/TabBarIcons/anasayfa.png")}
								resizeMode="contain"
								style={{
									tintColor: focused ? {} : colors.cool_gray,
									height: height / 27,
								}}
							/>
							{focused ? (
								<GradientText style={{ fontSize: 13, fontWeight: "bold" }} text={"Ana Sayfa"} />
							) : (
								<Text
									style={{
										fontSize: 13,
										fontWeight: "bold",
										color: colors.cool_gray,
									}}
								>
									Ana Sayfa
								</Text>
							)}
						</View>
					),
				}}
			/>
			<Tab.Screen
				name="Mesajlar"
				component={Messages}
				options={{
					tabBarIcon: ({ focused }) => (
						<View
							style={{
								alignItems: "center",
								justifyContent: "flex-end",
								flex: 1,
								width: width * 0.33,
							}}
						>
							<Image
								source={require("../assets/TabBarIcons/messages.png")}
								resizeMode="contain"
								style={{
									tintColor: focused ? {} : colors.cool_gray,
									height: height / 36,
								}}
							/>
							{focused ? (
								<GradientText style={{ fontSize: 13, fontWeight: "bold" }} text={"Mesajlar"} />
							) : (
								<Text
									style={{
										fontSize: 13,
										fontWeight: "bold",
										color: colors.cool_gray,
									}}
								>
									Mesajlar
								</Text>
							)}
						</View>
					),
				}}
			/>
		</Tab.Navigator>
	);
}

export default function StackNavigator() {
	const Stack = createNativeStackNavigator();
	const [appIsReady, setAppIsReady] = React.useState(false); // is the background fetching done
	const [isLoggedIn, setIsLoggedIn] = React.useState(false); // is the user logged in or not
	const [introShown, setIntroShown] = React.useState(); // is this the firs time the app is opened
	const [tutorialShown, setTutorialShown] = React.useState(); // is the tutorial screen shown before
	const [newUser, setNewUser] = React.useState(false);
	// const navigation = React.useContext(NavigationContext);

	const authContext = React.useMemo(() => ({
		signIn: async ({ email, password, isNewUser, navigation = null }) => {
			if (isNewUser) setNewUser(true);
			else setNewUser(false);

			const encryptedPassword = await digestStringAsync(CryptoDigestAlgorithm.SHA256, password);
			const dataToBeSent = { Mail: email, password: encryptedPassword };

			await axios
				.post(url + "/Login", dataToBeSent)
				.then(async (res) => {
					if (res.data.authentication == "true") {
						console.log(res.data);
						if (navigation != null && res.data.onBoardingComplete == 0) {
							navigation.replace("PhotoUpload", {
								mail: email,
								password: password,
								UserId: res.data.UserId,
								sesToken: res.data.sesToken,
							});
							return;
						}

						// If signed in
						const photoList = res.data.Photo.map((item) => {
							return {
								PhotoLink: item.PhotoLink,
								Photo_Order: item.Photo_Order,
							};
						});
						const userData = JSON.stringify({
							...res.data,
							password: password,
							email: email,
							Photo: photoList,
						});

						await SecureStore.setItemAsync("userData", userData);
						await SecureStore.setItemAsync("userID", res.data.UserId.toString());

						await AsyncStorage.setItem("isLoggedIn", "yes");
						setIsLoggedIn(true);
					} else {
						alert(res.data);
						console.log(res.data);
					}
				})
				.catch(async (error) => {
					Alert.alert("Hata", error?.response?.data, [{ text: "Kontrol Edeyim" }]);
					await SecureStore.deleteItemAsync("userData");
					await AsyncStorage.removeItem("isLoggedIn");
					setIsLoggedIn(false);
				});
		},
		signOut: async () => {
			try {
				await SecureStore.deleteItemAsync("userData");
				await AsyncStorage.removeItem("isLoggedIn");
			} catch (err) {
				console.log("Error Signing Out: ", err);
			} finally {
				setIsLoggedIn(false);
			}
		},
	}));

	React.useEffect(() => {
		async function prepare() {
			try {
				// Keep the splash screen visible while we fetch resources
				await SplashScreen.preventAutoHideAsync();

				await loadAsync({
					Now: require("../assets/Fonts/now.otf"),
					NowBold: require("../assets/Fonts/now_bold.otf"),
					Poppins: require("../assets/Fonts/Poppins.ttf"),
					PoppinsItalic: require("../assets/Fonts/Poppins_Italic.ttf"),
					PoppinsSemiBold: require("../assets/Fonts/Poppins-SemiBold.ttf"),
					PoppinsBold: require("../assets/Fonts/Poppins_bold.ttf"),
					PoppinsExtraBold: require("../assets/Fonts/Poppins-ExtraBold.ttf"),
				});

				setCustomText({ style: { fontFamily: "Poppins" } });
				setCustomTextInput({ style: { fontFamily: "Poppins" } });

				await AsyncStorage.getItem("introShown").then((res) => {
					// set intro shown value to true or false according to the data in local storage
					setIntroShown(res == "yes" ? true : false);
				});

				await AsyncStorage.getItem("tutorialShown").then((res) => {
					// set tutorial shown value to true or false according to the data in local storage
					setTutorialShown(res == "yes" ? true : false);
				});

				await AsyncStorage.getItem("isLoggedIn").then(async (res) => {
					// set logged in value to true or false according to the data in local storage

					if (res == "yes") {
						const { signIn } = authContext;
						const userStr = await SecureStore.getItemAsync("userData");
						const { email, password } = JSON.parse(userStr);
						await signIn({ email: email, password: password, isNewUser: false });
					} else {
						setIsLoggedIn(false);
					}
				});
			} catch (e) {
				console.warn(e);
			} finally {
				setAppIsReady(true); // app is ready
			}
		}

		prepare();
	}, []);

	const onLayoutRootView = React.useCallback(async () => {
		if (appIsReady) {
			await SplashScreen.hideAsync(); // hide splash screen if the app is ready
		}
	}, [appIsReady]);

	if (!appIsReady) {
		return <StatusBar stlye={"light"} />;
	} else {
		return (
			<GestureHandlerRootView style={{ flex: 1 }} onLayout={onLayoutRootView}>
				<StatusBar style={"auto"} />
				<NavigationContainer>
					<AuthContext.Provider value={authContext}>
						<Stack.Navigator>
							{isLoggedIn ? (
								// Screens for logged in users
								<Stack.Group
									screenOptions={{ headerShown: false }}
									navigationKey={newUser ? "new" : "old"}
								>
									{!tutorialShown && <Stack.Screen name="Tutorial" component={Tutorial} />}
									<Stack.Screen name="MainScreen" component={MainScreen} />
									<Stack.Screen name="Settings" component={Settings} />
									<Stack.Screen name="MahremiyetPolitikasi" component={MahremiyetPolitikasi} />
									<Stack.Screen name="KullaniciSozlesmesi" component={KullaniciSozlesmesi} />
									<Stack.Screen name="ToplulukKurallari" component={ToplulukKurallari} />
									<Stack.Screen name="Chat" component={Chat} />
									<Stack.Screen name="ProfilePhotos" component={ProfilePhotos} />
									<Stack.Screen name="ProfileCards" component={ProfileCards} />
									<Stack.Screen name="EventCards" component={EventCards} />
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
						</Stack.Navigator>
					</AuthContext.Provider>
				</NavigationContainer>
			</GestureHandlerRootView>
		);
	}
}
