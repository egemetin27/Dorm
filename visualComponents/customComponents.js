import React from "react";
import {
	TouchableWithoutFeedback,
	StyleSheet,
	Modal,
	View,
	Dimensions,
	Pressable,
	FlatList,
	TouchableOpacity,
	Text,
	TouchableHighlight,
} from "react-native";
import Animated, {
	useSharedValue,
	useAnimatedStyle,
	interpolateColor,
	interpolate,
	withTiming,
} from "react-native-reanimated";

import { Gradient, colors } from "./colors";

const { width, height } = Dimensions.get("screen");

export const CustomModal = (props) => {
	return (
		<Modal
			visible={props.visible}
			transparent={props.transparent || true}
			onRequestClose={props.dismiss}
			animationType={props.animationType || "fade"}
		>
			<TouchableWithoutFeedback onPress={props.dismiss}>
				<View style={[styles.modalOverlay, props?.overlay]} />
			</TouchableWithoutFeedback>
			<View style={styles.modalContent}>{props.children}</View>
		</Modal>
	);
};

export const Switch = ({ style, value, onValueChange }) => {
	const val = useSharedValue(value ? 1 : -1);

	const animatedStyle = useAnimatedStyle(() => {
		return {
			transform: [
				{
					translateX: interpolate(val.value, [-1, 1], [0, style?.height || 30]),
				},
			],
		};
	});

	const colorAnimation = useAnimatedStyle(() => {
		return {
			backgroundColor: interpolateColor(val.value, [-1, 1], ["#DADADA", "transparent"]),
		};
	});

	return (
		<Pressable
			onPress={() => {
				onValueChange(val.value == 1 ? false : true); // if val is initially equal to 1, then set value to false; else, set it to true
				val.value = withTiming(-val.value);
			}}
			style={style}
		>
			<View
				style={{
					height: style?.height || 30,
					aspectRatio: 2 / 1,
					borderRadius: style?.height / 2 || 20,
					overflow: "hidden",
				}}
			>
				<Gradient
					style={{
						width: "100%",
						height: "100%",
					}}
				>
					<Animated.View
						style={[
							{
								justifyContent: "center",
								height: style?.height || 30,
								aspectRatio: 2 / 1,
								borderRadius: style?.height / 2 || 20,
								padding: style?.height * 0.1 || 3,
							},
							colorAnimation,
						]}
					>
						<Animated.View
							style={[
								{
									aspectRatio: 1,
									height: style?.height - 6 || 24,
									borderRadius: style?.height / 2 - 3 || 12,
									backgroundColor: colors.white,

									shadowColor: "rgba(0, 0, 0, 1)",
									shadowOffset: { width: 0, height: 10 },
									shadowRadius: 20,
									elevation: 4,
								},
								animatedStyle,
							]}
						></Animated.View>
					</Animated.View>
				</Gradient>
			</View>
		</Pressable>
	);
};

export const CustomPicker = ({ style, visible, setVisible, data, setChoice }) => {
	// data = {key: int, choice: choice}
	return (
		<CustomModal
			visible={visible}
			transparent={true}
			dismiss={() => {
				setVisible(false);
			}}
			animationType="fade"
		>
			<View style={[styles.pickerContainer, style]}>
				<FlatList
					style={{ width: "100%" }}
					showsVerticalScrollIndicator={false}
					data={data}
					renderItem={({ item }) => (
						<TouchableOpacity
							style={{
								height: height / 16,
								justifyContent: "center",
								alignItems: "center",
								width: "100%",
							}}
							onPress={() => {
								setChoice(item);
								setVisible(false);
							}}
						>
							<Text style={{ fontSize: Math.min(width / 22, height * 0.025), textAlign: "center" }}>
								{item.choice}
							</Text>
						</TouchableOpacity>
					)}
				/>
			</View>
		</CustomModal>
	);
};

export const AnimatedModal = (props) => {
	const { visible } = props;
	const animStyle = useAnimatedStyle(() => {
		return {
			zIndex: withTiming(visible.value ? 2 : -1),
			opacity: withTiming(visible.value ? 1 : 0),
		};
	});

	return (
		<Animated.View style={[{ width: "100%", height: "100%", position: "absolute" }, animStyle]}>
			<TouchableWithoutFeedback onPress={props.dismiss}>
				<View style={[styles.modalOverlay, props?.overlay]} />
			</TouchableWithoutFeedback>
			<View style={styles.modalContent}>{props.children}</View>
		</Animated.View>
	);
};

const styles = StyleSheet.create({
	modalContent: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	modalOverlay: {
		position: "absolute",
		height: height,
		width: width,
		backgroundColor: "rgba(0,0,0,0.4)",
	},
	pickerContainer: {
		borderRadius: 20,
		backgroundColor: colors.white,
		height: height / 4,
		width: width / 2,
		alignItems: "center",
		justifyContent: "center",
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 4,
		elevation: 5,
	},
});
