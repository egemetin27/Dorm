import React from "react";
import { StyleSheet, Dimensions, View, AppState } from "react-native";
import Amplify from "aws-amplify";
import awsmobile from "./src/aws-exports";

const { width, height } = Dimensions.get("window");

Amplify.configure(awsmobile);

import Stack from "./Navigators/StackNavigator";
//PAGES end
import Temp from "./Pages/Temp";
import MatchMode from "./Pages/afterRegisteration/MatchMode";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function App() {
	let abortController = new AbortController();
	const appState = React.useRef(AppState.currentState);
	const [appStateVisible, setAppStateVisible] = React.useState(appState.current);

	React.useEffect(() => {
		const subscription = AppState.addEventListener("change", _handleAppStateChange);
		return () => {
			subscription.remove();
			abortController.abort();
		};
	}, []);

	const _handleAppStateChange = (nextAppState) => {
		if (appState.current.match(/inactive|background/) && nextAppState === "active") {
			console.log("App has come to the foreground!");
		}

		appState.current = nextAppState;
		setAppStateVisible(appState.current);
		console.log("AppState", appState.current);
	};

	return (
		<SafeAreaProvider style={{ flex: 1 }}>
			<Stack />
		</SafeAreaProvider>
	);
	// return (
	// 	<GestureHandlerRootView style={{ flex: 1 }}>
	// 		<MatchMode value={0} setValue={(x) => console.log(x)} />
	// 	</GestureHandlerRootView>
	// );
	// return <ImageManipulatorTest route={{ params: {} }} />;
}

const styles = StyleSheet.create({
	Container: {
		height: "100%",
		width: "100%",
		flex: 1,
		backgroundColor: "#ECECEC",
		alignItems: "center",
	},
});
