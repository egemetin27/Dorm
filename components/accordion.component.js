import { useState } from "react";
import { Text, StyleSheet, Pressable, Dimensions } from "react-native";
import Animated, {
	FlipInXUp,
	FlipOutXUp,
	Layout,
	useAnimatedStyle,
	useSharedValue,
	withTiming,
} from "react-native-reanimated";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const { width, height } = Dimensions.get("window");

const Accordion = ({ children, name, style, referance, disabled }) => {
	const navigation = useNavigation();
	const [isOpen, setIsOpen] = useState(false);
	const isOpenShared = useSharedValue(isOpen ? 1 : 0);

	const animatedIcon = useAnimatedStyle(() => {
		return {
			transform: [
				{
					rotate: `${isOpenShared.value * 90}deg`,
				},
			],
		};
	}, []);

	const handlePress = () => {
		if (disabled) {
			navigation.navigate("CustomModal", { modalType: "FILTER_DISABLED" });
			return;
		}

		if (referance.current) {
			referance.current.animateNextTransition();
		}
		isOpenShared.value = withTiming(isOpenShared.value === 0 ? 1 : 0, { duration: 200 });
		setIsOpen((prevValue) => !prevValue);
	};

	return (
		<Animated.View layout={Layout} style={styles.container}>
			<Pressable onPress={handlePress} style={styles.title}>
				<Text style={{ fontSize: style?.fontSize ?? 20, color: style?.color ?? "black" }}>
					{name}
				</Text>
				<Animated.View style={animatedIcon}>
					<Feather
						// style={isOpen && styles.openedIcon}
						name={"chevron-right"}
						size={style?.fontSize ?? 20}
					/>
				</Animated.View>
			</Pressable>
			{isOpen && (
				<Animated.View
					entering={FlipInXUp.duration(200).delay(200)}
					exiting={FlipOutXUp.duration(200)}
					style={styles.content}
				>
					{/* <View style={styles.content}> */}
					{children}
					{/* </View> */}
				</Animated.View>
			)}
		</Animated.View>
	);
};

export default Accordion;

const styles = StyleSheet.create({
	container: {
		paddingVertical: height * 0.01,
	},
	title: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
	},
	content: {
		paddingTop: 10,
		color: "blue",
	},
	openedIcon: {
		transform: [
			{
				rotate: "90deg",
			},
		],
	},
});
