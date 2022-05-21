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
import AsyncStorage from "@react-native-async-storage/async-storage";
import { normalize } from "../../nonVisualComponents/generalFunctions";

import { url } from "../../connection";
import commonStyles from "../../visualComponents/styles";
import { colors, Gradient, GradientText } from "../../visualComponents/colors";
import { AnimatedModal, CustomModal } from "../../visualComponents/customComponents";
import { AuthContext } from "../../nonVisualComponents/Context";

import Card from "./Card";
import { Session } from "../../nonVisualComponents/SessionVariables";

const { width, height, fontScale } = Dimensions.get("window");

export default function ProfileCards({ navigation, route }) {
	const [isLoading, setIsLoading] = React.useState(true);
	// const [peopleList, setPeopleList] = React.useState(route.params.list);
	const [peopleList, setPeopleList] = React.useState([]);
	// const superLikeEndedPopup = useSharedValue(false);
	const indexOfFrontCard = useSharedValue(0);
	// const [indexOfFrontCard, setIndexOfFrontCard] = React.useState(0);
	// const [endOfListModal, setEndOfListModal] = React.useState(false);
	// const [endOfLikesTimer, setEndOfLikesTimer] = React.useState({ hour: 0, minute: 0 });
	// const [isScrollShowed, setIsScrollShowed] = React.useState(false);

	// const [myProfilePicture, setMyProfilePicture] = React.useState();
	const [reportPage, setReportPage] = React.useState(false);
	const [chosenReport, setChosenReport] = React.useState(0);

	const [name, setName] = React.useState("");
	// const [firstImg, setFirstImg] = React.useState("");
	// const [secondImg, setSecondImg] = React.useState("");
	// const [reportUserID, setReportUserID] = React.useState("");

	const { signOut } = React.useContext(AuthContext);

	// const showMatchScreen = (otherName, otherPicture, myPicture) => {
	// 	// setMatchPage(true);
	// 	setName(otherName);
	// 	setFirstImg(otherPicture);
	// 	setSecondImg(myPicture);
	// };

	function showReportPage(otherUserID) {
		setReportPage(true);
		setReportUserID(otherUserID);
	}

	async function reportProfile() {
		if (chosenReport == 0) {
			alert("Lütfen bildirme nedeninizi seçiniz!");
		} else {
			setReportPage(false);
			try {
				await axios
					.post(
						url + "/report",
						{
							UserId: route.params.myID,
							sikayetEdilen: reportUserID,
							sikayetKodu: chosenReport,
							aciklama: "",
						},
						{ headers: { "access-token": route.params.sesToken } }
					)
					.then((res) => {
						if (res.data == "Unauthorized Session") {
							Alert.alert("Oturumunuzun süresi doldu!");
							signOut();
						}
					})
					.catch((err) => {
						console.log(err);
					});
				// setIndexOfFrontCard(indexOfFrontCard + 1);
				indexOfFrontCard.value = indexOfFrontCard.value + 1;
			} catch (error) {
				console.log(error);
			}
		}
	}

	// const numberOfSuperLikes = useSharedValue(1); // TODO: get this data from database
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

	React.useEffect(async () => {
		console.log("start");
		// setIsScrollShowed(Session.ScrollShown)

		// await AsyncStorage.getItem("scrollNotShowed").then((res) => {
		// 	if (res == null) {
		// 		setIsScrollShowed(true);
		// 	}
		// });

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
		async function prepare() {
			const { list, idx } = route.params;
			let profile = list.splice(idx, 1);
			setPeopleList([profile[0], ...list].reverse());
			// setPeopleList(list);
		}
		try {
			await prepare();
		} finally {
			console.log("end");
			setIsLoading(false);
		}
		return () => backHandler.remove();
	}, []);

	// React.useEffect(async () => {
	// 	try {
	// 		await axios
	// 			.post(
	// 				url + "/getProfilePic",
	// 				{ UserId: route.params.myID },
	// 				{ headers: { "access-token": route.params.sesToken } }
	// 			)
	// 			.then((res) => {
	// 				setMyProfilePicture(res.data[0].PhotoLink);
	// 			})
	// 			.catch((err) => {
	// 				console.log(err);
	// 			});
	// 	} catch (error) {
	// 		console.log(error);
	// 	}
	// }, []);
	// React.useEffect(() => {
	// 	if (peopleList.length > 0 && indexOfFrontCard == peopleList.length)
	// 		navigation.navigate("ListEndedModal");
	// 	// if (peopleList.length > 0 && indexOfFrontCard == peopleList.length) setEndOfListModal(true);
	// }, [indexOfFrontCard]);

	// React.useEffect(() => {
	// 	const unsubscribe = navigation.addListener("blur", () => {
	// 		setEndOfListModal(false);
	// 	});

	// 	return unsubscribe;
	// }, [navigation]);

	if (isLoading) {
		return (
			<View style={[commonStyles.Container, { justifyContent: "center" }]}>
				<StatusBar style="dark" />
				<ActivityIndicator animating={true} color={"rgba(100, 60, 248, 1)"} size={"large"} />
			</View>
		);
	}

	return (
		<View style={commonStyles.Container}>
			<StatusBar style="dark" backgroundColor="#F4F3F3" />
			<View
				onLayout={() => {}}
				name={"header"}
				style={{
					backgroundColor: "#F4F3F3",
					paddingVertical: height * 0.015,
					width: width,
					flexDirection: "row",
					justifyContent: "space-between",
					paddingHorizontal: 20,
					alignItems: "center",
					elevation: 10,
					shadowOffset: {
						width: 0,
						height: 5,
					},
					shadowOpacity: 0.34,
					shadowRadius: 6.27,
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
					style={{ height: height * 0.04, flex: 1 }}
				/>
				<Feather name="chevron-left" size={30} color={"transparent"} />
			</View>
			<View style={{ width: "100%", height: "100%" }}>
				<View
					style={{
						width: "100%",
						height: Math.min(width * 1.35, height * 0.7),
						marginTop: height * 0.05,
						// backgroundColor: "blue",
					}}
				>
					{peopleList.map((item, index) => (
						<Card
							key={index}
							index={peopleList.length - index - 1}
							card={item}
							backFace={backFace}
							myID={myID}
							sesToken={sesToken}
							indexOfFrontCard={indexOfFrontCard}
							myProfilePicture={route.params.myPP}
							isScrollShowed={Session.ScrollShown}
							// isScrollShowed={isScrollShowed}
							matchMode={route.params.matchMode}
							// setScrollShowed={() => {
							// 	setIsScrollShowed(true);
							// }}
							incrementIndex={() => {
								indexOfFrontCard.value = indexOfFrontCard.value + 1;
							}}
							showMatchScreen={(otherName, otherPicture, myPicture) => {
								navigation.navigate("MatchModal", {
									firstImg: otherPicture,
									secondImg: myPicture,
									name: otherName,
								});
							}}
							showReportPage={(otherUserID) => {
								showReportPage(otherUserID);
							}}
							showLikeEndedModal={(hour, minute) => {
								navigation.navigate("LikeEndedModal", {
									hour: hour,
									minute: minute,
								});
							}}
							showListEndedModal={() => {
								navigation.navigate("ListEndedModal");
							}}
							length={peopleList.length}
						/>
					))}
				</View>

				<View
					style={{
						width: "100%",
						// flex: 1,
						paddingTop: height * 0.01,
						justifyContent: "flex-start",
					}}
				>
					<ReText
						text={derivedText}
						style={{
							textAlign: "center",
							// fontSize: Platform.OS == "android" ? width * 0.03 : width * 0.04,
							// fontSize: normalize(12),
							fontSize: fontScale * normalize(14),
							color: colors.medium_gray,
							letterSpacing: 0.2,
						}}
					/>
				</View>
			</View>

			{/* <AnimatedModal
				visible={superLikeEndedPopup.value}
				dismiss={() => {
					superLikeEndedPopup.value = false;
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
							superLikeEndedPopup.value = false;
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
			</AnimatedModal> */}

			{/*Match Page Modal */}
			{/* <AnimatedModal
				visible={matchPage2}
				dismiss={() => {
					// matchPopup.value = false;
					// setMatchPage(false);
					matchPage2.value = false;
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
							uri: firstImg ?? null,
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
							uri: secondImg ?? null,
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

					<ReactNative.TouchableOpacity
						onPress={async () => {
							// await setMatchPage(false);
							matchPage2.value = false;
							setIndexOfFrontCard(indexOfFrontCard + 1);
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
					</ReactNative.TouchableOpacity>
					<ReactNative.TouchableOpacity
						style={{
							paddingTop: 5,
						}}
						onPress={async () => {
							// await setMatchPage(false);
							matchPage2.value = false;
							// matchPopup.value = false;
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
					</ReactNative.TouchableOpacity>
				</View>
				</View>
			</AnimatedModal> */}
			{/* Match Page Modal */}

			{/* Report Page Modal */}

			<CustomModal
				visible={reportPage}
				dismiss={() => {
					setReportPage(false);
				}}
			>
				<View
					style={{
						maxWidth: width * 0.9,
						height: height * 0.9,
						backgroundColor: colors.white,
						borderRadius: 10,
						paddingHorizontal: 36,
					}}
				>
					<View
						style={{
							width: "100%",
							marginTop: 20,
						}}
					>
						<View
							style={{
								flexDirection: "row",
								width: "100%",
								alignContent: "center",
								justifyContent: "center",
								marginVertical: 10,
							}}
						>
							<Image
								style={{ left: width * 0.1, alignSelf: "center" }}
								source={require("../../assets/report.png")}
							/>
							<View
								style={{
									left: width * 0.2,
								}}
							>
								<ReactNative.TouchableOpacity
									onPress={() => {
										setReportPage(false);
									}}
									style={{
										alignSelf: "flex-end",
										padding: 16,
										zIndex: 5,
									}}
								>
									<Text style={{ fontSize: 22, color: colors.medium_gray }}>İptal</Text>
								</ReactNative.TouchableOpacity>
							</View>
						</View>
						<View
							style={{
								flexDirection: "row",
								width: "100%",
								alignItems: "center",
								justifyContent: "center",
								marginVertical: 5,
							}}
						>
							<Text
								style={{
									color: colors.black,
									fontSize: 20,
									lineHeight: 24,
									fontFamily: "PoppinsSemiBold",
									fontWeight: "500",
								}}
							>
								Bildirmek istiyor musun ?
							</Text>
						</View>
						<View
							style={{
								flexDirection: "row",
								width: "100%",
								alignItems: "center",
								justifyContent: "center",
								marginVertical: 10,
							}}
						>
							<Text
								style={{
									color: colors.dark_gray,
									fontSize: 13,
									fontFamily: "Poppins",
									fontWeight: "400",
									textAlign: "center",
								}}
							>
								{name} adlı kişiyi bildiriyorsun. Bunu ona söylemeyeceğiz.
							</Text>
						</View>
						<ReactNative.TouchableOpacity
							onPress={() => {
								chosenReport == 1 ? setChosenReport(0) : setChosenReport(1);
							}}
							style={{
								maxWidth: "100%",

								borderRadius: 12,
								overflow: "hidden",
								justifyContent: "center",
								alignItems: "center",
								borderColor: colors.black,
								borderWidth: 1,
								marginBottom: 10,
							}}
						>
							{chosenReport == 1 ? (
								<GradientText
									text={"Sahte Profil/Spam"}
									style={{ fontSize: 18, fontWeight: "bold", padding: 5 }}
								/>
							) : (
								<Text style={{ fontSize: 18, fontWeight: "bold", padding: 5 }}>
									Sahte Profil/Spam
								</Text>
							)}
						</ReactNative.TouchableOpacity>
						<ReactNative.TouchableOpacity
							onPress={() => {
								chosenReport == 2 ? setChosenReport(0) : setChosenReport(2);
							}}
							style={{
								maxWidth: "100%",
								borderRadius: 12,
								overflow: "hidden",
								justifyContent: "center",
								alignItems: "center",
								borderColor: colors.black,
								borderWidth: 1,
								marginBottom: 10,
							}}
						>
							{chosenReport == 2 ? (
								<GradientText
									text={"Uygunsuz Mesaj"}
									style={{ fontSize: 18, fontWeight: "bold", padding: 5 }}
								/>
							) : (
								<Text style={{ fontSize: 18, fontWeight: "bold", padding: 5 }}>Uygunsuz Mesaj</Text>
							)}
						</ReactNative.TouchableOpacity>
						<ReactNative.TouchableOpacity
							onPress={() => {
								chosenReport == 3 ? setChosenReport(0) : setChosenReport(3);
							}}
							style={{
								maxWidth: "100%",

								borderRadius: 12,
								overflow: "hidden",
								justifyContent: "center",
								alignItems: "center",
								borderColor: colors.black,
								borderWidth: 1,
								marginBottom: 10,
							}}
						>
							{chosenReport == 3 ? (
								<GradientText
									text={"Uygunsuz Fotoğraf"}
									style={{ fontSize: 18, fontWeight: "bold", padding: 5 }}
								/>
							) : (
								<Text style={{ fontSize: 18, fontWeight: "bold", padding: 5 }}>
									Uygunsuz Fotoğraf
								</Text>
							)}
						</ReactNative.TouchableOpacity>
						<ReactNative.TouchableOpacity
							onPress={() => {
								chosenReport == 4 ? setChosenReport(0) : setChosenReport(4);
							}}
							style={{
								maxWidth: "100%",

								borderRadius: 12,
								overflow: "hidden",
								justifyContent: "center",
								alignItems: "center",
								borderColor: colors.black,
								borderWidth: 1,
								marginBottom: 10,
							}}
						>
							{chosenReport == 4 ? (
								<GradientText
									text={"Uygunsuz Biyografi"}
									style={{ fontSize: 18, fontWeight: "bold", padding: 5 }}
								/>
							) : (
								<Text style={{ fontSize: 18, fontWeight: "bold", padding: 5 }}>
									Uygunsuz Biyografi
								</Text>
							)}
						</ReactNative.TouchableOpacity>
						<ReactNative.TouchableOpacity
							onPress={() => {
								chosenReport == 5 ? setChosenReport(0) : setChosenReport(5);
							}}
							style={{
								maxWidth: "100%",

								borderRadius: 12,
								overflow: "hidden",
								justifyContent: "center",
								alignItems: "center",
								borderColor: colors.black,
								borderWidth: 1,
								marginBottom: 10,
							}}
						>
							{chosenReport == 5 ? (
								<GradientText
									text={"Reşit olmayan kullanıcı"}
									style={{ fontSize: 18, fontWeight: "bold", padding: 5 }}
								/>
							) : (
								<Text style={{ fontSize: 18, fontWeight: "bold", padding: 5 }}>
									Reşit Olmayan Kullanıcı
								</Text>
							)}
						</ReactNative.TouchableOpacity>
						<ReactNative.TouchableOpacity
							onPress={() => {
								chosenReport == 6 ? setChosenReport(0) : setChosenReport(6);
							}}
							style={{
								maxWidth: "100%",

								borderRadius: 12,
								overflow: "hidden",
								justifyContent: "center",
								alignItems: "center",
								borderColor: colors.black,
								borderWidth: 1,
								marginBottom: 10,
							}}
						>
							{chosenReport == 6 ? (
								<GradientText
									text={"Diğer"}
									style={{ fontSize: 18, fontWeight: "bold", padding: 5 }}
								/>
							) : (
								<Text style={{ fontSize: 18, fontWeight: "bold", padding: 5 }}>Diğer</Text>
							)}
						</ReactNative.TouchableOpacity>

						<ReactNative.TouchableOpacity
							onPress={reportProfile}
							style={{
								maxWidth: "100%",

								borderRadius: 12,
								overflow: "hidden",
								marginTop: 20,
								justifyContent: "center",
								alignItems: "center",
							}}
						>
							<Gradient
								style={{
									justifyContent: "center",
									alignItems: "center",
									width: "100%",
								}}
							>
								<Text
									style={{
										color: colors.white,
										fontSize: 22,
										fontFamily: "PoppinsSemiBold",
										padding: 10,
									}}
								>
									Bildir
								</Text>
							</Gradient>
						</ReactNative.TouchableOpacity>
					</View>
				</View>
			</CustomModal>
			{/* Report Page Modal */}
			{/* <AnimatedModal
				visible={likeEndedModal}
				// visible={likeEndedModal}
				dismiss={() => {
					likeEndedModal.value = false;
					// setLikeEndedModal(false);
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
							{endOfLikesTimer.hour != 0 ? endOfLikesTimer.hour + " saat" : ""}{" "}
							{endOfLikesTimer.minute} dakika
						</Text>
					</View>
					<ReactNative.TouchableOpacity
						onPress={() => {
							// setLikeEndedModal(false);
							likeEndedModal.value = false;
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
								Devam Et
							</Text>
						</Gradient>
					</ReactNative.TouchableOpacity>
				</View>
			</AnimatedModal> */}

			{/* <CustomModal
				visible={endOfListModal}
				dismiss={() => {
					setEndOfListModal(false);
				}}
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
					<Image
						source={require("../../assets/sadFace.png")}
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
						Şu an için etrafta kimse kalmadı gibi duruyor. Ama sakın umutsuzluğa kapılma. En kısa
						zamanda tekrar uğramayı unutma!
					</Text>
					<ReactNative.TouchableOpacity
						onPress={async () => {
							await setEndOfListModal(false);
							navigation.replace("MainScreen", {
								screen: "AnaSayfa",
								params: { screen: "Home" },
							});
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
								Ana Sayfaya Dön
							</Text>
						</Gradient>
					</ReactNative.TouchableOpacity>
				</View>
			</CustomModal> */}
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
