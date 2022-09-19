import { useContext } from "react";
import { View, Text, Dimensions, Pressable, TouchableOpacity } from "react-native";

import { colors, Gradient, GradientText } from "../../visualComponents/colors";
import CustomImage from "../../components/custom-image.component";
import { AuthContext } from "../../contexts/auth.context";

const { width, height } = Dimensions.get("window");

export default function MatchModal({ navigation, route }) {
	const { firstImg, secondImg, name } = route.params;
	// console.log(route)
	const { setPeopleIndex } = useContext(AuthContext);
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
					height: height * 0.91,
					width: width * 0.92,
					backgroundColor: colors.white,
				}}
			>
				<GradientText
					style={{
						fontSize: 26,
						fontWeight: "bold",
						textAlign: "center",
						paddingVertical: height * 0.02,
					}}
					text={"Hey! \n Eşleştiniz"}
				/>
				<Text
					style={{
						fontSize: 23,
						fontFamily: "Poppins",
						color: colors.medium_gray,
						textAlign: "center",
						paddingVertical: height * 0.01,
					}}
				>
					{name} {"&"} Sen
				</Text>
				<CustomImage
					url={firstImg ?? null}
					style={{
						top: height * 0.22,
						left: width * 0.1,
						borderRadius: 20,
						position: "absolute",
						aspectRatio: 1 / 1.5,
						width: width * 0.48,
						maxHeight: height * 0.6,
						resizeMode: "cover",
						transform: [{ rotateZ: "-14deg" }],
						zIndex: 2,
					}}
				/>
				<CustomImage
					url={secondImg ?? null}
					style={{
						top: height * 0.26,
						left: width * 0.33,
						borderRadius: 20,
						position: "absolute",
						aspectRatio: 1 / 1.5,
						width: width * 0.48,
						maxHeight: height * 0.7,
						resizeMode: "cover",
						transform: [{ rotateZ: "14deg" }],
					}}
				/>
				<Text
					style={{
						paddingTop: height * 0.5,
						fontSize: 16,
						fontFamily: "Poppins",
						color: colors.medium_gray,
						textAlign: "center",
						paddingHorizontal: 5,
					}}
				>
					“Merhaba!” demek için dışarıda karşılaşmayı bekleme.
				</Text>

				<TouchableOpacity
					onPress={() => {
						setPeopleIndex(-1);
						navigation.replace("MainScreen", { screen: "Mesajlar" });
					}}
					style={{
						paddingTop: 10,
						maxWidth: "100%",
						overflow: "hidden",
						justifyContent: "center",
						alignItems: "center",
					}}
				>
					<Gradient
						style={{
							justifyContent: "center",
							alignItems: "center",
							width: "80%",
							borderRadius: 12,
						}}
					>
						<Text
							style={{
								color: colors.white,
								fontSize: 18,
								fontFamily: "PoppinsSemiBold",
								padding: 10,
							}}
						>
							Mesaj Gönder
						</Text>
					</Gradient>
				</TouchableOpacity>
				<TouchableOpacity
					style={{
						paddingTop: 5,
					}}
					onPress={navigation.goBack}
				>
					<GradientText
						style={{
							fontSize: 18,
							fontFamily: "Poppins",
							fontWeight: "bold",
							textAlign: "center",
							paddingVertical: height * 0.02,
						}}
						text={"Daha sonra"}
					/>
				</TouchableOpacity>
			</View>
		</View>
	);
}
