import React from "react";
import { StyleSheet } from "react-native";
import {API} from "aws-amplify";
import Amplify from 'aws-amplify'
import awsconfig from './src/aws-exports'
Amplify.configure(awsconfig)

import Stack from "./Navigators/StackNavigator";
//PAGES end

import Temp from "./Pages/Temp";
import Temp2 from "./Pages/User/Temp2";

import Settings from "./Pages/Settings";
import Chat from "./Pages/User/Chat"
export default function App() {
	return <Stack />;
	// return <Temp />;
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
