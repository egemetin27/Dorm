import * as React from "react";
import { View, Text, Image, Dimensions, Alert, Pressable, AppState } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SplashScreen from "expo-splash-screen";
import { NavigationContainer, TabActions } from "@react-navigation/native";
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
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { API, graphqlOperation } from "aws-amplify";
import { getMsgUser } from "../src/graphql/queries";
import { createMsgUser, updateMsgUser } from "../src/graphql/mutations";
import * as Notifications from "expo-notifications";

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
import { Session } from "../nonVisualComponents/SessionVariables";
/////

import LikeEndedModal from "../Pages/modals/LikeEndedModal";
import MatchModal from "../Pages/modals/MatchModal";
import ListEndedModal from "../Pages/modals/ListEndedModal";

import useKeyGenerator from "../components/custom_hooks/useKeyGenerator";
import crypto from "../functions/crypto";
import UpdateNeededModal from "../Pages/modals/UpdateNeededModal";

const HomeStack = createNativeStackNavigator();

function HomeStackScreen(route, navigation) {
	return (
		<HomeStack.Navigator screenOptions={{ headerShown: false }}>
			<HomeStack.Screen name="Home" component={Home} />
			<HomeStack.Screen name="ProfileCards" component={ProfileCards} />
			<HomeStack.Screen name="EventCards" component={EventCards} />
		</HomeStack.Navigator>
	);
}

