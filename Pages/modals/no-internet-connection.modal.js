import React from "react";
import ReactNative, { View, Text, Image, Dimensions, Linking, Platform } from "react-native";

import { colors, Gradient } from "../../visualComponents/colors";
import commonStyles from "../../visualComponents/styles";

const { width, height } = Dimensions.get("window");

export default function NoInternetConnectionModal() {
	return (
		<Gradient
			style={{
				width: "100%",
				height: "100%",
				justifyContent: "center",
				alignItems: "center",
			}}
		>
			<View
				style={{
					width: width * 0.8,
					backgroundColor: "white",
					borderRadius: 10,
					alignItems: "center",
					justifyContent: "space-around",
					paddingVertical: 30,
					paddingHorizontal: "7.5%",
				}}
			>
				<View>
					<Image
						source={require("../../assets/sadFace.png")}
						style={{ maxWidth: "60%", height: height * 0.1, resizeMode: "contain" }}
					/>
				</View>
				<Text
					style={{
						textAlign: "center",
						marginTop: 20,
						color: colors.medium_gray,
						fontSize: Math.min(height * 0.021, width * 0.04),
					}}
				>
					İnternet bağlantında sorun var gibi duruyor. Dilersen bağlantını kontrol edip tekrar
					deneyebilirsin.
				</Text>
			</View>
		</Gradient>
	);
}
