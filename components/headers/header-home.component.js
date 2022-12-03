import { StyleSheet, View, Pressable, Dimensions } from "react-native";
import { useMemo } from "react";
import { Ionicons, Octicons } from "@expo/vector-icons";

import { colors, GradientText } from "../../visualComponents/colors";

import commonStyles from "../../visualComponents/styles";
import { useNavigation } from "@react-navigation/native";

const { width, height } = Dimensions.get("window");

const LABELS = {
	event: { label: "dorm • etkinlikler", gradientColors: ["#4136F1", "#8743FF"] },
	flirt: { label: "dorm • flört", gradientColors: ["#4136EC", "#FF6978"] },
	friend: { label: "dorm • arkadaşlık", gradientColors: ["#4136EC", "#189EFF"] },
};

const HomeHeader = ({ page }) => {
	const { label, gradientColors } = useMemo(
		() => LABELS[page] ?? { label: "", gradientColors: ["#8743FF", "#4136F1"] },
		[page]
	);

	const navigation = useNavigation();

	const handleDrawerButton = () => {
		navigation.openDrawer();
	};

	const handleFilterButton = () => {
		navigation.navigate("FilterModal");
	};

	return (
		<View name={"EventHeader"} style={styles.header}>
			<Pressable style={styles.leftHeaderButton} onPress={handleDrawerButton}>
				<Ionicons name="menu" size={Math.min(width * 0.08, 36)} color={colors.purpleGray} />
			</Pressable>
			<GradientText
				text={label}
				colors={gradientColors}
				style={{
					fontSize: Math.min(height * 0.03, 30),
					fontFamily: "PoppinsSemiBold",
					letterSpacing: 0.5,
				}}
			/>
			{page === "friend" && (
				<Pressable style={styles.rightHeaderButton} onPress={handleFilterButton}>
					<Ionicons
						name="filter-sharp"
						size={Math.min(width * 0.08, 36)}
						color={colors.purpleGray}
					/>
				</Pressable>
			)}
		</View>
	);
};

export default HomeHeader;

const styles = StyleSheet.create({
	header: {
		width: "100%",
		flexDirection: "row",
		height: height * 0.08,
		justifyContent: "center",
		alignItems: "center",
		marginTop: height * 0.01,
	},
	leftHeaderButton: {
		position: "absolute",
		left: Math.min(20, width * 0.03),
	},
	rightHeaderButton: {
		position: "absolute",
		right: Math.min(20, width * 0.03),
	},
});