function MainScreen({ route, navigation }) {
	const insets = useSafeAreaInsets();
	const { width, height } = Dimensions.get("window");
	const Tab = createBottomTabNavigator();
	const [pList, setPList] = React.useState(route.params?.photoList || null); //Photo list

	React.useEffect(async () => {
		setPList(route.params?.photoList);
	}, [route]);

	return (
		<View
			style={{
				flex: 1,
				paddingTop: insets.top,
				backgroundColor: colors.backgroundColor,
			}}
		>
			<Tab.Navigator
				backBehavior="initialRoute"
				screenOptions={{
					tabBarStyle: {
						height: height * 0.08 + insets.bottom,
						paddingBottom: height * 0.008 + insets.bottom,
					},
					headerShown: false,
					tabBarShowLabel: false,
					tabBarHideOnKeyboard: true,
				}}
				detachInactiveScreens={true}
				initialRouteName={"AnaSayfa"}
			>
				<Tab.Screen
					name="Profil"
					component={Profile}
					initialParams={{ photoList: pList }}
					options={{
						tabBarButton: (props) => (
							<Pressable
								{...props}
								style={[props.style, { zIndex: 1 }]}
								onPress={() => {
									navigation.navigate("MainScreen", {
										screen: "Profil",
									});
								}}
							/>
						),
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
									<GradientText
										style={{ fontSize: 13, fontFamily: "PoppinsBold" }}
										text={"Profil"}
									/>
								) : (
									<Text
										style={{
											fontSize: 13,
											fontFamily: "PoppinsBold",
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
					component={HomeStackScreen}
					options={{
						tabBarButton: (props) => (
							<Pressable
								{...props}
								onPress={() => {
									if (
										props?.accessibilityState?.selected &&
										props?.children?.props?.children[0].props?.route.state
									) {
										navigation.replace("MainScreen", {
											screen: "AnaSayfa",
											params: { screen: "Home" },
										});
									} else if (!props?.accessibilityState?.selected) {
										// const jumpToAction = TabActions.jumpTo("AnaSayfa", {
										// 	screen: "Home",
										// });
										// navigation.dispatch(jumpToAction);
										navigation.replace("MainScreen", {
											screen: "AnaSayfa",
											params: { screen: "Home" },
										});
									}
								}}
							/>
						),
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
									source={require("../assets/logoGradient.png")}
									resizeMode="contain"
									style={{
										tintColor: focused ? {} : colors.cool_gray,
										height: height / 30,
									}}
								/>
								{focused ? (
									<GradientText
										style={{ fontSize: 13, fontFamily: "PoppinsBold" }}
										text={"Ana Sayfa"}
									/>
								) : (
									<Text
										style={{
											fontSize: 13,
											color: colors.cool_gray,
											fontFamily: "PoppinsBold",
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
									<GradientText
										style={{ fontSize: 13, fontFamily: "PoppinsBold" }}
										text={"Mesajlar"}
									/>
								) : (
									<Text
										style={{
											fontSize: 13,
											fontFamily: "PoppinsBold",
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
		</View>
	);
}

const Stack = createNativeStackNavigator();

async function registerForPushNotificationAsync() {
	let token;
	const { status: existingStatus } = await Notifications.getPermissionsAsync();
	let finalStatus = existingStatus;
	console.log(existingStatus);
	console.log(finalStatus);
	if (existingStatus != "granted") {
		const { status } = await Notifications.requestPermissionsAsync();
		finalStatus = status;
	}
	if (finalStatus != "granted") {
		return null;
	}
	token = (await Notifications.getExpoPushTokenAsync()).data;
	console.log(token);

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

async function fetchUser(userName, userId, token) {
	const newUser = {
		id: userId,
		name: userName,
		pushToken: null,
	};

	const userData = await API.graphql(graphqlOperation(getMsgUser, { id: userId }));
	if (userData.data.getMsgUser) {
		console.log("User is already registered in database");

		await API.graphql(
			graphqlOperation(updateMsgUser, {
				input: { id: userId, name: userName, pushToken: token },
			})
		);

		return;
	} else {
		console.log("User does not exists");
	}

	console.log(newUser);
	await API.graphql(graphqlOperation(createMsgUser, { input: newUser }));

	console.log("New user created");
}

export default function StackNavigator() {
	const [appIsReady, setAppIsReady] = React.useState(false); // is the background fetching done
	const [isLoggedIn, setIsLoggedIn] = React.useState(false); // is the user logged in or not
	const [introShown, setIntroShown] = React.useState(); // is this the firs time the app is opened
	const [tutorialShown, setTutorialShown] = React.useState(); // is the tutorial screen shown before
	const [newUser, setNewUser] = React.useState(false);
	// const navigation = React.useContext(NavigationContext);

	const updateNeeded = useKeyGenerator();

	const authContext = React.useMemo(() => ({
		signIn: async ({ email, password, isNewUser, navigation = null, notLoading = () => {} }) => {
			if (isNewUser) {
				setNewUser(true);
			} else {
				setNewUser(false);
			}

			const encryptedPassword = await digestStringAsync(CryptoDigestAlgorithm.SHA256, password);
			const dataToBeSent = crypto.encrypt({ mail: email, password: encryptedPassword });
			console.log({ dataToBeSent });
			await axios
				.post(url + "/Login", dataToBeSent)
				.then(async (res) => {
					const data = crypto.decrypt(res.data);
					if (data.authentication == "true") {
						console.log(data);
						if (navigation != null && data.onBoardingComplete == 0) {
							navigation.replace("PhotoUpload", {
								mail: email,
								password: password,
								userId: data.userId,
								sesToken: data.sesToken,
							});
							return;
						}
						// If signed in

						const token = await registerForPushNotificationAsync();
						await fetchUser(data.Name, data.userId, token);

						const photoList = data.Photo.map((item) => {
							return {
								PhotoLink: item.PhotoLink,
								Photo_Order: item.Photo_Order,
							};
						});
						const userData = JSON.stringify({
							...data,
							password: password,
							email: email,
							Photo: photoList,
						});

						await SecureStore.setItemAsync("userData", userData);
						await SecureStore.setItemAsync("userId", data.userId.toString());
						Session.User = {
							...data,
							email: email,
							Photo: photoList,
						};

						await AsyncStorage.setItem("isLoggedIn", "yes");
						setIsLoggedIn(true);
					} else {
						console.log("else:", data);
						alert(data);
						notLoading();
					}
				})
				.catch(async (error) => {
					console.log("catch: ", error);
					Alert.alert("Hata", error?.response?.data, [{ text: "Kontrol Edeyim" }]);
					await SecureStore.deleteItemAsync("userData");
					await AsyncStorage.removeItem("isLoggedIn");
					setIsLoggedIn(false);
					notLoading();
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

	React.useEffect(async () => {
		await SplashScreen.preventAutoHideAsync();
		async function prepare() {
			try {
				// Keep the splash screen visible while we fetch resources

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
				await AsyncStorage.getItem("Constants").then(async (res) => {
					let constantDictStr = res;
					if (res == null) {
						constantDictStr = { introShown: false, tutorialShown: false };
						AsyncStorage.setItem("scrollNotShowed", "0"); //scroll not shown
					}
					await AsyncStorage.getItem("scrollNotShowed").then((res) => {
						if (res == null) {
							Session.ScrollShown = true;
						} else {
							Session.ScrollNumber = parseInt(res);
						}
					});
					const constants = JSON.parse(constantDictStr);
					setIntroShown(constants.introShown);
					setTutorialShown(constants.tutorialShown);
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
		await prepare();
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
				{/* <StatusBar style={"auto"} /> */}
				<NavigationContainer>
					<AuthContext.Provider value={authContext}>
						<Stack.Navigator mode={"modal"}>
							{updateNeeded ? (
								<Stack.Group screenOptions={{ headerShown: false }}>
									<Stack.Screen
										name="UpdateNeededModal"
										component={UpdateNeededModal}
										// options={{ presentation: "transparentModal" }}
									/>
								</Stack.Group>
							) : isLoggedIn ? (
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
							</Stack.Group>
						</Stack.Navigator>
					</AuthContext.Provider>
				</NavigationContainer>
			</GestureHandlerRootView>
		);
	}
}
