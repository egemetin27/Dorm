import React from "react";
import ReactNative, {
	View,
	Text,
	Image,
	StyleSheet,
	Dimensions,
	BackHandler,
	ActivityIndicator,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useSharedValue, useDerivedValue } from "react-native-reanimated";
import { StatusBar } from "expo-status-bar";
import { ReText } from "react-native-redash";
import { Octicons, Feather } from "@expo/vector-icons";
import * as SecureStore from "expo-secure-store";
import axios from "axios";
import { url } from "../../connection";

import commonStyles from "../../visualComponents/styles";
import { colors, Gradient, GradientText } from "../../visualComponents/colors";
import { AnimatedModal, CustomModal } from "../../visualComponents/customComponents";
import Card from "./Card";

const { width, height } = Dimensions.get("window");

export default function ProfileCards({ navigation, route }) {
	const [isLoading, setIsLoading] = React.useState(true);
	// const [peopleList, setPeopleList] = React.useState(route.params.list);
	const [peopleList, setPeopleList] = React.useState([]);
	const popupVisible = useSharedValue(false);
	const [indexOfFrontCard, setIndexOfFrontCard] = React.useState(0);

	const [myProfilePicture, setMyProfilePicture] = React.useState();

	React.useEffect(async () => {
		try {
			let abortController = new AbortController();
			const userDataStr = await SecureStore.getItemAsync("userData");
			const userData = JSON.parse(userDataStr);
			const userID = userData.UserId.toString();
			const myToken = userData.sesToken;

			await axios
				.post(url + "/getProfilePic", { UserId: userID }, { headers: { "access-token": myToken } })
				.then((res) => {
					//setPeopleList(res.data);
					//console.log(res.data);
					//console.log(res.data[0].PhotoLink);
					setMyProfilePicture(res.data[0].PhotoLink);
				})
				.catch((err) => {
					console.log(err);
				});
		} catch (error) {
			console.log(error);
		}
	}, []);

	const [matchPage, setMatchPage] = React.useState(false);
	const [reportPage, setReportPage] = React.useState(false);
	const [chosenReport, setChosenReport] = React.useState(0);


	const [name, setName] = React.useState("");
	const [firstImg, setFirstImg ] = React.useState("");
	const [secondImg, setSecondImg] = React.useState("");

	const showMatchScreen = (otherName, otherPicture, myPicture) => {
		setMatchPage(true);
		setName(otherName);
		setFirstImg(otherPicture);
		setSecondImg(myPicture);
		//console.log(otherName);
		//console.log(otherPicture);
		//console.log(myPicture);
	};

	const showReportPage = () => {
		setReportPage(true);
	};

	const navigateFromCard = () => {
		navigation.replace("MainScreen", { screen: "Mesajlar" });
	};

	
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
		const { fromEvent = false } = route.params;
		const backAction = () => {
			if (fromEvent) {
				navigation.goBack();
				return true;
			}

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
						navigation.replace("MainScreen", { screen: "AnaSayfa", props: { screen: "Home" } });
					}}
				>
					<Feather name="chevron-left" size={30} color={colors.cool_gray} />
				</TouchableOpacity>
				<Image
					source={require("../../assets/dorm_text.png")}
					resizeMode="contain"
					style={{ flex: 1, maxHeight: "60%" }}
					// style={{ width: "30%", maxHeight: "60%" }}
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
						myProfilePicture={myProfilePicture}
						navigateFromCard={() => {
							navigateFromCard();
						}}
						showMatchScreen={(otherName, otherPicture, myPicture)=>{
							showMatchScreen(otherName, otherPicture, myPicture);
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

			{/*Match Page Modal */}
			<CustomModal
				visible={matchPage}
				onRequestClose={() => {
					setMatchPage(false);
				}}
				onDismiss={() => {
					setMatchPage(false);
				}}
			>
				<View
					style={{
						height: height,
						width: width,
						top: 0,
						left: 0,
						right: 0,
						bottom: 0,
						position: "absolute",
						justifyContent: "center",
						alignItems: "center",
						alignContent: "center",
					}}
				>
					<View
						style={{
							height: height * 0.95,
							width: width * 0.95,
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
								paddingVertical: height * 0.02,
							}}
						>
							{name} {"&"} Sen
						</Text>
						<Image
							source={{
								uri: firstImg,
							}}
							style={{
								top: height * 0.25,
								left: width * 0.12,
								borderRadius: 20,
								position: "absolute",
								aspectRatio: 1 / 1.5,
								width: width * 0.4,
								maxHeight: height * 0.7,
								resizeMode: "cover",
								transform: [{ rotateZ: "-18deg" }],
								zIndex: 2,
							}}
						/>
						<Image
							source={{
								uri: secondImg,
							}}
							style={{
								top: height * 0.3,
								left: width * 0.4,
								borderRadius: 20,
								position: "absolute",
								aspectRatio: 1 / 1.5,
								width: width * 0.4,
								maxHeight: height * 0.7,
								resizeMode: "cover",
								transform: [{ rotateZ: "23deg" }],
							}}
						/>
						<Text
							style={{
								paddingTop: height * 0.425,
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
								setMatchPage(false);
								//incrementIndex();
								//goToMsg();
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
							onPress={async () => {
								await setMatchPage(false);
								//incrementIndex();
							}}
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
			</CustomModal>
			{/* Match Page Modal */}
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
