import React, { useEffect } from "react";
import { StyleSheet, View, Image } from "react-native";
import Animated, {
	useSharedValue,
	useAnimatedStyle,
	withRepeat,
	withTiming,
	withSequence,
	withDelay,
} from "react-native-reanimated";
import { colors } from "../visualComponents/colors";

export default function TapIndicator({ size = 100 }) {
	const scale = useSharedValue(1.3);

	useEffect(() => {
		scale.value = withRepeat(
			withSequence(
				withTiming(1.3, { duration: 500 }),
				withDelay(500, withTiming(1, { duration: 250 })),
				// withTiming(1, { duration: 200 }),
				withTiming(1.1, { duration: 200 }),
				withTiming(1, { duration: 250 })
				// withTiming(1.3, { duration: 500 })
			),
			-1,
			true
		);
	}, []);

	const animatedStyle = useAnimatedStyle(() => {
		return {
			transform: [{ scale: scale.value }],
		};
	}, []);
	return (
		<View style={{ justifyContent: "center", alignItems: "center" }}>
			<Animated.View
				style={[
					animatedStyle,
					styles.ring_container,
					{ width: size * 1.2, borderRadius: size * 0.6 },
				]}
			/>
			<View style={[styles.tap_icon_container, { width: size, borderRadius: size * 0.5 }]}>
				<Image style={styles.tap_icon} source={require("../assets/Tutorial/tap-icon.png")} />
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	ring_container: {
		position: "absolute",
		backgroundColor: colors.purple,
		justifyContent: "center",
		alignItems: "center",
		aspectRatio: 1,
	},
	tap_icon_container: {
		backgroundColor: colors.purple,
		justifyContent: "center",
		alignItems: "center",
		aspectRatio: 1,
	},
	tap_icon: {
		height: "80%",
		aspectRatio: 1,
	},
});
