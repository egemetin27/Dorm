import { Pressable, View, Text, StyleSheet, Dimensions } from "react-native";
import { colors, Gradient } from "../visualComponents/colors";

const { width, height } = Dimensions.get("window");

const CustomRadio = (props) => {
	const { horizontal = false, list = [], index, indexes = [], setIndex = () => {} } = props;
	const isMultiSelect = props?.multiSelect ?? false;

	return (
		<View style={{ flexDirection: horizontal ? "row" : "column", flexWrap: "wrap" }}>
			{list.map((item, idx) => {
				return (
					<Pressable
						key={idx}
						onPress={() => {
							setIndex(idx);
						}}
						style={[
							{
								marginHorizontal: Math.min(width * 0.03, 10),
							},
							props.style,
						]}
					>
						{(isMultiSelect ? indexes[idx] == 1 : index == idx) ? (
							<Gradient
								style={[
									{
										paddingVertical: 5,
										paddingHorizontal: 20,
										justifyContent: "center",
										alignItems: "center",
										elevation: 3,
									},
									props.listItemStyle,
								]}
							>
								<Text
									numberOfLines={1}
									adjustsFontSizeToFit={true}
									style={[
										{ color: colors.white, fontSize: Math.min(width * 0.04, 20) },
										props.textStyle,
									]}
								>
									{item}
								</Text>
							</Gradient>
						) : (
							<View
								style={[
									{
										paddingVertical: 5,
										paddingHorizontal: 20,
										backgroundColor: colors.white,
										justifyContent: "center",
										alignItems: "center",
										elevation: 3,
									},
									props.listItemStyle,
								]}
							>
								<Text
									numberOfLines={1}
									adjustsFontSizeToFit={true}
									style={[{ fontSize: Math.min(width * 0.04, 20) }, props.textStyle]}
								>
									{item}
								</Text>
							</View>
						)}
					</Pressable>
				);
			})}
		</View>
	);
};

export default CustomRadio;
