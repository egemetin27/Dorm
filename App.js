import { useEffect, useState } from "react";
import { useFonts } from "expo-font";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { setCustomText, setCustomTextInput } from "react-native-global-props";
import { NavigationContainer } from "@react-navigation/native";
import NetInfo from "@react-native-community/netinfo";
import * as Linking from "expo-linking";

import * as Notifications from "expo-notifications";

import AuthProvider from "./contexts/auth.context";
import NotificationProvider from "./contexts/notification.context";
import ListsProvider from "./contexts/lists.context";

import AppStateManager from "./components/app-state-manager";

import Stack from "./Navigators/StackNavigator";
// import Temp from "./Pages/Temp";

import NoInternetConnectionModal from "./Pages/modals/no-internet-connection.modal";

const fonts = {
	Now: require("./assets/fonts/Now.otf"),
	NowBold: require("./assets/fonts/NowBold.otf"),
	PoppinsLight: require("./assets/fonts/Poppins-ExtraLight.ttf"),
	PoppinsSemiLight: require("./assets/fonts/Poppins-Light.ttf"),
	Poppins: require("./assets/fonts/Poppins.ttf"),
	PoppinsItalic: require("./assets/fonts/PoppinsItalic.ttf"),
	PoppinsBoldItalic: require("./assets/fonts/PoppinsBoldItalic.ttf"),
	PoppinsMedium: require("./assets/fonts/Poppins-Medium.ttf"),
	PoppinsSemiBold: require("./assets/fonts/PoppinsSemiBold.ttf"),
	PoppinsBold: require("./assets/fonts/PoppinsBold.ttf"),
	PoppinsExtraBold: require("./assets/fonts/PoppinsExtraBold.ttf"),
};

const prefix = Linking.createURL("/");

const defaultLinkingConfig = {
	screens: {
		MainScreen: {
			initialRouteName: "home",
			screens: {
				Profil: "profile",
				AnaSayfa: "home",
				Mesajlar: "messages",
			},
		},
	},
};

export default function App() {
	const [internetConnection, setInternetConnection] = useState(true);
	const [fontsLoaded] = useFonts(fonts);

	useEffect(() => {
		const unsubscribe = NetInfo.addEventListener((state) => {
			setInternetConnection(state.isConnected);
		});

		return () => unsubscribe();
	}, []);

	const linking = {
		prefixes: [prefix, "dorm://"],
		// exp://192.168.1.29:19000/--/messages
		config: defaultLinkingConfig,
	};

	//enableFreeze(true);

	useEffect(() => {
		if (fontsLoaded) {
			setCustomText({ style: { fontFamily: "Poppins" } });
			setCustomTextInput({ style: { fontFamily: "Poppins" } });
		}
	}, [fontsLoaded]);

	// if (!fontsLoaded) return <View></View>;
	if (!fontsLoaded) return null;

	// return <Temp></Temp>

	if (!internetConnection) return <NoInternetConnectionModal />;

	return (
		<SafeAreaProvider style={{ flex: 1 }}>
			<NavigationContainer
				// linking={linking}
				linking={{
					...linking,
					async getInitialURL() {
						const response = await Notifications.getLastNotificationResponseAsync();
						const url = response?.notification.request.content.data.url;

						return url;
					},
					subscribe(listener) {
						const onReceiveURL = ({ url }) => listener(url);

						// Listen to incoming links from deep linking
						const subscriptionLinking = Linking.addEventListener("url", onReceiveURL);

						// Listen to expo push notifications
						const subscription = Notifications.addNotificationResponseReceivedListener(
							(response) => {
								const url = response.notification.request.content.data.url;

								// Any custom logic to see whether the URL needs to be handled
								//...

								// Let React Navigation handle the URL
								listener(url);
							}
						);

						return () => {
							// Clean up the event listeners
							subscriptionLinking.remove();
							subscription.remove();
						};
					},
				}}
			>
				<ListsProvider>
					<AuthProvider>
						<NotificationProvider>
							<AppStateManager>
								<Stack />
							</AppStateManager>
						</NotificationProvider>
					</AuthProvider>
				</ListsProvider>
			</NavigationContainer>
		</SafeAreaProvider>
	);
}

// const styles = StyleSheet.create({
// 	container: { flex: 1 },
// });
