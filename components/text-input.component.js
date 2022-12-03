import { StyleSheet, Text, View, TextInput } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue } from "react-native-reanimated";

const AnimatedTextInput = () => {
	const y = useSharedValue(0);

	const animatedLabel = useAnimatedStyle(() => {
		return {};
	});

	return <View></View>;
};

export default AnimatedTextInput;

const styles = StyleSheet.create({});
