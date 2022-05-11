import React from "react";
import { StyleSheet, Dimensions, View } from "react-native";
import { API } from "aws-amplify";
import Amplify from "aws-amplify";
import awsmobile from "./src/aws-exports";

const { width, height } = Dimensions.get("window");

Amplify.configure(awsmobile);

import Stack from "./Navigators/StackNavigator";
//PAGES end
import Temp from "./Pages/Temp";
import MatchMode from "./Pages/afterRegisteration/MatchMode";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function App() {
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
	// return <Temp route={{ params: {} }} />;
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
