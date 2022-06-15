import React from "react";
import {
	Text,
	View,
	Image,
	Dimensions,
	Pressable,
	TouchableOpacity,
	Alert,
	ActivityIndicator,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { ScrollView } from "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import * as SecureStore from "expo-secure-store";
import { manipulateAsync, SaveFormat } from "expo-image-manipulator";

import commonStyles from "../../visualComponents/styles";
import { colors, GradientText, Gradient } from "../../visualComponents/colors";
import { CustomModal } from "../../visualComponents/customComponents";
import axios from "axios";
import { url } from "../../connection";

const { width, height } = Dimensions.get("screen");

export default function PhotoUpload({ navigation, route }) {
	const { UserId, sesToken } = route.params;
	const [initial, setInitial] = React.useState(true);
	const [isLoading, setIsLoading] = React.useState(false);

	const [photoList, setPhotoList] = React.useState([]);
	const [modalVisible, setModalVisibility] = React.useState(false);
	const [toBeDeleted, setToBeDeleted] = React.useState(false);

	const pickImage = async () => {
		const { granted } = await ImagePicker.getMediaLibraryPermissionsAsync(false);
		if (!granted) {
			const x = await ImagePicker.requestMediaLibraryPermissionsAsync(false);
		} else {
			let result = await ImagePicker.launchImageLibraryAsync({
				mediaTypes: ImagePicker.MediaTypeOptions.Images,
				allowsEditing: true,
				aspect: [2, 3],
				quality: 0.2,
			});
			let resizedResult = await manipulateAsync(result.uri, [{ resize: { height: 1024 } }], {
				compress: 0.2,
				format: SaveFormat.JPEG,
			});
			if (!result.cancelled) {
				handleAdd(resizedResult);
			}
		}
	};

	const handleAdd = (photo) => {
		setPhotoList([
			...photoList,
			{
				Photo_Order: photoList.length + 1,
				PhotoLink: photo.uri,
				photo: photo,
			},
		]);
	};

	const handleDelete = () => {
		const filtered = [];
		for (let item of photoList) {
			if (item.Photo_Order != toBeDeleted.Photo_Order) {
				if (item.Photo_Order > toBeDeleted.Photo_Order) {
					filtered.push({ ...item, Photo_Order: item.Photo_Order - 1 });
				} else {
					filtered.push(item);
				}
			}
		}

		setPhotoList(filtered);
		setModalVisibility(false);
	};

	const handleSave = async () => {
		try {
			if (photoList.length == 0) {
				Alert.alert("Hata!", "En az bir fotoğraf yüklemelisin", [{ text: "Kontrol Edeyim" }]);
				return;
			}
			setIsLoading(true);
			const newList = await Promise.all(
				photoList.map(async (item, index) => {
					if (item?.photo ?? false) {
						const returnVal = await axios
							.post(
								url + "/SecurePhotoLink",
								{ userId: UserId },
								{ headers: { "access-token": sesToken } }
							)
							.then(async (res) => {
								const uploadUrl = res.data.url;
								const returned = await fetch(uploadUrl, {
									method: "PUT",
									body: item.photo,
									headers: {
										Accept: "application/json",
										"Content-Type": "multipart/form-data",
									},
								})
									.then((res) => {
										if (res.ok) {
											const photoLink = uploadUrl.split("?")[0];

											return {
												Photo_Order: item.Photo_Order,
												PhotoLink: photoLink,
											};
										} else {
											console.log("ERROR UPLOADING IMAGE");
										}
									})
									.catch((err) => {
										console.log(err);
									});
								return returned;
							})
							.catch((error) => {
								console.log({ error });
							});
						return returnVal;
					}
					return item;
				})
			);
			await axios
				.post(
					url + "/addPhotoLink",
					{
						UserId: UserId,
						userPhoto: 1,
						photos: newList,
					},
					{ headers: { "access-token": sesToken } }
				)
				.then(async (res) => {
					setPhotoList(newList);

					const storedValue = JSON.stringify({
						Photo: newList,
					});
					setIsLoading(false);

					await SecureStore.setItemAsync("userData", storedValue);
					navigation.replace("AfterRegister", {
						profile: route.params,
					});
				})
				.catch((err) => {
					console.log(err);
				});
		} catch (err) {
			console.log("ERROR SAVING: ", err);
			setIsLoading(false);
		}
	};

	return (
		<View style={commonStyles.Container}>
			<StatusBar style="dark" />
			{initial ? (
				<View
					style={{
						width: "100%",
						height: "100%",
						justifyContent: "flex-end",
						alignItems: "center",
					}}
					onLayout={() => {
						setTimeout(() => {
							setInitial(false);
						}, 2000);
					}}
				>
					<GradientText
						text={"Kaydın tamam!"}
						style={{ fontSize: width * 0.08, fontFamily: "NowBold", letterSpacing: 1.2 }}
					/>
					<Image
						source={require("../../assets/RegisterationComplete.png")}
						style={{
							marginTop: height * 0.05,
							height: height * 0.4,
							aspectRatio: 1,
						}}
						resizeMode={"contain"}
					/>
				</View>
			) : (
				<View style={{ width: "100%", height: "100%", alignItems: "center" }}>
					<View
						style={[commonStyles.Header, { paddingHorizontal: 30, justifyContent: "flex-end" }]}
					>
						<TouchableOpacity onPress={handleSave}>
							<Text style={{ color: colors.medium_gray, fontSize: 18 }}>İleri</Text>
						</TouchableOpacity>
					</View>
					<View style={{ paddingHorizontal: width * 0.1, marginTop: 20, width: "100%" }}>
						<GradientText
							text={"En güzel fotoğraflarım"}
							style={{ fontSize: Math.min(height * 0.032, width * 0.06), fontFamily: "NowBold" }}
						/>
						<Text
							style={{
								fontSize: Math.min(height * 0.02, width * 0.0375),
								color: colors.medium_gray,
								marginTop: 5,
								letterSpacing: 0.5,
							}}
						>
							Kendi fotoğraflarını ekle, görmek istediğimiz kişi sensin. :)
						</Text>
					</View>
					<View style={{ width: "100%", alignItems: "center" }}>
						<ScrollView
							horizontal={true}
							showsHorizontalScrollIndicator={false}
							style={{ marginTop: 20 }}
							// snapToInterval={width * 0.8 + 30}
						>
							{photoList.map((item, index) => {
								return (
									<View key={index} style={{ height: "100%" }}>
										<View
											style={[
												commonStyles.photo,
												{
													height: Math.min(width * 1.35, height * 0.6),
													marginHorizontal: 20,
													elevation: 0,
												},
											]}
										>
											<Image
												source={{ uri: item.PhotoLink }}
												style={{ height: "100%", width: "100%" }}
												resizeMode="cover"
											/>
											<View
												style={{
													height: "100%",
													width: "100%",
													position: "absolute",
													alignItems: "flex-end",
													// padding: 10,
												}}
											>
												<Pressable
													onPress={() => {
														setToBeDeleted(item);
														setModalVisibility(true);
													}}
													style={{
														position: "absolute",
														alignItems: "center",
														justifyContent: "center",
														padding: 10,
													}}
												>
													<Feather name="trash" size={24} color={colors.gray} />
												</Pressable>
											</View>
										</View>
									</View>
								);
							})}
							{photoList.length < 4 && (
								<Pressable onPress={pickImage} style={{ elevation: 0 }}>
									<View
										style={[
											commonStyles.photo,
											{
												height: Math.min(width * 1.35, height * 0.6),
												elevation: 0,
											},
										]}
									>
										<Feather name="plus" size={width / 8} color={colors.gray} />
									</View>
								</Pressable>
							)}
						</ScrollView>
					</View>
				</View>
			)}
			{isLoading && (
				<View
					style={[
						commonStyles.Container,
						{
							position: "absolute",
							justifyContent: "center",
							backgroundColor: "rgba(128,128,128,0.5)",
						},
					]}
				>
					<ActivityIndicator animating={true} color={"rgba(100, 60, 248, 1)"} size={"large"} />
				</View>
			)}

			<CustomModal
				visible={modalVisible}
				transparent={true}
				dismiss={() => {
					setModalVisibility(false);
				}}
				animationType={"fade"}
			>
				<View
					style={{
						paddingHorizontal: 23,
						borderRadius: 20,
						backgroundColor: colors.white,
						width: width * 0.8,
						aspectRatio: 1 / 1,
						alignItems: "center",
						justifyContent: "center",
						shadowColor: "#000",
						shadowOffset: {
							width: 0,
							height: 2,
						},
						shadowOpacity: 0.25,
						shadowRadius: 4,
						elevation: 5,
					}}
				>
					<Image source={require("../../assets/sadFace.png")} />
					<Text
						style={{
							color: colors.dark_gray,
							fontSize: width * 0.042,
							fontWeight: "500",
							marginTop: 10,
							textAlign: "center",
						}}
					>
						Fotoğrafını profilinden kaldırmak üzeresin. Emin misin?{"\n"}
						{"\n"}Tabii tekrar galerinden ekleyebilirsin
					</Text>
					<TouchableOpacity
						style={{
							width: "90%",
							height: width * 0.15,
							borderRadius: width * 0.03,
							marginTop: 25,
							overflow: "hidden",
						}}
						onPress={handleDelete}
					>
						<Gradient
							style={{
								width: "100%",
								height: "100%",
							}}
						>
							<View
								style={{
									flex: 1,
									justifyContent: "center",
									alignItems: "center",
								}}
							>
								<Text
									style={{
										fontSize: 25,
										color: colors.white,
										fontWeight: "700",
									}}
								>
									Fotoğrafı Sil
								</Text>
							</View>
						</Gradient>
					</TouchableOpacity>
				</View>
			</CustomModal>
		</View>
	);
}
