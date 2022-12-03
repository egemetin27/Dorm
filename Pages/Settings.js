import { useContext, useEffect, useState } from "react";
import {
	View,
	Text,
	ScrollView,
	StyleSheet,
	TouchableOpacity,
	Dimensions,
	Image,
	BackHandler,
	Linking,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import axios from "axios";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import commonStyles from "../visualComponents/styles";
import { colors, Gradient, GradientText } from "../visualComponents/colors";
import { CustomModal, Switch } from "../visualComponents/customComponents";
import url from "../connection";

import { AuthContext } from "../contexts/auth.context";

import crypto from "../functions/crypto";

const { width, height } = Dimensions.get("window");

const SignOutModal = ({ visible, dismiss, signOut }) => {
	const handleSignOut = async () => {
		await dismiss();
		signOut();
	};

	return (
		<CustomModal visible={visible} dismiss={dismiss}>
			<View
				style={{
					width: width * 0.75,
					maxHeight: height * 0.6,
					backgroundColor: colors.white,
					borderRadius: 10,
					alignItems: "center",
					justifyContent: "center",
					paddingHorizontal: width * 0.025,
				}}
			>
				<Image
					source={require("../assets/sadFace.png")}
					style={{ height: "20%", aspectRatio: 1 }}
					resizeMode={"contain"}
				/>
				<Text style={{ color: colors.dark_gray, fontSize: 24, fontFamily: "PoppinsSemiBold" }}>
					Oturumumu Kapat
				</Text>
				<Text
					style={{
						marginTop: "5%",
						paddingHorizontal: "5%",
						color: colors.dark_gray,
						fontSize: 16,
						textAlign: "center",
					}}
				>
					Oturumu kapatmak istediğine emin misin? Profilin kullanıcılara gözükmeye devam edecek.
				</Text>

				<TouchableOpacity
					onPress={dismiss}
					style={{
						maxWidth: "90%",
						height: "15%",
						maxHeight: 60,
						aspectRatio: 9 / 2,
						borderRadius: 12,
						overflow: "hidden",
						marginTop: 20,
					}}
				>
					<Gradient
						style={{
							justifyContent: "center",
							alignItems: "center",
							width: "100%",
							height: "100%",
						}}
					>
						<Text style={{ color: colors.white, fontSize: 20, fontFamily: "PoppinsSemiBold" }}>
							Vazgeçtim
						</Text>
					</Gradient>
				</TouchableOpacity>

				<TouchableOpacity
					onPress={handleSignOut}
					style={{
						maxWidth: "90%",
						height: "15%",
						maxHeight: 60,
						aspectRatio: 9 / 2,
						borderRadius: 12,
						overflow: "hidden",
						marginTop: 10,
						alignItems: "center",
						justifyContent: "center",
						marginBottom: 8,
						borderWidth: 2,
						borderColor: "#B6B6B6",
					}}
				>
					<Text style={{ fontSize: 20, color: "#B6B6B6", fontFamily: "PoppinsSemiBold" }}>
						Oturumumu Kapat
					</Text>
				</TouchableOpacity>
			</View>
		</CustomModal>
	);
};

const FreezeAccountModal = ({ visible, dismiss, signOut, userId, sesToken, beInvisible }) => {
	const handleFreeze = async () => {
		await dismiss();

		const myJson = crypto.encrypt({ userId });
		axios
			.post(url + "/profile/FreezeAccount", myJson, { headers: { "access-token": sesToken } })
			.then(() => {
				signOut();
			})
			.catch((err) => {
				console.log("error on /freezeAccount:", err.resonse);
			});
	};

	const handleInvisible = () => {
		beInvisible();
		dismiss();
	};

	async () => {};
	return (
		<CustomModal visible={visible} dismiss={dismiss}>
			<View
				style={{
					width: width * 0.75,
					maxHeight: height * 0.6,
					backgroundColor: colors.white,
					borderRadius: 10,
					alignItems: "center",
					justifyContent: "center",
					paddingHorizontal: width * 0.025,
				}}
			>
				<TouchableOpacity
					onPress={dismiss}
					style={{
						position: "absolute",
						paddingTop: 10,
						paddingRight: 16,
						top: 0,
						right: 0,
					}}
				>
					<Text style={{ fontSize: 22, color: colors.medium_gray }}>İptal</Text>
				</TouchableOpacity>
				<Image
					source={require("../assets/sadFace.png")}
					style={{ height: "20%", aspectRatio: 1 }}
					resizeMode={"contain"}
				/>
				<Text style={{ color: colors.dark_gray, fontSize: 24, fontFamily: "PoppinsSemiBold" }}>
					Hesabımı Dondur
				</Text>
				<Text
					style={{
						marginTop: "5%",
						paddingHorizontal: "5%",
						color: colors.dark_gray,
						fontSize: 16,
						textAlign: "center",
					}}
				>
					Profil bilgilerin silinmeden hesabın dondurulacak. Bu sürede profilin diğer kullanıcılara
					gözükmeyecek. Geri gelmek istediğinde uygulamaya tekrar giriş yapman yeterli.
				</Text>

				<TouchableOpacity
					onPress={handleFreeze}
					style={{
						maxWidth: "90%",
						height: "15%",
						maxHeight: 60,
						aspectRatio: 9 / 2,
						borderRadius: 12,
						overflow: "hidden",
						marginTop: 20,
					}}
				>
					<Gradient
						style={{
							justifyContent: "center",
							alignItems: "center",
							width: "100%",
							height: "100%",
						}}
					>
						<Text style={{ color: colors.white, fontSize: 20, fontFamily: "PoppinsSemiBold" }}>
							Hesabımı Dondur
						</Text>
					</Gradient>
				</TouchableOpacity>

				<TouchableOpacity
					onPress={handleInvisible}
					style={{
						maxWidth: "90%",
						height: "15%",
						maxHeight: 60,
						aspectRatio: 9 / 2,
						borderRadius: 12,
						overflow: "hidden",
						marginTop: 10,
						alignItems: "center",
						justifyContent: "center",
						borderWidth: 2,
						borderColor: "#B6B6B6",
					}}
				>
					<Text style={{ fontSize: 20, color: "#B6B6B6", fontFamily: "PoppinsSemiBold" }}>
						Görünmez Ol
					</Text>
				</TouchableOpacity>
			</View>
		</CustomModal>
	);
};

const DeleteAccountModal = ({
	visible,
	dismiss,
	showFreezeAccountModal,
	signOut,
	sesToken,
	userId,
}) => {
	const handleDelete = async () => {
		await dismiss();
		const encryptedData = crypto.encrypt({ userId: userId });
		axios
			.post(url + "/profile/deleteAccount", encryptedData, {
				headers: { "access-token": sesToken },
			})
			.then((res) => {
				console.log(res.data);
				signOut();
			})
			.catch((err) => console.log(err));
	};

	return (
		<CustomModal visible={visible} dismiss={dismiss}>
			<View
				style={{
					width: width * 0.75,
					maxHeight: height * 0.6,
					backgroundColor: colors.white,
					borderRadius: 10,
					alignItems: "center",
					justifyContent: "center",
					paddingHorizontal: width * 0.025,
				}}
			>
				<TouchableOpacity
					onPress={dismiss}
					style={{
						position: "absolute",
						paddingTop: 10,
						paddingRight: 16,
						top: 0,
						right: 0,
					}}
				>
					<Text style={{ fontSize: 22, color: colors.medium_gray }}>İptal</Text>
				</TouchableOpacity>
				<Image
					source={require("../assets/sadFace.png")}
					style={{ height: "20%", aspectRatio: 1 }}
					resizeMode={"contain"}
				/>
				<Text style={{ color: colors.dark_gray, fontSize: 24, fontFamily: "PoppinsSemiBold" }}>
					Hesabımı Sil
				</Text>
				<Text
					style={{
						marginTop: "5%",
						paddingHorizontal: "10%",
						color: colors.dark_gray,
						fontSize: 16,
						fontWeight: "400",
						textAlign: "center",
					}}
				>
					Gittiğini gördüğümüze üzüldük!{"\n"}Onun yerine hesabını dondurmak ister misin?
				</Text>

				<TouchableOpacity
					onPress={() => {
						dismiss();
						showFreezeAccountModal();
					}}
					style={{
						maxWidth: "90%",
						height: "15%",
						maxHeight: 60,
						aspectRatio: 9 / 2,
						borderRadius: 12,
						overflow: "hidden",
						marginTop: 20,
					}}
				>
					<Gradient
						style={{
							justifyContent: "center",
							alignItems: "center",
							width: "100%",
							height: "100%",
						}}
					>
						<Text style={{ color: colors.white, fontSize: 20, fontFamily: "PoppinsSemiBold" }}>
							Hesabımı Dondur
						</Text>
					</Gradient>
				</TouchableOpacity>

				<TouchableOpacity
					onPress={handleDelete}
					style={{
						maxWidth: "90%",
						height: "15%",
						maxHeight: 60,
						aspectRatio: 9 / 2,
						borderRadius: 12,
						overflow: "hidden",
						marginVertical: 10,
						alignItems: "center",
						justifyContent: "center",
						borderWidth: 2,
						borderColor: "#B6B6B6",
					}}
				>
					<Text style={{ fontSize: 20, color: "#B6B6B6", fontFamily: "PoppinsSemiBold" }}>
						Hesabımı Sil
					</Text>
				</TouchableOpacity>
			</View>
		</CustomModal>
	);
};

export default function Settings({ navigation, route }) {
	const insets = useSafeAreaInsets();

	const { user, updateProfile, signOut } = useContext(AuthContext);

	const invis = user.Invisible == "1" ? true : false;
	const ghost = user.BlockCampus == "1" ? true : false;
	const onlyCampus = user.OnlyCampus == "1" ? true : false;
	const userId = user.userId;
	const sesToken = user.sesToken;

	// SWITCHES
	const [invisibility, setInvisibility] = useState(invis);
	const [campusGhost, setCampusGhost] = useState(ghost);
	const [schoolLover, setSchoolLover] = useState(onlyCampus);
	const [email, setEmail] = useState(false);
	const [pushNotifications, setPushNotifications] = useState(false);
	////////////

	// MODALS
	// const [superdormerModal, setSuperdormerModal] = useState(false);
	const [signoutModal, setSignoutModal] = useState(false);
	const [freezeAccountModal, setFreezeAccountModal] = useState(false);
	const [deleteAccountModal, setDeleteAccountModal] = useState(false);
	////////////

	// const oneMonthPrice = 29;
	// const threeMonthPrice = 24.6;
	// const sixMonthPrice = 17.4;

	useEffect(() => {
		const backAction = () => {
			navigation.goBack();
			return true;
		};

		const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);

		return () => backHandler.remove();
	}, []);

	const handleInvisibility = (value) => {
		setInvisibility(value);

		const invisSent = crypto.encrypt({ invisible: value ? "1" : "0", userId: userId });

		axios
			.post(url + "/profile/ChangeVisibility", invisSent, { headers: { "access-token": sesToken } }) // There is a typo (not Change but Chage) TODO: make userId variable
			.then(async (res) => {
				// let userStr = await SecureStore.getItemAsync("userData");
				// const user = JSON.parse(userStr);
				// const newUser = { ...user, Invisible: value ? "1" : "0" };
				// userStr = JSON.stringify(newUser);
				// SecureStore.setItemAsync("userData", userStr);

				updateProfile({ Invisible: value ? "1" : "0" });
			})
			.catch((error) => {
				console.log("Visibility Error: ", error);
			});
	};

	const handleCampusGhost = (value) => {
		setCampusGhost(value);
		if (schoolLover) {
			handleSchoolLover(false);
		}
		const blockCampusSent = crypto.encrypt({ BlockCampus: value ? "1" : "0", userId: userId });

		axios
			.post(url + "/profile/BlockCampus", blockCampusSent, {
				headers: { "access-token": sesToken },
			}) // There is a typo (not Change but Chage) TODO: make userId variable
			.then(async (res) => {
				// let userStr = await SecureStore.getItemAsync("userData");
				// const user = JSON.parse(userStr);
				// const newUser = { ...user, BlockCampus: value ? "1" : "0" };
				// userStr = JSON.stringify(newUser);
				// SecureStore.setItemAsync("userData", userStr);

				updateProfile({ BlockCampus: value ? "1" : "0" });
			})
			.catch((error) => {
				console.log("Ghost Error: ", error);
			});
	};

	const handleSchoolLover = (value) => {
		setSchoolLover(value);
		if (campusGhost) {
			handleCampusGhost(false);
		}

		const onlyCampusSent = crypto.encrypt({ OnlyCampus: value ? "1" : "0", userId: userId });

		axios
			.post(url + "/profile/OnlyCampus", onlyCampusSent, { headers: { "access-token": sesToken } }) // There is a typo (not Change but Chage) TODO: make userId variable
			.then(async (res) => {
				// let userStr = await SecureStore.getItemAsync("userData");
				// const user = JSON.parse(userStr);
				// const newUser = { ...user, OnlyCampus: value ? "1" : "0" };
				// userStr = JSON.stringify(newUser);
				// SecureStore.setItemAsync("userData", userStr);

				updateProfile({ OnlyCampus: value ? "1" : "0" });
			})
			.catch((error) => {
				console.log("Only Campus Error: ", error);
			});
	};

	const handleEmail = (value) => {
		setEmail(value);
	};

	const handlePushNotifications = (value) => {
		setPushNotifications(value);
	};

	return (
		<View style={[commonStyles.Container, { paddingBottom: insets.bottom }]}>
			<StatusBar style="dark" backgroundColor={colors.white} />
			<View name={"Header"} style={[styles.header, { height: height * 0.08 + insets.top }]}>
				<TouchableOpacity
					name={"backButton"}
					onPress={() => {
						navigation.goBack();
					}}
				>
					<Feather name="chevron-left" size={36} color="#4A4A4A" />
				</TouchableOpacity>
				<GradientText text={"Ayarlar"} style={{ fontSize: 32, fontFamily: "NowBold" }} />
			</View>
			<ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ width: width }}>
				{/* <TouchableOpacity
					style={styles.buttonContainer}
					onPress={() => {
						setSuperdormerModal(true);
					}}
				>
					<Text style={styles.buttonText}>Superdormer Ol</Text>
					<Feather name="chevron-right" size={20} color="#4A4A4A" />
				</TouchableOpacity>

				<TouchableOpacity style={styles.buttonContainer}>
					<Text style={styles.buttonText}>Kıvılcım Hakkı Al</Text>
					<Feather name="chevron-right" size={20} color="#4A4A4A" />
				</TouchableOpacity>
				<View style={{ width: "100%", height: 1, backgroundColor: "#DADADA" }} /> */}

				{/* <TouchableOpacity style={styles.buttonContainer}>
					<Text style={styles.buttonText}>Eşleşme Modu</Text>
					<Feather name="chevron-right" size={20} color="#4A4A4A" />
				</TouchableOpacity> */}

				<TouchableOpacity style={styles.buttonContainer}>
					<Text style={styles.buttonText}>Filtreleme</Text>
					<Feather name="chevron-right" size={20} color="#4A4A4A" />
				</TouchableOpacity>

				<TouchableOpacity style={styles.buttonContainer}>
					<Text style={styles.buttonText}>Konum</Text>
					<Feather name="chevron-right" size={20} color="#4A4A4A" />
				</TouchableOpacity>

				<View style={{ paddingBottom: 16 }}>
					<View style={[styles.buttonContainer, {}]}>
						<Text style={styles.buttonText}>Görünmezlik</Text>
						<Switch
							value={invisibility ? 1 : -1}
							onValueChange={(value) => {
								handleInvisibility(value);
							}}
						/>
					</View>
					<Text style={{ paddingHorizontal: 20, color: colors.medium_gray }}>
						Görünmezken, eşleşme ekranında görünmeyeceksin. Eşleşmelerinle dorm'dan konuşmaya ve
						etkinlik incelemeye devam edebilirsin.
					</Text>
				</View>

				<View style={{ paddingBottom: 16 }}>
					<View style={[styles.buttonContainer, {}]}>
						<Text style={styles.buttonText}>Kampüs Hayaleti</Text>
						<Switch
							value={campusGhost ? 1 : -1}
							onValueChange={(value) => {
								handleCampusGhost(value);
							}}
						/>
					</View>
					<Text style={{ paddingHorizontal: 20, color: colors.medium_gray }}>
						Bu ayarı açtığında üniversitendeki diğer kullanıcılar seni göremeyecek, sen de onları
						göremeyeceksin.
					</Text>
				</View>

				<View style={{ paddingBottom: 16 }}>
					<View style={[styles.buttonContainer, {}]}>
						<Text style={styles.buttonText}>Canım Okulum</Text>
						<Switch
							value={schoolLover ? 1 : -1}
							onValueChange={(value) => {
								handleSchoolLover(value);
							}}
						/>
					</View>
					<Text style={{ paddingHorizontal: 20, color: colors.medium_gray }}>
						Bu ayarı açtığında sadece okuduğun üniversitedeki kullanıcıları göreceksin.
					</Text>
				</View>
				<View style={{ width: "100%", height: 1, backgroundColor: "#DADADA" }} />

				{/* <View style={styles.buttonContainer}>
					<Text style={{ fontSize: 20, fontFamily: "PoppinsSemiBold", color: "#333333" }}>
						Bildirimler
					</Text>
				</View>

				<View style={{ paddingBottom: 16 }}>
					<View style={[styles.buttonContainer, {}]}>
						<Text style={styles.buttonText}>E-Posta</Text>
						<Switch
							value={email ? 1 : -1}
							onValueChange={(value) => {
								handleEmail(value);
							}}
						/>
					</View>
					<Text style={{ paddingHorizontal: 20, color: colors.medium_gray }}>
						Yeni eşleşmeler, mesajlar, super like'lar
					</Text>
				</View>

				<View style={{ paddingBottom: 16 }}>
					<View style={[styles.buttonContainer, {}]}>
						<Text style={styles.buttonText}>Anlık Bildirimler</Text>
						<Switch
							value={pushNotifications ? 1 : -1}
							onValueChange={(value) => {
								handlePushNotifications(value);
							}}
						/>
					</View>
					<Text style={{ paddingHorizontal: 20, color: colors.medium_gray }}>
						Yeni eşleşmeler, mesajlar, super like'lar, ipuçları, etkinlik anımsatıcısı
					</Text>
				</View>

				<View style={{ width: "100%", height: 1, backgroundColor: "#DADADA" }} /> */}

				<TouchableOpacity style={styles.buttonContainer}>
					<Text style={styles.buttonText}>Yardım ve Destek</Text>
					<Feather name="chevron-right" size={20} color="#4A4A4A" />
				</TouchableOpacity>

				<TouchableOpacity
					onPress={() => {
						Linking.openURL("mailto:support@meetdorm.com");
					}}
					style={{ paddingBottom: 16 }}
				>
					<View style={[styles.buttonContainer, {}]}>
						<Text style={styles.buttonText}>Bize Ulaş</Text>
						<Feather name="chevron-down" size={20} color="#4A4A4A" />
					</View>
					<Text style={{ paddingHorizontal: 20, color: colors.medium_gray }}>
						İlişki tavsiyesi, yanlış giden bir şeyler ya da sadece selam vermek… İstediğin her şey
						için bize ulaşabilirsin! {"\n"}{" "}
						<Text style={{ color: "blue" }}>support@meetdorm.com</Text>
					</Text>
				</TouchableOpacity>

				<TouchableOpacity style={styles.buttonContainer}>
					<Text style={styles.buttonText}>Topluluk Kuralları</Text>
					<Feather name="chevron-right" size={20} color="#4A4A4A" />
				</TouchableOpacity>

				<TouchableOpacity style={styles.buttonContainer}>
					<Text style={styles.buttonText}>Güvenlik İpuçları</Text>
					<Feather name="chevron-right" size={20} color="#4A4A4A" />
				</TouchableOpacity>

				<View style={{ width: "100%", height: 1, backgroundColor: "#DADADA" }} />

				<View style={styles.buttonContainer}>
					<Text style={{ fontSize: 20, fontFamily: "PoppinsSemiBold", color: "#333333" }}>
						Yasal
					</Text>
				</View>

				<TouchableOpacity style={styles.buttonContainer}>
					<Text style={styles.buttonText}>Gizlilik Tercihleri</Text>
					<Feather name="chevron-right" size={20} color="#4A4A4A" />
				</TouchableOpacity>

				<TouchableOpacity
					style={styles.buttonContainer}
					onPress={() => {
						navigation.navigate("MahremiyetPolitikasi");
					}}
				>
					<Text style={styles.buttonText}>Mahremiyet Politikası</Text>
					<Feather name="chevron-right" size={20} color="#4A4A4A" />
				</TouchableOpacity>

				<TouchableOpacity
					style={styles.buttonContainer}
					onPress={() => {
						navigation.navigate("KullaniciSozlesmesi");
					}}
				>
					<Text style={styles.buttonText}>Kullanıcı Sözleşmesi</Text>
					<Feather name="chevron-right" size={20} color="#4A4A4A" />
				</TouchableOpacity>

				<TouchableOpacity
					style={styles.buttonContainer}
					onPress={() => {
						navigation.navigate("ToplulukKurallari");
					}}
				>
					<Text style={styles.buttonText}>Topluluk Kuralları</Text>
					<Feather name="chevron-right" size={20} color="#4A4A4A" />
				</TouchableOpacity>

				<TouchableOpacity style={styles.buttonContainer}>
					<Text style={styles.buttonText}>Lisanslar</Text>
					<Feather name="chevron-right" size={20} color="#4A4A4A" />
				</TouchableOpacity>

				<View style={{ width: "100%", height: 1, backgroundColor: "#DADADA" }} />

				<TouchableOpacity style={styles.buttonContainer} onPress={() => setSignoutModal(true)}>
					<Text style={[styles.buttonText, { color: colors.red }]}>Oturumu Kapat</Text>
					<Feather name="chevron-right" size={20} color={colors.red} />
				</TouchableOpacity>

				<TouchableOpacity
					style={styles.buttonContainer}
					onPress={() => setFreezeAccountModal(true)}
				>
					<Text style={[styles.buttonText, { color: colors.red }]}>Hesabımı Dondur</Text>
					<Feather name="chevron-right" size={20} color={colors.red} />
				</TouchableOpacity>

				<TouchableOpacity
					style={styles.buttonContainer}
					onPress={() => setDeleteAccountModal(true)}
					// onPress={() => {
					// 	Alert.alert("Üzgünüz", "Hesabını silme özelliği henüz mevcut değil :(", [
					// 		{ text: "tamamdır" },
					// 	]);
					// }}
				>
					<Text style={[styles.buttonText, { color: colors.red }]}>Hesabımı Sil</Text>
					<Feather name="chevron-right" size={20} color={colors.red} />
				</TouchableOpacity>
			</ScrollView>

			<SignOutModal
				visible={signoutModal}
				dismiss={() => setSignoutModal(false)}
				signOut={signOut}
			/>

			<FreezeAccountModal
				signOut={signOut}
				visible={freezeAccountModal}
				dismiss={() => setFreezeAccountModal(false)}
				sesToken={sesToken}
				userId={userId}
				beInvisible={() => {
					handleInvisibility(true);
				}}
			/>
			<DeleteAccountModal
				visible={deleteAccountModal}
				dismiss={() => setDeleteAccountModal(false)}
				showFreezeAccountModal={() => setFreezeAccountModal(true)}
				signOut={signOut}
				sesToken={sesToken}
				userId={userId}
			/>

			{/* <CustomModal
				visible={superdormerModal}
				dismiss={() => {
					setSuperdormerModal(false);
				}}
			>
				PART: TODO:: make subscription selection part button
				<View
					style={{
						aspectRatio: 1 / 2,
						maxHeight: height * 0.9,
						width: width * 0.9,
						backgroundColor: colors.white,
						borderRadius: 10,
						alignItems: "center",
						paddingVertical: 30,
						paddingHorizontal: 36,
					}}
				>
					<TouchableOpacity
						onPress={() => {
							setSuperdormerModal(false);
						}}
						style={{
							position: "absolute",
							alignSelf: "flex-end",
							padding: 16,
						}}
					>
						<Feather name="x" size={32} color={colors.medium_gray} />
					</TouchableOpacity>
					<GradientText text={"Superdormer"} style={{ fontSize: 36, fontFamily: "PoppinsSemiBold" }} />
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
								alignItems: "center",
								marginVertical: 10,
							}}
						>
							<Image
								source={require("../assets/SuperDormerPopup/card.png")}
								style={{ maxWidth: 30, aspectRatio: 1 }}
								resizeMode={"contain"}
							/>
							<View style={{ paddingLeft: 20 }}>
								<Text style={{ color: colors.dark_gray, fontSize: 18, fontWeight: "600" }}>
									Sınırsız Beğenme
								</Text>
								<Text style={{ color: colors.medium_gray, fontSize: 15, fontWeight: "normal" }}>
									İstediğin kadar profili kaydır
								</Text>
							</View>
						</View>
						<View
							style={{
								flexDirection: "row",
								width: "100%",
								alignItems: "center",
								marginVertical: 10,
							}}
						>
							<Image
								source={require("../assets/SuperDormerPopup/spark.png")}
								style={{ maxWidth: 30, aspectRatio: 1 / 1 }}
								resizeMode={"contain"}
							/>
							<View style={{ paddingLeft: 20 }}>
								<Text style={{ color: colors.dark_gray, fontSize: 18, fontWeight: "600" }}>
									Günde 5 Kıvılcım
								</Text>
								<Text
									style={{
										color: colors.medium_gray,
										fontSize: 15,
										fontWeight: "normal",
									}}
								>
									Beğendiğin kişilere kendini gösterme{"\n"}şansını kaçırma
								</Text>
							</View>
						</View>
						<View
							style={{
								flexDirection: "row",
								width: "100%",
								alignItems: "center",
								marginVertical: 10,
							}}
						>
							<Image
								source={require("../assets/SuperDormerPopup/university.png")}
								style={{ maxWidth: 30, aspectRatio: 1 }}
								resizeMode={"contain"}
							/>
							<View style={{ paddingLeft: 20 }}>
								<Text style={{ color: colors.dark_gray, fontSize: 18, fontWeight: "600" }}>
									Üniversite Filtresi
								</Text>
								<Text style={{ color: colors.medium_gray, fontSize: 15, fontWeight: "normal" }}>
									İstediğin üniversiteden insanlarla eşleş
								</Text>
							</View>
						</View>
					</View>

					<Animated.View
						style={{
							width: "100%",
							marginTop: 30,
							height: 80,
							borderRadius: 12,
							borderWidth: 1,
							borderColor: colors.cool_gray,
							flexDirection: "row",
							alignItems: "center",
							paddingHorizontal: 16,
							justifyContent: "space-between",
						}}
					>
						<View>
							<Text style={{ fontSize: 18, fontFamily: "PoppinsSemiBold", color: colors.dark_gray }}>
								1 Aylık Üyelik
							</Text>
							<Text style={{ fontSize: 15, fontWeight: "normal", color: colors.medium_gray }}>
								Denemen İçin Başlangıç
							</Text>
						</View>
						<View>
							<Text style={{ fontSize: 30, fontFamily: "PoppinsSemiBold", color: colors.dark_gray }}>
								{Math.floor(oneMonthPrice)}
								<Text style={{ fontSize: 16, fontFamily: "PoppinsSemiBold", color: colors.dark_gray }}>
									{oneMonthPrice % 1 == 0 ? "" : "." + Math.round((oneMonthPrice * 100) % 100)}
								</Text>
								<Text style={{ fontSize: 16, fontWeight: "normal", color: colors.dark_gray }}>
									₺
								</Text>
								<Text style={{ fontSize: 16, fontWeight: "normal", color: colors.medium_gray }}>
									/Aylık
								</Text>
							</Text>
						</View>
					</Animated.View>
					<Animated.View
						style={{
							width: "100%",
							marginTop: 16,
							height: 80,
							borderRadius: 12,
							borderWidth: 1,
							borderColor: colors.cool_gray,
							flexDirection: "row",
							alignItems: "center",
							paddingHorizontal: 16,
							justifyContent: "space-between",
						}}
					>
						<View
							style={{
								position: "absolute",
								justifyContent: "center",
								alignItems: "center",
								top: -10,
								right: -10,
							}}
						>
							<Image
								source={require("../assets/SuperDormerPopup/star.png")}
								resizeMode={"contain"}
								style={{ height: 40, aspectRatio: 1 }}
							/>
							<Text
								style={{
									position: "absolute",
									textAlign: "center",
									color: colors.white,
									fontSize: 10,
									transform: [{ rotateZ: "15deg" }],
								}}
							>
								En{"\n"}Polüler
							</Text>
						</View>
						<View>
							<Text style={{ fontSize: 18, fontFamily: "PoppinsSemiBold", color: colors.dark_gray }}>
								3 Aylık Üyelik
							</Text>
							<Text style={{ fontSize: 15, fontWeight: "normal", color: colors.medium_gray }}>
								%15 indirimden yararlanırsın
							</Text>
						</View>
						<View>
							<Text style={{ fontSize: 30, fontFamily: "PoppinsSemiBold", color: colors.dark_gray }}>
								{Math.floor(threeMonthPrice)}
								<Text style={{ fontSize: 16, fontFamily: "PoppinsSemiBold", color: colors.dark_gray }}>
									{threeMonthPrice % 1 == 0 ? "" : "." + Math.round((threeMonthPrice * 100) % 100)}
								</Text>
								<Text style={{ fontSize: 16, fontWeight: "normal", color: colors.dark_gray }}>
									₺
								</Text>
								<Text style={{ fontSize: 16, fontWeight: "normal", color: colors.medium_gray }}>
									/Aylık
								</Text>
							</Text>
						</View>
					</Animated.View>
					<Animated.View
						style={{
							width: "100%",
							marginTop: 16,
							height: 80,
							borderRadius: 12,
							borderWidth: 1,
							borderColor: colors.cool_gray,
							flexDirection: "row",
							alignItems: "center",
							paddingHorizontal: 16,
							justifyContent: "space-between",
						}}
					>
						<View>
							<Text style={{ fontSize: 18, fontFamily: "PoppinsSemiBold", color: colors.dark_gray }}>
								6 Aylık Üyelik
							</Text>
							<Text style={{ fontSize: 15, fontWeight: "normal", color: colors.medium_gray }}>
								%40 indirimden yararlanırsın
							</Text>
						</View>
						<View>
							<Text style={{ fontSize: 30, fontFamily: "PoppinsSemiBold", color: colors.dark_gray }}>
								{Math.floor(sixMonthPrice)}
								<Text style={{ fontSize: 16, fontFamily: "PoppinsSemiBold", color: colors.dark_gray }}>
									{sixMonthPrice % 1 == 0 ? "" : "." + Math.round((sixMonthPrice * 100) % 100)}
								</Text>
								<Text style={{ fontSize: 16, fontWeight: "normal", color: colors.dark_gray }}>
									₺
								</Text>
								<Text style={{ fontSize: 16, fontWeight: "normal", color: colors.medium_gray }}>
									/Aylık
								</Text>
							</Text>
						</View>
					</Animated.View>

					<TouchableOpacity
						style={{
							width: "80%",
							height: 60,
							borderRadius: 12,
							overflow: "hidden",
							marginTop: 30,
						}}
					>
						<Gradient style={{ justifyContent: "center", alignItems: "center" }}>
							<Text style={{ color: colors.white, fontSize: 20, fontFamily: "PoppinsSemiBold" }}>
								Superdormer Ol
							</Text>
						</Gradient>
					</TouchableOpacity>
				</View>
			</CustomModal> */}
		</View>
	);
}

const styles = StyleSheet.create({
	header: {
		backgroundColor: colors.white,
		width: "100%",
		elevation: 20,
		flexDirection: "row",
		alignItems: "flex-end",
		paddingLeft: 10,
		paddingBottom: 10,
	},
	buttonContainer: {
		width: width,
		flexDirection: "row",
		justifyContent: "space-between",
		paddingVertical: 16,
		paddingHorizontal: 20,
		alignItems: "center",
	},
	buttonText: {
		fontSize: 20,
		color: "#4A4A4A",
		fontWeight: "600",
	},
});
