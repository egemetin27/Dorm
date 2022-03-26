import React from "react";
import { Text, View, TouchableOpacity } from "react-native";
import { StatusBar } from "expo-status-bar";

import { colors, Gradient, GradientText } from "../../visualComponents/colors";
import commonStyles from "../../visualComponents/styles";
import { Switch } from "../../visualComponents/customComponents";

export default sexOrientation = ({ value, setValue, isEnabled }) => {
	return (
		<View style={commonStyles.Container}>
			<StatusBar style="dark" />
			<View
				style={{ width: "100%", alignItems: "flex-start", paddingHorizontal: 30, marginTop: 20 }}
			>
				<GradientText text={"Cinsel Yönelimim"} style={{ fontSize: 30, fontFamily: "NowBold" }} />
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
							Heteroseksüel
						</Text>
					</Gradient>
				) : (
					<GradientText
						text={"Heteroseksüel"}
						style={{ fontSize: 18, fontFamily: "PoppinsSemiBold", letterSpacing: 1.2 }}
					/>
				)}
			</TouchableOpacity>
			<TouchableOpacity
				style={[commonStyles.button, { backgroundColor: colors.white, marginTop: 16 }]}
				onPress={() => {
					setValue(234);
				}}
			>
				{value == 234 ? (
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
							Biseksüel
						</Text>
					</Gradient>
				) : (
					<GradientText
						text={"Biseksüel"}
						style={{ fontSize: 18, fontFamily: "PoppinsSemiBold", letterSpacing: 1.2 }}
					/>
				)}
			</TouchableOpacity>
			<TouchableOpacity
				style={[commonStyles.button, { backgroundColor: colors.white, marginTop: 16 }]}
				onPress={() => {
					setValue(34);
				}}
			>
				{value == 34 ? (
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
							Homoseksüel
						</Text>
					</Gradient>
				) : (
					<GradientText
						text={"Homoseksüel"}
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
							Panseksüel
						</Text>
					</Gradient>
				) : (
					<GradientText
						text={"Panseksüel"}
						style={{ fontSize: 18, fontFamily: "PoppinsSemiBold", letterSpacing: 1.2 }}
					/>
				)}
			</TouchableOpacity>
			<TouchableOpacity
				style={[commonStyles.button, { backgroundColor: colors.white, marginTop: 16 }]}
				onPress={() => {
					setValue(5);
				}}
			>
				{value == 5 ? (
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
							Aseksüel
						</Text>
					</Gradient>
				) : (
					<GradientText
						text={"Aseksüel"}
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
				<Text style={{ color: "gray", fontSize: 15, letterSpacing: 0.6, marginRight: 30 }}>
					Profilinde yönelim görünürlüğü{" "}
				</Text>
				<Switch
					onValueChange={(value) => {
						isEnabled.value = value;
					}}
					value={isEnabled.value}
				/>
			</View>
		</View>
	);
};
