import { View, Text, Image, Dimensions, Pressable, TouchableOpacity } from "react-native";
//import { Feather } from "@expo/vector-icons";

import { colors, Gradient } from "../../visualComponents/colors";
import commonStyles from "../../visualComponents/styles";

const { width, height } = Dimensions.get("window");

export default function LikeEndedModal({ navigation, route }) {
	return (
		<View style={{ width: "100%", height: "100%", justifyContent: "center", alignItems: "center" }}>
			<Pressable
				onPress={() => navigation.goBack()}
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
					// aspectRatio: 1,
					// maxHeight: 400,
					backgroundColor: "white",
					borderRadius: 10,
					alignItems: "center",
					paddingVertical: 30,
					paddingHorizontal: 40,
				}}
			>
				<Image
					source={require("../../assets/sadFace.png")}
					style={{ height: height * 0.072 }}
					resizeMode={"contain"}
				/>
				<View style={{ marginTop: 20 }}>
					<Text
						style={{
							textAlign: "center",
							color: colors.medium_gray,
							fontSize: 16,
						}}
					>
						Şu an için etrafta kimse kalmadı gibi duruyor. Ama sakın umutsuzluğa kapılma. En kısa
						zamanda tekrar uğramayı unutma!
					</Text>
				</View>
				{/* <TouchableOpacity
					onPress={() => {
						// navigation.replace(
						// 	"MainScreen", {
						// 	screen: "AnaSayfa",
						// 	params: { screen: "Home" },
						// });
						navigation.goBack();
					}}
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
							
						</Text>
					</Gradient>
				</TouchableOpacity> */}
			</View>
		</View>
	);
}
