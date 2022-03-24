import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";

import commonStyles from "../../visualComponents/styles";
import { GradientText } from "../../visualComponents/customComponents";

export default function Match({ navigation, route }) {
	const { affector, affected } = route?.params ?? { affector: "", affected: "" };

	return (
		<View style={commonStyles.Container}>
			<GradientText text={"Hey!\nEşleştiniz"} />
		</View>
	);
}
