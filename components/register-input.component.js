import {
	StyleSheet,
	Text,
	View,
	TextInput,
	Dimensions,
	Pressable,
	Platform,
	Keyboard,
} from "react-native";
import React, { forwardRef, Fragment, useEffect, useState } from "react";
import { colors, Gradient } from "../visualComponents/colors";
import { CustomPicker } from "../visualComponents/customComponents";
import DateTimePicker from "@react-native-community/datetimepicker";
import { isDate } from "moment";
import { parseDate } from "../utils/date.utils";

const { width, height } = Dimensions.get("window");

const RegisterInputField = forwardRef(
	(
		{
			containerStyle = {},
			label = "",
			placeholder = "",
			inputType = "text",
			list = [],
			onSubmit = () => {},
			onChange = () => {},
		},
		ref
	) => {
		const [value, setValue] = useState("");
		const [popupVisible, setPopupVisible] = useState(false);

		useEffect(() => {
			if (popupVisible) {
				Keyboard.dismiss();
			}
		}, [popupVisible]);

		const handleChange = (changedStr) => {
			setValue(changedStr);
			onChange(changedStr);
		};

		const datePick = (event, selectedDate) => {
			const currentDate = selectedDate || new Date(value);
			setPopupVisible(Platform.OS === "ios");
			// setPopupVisible(false);
			onChange(currentDate);

			const formattedDate = parseDate(currentDate);

			setValue(formattedDate);
			onSubmit(currentDate);
		};

		const handleSubmit = (event) => {
			onSubmit(value);
		};

		return (
			<Fragment>
				<View
					style={{
						justifyContent: "center",
						alignItems: "center",
					}}
				>
					<View style={[styles.container, containerStyle]}>
						<Gradient style={{ flex: 1 }}>
							<View
								style={{
									height: (containerStyle?.height ?? styles.container.height) * 0.5,
									paddingTop: "5%",
								}}
							>
								<Text style={styles.label}>{label}</Text>
							</View>
							{inputType === "text" && (
								<TextInput
									ref={ref}
									style={styles.input}
									placeholder={placeholder}
									value={value}
									onChangeText={handleChange}
									onSubmitEditing={handleSubmit}
								/>
							)}

							{inputType !== "text" && (
								<Pressable
									style={{ width: "100%" }}
									onPress={() => {
										setPopupVisible(true);
									}}
								>
									<View style={[styles.input, { justifyContent: "center", alignItems: "center" }]}>
										<Text
											style={[
												{
													color:
														inputType === "select"
															? value && value?.choice != ""
																? colors.black
																: colors.medium_gray
															: value.length > 0
															? colors.black
															: colors.medium_gray,
													fontSize: 20,
												},
											]}
										>
											{inputType === "select"
												? value && value?.choice != ""
													? value.choice
													: placeholder
												: value.length
												? value.toString()
												: placeholder}
											{/* {value && value?.choice != "" ? value.choice : placeholder} */}
										</Text>
									</View>
								</Pressable>
							)}
						</Gradient>
					</View>
				</View>

				{inputType === "select" && (
					<CustomPicker
						// style={{ width: "100%" }}
						style={{ width: width * 0.75 }}
						data={list}
						visible={popupVisible}
						setVisible={setPopupVisible}
						setChoice={handleChange}
						// setChoice={setUniversity}
					/>
				)}
				{inputType === "date" && (
					<Fragment>
						{popupVisible && (
							<View style={{ marginRight: width * 0.12, marginTop: 6, alignSelf: "flex-end" }}>
								{/* <Text style={{ alignSelf: "center" }}>Lütfen Doğum Tarihinizi Seçin</Text> */}
								<DateTimePicker
									textColor="black"
									accentColor="red"
									testID="dateTimePicker"
									value={isDate(value) ? value : new Date()}
									style={{ backgroundColor: "white", marginVertical: 5, alignSelf: "auto" }}
									mode="date"
									onChange={datePick}
									// onChange={datePick}
								/>
							</View>
						)}
					</Fragment>
				)}
			</Fragment>
		);
	}
);

export default RegisterInputField;

const styles = StyleSheet.create({
	container: {
		width: width * 0.75,
		height: 180,
		borderRadius: 16,
		overflow: "hidden",

		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 6,
		},
		shadowOpacity: 0.37,
		shadowRadius: 7.49,

		elevation: 12,
	},
	QuestionCard: {
		zIndex: 1,
		position: "absolute",
		height: 166.33,
		width: 329.99,
		borderRadius: 16,
	},
	label: {
		fontSize: 22,
		color: colors.light_gray,
		fontFamily: "PoppinsSemiBold",
		textAlign: "center",
	},
	input: {
		width: "100%",
		backgroundColor: "#F2F2F2",
		height: 54,
		fontSize: 20,
		textAlign: "center",
		paddingHorizontal: 10,
	},
});
