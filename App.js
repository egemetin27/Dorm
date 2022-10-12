import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { loadAsync, useFonts } from "expo-font";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { setCustomText, setCustomTextInput } from "react-native-global-props";
import { NavigationContainer } from "@react-navigation/native";
import * as Linking from "expo-linking";

import * as Notifications from "expo-notifications";
// import { enableFreeze } from "react-native-screens";

// import Amplify from "aws-amplify";
// import awsmobile from "./src/aws-exports";

import AuthProvider from "./contexts/auth.context";
import NotificationProvider from "./contexts/notification.context";
import SocketProvider from "./contexts/socket.context";
import MessageProvider from "./contexts/message.context";

// Amplify.configure(awsmobile);

import Stack from "./Navigators/StackNavigator";
//PAGES end
// import Temp from "./Pages/Temp";
import AppStateManager from "./components/app-state-manager";
import FilterProvider from "./contexts/filter.context";
import ListsProvider from "./contexts/lists.context";

//import ImageManipulatorTest from "./ImageManipulatorTest";

const fonts = {
	Now: require("./assets/fonts/Now.otf"),
	NowBold: require("./assets/fonts/NowBold.otf"),
	Poppins: require("./assets/fonts/Poppins.ttf"),
	PoppinsItalic: require("./assets/fonts/PoppinsItalic.ttf"),
	PoppinsBoldItalic: require("./assets/fonts/PoppinsBoldItalic.ttf"),
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
	// const [fontLoaded, setFontLoaded] = useState(false);

	const [fontsLoaded] = useFonts(fonts);

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

	if (!fontsLoaded) return <View></View>;
	// if (!fontLoaded) return null;

	return (
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
					const subscription = Notifications.addNotificationResponseReceivedListener((response) => {
						const url = response.notification.request.content.data.url;

						// Any custom logic to see whether the URL needs to be handled
						//...

						// Let React Navigation handle the URL
						listener(url);
					});

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
					<FilterProvider>
						<NotificationProvider>
							<MessageProvider>
								<SocketProvider>
									<AppStateManager>
										<SafeAreaProvider style={{ flex: 1 }}>
											<Stack />
										</SafeAreaProvider>
									</AppStateManager>
								</SocketProvider>
							</MessageProvider>
						</NotificationProvider>
					</FilterProvider>
				</AuthProvider>
			</ListsProvider>
		</NavigationContainer>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1 },
});
