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
	Alert,
} from "react-native";
import { Feather, FontAwesome5 } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { StatusBar } from "expo-status-bar";

import { GestureDetector, Gesture, FlatList } from "react-native-gesture-handler";
import Animated, {
	Extrapolate,
	interpolate,
	runOnJS,
	useAnimatedReaction,
	useAnimatedStyle,
	useSharedValue,
	withDelay,
	withSpring,
	withTiming,
} from "react-native-reanimated";

import { Gradient, GradientText, colors } from "../visualComponents/colors";
import commonStyles from "../visualComponents/styles";
import { CustomModal } from "../visualComponents/customComponents";

const { width, height } = Dimensions.get("window");

const Photo = ({ index, photo, setToBeDeleted, setModalVisibility, list }) => {
	const PHOTO_HEIGHT = width * 0.715;
	const PHOTO_WIDTH = width * 0.5;

	const initialPosition = useSharedValue({ x: 0, y: 0 });
	const xTrans = useSharedValue(0);
	const yTrans = useSharedValue(0);
	const isActive = useSharedValue(false);

	// const myGesture = Gesture.Simultaneous()

	const myGesture = React.useMemo(
		() =>
			Gesture.Pan()
				.onStart((event) => {
					isActive.value = true;
					initialPosition.value = { x: xTrans.value, y: yTrans.value };
				})
				.onUpdate((event) => {
					xTrans.value = event.translationX + initialPosition.value.x;
					yTrans.value = event.translationY + initialPosition.value.y;
				})
				.onEnd((event) => {
					// xTrans.value = withTiming(0);
					// yTrans.value = withTiming(0);
				})
				.onFinalize((event) => {
					isActive.value = false;
				}),
		[]
	);

	const animatedStyle = useAnimatedStyle(() => {
		return {
			zIndex: isActive.value ? 100 : withTiming(1),
			transform: [
				{ translateX: xTrans.value },
				{ translateY: yTrans.value },
				{ scale: isActive.value ? withTiming(1.1, { duration: 100 }) : 1 },
			],
		};
	});

	// marginVertical: height * 0.01,
	// marginHorizontal: width * 0.03,
	// height: Math.min(height * 0.35, width * 0.66),
	// aspectRatio: 1 / 1.5,

	return (
		<GestureDetector gesture={myGesture}>
			<Animated.View key={index} style={[styles.photo, animatedStyle]}>
				<Image
					style={{ height: "100%", width: "100%" }}
					resizeMode="cover"
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
			</Animated.View>
		</GestureDetector>
	);
};

const myList = [
	{
		PhotoLink:
			"file:///data/user/0/host.exp.exponent/cache/ExperienceData/%2540dorm%252FDorm/ImagePicker/18e1f3a1-a289-4725-9be6-e3badf41eeec.jpg",
		Photo_Order: 2,
		photo: {
			cancelled: false,
			height: 1731,
			type: "image",
			uri: "file:///data/user/0/host.exp.exponent/cache/ExperienceData/%2540dorm%252FDorm/ImagePicker/18e1f3a1-a289-4725-9be6-e3badf41eeec.jpg",
			width: 1154,
		},
	},
	{
		PhotoLink:
			"file:///data/user/0/host.exp.exponent/cache/ExperienceData/%2540dorm%252FDorm/ImagePicker/dd002285-be78-400d-bc87-d2d99d1a40e0.jpg",
		Photo_Order: 3,
		photo: {
			cancelled: false,
			height: 1024,
			type: "image",
			uri: "file:///data/user/0/host.exp.exponent/cache/ExperienceData/%2540dorm%252FDorm/ImagePicker/dd002285-be78-400d-bc87-d2d99d1a40e0.jpg",
			width: 682,
		},
	},
	{
		PhotoLink:
			"file:///data/user/0/host.exp.exponent/cache/ExperienceData/%2540dorm%252FDorm/ImagePicker/471d25ba-5b60-48c8-a55c-472f0645b06c.jpg",
		Photo_Order: 4,
		photo: {
			cancelled: false,
			height: 1728,
			type: "image",
			uri: "file:///data/user/0/host.exp.exponent/cache/ExperienceData/%2540dorm%252FDorm/ImagePicker/471d25ba-5b60-48c8-a55c-472f0645b06c.jpg",
			width: 1152,
		},
	},
];

