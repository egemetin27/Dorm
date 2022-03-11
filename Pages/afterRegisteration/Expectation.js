import React from "react";
import { Text, View, TouchableOpacity } from "react-native";
import commonStyles from "../../visualComponents/styles";
import { colors, Gradient, GradientText } from "../../visualComponents/colors";

export default Expectation = ({ value, setValue }) => {
	return (
		<View style={commonStyles.Container}>
			<View
				style={{ width: "100%", alignItems: "flex-start", paddingHorizontal: 30, marginTop: 20 }}
			>
				<GradientText text={"Dorm'dan Beklentim"} style={{ fontSize: 30, fontWeight: "bold" }} />
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
							Takılmak
						</Text>
					</Gradient>
				) : (
					<GradientText
						text={"Takılmak"}
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
							Kısa Süreli İlişki
						</Text>
					</Gradient>
				) : (
					<GradientText
						text={"Kısa Süreli İlişki"}
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
							Uzun Süreli İlişki
						</Text>
					</Gradient>
				) : (
					<GradientText
						text={"Uzun Süreli İlişki"}
						style={{ fontSize: 18, fontWeight: "bold", letterSpacing: 1.2 }}
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
					<Gradient style={{ borderRadius: 8, justifyContent: "center", alignItems: "center" }}>
						<Text style={[commonStyles.buttonText, { fontWeight: "bold", fontSize: 18 }]}>
							Yeni Arkadaşlıklar
						</Text>
					</Gradient>
				) : (
					<GradientText
						text={"Yeni Arkadaşlıklar"}
						style={{ fontSize: 18, fontWeight: "bold", letterSpacing: 1.2 }}
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
					<Gradient style={{ borderRadius: 8, justifyContent: "center", alignItems: "center" }}>
						<Text style={[commonStyles.buttonText, { fontWeight: "bold", fontSize: 18 }]}>
							Etkinliklere Eşlik Edecek Biri
						</Text>
					</Gradient>
				) : (
					<GradientText
						text={"Etkinliklere Eşlik Edecek Biri"}
						style={{ fontSize: 18, fontWeight: "bold", letterSpacing: 1.2 }}
					/>
				)}
			</TouchableOpacity>
			<TouchableOpacity
				style={[commonStyles.button, { backgroundColor: colors.white, marginTop: 16 }]}
				onPress={() => {
					setValue(6);
				}}
			>
				{value == 6 ? (
					<Gradient style={{ borderRadius: 8, justifyContent: "center", alignItems: "center" }}>
						<Text style={[commonStyles.buttonText, { fontWeight: "bold", fontSize: 18 }]}>
							Ne istediğimi Bilmiyorum
						</Text>
					</Gradient>
				) : (
					<GradientText
						text={"Ne istediğimi Bilmiyorum"}
						style={{ fontSize: 18, fontWeight: "bold", letterSpacing: 1.2 }}
					/>
				)}
			</TouchableOpacity>
		</View>
	);
};
