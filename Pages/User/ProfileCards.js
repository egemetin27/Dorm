import React from "react";
import ReactNative, {
	View,
	Text,
	Image,
	StyleSheet,
	Dimensions,
	Pressable,
	BackHandler,
	ActivityIndicator,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useSharedValue, useDerivedValue } from "react-native-reanimated";
import { StatusBar } from "expo-status-bar";
import { ReText } from "react-native-redash";
import { Octicons, Feather } from "@expo/vector-icons";

import commonStyles from "../../visualComponents/styles";
import { colors, Gradient } from "../../visualComponents/colors";
import { AnimatedModal } from "../../visualComponents/customComponents";
import Card from "./Card";

const { width, height } = Dimensions.get("window");

export default function ProfileCards({ navigation, route }) {
	const [isLoading, setIsLoading] = React.useState(true);
	// const [peopleList, setPeopleList] = React.useState(route.params.list);
	const [peopleList, setPeopleList] = React.useState([]);
	const popupVisible = useSharedValue(false);
	const [indexOfFrontCard, setIndexOfFrontCard] = React.useState(0);

	const numberOfSuperLikes = useSharedValue(1); // TODO: get this data from database
	const backFace = useSharedValue(false);

	const derivedText = useDerivedValue(
		() =>
			`${
				backFace.value
					? "Arka yüze dönmek için kart alanına çift dokun"
					: "Daha iyi tanımak için kart alanına çift dokun"
			}`
	);

	// const peopleList = route.params.list;
	const { myID, sesToken } = route.params;

	function handlePopupSubmit() {
		console.log("super like popup submit...");
	}

	const hour = 15;
	const minute = 20;
	const second = 51; // TODO: get this data from database

	React.useEffect(() => {
		const backAction = () => {
			navigation.replace("MainScreen", { screen: "AnaSayfa" });
			return true;
		};
		const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);
		return () => backHandler.remove();
	}, []);

	React.useEffect(async () => {
		async function prepare() {
			const { list, idx } = route.params;

			var arr = new Array(...list);
			const element = arr[idx];
			arr.splice(idx, 1);
			arr.splice(0, 0, element);
			arr = arr.reverse();
			setPeopleList(arr);
		}

		try {
			await prepare();
		} finally {
			setIsLoading(false);
		}
	}, []);

	{
		isLoading && (
			<View style={[commonStyles.Container, { justifyContent: "center" }]}>
				<StatusBar style="dark" />
				<ActivityIndicator animating={true} color={"rgba(100, 60, 248, 1)"} size={"large"} />
			</View>
		);
	}

	return (
		<View style={commonStyles.Container}>
			<StatusBar style="dark" translucent={false} backgroundColor="#F4F3F3" />
			<View
				name={"header"}
				style={{
					backgroundColor: "#F4F3F3",
					maxHeight: height * 0.15,
					width: width,
					flexDirection: "row",
					justifyContent: "space-between",
					paddingHorizontal: 20,
					alignItems: "center",
					elevation: 10,
				}}
			>
				<TouchableOpacity
					onPress={() => {
						navigation.replace("MainScreen", { screen: "AnaSayfa" });
					}}
				>
					<Feather name="chevron-left" size={30} color={colors.cool_gray} />
				</TouchableOpacity>
				<Image
					source={require("../../assets/dorm_text.png")}
					resizeMode="center"
					style={{ width: "30%", maxHeight: "60%" }}
				/>
				<TouchableOpacity>
					{/* TODO: open filtering modal here  */}
					<Octicons
						style={{ transform: [{ rotate: "-90deg" }] }}
						name="settings"
						size={30}
						color={colors.cool_gray}
					/>
				</TouchableOpacity>
			</View>
			<View
				style={{
					width: "100%",
					height: height * 0.7,
					alignItems: "center",
					marginTop: height * 0.05,
				}}
			>
				{peopleList.map((item, index) => (
					<Card
						key={index}
						index={peopleList.length - index - 1}
						card={item}
						backFace={backFace}
						setPopupVisible={(val) => (popupVisible.value = val)}
						numberOfSuperLikes={numberOfSuperLikes}
						myID={myID}
						sesToken={sesToken}
						indexOfFrontCard={indexOfFrontCard}
						incrementIndex={() => {
							setIndexOfFrontCard(indexOfFrontCard + 1);
						}}
					/>
				))}
			</View>

			<View
				style={{
					width: "100%",
				}}
			>
				<ReText
					text={derivedText}
					style={{
						textAlign: "center",
						fontSize: width * 0.04,
						color: colors.medium_gray,
						letterSpacing: 0.2,
					}}
				/>
			</View>

			<View name={"tab-Bar"} style={styles.tabBar}>
				<Pressable
					onPress={() => {
						navigation.replace("MainScreen", { screen: "Profil" });
					}}
					style={{ alignItems: "center", justifyContent: "flex-end", flex: 1 }}
				>
					<Image
						source={require("../../assets/TabBarIcons/profile.png")}
						resizeMode="contain"
						style={{
							tintColor: colors.cool_gray,
							height: height / 36,
						}}
					/>

					<Text
						style={{
							fontSize: 13,
							fontFamily: "PoppinsSemiBold",
							color: colors.cool_gray,
						}}
					>
						Profil
					</Text>
				</Pressable>
				<Pressable
					onPress={() => {
						navigation.replace("MainScreen", { screen: "AnaSayfa" });
					}}
					style={{ alignItems: "center", justifyContent: "flex-end", flex: 1 }}
				>
					<Image
						source={require("../../assets/logoGradient.png")}
						resizeMode="contain"
						style={{
							tintColor: colors.cool_gray,
							height: height / 30,
						}}
					/>
					<Text
						style={{
							fontSize: 13,
							fontFamily: "PoppinsSemiBold",
							color: colors.cool_gray,
						}}
					>
						Ana Sayfa
					</Text>
				</Pressable>
				<Pressable
					onPress={() => {
						navigation.replace("MainScreen", { screen: "Mesajlar" });
					}}
					style={{ alignItems: "center", justifyContent: "flex-end", flex: 1 }}
				>
					<Image
						source={require("../../assets/TabBarIcons/messages.png")}
						resizeMode="contain"
						style={{
							tintColor: colors.cool_gray,
							height: height / 36,
						}}
					/>
					<Text
						style={{
							fontSize: 13,
							fontFamily: "PoppinsSemiBold",
							color: colors.cool_gray,
						}}
					>
						Mesajlar
					</Text>
				</Pressable>
			</View>

			<AnimatedModal
				visible={popupVisible.value}
				dismiss={() => {
					popupVisible.value = false;
				}}
				// style={{ position: "absolute" }}
			>
				<View
					style={{
						width: width * 0.8,
						aspectRatio: 1,
						maxHeight: height * 0.5,
						backgroundColor: "white",
						borderRadius: 10,
						alignItems: "center",
						paddingVertical: 30,
						paddingHorizontal: 40,
					}}
				>
					<ReactNative.TouchableOpacity
						onPress={() => {
							popupVisible.value = false;
						}}
						style={{ position: "absolute", top: 15, right: 20 }}
					>
						<Text
							style={{
								color: colors.medium_gray,
								fontSize: 16,
								fontWeight: "600",
								letterSpacing: 0.5,
							}}
						>
							Kapat
						</Text>
					</ReactNative.TouchableOpacity>
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
							fontSize: 16,
						}}
					>
						Kıvılcım hakların bitti! Gün içinde tekrar yenilecek ama aranızdaki kıvılcımlar hiçbir
						yere kaçmıyor
					</Text>
					<Text
						style={{
							textAlign: "center",
							marginTop: 20,
							color: colors.cool_gray,
							fontSize: 16,
						}}
					>
						Kıvılcım hakkın için kalan süre:{"\n"}
						<Feather name="clock" size={16} color={colors.cool_gray} />
						{hour} saat {minute} dakika {second} saniye
					</Text>
					<ReactNative.TouchableOpacity
						onPress={handlePopupSubmit}
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
					</ReactNative.TouchableOpacity>
				</View>
			</AnimatedModal>
		</View>
	);
}

const styles = StyleSheet.create({
	tabBar: {
		position: "absolute",
		bottom: 0,
		height: height * 0.08,
		width: "100%",
		paddingBottom: height * 0.008,
		backgroundColor: colors.white,
		flexDirection: "row",
	},
});