export default function ProfilePhotos({ route, navigation }) {
	const [modalVisible, setModalVisibility] = React.useState(false);
	const [toBeDeleted, setToBeDeleted] = React.useState(null);
	const [PHOTO_LIST, setPhotoList] = React.useState(myList);
	const [isLoading, setIsLoading] = React.useState(false);
	const photoListShared = useSharedValue(myList);

	// const { sesToken } = route.params;

	const handleDelete = async () => {
		//TODO: delete "toBeDeleted"
		// if (PHOTO_LIST.length == 1) {
		// 	Alert.alert("En az bir fotoğrafın kalmalı!!");
		// 	return;
		// }
		// const filtered = [];
		// for (const item of PHOTO_LIST) {
		// 	if (item.Photo_Order != toBeDeleted.Photo_Order) {
		// 		if (item.Photo_Order > toBeDeleted.Photo_Order) {
		// 			filtered.push({ ...item, Photo_Order: item.Photo_Order - 1 });
		// 		} else {
		// 			filtered.push(item);
		// 		}
		// 	}
		// }
		// if (toBeDeleted?.photo == undefined) {
		// 	const dataStr = await SecureStore.getItemAsync("userData");
		// 	const userData = JSON.parse(dataStr);
		// 	const storedValue = JSON.stringify({
		// 		...userData,
		// 		Photo: filtered,
		// 	});
		// 	await SecureStore.setItemAsync("userData", storedValue);
		// 	const response = await axios.post(
		// 		url + "/deleteS3Photo",
		// 		{
		// 			photoName: toBeDeleted.PhotoLink.split("/")[3],
		// 		},
		// 		{ headers: { "access-token": sesToken } }
		// 	);
		// 	console.log(response.data);
		// }
		// setPhotoList(filtered);
		// setModalVisibility(false);
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
				quality: 0.25,
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
		// try {
		setIsLoading(true);
		// 	const newList = await Promise.all(
		// 		PHOTO_LIST.map(async (item, index) => {
		// 			if (item?.photo ?? false) {
		// 				const returnVal = await axios
		// 					.get(url + "/SecurePhotoLink", { headers: { "access-token": sesToken } })
		// 					.then(async (res) => {
		// 						const uploadUrl = res.data.url;
		// 						const returned = await fetch(uploadUrl, {
		// 							method: "PUT",
		// 							body: item.photo,
		// 							headers: {
		// 								Accept: "application/json",
		// 								"Content-Type": "multipart/form-data",
		// 							},
		// 						})
		// 							.then((res) => {
		// 								if (res.ok) {
		// 									const photoLink = uploadUrl.split("?")[0];

		// 									return {
		// 										Photo_Order: item.Photo_Order,
		// 										PhotoLink: photoLink,
		// 									};
		// 								} else {
		// 									console.log("ERROR UPLOADING IMAGE");
		// 								}
		// 							})
		// 							.catch((err) => {
		// 								console.log(err);
		// 							});
		// 						return returned;
		// 					})
		// 					.catch((error) => {
		// 						console.log({ error });
		// 					});
		// 				return returnVal;
		// 			}
		// 			return item;
		// 		})
		// 	);
		// 	await axios
		// 		.post(
		// 			url + "/addPhotoLink",
		// 			{
		// 				userId: userId,
		// 				userPhoto: 1,
		// 				photos: newList,
		// 			},
		// 			{ headers: { "access-token": sesToken } }
		// 		)
		// 		.then(async (res) => {
		// 			// setPhotoList(newList);

		// 			const dataStr = await SecureStore.getItemAsync("userData");
		// 			const userData = JSON.parse(dataStr);
		// 			const storedValue = JSON.stringify({
		// 				...userData,
		// 				Photo: newList,
		// 			});
		// 			await SecureStore.setItemAsync("userData", storedValue);
		// 			setIsLoading(false);
		// 			navigation.replace("MainScreen", {
		// 				screen: "Profile",
		// 				photoList: newList,
		// 			});
		// 		})
		// 		.catch((err) => {
		// 			console.log(err);
		// 		});
		// } catch (err) {
		// 	console.log("ERROR SAVING: ", err);
		// }
	};

	return (
		<View style={[commonStyles.Container, { paddingTop: 50 }]}>
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
					<TouchableOpacity onPress={handleSave}>
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
						list={photoListShared}
					/>
				))}
				{PHOTO_LIST.length < 4 && (
					<Pressable onPress={pickImage}>
						<View style={[styles.photo]}>
							<Feather name="plus" size={width / 8} color={colors.gray} />
						</View>
					</Pressable>
				)}
				{(PHOTO_LIST.length == 2 || PHOTO_LIST.length == 0) && (
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
				<Text style={{ fontSize: width * 0.03, color: colors.medium_gray }}>
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
					<Image source={require("../assets/sadFace.png")} />
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
		flexDirection: "row",
		flexWrap: "wrap",
		justifyContent: "space-evenly",
	},
	photo: {
		marginVertical: height * 0.01,
		marginHorizontal: width * 0.03,
		height: Math.min(height * 0.35, width * 0.66),
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
