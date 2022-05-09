import React from "react";
import { StyleSheet, Dimensions, View } from "react-native";
import { API } from "aws-amplify";
import Amplify from "aws-amplify";
import awsmobile from "./src/aws-exports";
import { GestureHandlerRootView } from "react-native-gesture-handler";

Amplify.configure(awsmobile);

const { width, height } = Dimensions.get("window");

import Stack from "./Navigators/StackNavigator";
//PAGES end
import Temp from "./Pages/Temp";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function App() {
	return (
		<SafeAreaProvider>
			<Stack />
		</SafeAreaProvider>
	);
	// return (
	// 	<GestureHandlerRootView style={{ flex: 1 }}>
	// 		<Temp />
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
