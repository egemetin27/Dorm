//import React from "react";
import {
	//StyleSheet,
	Text,
	View,
	//TouchableOpacity,
	//TextInput,
	//Animated,
	//ProgressViewIOS,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import MaskedView from "@react-native-masked-view/masked-view";

export const colors = {
	// backgroundColor: "#DADADA",
	// white: "#F8F8F8",
	// light_gray: "#ECECEC",
	// gray: "#B6B6B6",
	// cool_gray: "#D0D0D0",
	// medium_gray: "#9D9D9D",
	// dark_gray: "#4A4A4A",
	// black: "#343434",
	// soft_red: "#F9EAEC",
	// red: "#EB5E6C",
	// soft_green: "#BEFFA8",
	// green: "#7BFF4D",
	backgroundColor: "#F4F3F3",
	black: "#343434",
	dark_gray: "#4C525C",
	medium_gray: "#9D9D9D",
	gray: "#B6B6B6",
	cool_gray: "#D0D0D0",
	new_gray: "#DADADA",
	light_gray: "#ECECEC",
	light_gray2: "#EEEEEE",
	red: "#EB5E6C",
	soft_red: "#F9EAEC",
	green: "#7BFF4D",
	soft_green: "#BEFFA8",
	white2: "#F7F7F7",
	white: "#F8F8F8",
	full_white: "#FFFFFF",
	tutorialPurple: "#6B46D2",
	purple: "rgba(107,70,210,0.5)",

	//new colors:
	backgroundNew: "#F1F1F1",
	purpleGray: "#C8BFE1",
	grayNew: "#8E8E93",
	purpleNew: "#4136F1",
	softPurple: "#E0D4FF",
	indigo: "#4136EC",

	event: "#8743FF",
	flirt: "#FF6B79",
	friend: "#20A1FF",
};

export const Gradient = (props) => {
	return (
		<LinearGradient
			colors={props.colors || ["#4136F1", "#8743FF"]}
			start={props.start || { x: 0, y: 0 }}
			end={props.end || { x: 1, y: 1 }}
			locations={props.locations || [0, 1]}
			style={props.style}
			// style={[{ height: "100%", width: "100%" }, props.style]}
		>
			{props.children}
		</LinearGradient>
	);
};

export const GradientRegistration = (props) => {
	return (
		<LinearGradient
			colors={props.colors || ["#808080", "#7043FF"]}
			start={props.start || { x: 0, y: 0 }}
			end={props.end || { x: 1, y: 1 }}
			locations={props.locations || [0, 1]}
			style={props.style}
			// style={[{ height: "100%", width: "100%" }, props.style]}
		>
			{props.children}
		</LinearGradient>
	);
};

export const GradientText = ({ colors, ...props }) => {
	// text, style.fontSize
	return (
		<MaskedView
			style={{ alignContent: "center" }}
			maskElement={
				<View
					style={{
						// flex: 1,
						justifyContent: "center",
					}}
				>
					<Text style={[{ fontSize: 20 }, props.style]}>{props.text}</Text>
				</View>
			}
		>
			<Gradient colors={colors}>
				<Text
					style={[
						{
							opacity: 0,
							fontSize: 20,
						},
						props.style,
					]}
				>
					{props.text}
				</Text>
			</Gradient>
		</MaskedView>
	);
};
