import { useContext, useEffect, useState } from "react";
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
	Alert,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
//import { manipulateAsync, SaveFormat } from "expo-image-manipulator";

import { Gradient, GradientText, colors } from "../../visualComponents/colors";
import commonStyles from "../../visualComponents/styles";
import { CustomModal } from "../../visualComponents/customComponents";
import url from "../../connection";
import crypto from "../../functions/crypto";
//import { Session } from "../../nonVisualComponents/SessionVariables";
import { AuthContext } from "../../contexts/auth.context";
import CustomImage from "../../components/custom-image.component";

const { width, height } = Dimensions.get("window");

const fetchImageFromUri = async (uri) => {
	const response = await fetch(uri);
	const blob = await response.blob();
	return blob;
};

const Photo = ({ index, photo, setToBeDeleted, setModalVisibility }) => {
	const PHOTO_HEIGHT = width * 0.715;
	const PHOTO_WIDTH = width * 0.5;

	return (
		<View key={index} style={[styles.photo]}>
			<CustomImage
				url={photo.PhotoLink}
				style={{ height: "100%", width: "100%", resizeMode: "cover" }}
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
	const { user, updateProfile } = useContext(AuthContext);

	const [modalVisible, setModalVisibility] = useState(false);
	const [toBeDeleted, setToBeDeleted] = useState(null);
	const [PHOTO_LIST, setPhotoList] = useState(user.Photo || []);
	const [isLoading, setIsLoading] = useState(false);

	const insets = useSafeAreaInsets();

	const { userId, sesToken } = user;

	useEffect(() => {
		let abortController = new AbortController();
		const backAction = () => {
			handleBackButton();
			return true;
		};

		const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);

		return () => {
			backHandler.remove();
			abortController.abort();
		};
	}, []);

	const handleDelete = async () => {
		//TODO: delete "toBeDeleted"

		if (PHOTO_LIST.length == 1) {
			Alert.alert("En az bir fotoğrafın kalmalı!!");
			return;
		}

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
			updateProfile({ Photo: filtered });

			const encryptedData = crypto.encrypt({
				photoName: toBeDeleted.PhotoLink.split("/")[3],
			});
			const response = await axios.post(url + "/profile/deleteS3Photo", encryptedData, {
				headers: { "access-token": sesToken },
			});
			console.log(response.data);
		}

		setPhotoList(filtered);
		setModalVisibility(false);
	};

	const pickImage = async () => {
		let { granted } = await ImagePicker.getMediaLibraryPermissionsAsync(false);
		if (!granted) {
			let answer = await ImagePicker.requestMediaLibraryPermissionsAsync(false);
			granted = answer.granted;
		}
		if (granted) {
			let result = await ImagePicker.launchImageLibraryAsync({
				mediaTypes: ImagePicker.MediaTypeOptions.Images,
				allowsEditing: true,
				aspect: [2, 3],
				quality: 0.16,
			});

			if (!result.cancelled && result != null) {
				// let resizedResult = await manipulateAsync(result.uri, [{ resize: { height: 1024 } }], {
				// 	compress: 0.4,
				// 	format: SaveFormat.JPEG,
				// });
				//handleAdd(resizedResult);
				handleAdd(result);
			}
		}
	};

	const handleAdd = async (photo) => {
		setPhotoList([
			...PHOTO_LIST,
			{
				Photo_Order: PHOTO_LIST.length + 1,
				PhotoLink: photo.uri,
				photo: photo,
			},
		]);
	};

	const handleBackButton = () => {
		navigation.goBack();
	};

	const handleSave = async () => {
		try {
			setIsLoading(true);
			const newList = await Promise.all(
				PHOTO_LIST.map(async (item, index) => {
					if (item?.photo ?? false) {
						const dataToBeSent = crypto.encrypt({ userId: userId });
						const returnVal = await axios
							.post(url + "/profile/SecurePhotoLink", dataToBeSent, {
								headers: { "access-token": sesToken },
							})
							.then(async (res) => {
								const uploadUrl = crypto.decrypt(res.data).url;
								const img = await fetchImageFromUri(item.PhotoLink);
								// const returned = await fetch(uploadUrl, {
								// 	method: "PUT",
								// 	body: item.photo,
								// 	headers: {
								// 		Accept: "application/json",
								// 		"Content-Type": "multipart/form-data",
								// 	},
								// })
								// const returned = await axios
								// 	.put(uploadUrl, img)
								const returned = await fetch(uploadUrl, {
									method: "PUT",
									body: img,
								})
									.then((res) => {
										if (res?.status?.toString() === "200" || res.ok) {
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
								console.log("error on secure photo link");
							});
						return returnVal;
					}
					return item;
				})
			);
			//console.log({ newList });
			const photoData = crypto.encrypt({
				userId: userId,
				photos: newList,
			});
			//console.log({ photoData });
			await axios
				.post(url + "/profile/addPhotoLink", photoData, { headers: { "access-token": sesToken } })
				.then(async (res) => {
					console.log(res.data);
					updateProfile({ Photo: newList });
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
		<View
			style={[commonStyles.Container, { paddingBottom: insets.bottom, paddingTop: insets.top }]}
		>
			<StatusBar style="dark" />
			<View
				name={"Header"}
				style={{
					flexDirection: "row",
					justifyContent: "space-between",
					alignItems: "center",
					width: "100%",
					marginTop: 10,
				}}
			>
				<View style={{ marginLeft: 20 }}>
					<TouchableOpacity onPress={handleBackButton}>
						<Feather
							name="arrow-left"
							size={height * 0.04}
							color={colors.gray}
							style={{ padding: 10, paddingTop: 0 }}
						/>
					</TouchableOpacity>
				</View>
				{/* <View style={{ flexDirection: "row", alignSelf: "center" }}> */}
				<TouchableOpacity onPress={handleSave}>
					<GradientText
						style={{
							fontSize: height * 0.03,
							letterSpacing: 1.2,
							marginRight: 20,
							fontFamily: "PoppinsSemiBold",
						}}
						text={"Kaydet"}
					/>
				</TouchableOpacity>
				{/* </View> */}
			</View>

			<View name={"Photos"} style={[styles.photoContainer, {}]}>
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
				{PHOTO_LIST.length == 2 && (
					<View style={[styles.photo, { backgroundColor: "transparent" }]} />
				)}
			</View>
			<View
				style={{
					flex: 1,
					justifyContent: "flex-end",
					position: "relative",
					paddingBottom: height * 0.02,
				}}
			>
				<Text style={{ fontSize: width * 0.035, color: colors.medium_gray }}>
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
					<TouchableOpacity
						onPress={() => {
							setModalVisibility(false);
						}}
						style={{ position: "absolute", right: 16, top: 10 }}
					>
						<Feather name="x" size={24} color="black" />
					</TouchableOpacity>
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
		flexDirection: "row",
		flexWrap: "wrap",
		justifyContent: "space-evenly",
	},
	photo: {
		marginVertical: height * 0.01,
		marginHorizontal: width * 0.03,
		height: Math.min(height * 0.315, width * 0.635),
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
