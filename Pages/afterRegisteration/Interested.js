import React from "react";
import { Text, View, TouchableOpacity } from "react-native";

import commonStyles from "../../visualComponents/styles";
import { colors, Gradient, GradientText } from "../../visualComponents/colors";

export default Interested = ({ value, setValue }) => {
	return (
		<View style={commonStyles.Container}>
			<View
				style={{ width: "100%", alignItems: "flex-start", paddingHorizontal: 30, marginTop: 20 }}
			>
				<GradientText text={"İlgi duyduğum"} style={{ fontSize: 30, fontWeight: "bold" }} />
			</View>
			<TouchableOpacity
				style={[commonStyles.button, { backgroundColor: colors.white, marginTop: 16 }]}
				onPress={() => {
					setValue(1);
				}}
			>
				{value == 1 ? (
					<Gradient style={{ borderRadius: 8, justifyContent: "center", alignItems: "center" }}>
						<Text style={[commonStyles.buttonText, { fontWeight: "bold", fontSize: 18 }]}>
							Kadın
						</Text>
					</Gradient>
				) : (
					<GradientText
						text={"Kadın"}
						style={{ fontSize: 18, fontWeight: "bold", letterSpacing: 1.2 }}
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
					<Gradient style={{ borderRadius: 8, justifyContent: "center", alignItems: "center" }}>
						<Text style={[commonStyles.buttonText, { fontWeight: "bold", fontSize: 18 }]}>
							Erkek
						</Text>
					</Gradient>
				) : (
					<GradientText
						text={"Erkek"}
						style={{ fontSize: 18, fontWeight: "bold", letterSpacing: 1.2 }}
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
					<Gradient style={{ borderRadius: 8, justifyContent: "center", alignItems: "center" }}>
						<Text style={[commonStyles.buttonText, { fontWeight: "bold", fontSize: 18 }]}>
							Herkes
						</Text>
					</Gradient>
				) : (
					<GradientText
						text={"Herkes"}
						style={{ fontSize: 18, fontWeight: "bold", letterSpacing: 1.2 }}
					/>
				)}
			</TouchableOpacity>

			<Text style={{ color: "gray", fontSize: 15, letterSpacing: 0.6, marginTop: 20 }}>
				Seçimini daha sonra değiştirebilirsin
			</Text>
		</View>
	);
};
