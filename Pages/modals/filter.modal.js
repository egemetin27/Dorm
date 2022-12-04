import { useContext, useRef } from "react";
import { Pressable, StyleSheet, View, Dimensions, ScrollView } from "react-native";
//import MultiSlider from "@ptomasroos/react-native-multi-slider";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

import Accordion from "../../components/accordion.component";
import CustomRadio from "../../components/custom-radio.component";
import CustomButton from "../../components/button.components";

import { FilterContext, TYPES, FILTERS, OPTIONS } from "../../contexts/filter.context";

import { colors, GradientText } from "../../visualComponents/colors";
import RangeSlider from "../../components/range-slider.component";
import { AuthContext } from "../../contexts/auth.context";

const { width, height } = Dimensions.get("window");

const makeList = (options) => {
	const list = [];

	options.forEach((option) => {
		list.push(option.name);
	});

	return list;
};

const FilterModal = () => {
	const { filters, changeFilters, discardUnsaved, saveFilters } = useContext(FilterContext);
	const { setPeopleIndex } = useContext(AuthContext);
	const { age } = filters;
	const navigation = useNavigation();
	const ref = useRef();

	const handleDismiss = () => {
		discardUnsaved();
		navigation.goBack();
	};

	const handleSave = () => {
		saveFilters();
		setPeopleIndex(-1);
		navigation.goBack();
		//navigation.goBack();
	};

	const handleRangeChange = (values) => {
		changeFilters("age", { value: values });
	};

	return (
		<View style={styles.wrapper}>
			<Pressable onPress={handleDismiss} style={styles.absolute_fill} />
			<View style={styles.modal_container}>
				<Pressable style={styles.modal_exit_button} onPress={handleDismiss}>
					<Feather
						name="x"
						style={{ color: "#9D9D9D" }}
						size={Math.min(32, width * 0.06)}
						color="black"
					/>
				</Pressable>
				<View style={styles.header}>
					<GradientText text={"Filtreleme"} style={styles.header_text} />
					{/* <Text style={styles.header_subtext}>5 Filtre kullanma hakkın var</Text> */}
				</View>
				<ScrollView style={styles.scroll_view} showsVerticalScrollIndicator={false}>
					{Object.keys(FILTERS).map((key) => {
						const { name, type, disabled } = FILTERS[key];
						const isRadio = type == TYPES.radio;
						const indexes = filters[FILTERS[key].databaseKey];
						return (
							<Accordion
								key={key}
								style={styles.accordion}
								name={name}
								referance={ref}
								disabled={disabled}
							>
								{isRadio ? (
									<ScrollView
										style={{ paddingBottom: 10 }}
										horizontal={true}
										showsHorizontalScrollIndicator={false}
									>
										<CustomRadio
											horizontal
											multiSelect
											list={makeList(OPTIONS[key])}
											indexes={indexes}
											setIndex={(idx) => changeFilters(key, { idx })}
											style={{
												marginHorizontal: 5,
											}}
											listItemStyle={{
												width: width * 0.27,
												aspectRatio: 2.4 / 1,
												paddingHorizontal: 0,
												borderRadius: (width * 0.4) / 6,
												marginBottom: 10,
											}}
											textStyle={{
												fontSize: width * 0.036,
											}}
										/>
									</ScrollView>
								) : (
									<View style={styles.range_container}>
										<RangeSlider
											values={[age[0], age[1]]}
											min={18}
											max={35}
											onValuesChangeFinish={handleRangeChange}
											snapped={true}
											showSteps={true}
											allowOverlap={true}
											sliderLength={Math.min(width * 0.9, 360) * 0.7}
											// isMarkersSeparated={true}
										/>
									</View>
								)}
							</Accordion>
						);
					})}
				</ScrollView>
				<CustomButton onPress={handleSave} text="Filtrele" />
			</View>
		</View>
	);
};

export default FilterModal;

const vars = {
	fontSizeHeader: 24,
};
const styles = StyleSheet.create({
	wrapper: {
		width: "100%",
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	absolute_fill: {
		...StyleSheet.absoluteFill,
		backgroundColor: "rgba(0,0,0,0.5)",
	},
	modal_container: {
		width: Math.min(width * 0.9, 360),
		height: height * 0.6,
		backgroundColor: colors.backgroundColor,
		alignItems: "center",
		justifyContent: "space-evenly",
		paddingVertical: Math.min(height * 0.05, 30),
		paddingHorizontal: Math.min(width * 0.05, 20),
		borderRadius: 16,
	},
	header: {
		alignSelf: "flex-start",
		marginBottom: 20,
	},
	header_text: {
		fontSize: vars.fontSizeHeader,
		height: vars.fontSizeHeader * 1.25,
		fontFamily: "PoppinsExtraBold",
		letterSpacing: 0.2,
		marginBottom: 5,
	},
	header_subtext: {
		color: colors.gray,
		fontSize: vars.fontSizeHeader * 0.56,
	},
	scroll_view: {
		width: "100%",
		paddingRight: "5%",
	},
	accordion: {
		fontSize: vars.fontSizeHeader * 0.67,
	},
	range_container: {
		width: "100%",
		alignItems: "center",
	},
	modal_exit_button: {
		zIndex: 1,
		position: "absolute",
		top: 10,
		right: "5%",
	},
});
