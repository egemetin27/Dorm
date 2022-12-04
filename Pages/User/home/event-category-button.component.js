import { useContext, useMemo } from "react";
import { View, Pressable, Image, Text, Dimensions, StyleSheet } from "react-native";
import { CATEGORIES, EventContext } from "../../../contexts/events.context";
import { colors, Gradient } from "../../../visualComponents/colors";
import commonStyles from "../../../visualComponents/styles";

const { height, width } = Dimensions.get("window");

const CategoryButton = ({ index, label, url }) => {
	const { selectedCategory, changeCategory } = useContext(EventContext);
	const isSelected = useMemo(() => selectedCategory === index, [selectedCategory]);

	const textColor = useMemo(() => (isSelected ? colors.white : colors.indigo), [isSelected]);
	// const textColor = useMemo(() => (isSelected ? colors.white : colors.indigo), [isSelected]);

	const handleCategoryChangeButton = () => {
		changeCategory(index);
	};

	return (
		<View
			style={[
				commonStyles.photo,
				styles.categoryButtonWrapper,
				{ marginRight: index + 1 == CATEGORIES.length ? Math.min(20, width * 0.03) : 0 },
			]}
		>
			{isSelected && <Gradient style={{ position: "absolute", width: "100%", height: "100%" }} />}

			<Pressable
				onPress={handleCategoryChangeButton}
				style={{ width: "100%", paddingHorizontal: 2 }}
			>
				<View name={"icon"} style={styles.categoryIconWrapper}>
					<Image
						style={[
							styles.categoryIcon,
							{
								tintColor: textColor,
							},
						]}
						source={url}
					/>
				</View>

				<View name={"label"} style={{ width: "100%", height: "40%", alignItems: "center" }}>
					<Text
						numberOfLines={1}
						style={{
							fontSize: height * 0.014,
							color: textColor,
						}}
					>
						{label}
					</Text>
				</View>
			</Pressable>
		</View>
	);
};

const styles = StyleSheet.create({
	categoryButtonWrapper: {
		height: "80%",
		borderRadius: 10,
		aspectRatio: 1 / 1,
		marginLeft: Math.min(20, width * 0.03),
		backgroundColor: colors.softPurple,
		shadowOpacity: 0,
		elevation: 0,
	},
	categoryIconWrapper: {
		width: "100%",
		height: "60%",
		paddingTop: "5%",
		alignItems: "center",
		justifyContent: "center",
	},
	categoryIcon: {
		marginTop: "10%",
		height: "90%",
		maxWidth: "60%",
		resizeMode: "contain",
	},
});

export default CategoryButton;
