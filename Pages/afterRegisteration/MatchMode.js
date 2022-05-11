import React from "react";
import { Text, View, TouchableOpacity } from "react-native";
import { StatusBar } from "expo-status-bar";

import commonStyles from "../../visualComponents/styles";
import { colors, Gradient, GradientText } from "../../visualComponents/colors";

export default MatchMode = ({ value, setValue }) => {
	return (
		<View style={commonStyles.Container}>
			<StatusBar style="dark" />
			<View
				style={{ width: "100%", alignItems: "flex-start", paddingHorizontal: 30, marginTop: 20 }}
			>
				<GradientText
					text={"Ne Arıyorum"}
					style={{ fontSize: 30, fontFamily: "NowBold", fontWeight: "bold" }}
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
							Flört
						</Text>
					</Gradient>
				) : (
					<GradientText
						text={"Flört"}
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
							Arkadaş
						</Text>
					</Gradient>
				) : (
					<GradientText
						text={"Arkadaş"}
						style={{ fontSize: 18, fontFamily: "PoppinsSemiBold", letterSpacing: 1.2 }}
					/>
				)}
			</TouchableOpacity>
		</View>
	);
};
