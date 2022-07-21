import React, { useEffect } from "react";
import { StyleSheet, Dimensions, View, AppState } from "react-native";
import { loadAsync } from "expo-font";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { setCustomText, setCustomTextInput } from "react-native-global-props";
import Amplify from "aws-amplify";
import awsmobile from "./src/aws-exports";

import AuthProvider from "./contexts/auth.context";
import SocketProvider from "./contexts/socket.context";
import MessageProvider from "./contexts/message.context";

const { width, height } = Dimensions.get("window");

Amplify.configure(awsmobile);

import Stack from "./Navigators/StackNavigator";
//PAGES end

import Temp from "./Pages/Temp";
import Messages from "./Pages/User/messages/messages.route";
import Chat from "./Pages/User/chat/chat.route";
import { NavigationContainer } from "@react-navigation/native";
//import ImageManipulatorTest from "./ImageManipulatorTest";

const fonts = {
	Now: require("./assets/fonts/now.otf"),
	NowBold: require("./assets/fonts/now_bold.otf"),
	Poppins: require("./assets/fonts/Poppins.ttf"),
	PoppinsItalic: require("./assets/fonts/Poppins_Italic.ttf"),
	PoppinsSemiBold: require("./assets/fonts/Poppins-SemiBold.ttf"),
	PoppinsBold: require("./assets/fonts/Poppins_bold.ttf"),
	PoppinsExtraBold: require("./assets/fonts/Poppins-ExtraBold.ttf"),
};

export default function App() {
	let abortController = new AbortController();
	const appState = React.useRef(AppState.currentState);
	const [appStateVisible, setAppStateVisible] = React.useState(appState.current);

	const _handleAppStateChange = (nextAppState) => {
		if (appState.current.match(/inactive|background/) && nextAppState === "active") {
			console.log("App has come to the foreground!");
		}

		appState.current = nextAppState;
		setAppStateVisible(appState.current);
		console.log("AppState", appState.current);
	};

	// useEffect(() => {
	// 	const appStateListener = AppState.addEventListener("change", _handleAppStateChange);
	// 	return () => {
	// 		appStateListener.remove();
	// 		abortController.abort();
	// 	};
	// }, []);

	useEffect(() => {
		(async () => {
			await loadAsync(fonts);

			setCustomText({ style: { fontFamily: "Poppins" } });
			setCustomTextInput({ style: { fontFamily: "Poppins" } });
		})();
	}, []);

	return (
		// <View style={{ flex: 1, width: "100%", backgroundColor: "pink" }}></View>
		<NavigationContainer>
			<AuthProvider>
				<MessageProvider>
					<SocketProvider>
						<SafeAreaProvider style={{ flex: 1 }}>
							{/* <Chat /> */}
							{/* <Messages /> */}
							<Stack />
						</SafeAreaProvider>
					</SocketProvider>
				</MessageProvider>
			</AuthProvider>
		</NavigationContainer>
	);
	// return (
	// 	<GestureHandlerRootView style={{ flex: 1 }}>
	// 		<MatchMode value={0} setValue={(x) => console.log(x)} />
	// 	</GestureHandlerRootView>
	// );
	// return <ImageManipulatorTest route={{ params: {} }} />;
}
