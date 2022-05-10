import React from "react";
import { StyleSheet, Dimensions, View } from "react-native";
import { API } from "aws-amplify";
import Amplify from "aws-amplify";
import awsmobile from "./src/aws-exports";

Amplify.configure(awsmobile);

const { width, height } = Dimensions.get("window");

import Stack from "./Navigators/StackNavigator";
//PAGES end
import Temp from "./Pages/Temp";
import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { red } from "react-native-redash";
import { colors } from "./visualComponents/colors";

export default function App() {

	return <SafeAreaProvider style ={{flex: 1}}>
			<Stack />
		</SafeAreaProvider>
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
