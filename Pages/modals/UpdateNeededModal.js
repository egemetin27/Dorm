import React from "react";
import ReactNative, { View, Text, Image, Dimensions, Linking, Platform } from "react-native";

import { colors, Gradient } from "../../visualComponents/colors";
import commonStyles from "../../visualComponents/styles";

const { width, height } = Dimensions.get("window");

export default function UpdateNeededModal() {
	const directToStore = () => {
		if (Platform.OS == "android") {
			Linking.openURL("https://play.google.com/store/apps/details?id=com.meetdorm.dorm");
			return;
		}
		Linking.openURL("https://apps.apple.com/tr/app/dorm/id1612471736?l=tr");
		return;
	};

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
					// height: height * 0.6,
					backgroundColor: "white",
					borderRadius: 10,
					alignItems: "center",
					justifyContent: "space-around",
					paddingVertical: 30,
					paddingHorizontal: "7.5%",
				}}
			>
				<Image
					source={require("../../assets/dorm_text.png")}
					style={{ width: "60%", height: "15%" }}
					resizeMode={"cover"}
				/>
				<Text
					style={{
						textAlign: "center",
						marginTop: 20,
						color: colors.medium_gray,
						fontSize: Math.min(height * 0.021, width * 0.04),
					}}
				>
					Uygulamanın yeni bir sürümü mevcut. Yeni sürüm kritik güncellemeler içerdiği için
					uygulamayı güncellemeni rica ediyoruz.
				</Text>
				<ReactNative.TouchableOpacity
					onPress={directToStore}
					style={[commonStyles.button, { width: "100%", overflow: "hidden", marginTop: 20 }]}
				>
					<Gradient
						style={{
							justifyContent: "center",
							alignItems: "center",
							width: "100%",
							height: "100%",
						}}
					>
						<Text
							style={{
								color: colors.white,
								fontSize: 20,
								fontFamily: "PoppinsSemiBold",
								letterSpacing: 1,
							}}
						>
							Mağazaya Git
						</Text>
					</Gradient>
				</ReactNative.TouchableOpacity>
			</View>
		</Gradient>
	);
}
