import { useContext, useMemo, useRef, useState } from "react";
import { StyleSheet, Text, View, Dimensions, FlatList, Animated } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
// import {
// 	ScrollView,
// 	GestureDetector,
// 	Gesture,
// 	TouchableOpacity,
// 	FlatList,
// } from "react-native-gesture-handler";
import Reanimated, {
	Extrapolate,
	interpolate,
	runOnJS,
	useAnimatedStyle,
	useSharedValue,
	withDelay,
	withSpring,
	withTiming,
} from "react-native-reanimated";

import CustomImage from "./custom-image.component";

import { ListsContext } from "../contexts/lists.context";

import { sort } from "../utils/array.utils";
import { Session } from "../nonVisualComponents/SessionVariables";
import commonStyles from "../visualComponents/styles";
import { colors } from "../visualComponents/colors";
import DoubleTap from "./double-tap.component";
import { LinearGradient } from "expo-linear-gradient";
import { getAge } from "../utils/date.utils";
import { BlurView } from "expo-blur";
import { checkField } from "../utils/null-check.utils";
import { getInterests } from "../functions/get-interests";

const { height, width } = Dimensions.get("window");

const Card = ({ card, index, isBackFace, isScrollShowed, indexOfFrontCard }) => {
	const {
		lists: { genderList, smokeAndDrinkList, signList, dietList },
	} = useContext(ListsContext);

	const { photos = [], Name: name, Birth_Date: bDay, School: school, Major: major } = card;
	//console.log(JSON.stringify(card));
	const [age, setAge] = useState(getAge(bDay));
	const [sortedPhotos, setSortedPhotos] = useState(sort(photos, "Photo_Order"));

	const [backFace, setBackFace] = useState(false);
	const [BACK_FACE_FIELDS, set_BACK_FACE_FIELDS] = useState({
		Gender: { label: "Cinsiyet", function: (idx) => genderList[idx].choice },
		Burc: { label: "Burç", function: (idx) => signList[idx].choice },
		Sigara: { label: "Sigara Kullanımı", function: (idx) => smokeAndDrinkList[idx].choice },
		Alkol: { label: "Alkol Kullanımı", function: (idx) => smokeAndDrinkList[idx].choice },
		Beslenme: { label: "Beslenme Tercihi", function: (idx) => dietList[idx].choice },
		interest: { label: "İlgi Alanları", function: (list) => getInterests(list) },
		About: { label: "Hakkında", function: (val) => getInterests(val) },
		// Din: { label: "Dini İnanç", function: (val) => val },
	});

	const photoIndex = useSharedValue(0);
	const face = useSharedValue(1); // 1 => front, -1 => back

	const photoListRef = useRef();

	const handleSingleTap = () => {
		if (face.value === -1 || !photoListRef.current) return;
		const newIndex =
			sortedPhotos.length > Math.round(photoIndex.value + 1) ? Math.round(photoIndex.value) + 1 : 0;
		photoListRef.current.scrollToIndex({ animated: true, index: newIndex });
	};

	const handleDoubleTap = () => {
		face.value = withTiming(-face.value);
		isBackFace.value = !isBackFace.value;
		setBackFace(true);
	};

	const checkScrollNeeded = async () => {
		if (index == indexOfFrontCard.value && !isScrollShowed && photos.length > 1) {
			scroll();
			if (Session.ScrollNumber + 1 == 10) {
				AsyncStorage.removeItem("scrollNotShowed");
				Session.ScrollShown = true;
				return;
			}
			Session.ScrollNumber += 1;
			AsyncStorage.setItem("scrollNotShowed", Session.ScrollNumber.toString());
		}
	};

	const scroll = () => {
		if (!photoListRef.current) return;
		setTimeout(() => {
			// scrollDown();
			photoListRef.current.scrollToIndex({ index: 0.4 });
		}, 200);
		setTimeout(() => {
			// scrollUp();
			photoListRef.current.scrollToIndex({ index: 0 });
		}, 600);
	};

	const handleScroll = ({ nativeEvent }) => {
		photoIndex.value = nativeEvent.contentOffset.y / nativeEvent.layoutMeasurement.height;
	};

	const animatedPhotoProgress1 = useAnimatedStyle(() => {
		return {
			display: sortedPhotos?.length > 0 ? "flex" : "none",
			height: interpolate(photoIndex.value, [0, 1], [24, 8]),
		};
	});

	const animatedPhotoProgress2 = useAnimatedStyle(() => {
		return {
			display: sortedPhotos?.length > 1 ? "flex" : "none",
			height: interpolate(photoIndex.value, [0, 1, 2], [8, 24, 8]),
		};
	});

	const animatedPhotoProgress3 = useAnimatedStyle(() => {
		return {
			display: sortedPhotos?.length > 2 ? "flex" : "none",
			height: interpolate(photoIndex.value, [1, 2, 3], [8, 24, 8]),
		};
	});

	const animatedPhotoProgress4 = useAnimatedStyle(() => {
		return {
			display: sortedPhotos?.length > 3 ? "flex" : "none",
			height: interpolate(photoIndex.value, [2, 3], [8, 24]),
		};
	});

	const animatedFrontFace = useAnimatedStyle(() => {
		return {
			transform: [
				{
					rotateY: `${interpolate(face.value, [1, -1], [0, 180])}deg`,
				},
			],
		};
	});

	const animatedBackFace = useAnimatedStyle(() => {
		return {
			zIndex: face.value == 1 ? -1 : 1,
			transform: [
				{
					rotateY: `${interpolate(face.value, [1, -1], [180, 360])}deg`,
				},
			],
		};
	});

	return (
		<View>
			<DoubleTap singleTap={handleSingleTap} doubleTap={handleDoubleTap} delay={220}>
				<View>
					{/* Front Face Start */}
					<Reanimated.View style={[card_style, animatedFrontFace]}>
						<FlatList
							removeClippedSubviews={true}
							initialNumToRender={2}
							maxToRenderPerBatch={2}
							ref={photoListRef}
							data={sortedPhotos}
							onLayout={async () => {
								await checkScrollNeeded();
							}}
							keyExtractor={(item) => {
								return item.Photo_Order;
							}}
							renderItem={({ item }) => {
								return (
									<CustomImage
										url={item?.PhotoLink}
										style={{
											// width: "100%",
											// flex: 1,
											aspectRatio: 1 / 1.5,
											height: Math.min(height * 0.7, width * 1.35),
											// //resizeMode: "cover",
											// backgroundColor: colors.cool_gray,
										}}
									/>
								);
							}}
							pagingEnabled={true}
							showsHorizontalScrollIndicator={false}
							showsVerticalScrollIndicator={false}
							onScroll={handleScroll}
							horizontal={false}
						/>
						<Reanimated.View
							style={[
								{
									backfaceVisibility: "hidden",
									position: "absolute",
									left: 20,
									top: 20,
								},
								animatedFrontFace,
							]}
						>
							<Reanimated.View
								style={[
									{
										backgroundColor: colors.white,
										elevation: 10,
										minHeight: 8,
										maxHeight: 24,
										width: 8,
										borderRadius: 4,
									},
									animatedPhotoProgress1,
								]}
							/>
							<Reanimated.View
								style={[
									{
										backgroundColor: colors.white,
										elevation: 10,
										minHeight: 8,
										maxHeight: 24,
										width: 8,
										borderRadius: 4,
										marginTop: 4,
									},
									animatedPhotoProgress2,
								]}
							/>
							<Reanimated.View
								style={[
									{
										backgroundColor: colors.white,
										elevation: 10,
										minHeight: 8,
										maxHeight: 24,
										width: 8,
										borderRadius: 4,
										marginTop: 4,
									},
									animatedPhotoProgress3,
								]}
							/>
							<Reanimated.View
								style={[
									{
										backgroundColor: colors.white,
										elevation: 10,
										minHeight: 8,
										maxHeight: 24,
										width: 8,
										borderRadius: 4,
										marginTop: 4,
									},
									animatedPhotoProgress4,
								]}
							/>
						</Reanimated.View>
						<LinearGradient
							colors={["rgba(0,0,0,0.005)", " rgba(0,0,0,0.1)", "rgba(0,0,0,0.7)"]}
							locations={[0, 0.1, 1]}
							start={{ x: 0.5, y: 0 }}
							end={{ x: 0.5, y: 1 }}
							style={{
								minHeight: height * 0.12,
								width: "100%",
								position: "absolute",
								bottom: 0,
								paddingVertical: 10,
							}}
						>
							<Reanimated.View
								style={[
									{
										width: "100%",
										height: "100%",
										flexDirection: "row",
										alignItems: "center",
										justifyContent: "space-between",
										paddingHorizontal: 20,
										backfaceVisibility: "hidden",
									},
									animatedFrontFace,
								]}
							>
								<View style={{ flexShrink: 1 }}>
									<Text
										style={{
											color: colors.white,
											fontSize: Math.min(35, width * 0.06),
											fontFamily: "PoppinsSemiBold",
											letterSpacing: 1.05,
										}}
									>
										{name} • {age}
									</Text>
									<Text
										style={{
											color: colors.white,
											fontSize: Math.min(24, width * 0.045),
											fontFamily: "PoppinsItalic",
											lineHeight: Math.min(27, width * 0.05),
										}}
									>
										{school}
										{"\n"}
										{major}
									</Text>
								</View>
							</Reanimated.View>
						</LinearGradient>
					</Reanimated.View>
					{/* Front Face End */}

					{/* Back Face Start */}
					{backFace && (
						<Reanimated.View
							style={[
								card_style,
								animatedBackFace,
								{
									position: "absolute",
									backgroundColor: "transparent",
									backfaceVisibility: "hidden",
								},
							]}
						>
							<BlurView
								intensity={100}
								tint="dark"
								style={{ width: "100%", height: "100%", position: "absolute" }}
							/>
							<FlatList
								showsVerticalScrollIndicator={false}
								style={{
									zIndex: 5,
									width: "80%",
									marginVertical: 30,
								}}
								keyExtractor={(key) => key}
								data={Object.keys(BACK_FACE_FIELDS)}
								renderItem={({ item: field }) => {
									const value = card[field];

									if (field == "interest" && typeof value === "string") {
										console.log({ value });
									}

									if (checkField(value) === true || BACK_FACE_FIELDS[field].function(value) === "")
										return null;
									return (
										<Text
											key={field}
											name={field}
											style={{
												color: colors.light_gray,
												fontSize: Math.min(height * 0.025, width * 0.04),
												textAlign: "center",
												paddingVertical: 5,
											}}
										>
											{BACK_FACE_FIELDS[field].label}
											{"\n"}
											<Text
												style={{
													fontFamily: "PoppinsSemiBold",
													fontSize: Math.min(height * 0.03, width * 0.048),
												}}
											>
												{BACK_FACE_FIELDS[field].function(value)}
											</Text>
										</Text>
									);
								}}
							/>
						</Reanimated.View>
					)}

					{/* Back Face End */}
				</View>
			</DoubleTap>
		</View>
	);
};

export default Card;

const styles = StyleSheet.create({
	backfaceHidden: {
		backfaceVisibility: "hidden",
	},
});

const card_style = [
	commonStyles.photo,
	{
		// backgroundColor: "blue",
		height: Math.min(width * 1.35, height * 0.7),
		elevation: 0,
	},
];
