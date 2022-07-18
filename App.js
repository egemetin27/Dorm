import React from "react";
import { StyleSheet, Dimensions, View, AppState } from "react-native";
import AuthProvider from "./contexts/auth.context";
import Amplify from "aws-amplify";
import awsmobile from "./src/aws-exports";
const { width, height } = Dimensions.get("window");

Amplify.configure(awsmobile);

import Stack from "./Navigators/StackNavigator";
//PAGES end
import { SafeAreaProvider } from "react-native-safe-area-context";
import SocketProvider from "./contexts/socket.context";

import Temp from "./Pages/Temp";
import Messages from "./Pages/User/messages/messages.route";
//import ImageManipulatorTest from "./ImageManipulatorTest";

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

	// React.useEffect(() => {
	// 	const appStateListener = AppState.addEventListener("change", _handleAppStateChange);
	// 	return () => {
	// 		appStateListener.remove();
	// 		abortController.abort();
	// 	};
	// }, []);

	return (
		<SocketProvider>
			<SafeAreaProvider style={{ flex: 1 }}>
				{/* <Messages /> */}
				<Stack />
			</SafeAreaProvider>
		</SocketProvider>
	);
	// return (
	// 	<GestureHandlerRootView style={{ flex: 1 }}>
	// 		<MatchMode value={0} setValue={(x) => console.log(x)} />
	// 	</GestureHandlerRootView>
	// );
	// return <ImageManipulatorTest route={{ params: {} }} />;
}
