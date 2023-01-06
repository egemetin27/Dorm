import { Text, View, TouchableOpacity, Dimensions } from "react-native";

import commonStyles from "../../visualComponents/styles";
import { colors, Gradient, GradientText } from "../../visualComponents/colors";

const { width, height } = Dimensions.get("window");

export default MatchMode = ({ value, setValue }) => {
	return (
		<View style={commonStyles.Container}>
			<View
				style={{
					width: "100%",
					alignItems: "flex-start",
					paddingHorizontal: 30,
					marginTop: 20,
				}}
			>
				<GradientText
					text={"Başlamak İçin Modunu Seç!"}
					style={{
						fontSize: Math.min(30, Math.min(height * 0.035, width * 0.06)),
						fontFamily: "NowBold",
					}}
				/>
				<View style={{ marginVertical: 10 }}>
					<Text
						style={{
							color: colors.medium_gray,
							fontSize: Math.min(16, width * 0.04),
						}}
					>
						Merak etme! Modlar arasında istediğin zaman geçiş yapabilirsin
					</Text>
				</View>
			</View>
			<TouchableOpacity
				style={[commonStyles.button, { backgroundColor: colors.white, marginTop: 16 }]}
				onPress={() => {
					setValue(0);
				}}
			>
				{value == 0 ? (
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
							style={[
								commonStyles.buttonText,
								{ fontFamily: "PoppinsSemiBold", fontSize: 18 },
							]}
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
							style={[
								commonStyles.buttonText,
								{ fontFamily: "PoppinsSemiBold", fontSize: 18 },
							]}
						>
							Arkadaşlık
						</Text>
					</Gradient>
				) : (
					<GradientText
						text={"Arkadaşlık"}
						style={{ fontSize: 18, fontFamily: "PoppinsSemiBold", letterSpacing: 1.2 }}
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
							style={[
								commonStyles.buttonText,
								{ fontFamily: "PoppinsSemiBold", fontSize: 18 },
							]}
						>
							Etkinlik Üstünden Flört
						</Text>
					</Gradient>
				) : (
					<GradientText
						text={"Etkinlik Üstünden Flört"}
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
							style={[
								commonStyles.buttonText,
								{ fontFamily: "PoppinsSemiBold", fontSize: 18 },
							]}
						>
							Etkinlik Üstünden Arkadaşlık
						</Text>
					</Gradient>
				) : (
					<GradientText
						text={"Etkinlik Üstünden Arkadaşlık"}
						style={{ fontSize: 18, fontFamily: "PoppinsSemiBold", letterSpacing: 1.2 }}
					/>
				)}
			</TouchableOpacity>
			<View style={{ paddingHorizontal: width * 0.1, marginTop: 20 }}>
				<Text
					style={{
						color: colors.medium_gray,
						fontSize: Math.min(16, width * 0.04),
						textAlign: "center",
					}}
				>
					*Sadece bu moddaki insanlara gösterileceksin
				</Text>
			</View>
		</View>
	);
};
