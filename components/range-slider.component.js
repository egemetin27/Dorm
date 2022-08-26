import { View, StyleSheet, Text } from "react-native";
import MultiSlider from "@ptomasroos/react-native-multi-slider";
import { Gradient } from "../visualComponents/colors";

const CustomMarker = ({ data }) => {
	const { currentValue } = data;
	return (
		<View>
			<Text style={{ position: "absolute", bottom: 15 }}>{currentValue}</Text>
			<Gradient style={styles.custom_marker} />
		</View>
	);
};

const RangeSlider = ({
	values = [0],
	min = 0,
	max = 10,
	snapped,
	showSteps,
	allowOverlap,
	sliderLength,
	onValuesChangeStart = () => {},
	onValuesChange = () => {},
	onValuesChangeFinish = (values) => {},
}) => {
	return (
		<MultiSlider
			values={values}
			min={min}
			max={max}
			onValuesChangeFinish={onValuesChangeFinish}
			snapped={snapped}
			showSteps={showSteps}
			allowOverlap={allowOverlap}
			sliderLength={sliderLength}
			selectedStyle={{ backgroundColor: "#6434f8" }}
			stepLabelStyle={{ backgroundColor: "pink" }}
			customMarker={(data) => <CustomMarker data={data} />}
		/>
	);
};

const styles = StyleSheet.create({
	custom_marker: {
		width: 16,
		aspectRatio: 1,
		// height: 10,
		backgroundColor: "pink",
		borderRadius: 8,
	},
	label_container: { flexDirection: "row" },
});

export default RangeSlider;
