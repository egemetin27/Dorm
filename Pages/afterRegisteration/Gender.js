import React from "react";
import { Text, View, TouchableOpacity, Dimensions } from "react-native";
import { StatusBar } from "expo-status-bar";

import commonStyles from "../../visualComponents/styles";
import { colors, Gradient, GradientText } from "../../visualComponents/colors";
import { Switch } from "../../visualComponents/customComponents";

const { width, height } = Dimensions.get("window");

export default Gender = ({ value, setValue, isEnabled }) => {
	const [switchOn, setSwitchOn] = React.useState(isEnabled.value ? 1 : -1);

	return (
		<View style={commonStyles.Container}>
			<StatusBar style="dark" />
			<View
				style={{ width: "100%", alignItems: "flex-start", paddingHorizontal: 30, marginTop: 20 }}
			>
				<GradientText
					text={"Cinsiyetim"}
					style={{
						fontSize: Math.min(30, Math.min(height * 0.035, width * 0.06)),
						fontFamily: "NowBold",
					}}
				/>
			</View>

			<TouchableOpacity
				style={[commonStyles.button, { backgroundColor: colors.white, marginTop: 16 }]}
				onPress={() => {
					setValue(1);
				}}
			>
				{value == 1 ? (
					<Gradient
						style={{
							borderRadius: 8,
							justifyContent: "center",
							alignItems: "center",
							width: "100%",
							height: "100%",
						}}
					>
						<Text
							style={[commonStyles.buttonText, { fontFamily: "PoppinsSemiBold", fontSize: 18 }]}
						>
							Kadın
						</Text>
					</Gradient>
				) : (
					<GradientText
						text={"Kadın"}
						style={{ fontSize: 18, fontFamily: "PoppinsSemiBold", letterSpacing: 1.2 }}
					/>
				)}
			</TouchableOpacity>

			<TouchableOpacity
				style={[commonStyles.button, { backgroundColor: colors.white, marginTop: 16 }]}
				onPress={() => {
					setValue(2);
				}}
			>
				{value == 2 ? (
					<Gradient
						style={{
							borderRadius: 8,
							justifyContent: "center",
							alignItems: "center",
							width: "100%",
							height: "100%",
						}}
					>
						<Text
							style={[commonStyles.buttonText, { fontFamily: "PoppinsSemiBold", fontSize: 18 }]}
						>
							Erkek
						</Text>
					</Gradient>
				) : (
					<GradientText
						text={"Erkek"}
						style={{ fontSize: 18, fontFamily: "PoppinsSemiBold", letterSpacing: 1.2 }}
					/>
				)}
			</TouchableOpacity>

			<TouchableOpacity
				style={[commonStyles.button, { backgroundColor: colors.white, marginTop: 16 }]}
				onPress={() => {
					setValue(3);
				}}
			>
				{value == 3 ? (
					<Gradient
						style={{
							borderRadius: 8,
							justifyContent: "center",
							alignItems: "center",
							width: "100%",
							height: "100%",
						}}
					>
						<Text
							style={[commonStyles.buttonText, { fontFamily: "PoppinsSemiBold", fontSize: 18 }]}
						>
							Non-Binary
						</Text>
					</Gradient>
				) : (
					<GradientText
						text={"Non-Binary"}
						style={{ fontSize: 18, fontFamily: "PoppinsSemiBold", letterSpacing: 1.2 }}
					/>
				)}
			</TouchableOpacity>

			<TouchableOpacity
				style={[commonStyles.button, { backgroundColor: colors.white, marginTop: 16 }]}
				onPress={() => {
					setValue(4);
				}}
			>
				{value == 4 ? (
					<Gradient
						style={{
							borderRadius: 8,
							justifyContent: "center",
							alignItems: "center",
							width: "100%",
							height: "100%",
						}}
					>
						<Text
							style={[commonStyles.buttonText, { fontFamily: "PoppinsSemiBold", fontSize: 18 }]}
						>
							Beyan Etmemeyi Tercih Ederim
						</Text>
					</Gradient>
				) : (
					<GradientText
						text={"Beyan Etmemeyi Tercih Ederim"}
						style={{ fontSize: 18, fontFamily: "PoppinsSemiBold", letterSpacing: 1.2 }}
					/>
				)}
			</TouchableOpacity>
			<View
				style={{
					width: "100%",
					flexDirection: "row",
					alignItems: "center",
					justifyContent: "center",
					marginTop: 20,
				}}
			>
				<Text
					style={{ color: colors.medium_gray, fontSize: 15, letterSpacing: 0.6, marginRight: 30 }}
				>
					Profilinde cinsiyet görünürlüğü
				</Text>
				<Switch
					value={switchOn}
					onValueChange={(value) => {
						isEnabled.value = value;
						setSwitchOn(value ? 1 : -1);
					}}
				/>
			</View>
		</View>
	);
};
