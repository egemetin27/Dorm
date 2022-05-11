import React from "react";
import { StyleSheet, Dimensions, View } from "react-native";
import { API } from "aws-amplify";
import Amplify from "aws-amplify";
import awsmobile from "./src/aws-exports";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const { width, height } = Dimensions.get("window");

import Stack from "./Navigators/StackNavigator";
//PAGES end
import Temp from "./Pages/Temp";
import MatchMode from "./Pages/afterRegisteration/MatchMode";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function App() {
	return (
		<SafeAreaProvider>
			<Stack />
		</SafeAreaProvider>
	);
	// return (
	// 	<GestureHandlerRootView style={{ flex: 1 }}>
	// 		<MatchMode value={0} setValue={(x) => console.log(x)} />
	// 	</GestureHandlerRootView>
	// );
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
