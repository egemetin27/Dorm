import React, { useEffect, useState } from "react";
import {
	StyleSheet,
	View,
	TouchableOpacity,
	FlatList,
	Dimensions,
	Pressable,
	Image,
	Text,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import commonStyles from "../../visualComponents/styles";
import { Feather, FontAwesome5 } from "@expo/vector-icons";
import { Gradient, GradientText, colors } from "../../visualComponents/colors";
import { CustomModal } from "../../visualComponents/customComponents";
import Animated, {
	useAnimatedRef,
	useAnimatedScrollHandler,
	useSharedValue,
	useAnimatedStyle,
	withSpring,
	withTiming,
	Easing,
	eventHandler,
	useAnimatedGestureHandler,
	interpolate,
	Extrapolate,
	useDerivedValue,
	useAnimatedReaction,
	runOnJS,
} from "react-native-reanimated";

import { PanGestureHandler, LongPressGestureHandler, State } from "react-native-gesture-handler";

const { width, height } = Dimensions.get("window");

const getPos = (x, y, length) => {
	"worklet";

	if (y < 1) {
		if (x < 1) {
			return 0;
		} else {
			return Math.min(1, length - 1);
		}
	} else {
		if (x < 1) {
			return Math.min(2, length - 1);
		} else {
			return Math.min(3, length - 1);
		}
	}
};

const move = (positions, oldPos, newPos) => {
	"worklet";
	const newObject = Object.assign({}, positions);

	if (oldPos < newPos) {
		for (const key in positions) {
			if (positions[key] == oldPos) {
				newObject[key] = newPos;
			}

			if (positions[key] > oldPos && positions[key] <= newPos) {
				newObject[key] = positions[key] - 1;
			}
		}
	} else {
		for (const key in positions) {
			if (positions[key] == oldPos) {
				newObject[key] = newPos;
			}
			if (positions[key] < oldPos && positions[key] >= newPos) {
				newObject[key] = positions[key] + 1;
			}
		}
	}

	return newObject;
};

const Photo = ({
	index,
	photo,
	setToBeDeleted,
	setModalVisibility,
	positions,
	PHOTO_LIST,
	setPhotoList,
}) => {
	const PHOTO_HEIGHT = width * 0.715;
	const PHOTO_WIDTH = width * 0.5;
	const pressed = useSharedValue(false);
	const x = useSharedValue(0);
	const y = useSharedValue(0);
	const top = useSharedValue(photo.key % 4 < 2 ? 0 : PHOTO_HEIGHT);
	const left = useSharedValue(photo.key % 2 == 0 ? 0 : PHOTO_WIDTH);
	const animRef = useSharedValue(0);
	const longPress = React.useRef();
	const Pan = React.useRef();

	// const editList = () => {
	// 	newArr = [];
	// 	for (i = 0; i < PHOTO_LIST.length; i++) {}
	// };

	useAnimatedReaction(
		() => {
			return positions.value[photo.key];
		},
		(newPos, oldPos) => {
			if (newPos != oldPos) {
				if (!pressed.value) {
					top.value = withSpring(positions.value[photo.key] % 4 < 2 ? 0 : PHOTO_HEIGHT);
					left.value = withSpring(positions.value[photo.key] % 2 == 0 ? 0 : PHOTO_WIDTH);
				}
			}
		},
		[pressed.value]
	);

	const eventHandler = useAnimatedGestureHandler({
		onStart: (_, context) => {
			context.startX = x.value;
			context.startY = y.value;
		},
		onActive: (event, context) => {
			if (pressed.value) {
				const posY = event.absoluteY - 95;
				y.value = context.startX + event.translationY;
				x.value = context.startY + event.translationX;

				const newPosition = getPos(
					Math.floor(event.absoluteX / PHOTO_WIDTH),
					Math.floor(posY / PHOTO_HEIGHT),
					PHOTO_LIST.length
				);

				// if (newPosition != photo.key) {
				// 	PHOTO_LIST.value = move(PHOTO_LIST.value, photo.key, newPosition);
				// }
				if (newPosition != positions.value[photo.key]) {
					positions.value = move(positions.value, positions.value[photo.key], newPosition);
				}
			}
		},
		onEnd: () => {
			pressed.value = false;
			// top.value = photo.key % 4 < 2 ? 0 : PHOTO_HEIGHT;
			// left.value = photo.key % 2 == 0 ? 0 : PHOTO_WIDTH;
			top.value = positions.value[photo.key] % 4 < 2 ? 0 : PHOTO_HEIGHT;
			left.value = positions.value[photo.key] % 2 == 0 ? 0 : PHOTO_WIDTH;
			// x.value = 0;
			// y.value = 0;
			// x.value = withSpring(0, { mass: 0.3, damping: 5 });
			// y.value = withSpring(0, { mass: 0.3, damping: 5 });
			x.value = 0;
			y.value = 0;

			// const newArr = [];
			// for (let i = 0; i < PHOTO_LIST.length; i++) {
			// 	if (PHOTO_LIST[i].key == positions.value[PHOTO_LIST[i].key]) {
			// 		newArr.push(PHOTO_LIST[i]);
			// 	} else {
			// 		newArr.push({ key: positions.value[PHOTO_LIST[i].key], url: PHOTO_LIST[i].url });
			// 	}
			// }
			// runOnJS(setPhotoList)(newArr);
			console.log(positions.value);
			animRef.value = withTiming(0, {
				duration: 200,
			});
		},
	});

	const stateHandler = ({ nativeEvent }) => {
		if (nativeEvent.state === State.ACTIVE) {
			pressed.value = true;
			animRef.value = withTiming(1, {
				duration: 100,
			});
		} else if (nativeEvent.state === State.END) {
			pressed.value = false;
			animRef.value = withTiming(0, {
				duration: 100,
			});
		}
	};

	const uas = useAnimatedStyle(() => {
		return {
			position: "absolute",
			left: left.value,
			top: top.value,
			transform: [
				{ translateX: x.value },
				{ translateY: y.value },
				{
					scale: interpolate(animRef.value, [0, 1], [1, 1.05]),
				},
			],
			elevation: animRef.value + 1,
			zIndex: animRef.value,
		};
	});

	return (
		<Animated.View index={index} key={index} style={uas}>
			<LongPressGestureHandler
				onHandlerStateChange={stateHandler}
				minDurationMs={250}
				maxDist={100}
				ref={longPress}
				simultaneousHandlers={Pan}
			>
				<Animated.View>
					<PanGestureHandler
						ref={Pan}
						simultaneousHandlers={longPress}
						onGestureEvent={eventHandler}
					>
						<Animated.View
							key={index}
							style={[
								styles.photo,
								useAnimatedStyle(() => {
									return {
										elevation: interpolate(animRef.value, [0, 1], [0, 10]),
										zIndex: animRef.value,
									};
								}),
							]}
						>
							<Image
								style={{ height: "100%", width: "100%" }}
								resizeMode="center"
								source={{ uri: photo.url }}
							/>
							<View
								style={{
									height: "100%",
									width: "100%",
									position: "absolute",
									alignItems: "flex-end",
								}}
							>
								<Pressable
									style={{
										position: "absolute",
										alignItems: "center",
										justifyContent: "center",
										padding: 10,
									}}
									onPress={() => {
										setToBeDeleted(photo);
										setModalVisibility(true);
									}}
								>
									<Feather name="trash" size={28} color={colors.dark_gray} />
									<Feather
										name="trash"
										size={22}
										color={colors.dark_gray}
										style={{ position: "absolute" }}
									/>
									<Feather
										name="trash"
										size={25}
										color={"white"}
										// iconStyle={{ borderWidth: 10, borderColor: "black" }}
										style={{ position: "absolute" }}
									/>
								</Pressable>
							</View>
						</Animated.View>
					</PanGestureHandler>
				</Animated.View>
			</LongPressGestureHandler>
		</Animated.View>
	);
};

const serialize = (list) => {
	const temp = Object.values(list);
	const object = {};
	let i = 0;
	for (item of temp) {
		object[item.key] = i++;
	}
	console.log("AAAAAAAAAAAAAAAA: ", object);
	return object;
};

export default function ProfilePhotos({ route, navigation }) {
	const [modalVisible, setModalVisibility] = React.useState(false);
	const [toBeDeleted, setToBeDeleted] = React.useState(null);
	// const PHOTO_LIST = useSharedValue(route.params?.photoList || []);
	const [PHOTO_LIST, setPhotoList] = useState([
		{
			key: 0,
			url: "file:///data/user/0/host.exp.exponent/cache/ExperienceData/%2540cankrmn%252FDorm/ImagePicker/1f85541f-853d-4741-bbcb-06929f058d7d.jpg",
		},
		{
			key: 1,
			url: "file:///data/user/0/host.exp.exponent/cache/ExperienceData/%2540cankrmn%252FDorm/ImagePicker/6bb520a0-9e1b-4757-9bb4-6de742b19d78.jpg",
		},
		{
			key: 2,
			url: "file:///data/user/0/host.exp.exponent/cache/ExperienceData/%2540cankrmn%252FDorm/ImagePicker/a8e8b42d-477b-4173-8eeb-ede5747f367b.jpg",
		},
		{
			key: 3,
			url: "file:///data/user/0/host.exp.exponent/cache/ExperienceData/%2540cankrmn%252FDorm/ImagePicker/f597e788-e7c5-4b0a-8726-f80527c14c40.jpg",
		},
	]);
	const positions = useSharedValue(false);
	// if (!positions.value) {
	// 	positions.value = serialize(PHOTO_LIST);
	// }
	positions.value = React.useMemo(() => {
		return serialize(PHOTO_LIST);
	}, [PHOTO_LIST]);

	const handleDelete = () => {
		//TODO: delete "toBeDeleted"

		const filtered = [];
		for (item of PHOTO_LIST) {
			if (item.key != toBeDeleted.key) {
				if (item.key > toBeDeleted.key) {
					filtered.push({ key: item.key - 1, url: item.url });
				} else {
					filtered.push(item);
				}
			}
		}
		// const filtered = PHOTO_LIST.filter((item) => {
		// 	if (item.key != toBeDeleted.key) {
		// 		return item;
		// 	}
		// });
		setPhotoList(filtered);
		setModalVisibility(false);
	};

	const pickImage = async () => {
		const result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			allowsEditing: true,
			aspect: [2, 3],
			quality: 1,
		});
		if (!result.cancelled) {
			const tempList = PHOTO_LIST.map((item) => {
				return { key: positions.value[item.key], url: item.url };
			});
			console.log({ tempList });
			setPhotoList([...tempList, { key: PHOTO_LIST.length, url: result.uri }]);
		}
	};

	return (
		<View style={commonStyles.Container}>
			<View name={"Header"} style={commonStyles.Header}>
				<View style={{ marginLeft: 20 }}>
					<TouchableOpacity
						onPress={() => {
							navigation.goBack();
						}}
					>
						<Feather name="arrow-left" size={30} color={colors.gray} style={{ paddingLeft: 15 }} />
					</TouchableOpacity>
				</View>
				<View style={{ flexDirection: "row", alignSelf: "center" }}>
					<TouchableOpacity
						onPress={() => {
							navigation.navigate("MainScreen", {
								screen: "Profile",
								photoList: PHOTO_LIST,
							});
						}}
					>
						<GradientText
							style={{ fontSize: 25, letterSpacing: 1.2, paddingRight: 15 }}
							text={"Kaydet"}
						/>
					</TouchableOpacity>
				</View>
			</View>

			<View name={"Photos"} style={[styles.photoContainer, {}]}>
				{PHOTO_LIST.map((item, index) => (
					<Photo
						key={index}
						// index={index}
						photo={item}
						positions={positions}
						PHOTO_LIST={PHOTO_LIST}
						// setPhotoList={setPhotoList}
						setToBeDeleted={setToBeDeleted}
						setModalVisibility={setModalVisibility}
					/>
				))}
				{PHOTO_LIST.length < 4 && (
					<Pressable
						style={{
							position: "absolute",
							left: PHOTO_LIST.length % 2 == 0 ? 0 : width / 2,
							top: PHOTO_LIST.length % 4 < 2 ? 0 : width * 0.715,
						}}
						onPress={pickImage}
					>
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
				<Text style={{ fontSize: 18, color: colors.medium_gray }}>
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
					<Text style={{ color: colors.dark_gray, fontSize: 16, marginTop: 10 }}>
						Fotoğrafını profilinden kaldırmak üzeresin. Emin misin?{"\n"}
						{"\n"}Tabii tekrar galerinden ekleyebilirsin
					</Text>
					<TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
						<Gradient>
							<View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
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
		width: width * 0.7,
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
