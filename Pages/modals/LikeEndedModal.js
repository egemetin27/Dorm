import { View, Text, Image, Dimensions, Pressable, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";

import { colors, Gradient } from "../../visualComponents/colors";
import commonStyles from "../../visualComponents/styles";

const { width, height } = Dimensions.get("window");

export default function LikeEndedModal({ navigation, route }) {
	const { hour, minute } = route.params;
	return (
		<View style={{ width: "100%", height: "100%", justifyContent: "center", alignItems: "center" }}>
			<Pressable
				onPress={navigation.goBack}
				style={{
					position: "absolute",
					top: 0,
					left: 0,
					right: 0,
					bottom: 0,
					backgroundColor: "rgba(0,0,0,0.6)",
				}}
			/>
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
					source={require("../../assets/superLikeFinished.png")}
					style={{ height: "24%" }}
					resizeMode={"contain"}
				/>
				<Text
					style={{
						textAlign: "center",
						marginTop: 20,
						color: colors.medium_gray,
						fontSize: Math.min(height * 0.021, width * 0.04),
					}}
				>
					Beğenme hakların bitti!{"\n"} Ama korkma gün içinde tekrar yenilecek
				</Text>
				<View>
					<Text
						numberOfLines={1}
						adjustsFontSizeToFit={true}
						style={{
							textAlign: "center",
							marginTop: 20,
							color: colors.cool_gray,
							fontSize: Math.min(height * 0.021, width * 0.04),
						}}
					>
						Beğenme hakkın için kalan süre:
					</Text>
					<Text
						numberOfLines={1}
						adjustsFontSizeToFit={true}
						style={{
							textAlign: "center",
							color: colors.cool_gray,
							fontSize: Math.min(height * 0.021, width * 0.04),
						}}
					>
						<Feather
							name="clock"
							size={Math.min(height * 0.021, width * 0.04)}
							color={colors.cool_gray}
						/>
						{hour != 0 ? hour + " saat" : ""} {minute} dakika
					</Text>
				</View>
				<TouchableOpacity
					onPress={navigation.goBack}
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
							Devam Et
						</Text>
					</Gradient>
				</TouchableOpacity>
			</View>
		</View>
	);
}
