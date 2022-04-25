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

import commonStyles from "../../visualComponents/styles";
import { colors, GradientText } from "../../visualComponents/colors";
import axios from "axios";
import { url } from "../../connection";

const { width, height } = Dimensions.get("screen");

export default function PhotoUpload({ navigation, route }) {
	const { UserId, sesToken } = route.params;

	const [photoList, setPhotoList] = React.useState([]);
	const [isLoading, setIsLoading] = React.useState(false);

	const pickImage = async () => {
		const { granted } = await ImagePicker.getMediaLibraryPermissionsAsync(false);
		if (!granted) {
			const x = await ImagePicker.requestMediaLibraryPermissionsAsync(false);
		} else {
			let result = await ImagePicker.launchImageLibraryAsync({
				mediaTypes: ImagePicker.MediaTypeOptions.Images,
				allowsEditing: true,
				aspect: [2, 3],
				quality: 0.3,
			});
			if (!result.cancelled) {
				handleAdd(result);
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
		//TODO: delete "toBeDeleted"
		const filtered = [];
		for (item of photoList) {
			if (item.Photo_Order != toBeDeleted.Photo_Order) {
				if (item.Photo_Order > toBeDeleted.Photo_Order) {
					filtered.push({ ...item, Photo_Order: item.Photo_Order - 1 });
				} else {
					filtered.push(item);
				}
			}
		}
		console.log(filtered);
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
							.get(url + "/SecurePhotoLink", { headers: { "access-token": sesToken } })
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
					// setPhotoList(newList);

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
			<View style={[commonStyles.Header, { paddingHorizontal: 30, justifyContent: "flex-end" }]}>
				<TouchableOpacity onPress={handleSave}>
					<Text style={{ color: colors.medium_gray, fontSize: 18 }}>İleri</Text>
				</TouchableOpacity>
			</View>
			<View style={{ paddingHorizontal: 30, marginTop: 20 }}>
				<GradientText
					text={"En güzel fotoğraflarım"}
					style={{ fontSize: 30, fontFamily: "NowBold" }}
				/>
				<Text
					style={{
						fontSize: 18,
						color: colors.medium_gray,
						marginTop: 20,
						lineHeight: 27,
						letterSpacing: 0.5,
					}}
				>
					Kendi fotoğraflarını ekle, görmek{"\n"}istediğimiz kişi sensin. :{")"}
				</Text>
			</View>
			<View style={{ height: "100%", width: "100%", alignItems: "center" }}>
				<ScrollView
					horizontal={true}
					showsHorizontalScrollIndicator={false}
					style={{ height: "100%", marginTop: 20 }}
					// snapToInterval={width * 0.8 + 30}
				>
					{photoList.map((item, index) => {
						return (
							<View key={index} style={{ height: "100%" }}>
								<View
									style={[
										commonStyles.photo,
										{
											width: width * 0.8,
											maxHeight: "90%",
											marginHorizontal: 20,
										},
									]}
								>
									<Image
										source={{ uri: item.PhotoLink }}
										style={{ height: "100%", width: "100%" }}
										resizeMode="cover"
									/>
								</View>
							</View>
						);
					})}
					{photoList.length < 4 && (
						<Pressable onPress={pickImage} style={{ height: "100%" }}>
							<View
								style={[
									commonStyles.photo,
									{
										width: width * 0.8,
										maxHeight: "90%",
									},
								]}
							>
								<Feather name="plus" size={width / 8} color={colors.gray} />
							</View>
						</Pressable>
					)}
				</ScrollView>
			</View>
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
		</View>
	);
}
