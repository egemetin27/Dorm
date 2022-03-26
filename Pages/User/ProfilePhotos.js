import React from "react";
import {
	StyleSheet,
	View,
	TouchableOpacity,
	Dimensions,
	Pressable,
	Image,
	Text,
	ActivityIndicator,
	BackHandler,
} from "react-native";
import { Feather, FontAwesome5 } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { StatusBar } from "expo-status-bar";

import { Gradient, GradientText, colors } from "../../visualComponents/colors";
import commonStyles from "../../visualComponents/styles";
import { CustomModal } from "../../visualComponents/customComponents";
import { url } from "../../connection";

const { width, height } = Dimensions.get("window");

const Photo = ({ index, photo, setToBeDeleted, setModalVisibility }) => {
	const PHOTO_HEIGHT = width * 0.715;
	const PHOTO_WIDTH = width * 0.5;

	return (
		<View key={index} style={[styles.photo]}>
			<Image
				style={{ height: "100%", width: "100%" }}
				resizeMode="contain"
				source={{ uri: photo.PhotoLink }}
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
						setToBeDeleted(photo);
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
	);
};

export default function ProfilePhotos({ route, navigation }) {
	const [modalVisible, setModalVisibility] = React.useState(false);
	const [toBeDeleted, setToBeDeleted] = React.useState(null);
	const [PHOTO_LIST, setPhotoList] = React.useState(route.params?.photoList || []);
	const [isLoading, setIsLoading] = React.useState(false);

	const { userID, sesToken } = route.params;

	React.useEffect(() => {
		const backAction = () => {
			handleSave();
			return true;
		};

		const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);

		return () => backHandler.remove();
	}, []);

	const handleDelete = async () => {
		//TODO: delete "toBeDeleted"
		const filtered = [];
		for (const item of PHOTO_LIST) {
			if (item.Photo_Order != toBeDeleted.Photo_Order) {
				if (item.Photo_Order > toBeDeleted.Photo_Order) {
					filtered.push({ ...item, Photo_Order: item.Photo_Order - 1 });
				} else {
					filtered.push(item);
				}
			}
		}

		if (toBeDeleted?.photo == undefined) {
			const dataStr = await SecureStore.getItemAsync("userData");
			const userData = JSON.parse(dataStr);
			const storedValue = JSON.stringify({
				...userData,
				Photo: filtered,
			});
			await SecureStore.setItemAsync("userData", storedValue);

			const response = await axios.post(
				url + "/deleteS3Photo",
				{
					photoName: toBeDeleted.PhotoLink.split("/")[3],
				},
				{ headers: { "access-token": sesToken } }
			);
			console.log(response.data);
		}

		setPhotoList(filtered);
		setModalVisibility(false);
	};

	const pickImage = async () => {
		const { granted } = await ImagePicker.getMediaLibraryPermissionsAsync(false);
		if (!granted) {
			await ImagePicker.requestMediaLibraryPermissionsAsync(false);
		} else {
			let result = await ImagePicker.launchImageLibraryAsync({
				mediaTypes: ImagePicker.MediaTypeOptions.Images,
				allowsEditing: true,
				aspect: [2, 3],
				quality: 1,
			});
			if (!result.cancelled) {
				handleAdd(result);
			}
		}
	};

	const handleAdd = (photo) => {
		setPhotoList([
			...PHOTO_LIST,
			{
				Photo_Order: PHOTO_LIST.length + 1,
				PhotoLink: photo.uri,
				photo: photo,
			},
		]);
	};

	const handleSave = async () => {
		try {
			setIsLoading(true);
			const newList = await Promise.all(
				PHOTO_LIST.map(async (item, index) => {
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
						UserId: userID,
						userPhoto: 1,
						photos: newList,
					},
					{ headers: { "access-token": sesToken } }
				)
				.then(async (res) => {
					// setPhotoList(newList);

					const dataStr = await SecureStore.getItemAsync("userData");
					const userData = JSON.parse(dataStr);
					const storedValue = JSON.stringify({
						...userData,
						Photo: newList,
					});
					await SecureStore.setItemAsync("userData", storedValue);
					setIsLoading(false);
					navigation.replace("MainScreen", {
						screen: "Profile",
						photoList: newList,
					});
				})
				.catch((err) => {
					console.log(err);
				});
		} catch (err) {
			console.log("ERROR SAVING: ", err);
		}
	};

	return (
		<View style={commonStyles.Container}>
			<StatusBar style="dark" />
			<View name={"Header"} style={commonStyles.Header}>
				<View style={{ marginLeft: 20 }}>
					<TouchableOpacity onPress={handleSave}>
						<Feather name="arrow-left" size={30} color={colors.gray} style={{ paddingLeft: 15 }} />
					</TouchableOpacity>
				</View>
				<View style={{ flexDirection: "row", alignSelf: "center" }}>
					<TouchableOpacity onPress={handleSave}>
						<GradientText
							style={{ fontSize: 25, letterSpacing: 1.2, paddingRight: 15 }}
							text={"Kaydet"}
						/>
					</TouchableOpacity>
				</View>
			</View>

			<View
				name={"Photos"}
				style={[styles.photoContainer, { flexDirection: "row", flexWrap: "wrap" }]}
			>
				{PHOTO_LIST.map((item, index) => (
					<Photo
						key={index}
						index={index}
						photo={item}
						setToBeDeleted={setToBeDeleted}
						setModalVisibility={setModalVisibility}
					/>
				))}
				{PHOTO_LIST.length < 4 && (
					<Pressable onPress={pickImage}>
						<View style={[styles.photo]}>
							<Feather name="plus" size={width / 8} color={colors.gray} />
						</View>
					</Pressable>
				)}
			</View>
			<View
				style={{
					position: "relative",
				}}
			>
				<Text style={{ fontSize: width * 0.04, color: colors.medium_gray }}>
					En sevdiğin fotoğraflarından 4 tane seçebilirsin
				</Text>
			</View>

			<CustomModal
				visible={modalVisible}
				transparent={true}
				dismiss={() => {
					setModalVisibility(false);
				}}
				animationType={"fade"}
			>
				<View style={styles.modalContainer}>
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
					<TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
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

const styles = StyleSheet.create({
	photoContainer: {
		marginTop: 20,
		width: "100%",
		height: width * 1.55,
	},
	photo: {
		marginVertical: height * 0.02,
		marginHorizontal: width * 0.025,
		width: width * 0.45,
		aspectRatio: 1 / 1.5,
		backgroundColor: colors.white,
		borderRadius: 20,
		alignItems: "center",
		justifyContent: "center",
		overflow: "hidden",
		elevation: 0,
		zIndex: 0,
	},
	modalContainer: {
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
	},
	deleteButton: {
		width: "90%",
		height: width * 0.15,
		borderRadius: width * 0.03,
		marginTop: 25,
		overflow: "hidden",
	},
});
