import React from "react";
import ReactNative, { View, Text, Image, Dimensions, Pressable } from "react-native";
import {
	ScrollView,
	GestureDetector,
	Gesture,
	TouchableOpacity,
	FlatList,
} from "react-native-gesture-handler";
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
import { snapPoint } from "react-native-redash";
import { Ionicons, AntDesign } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import FastImage from "react-native-fast-image";

import commonStyles from "../../visualComponents/styles";
import { colors, Gradient } from "../../visualComponents/colors";
import { getGender } from "../../nonVisualComponents/generalFunctions";
import { getAge } from "../../utils/date.utils";
import { dietList, signList, smokeAndDrinkList } from "../../nonVisualComponents/Lists";

const { width, height } = Dimensions.get("window");
const SNAP_POINTS = [-width * 1.5, 0, width * 1.5];
import { API, graphqlOperation } from "aws-amplify";
import { getMsgUser } from "../../src/graphql/queries";
import CustomImage from "../../components/custom-image.component";
import { BlurView } from "expo-blur";

const ChatProfile = ({ navigation, route }) => {
	const props = route.params;

	const progress = useSharedValue(0);
	const x = useSharedValue(0);
	const destination = useSharedValue(0);
	const turn = useSharedValue(1);
	const backFace = useSharedValue(false);

	const gender = getGender(props.data.Gender);
	const age = getAge(props.data.Birth_Date);

	const checkText = (text) => {
		// return false if null
		if (text == "null" || text == null || text == "undefined" || text.length == 0 || text == 0)
			return false;
		return true;
	};

	const tapHandler = Gesture.Tap()
		.numberOfTaps(2)
		.onStart(() => {
			turn.value = withTiming(-turn.value);
			backFace.value = !backFace.value;
		});

	const animatedFrontFace = useAnimatedStyle(() => {
		return {
			transform: [
				{
					rotateY: `${interpolate(turn.value, [1, -1], [0, 180])}deg`,
				},
			],
		};
	});

	const animatedBackFace = useAnimatedStyle(() => {
		return {
			zIndex: turn.value == 1 ? -1 : 1,
			transform: [
				{
					rotateY: `${interpolate(turn.value, [1, -1], [180, 360])}deg`,
				},
			],
		};
	});

	const animatedPhotoProgress1 = useAnimatedStyle(() => {
		return {
			height: interpolate(progress.value, [0, 1], [24, 8]),
			display: props.data.photos?.length > 0 ? "flex" : "none",
		};
	});
	const animatedPhotoProgress2 = useAnimatedStyle(() => {
		return {
			height: interpolate(progress.value, [0, 1, 2], [8, 24, 8]),
			display: props.data.photos?.length > 1 ? "flex" : "none",
		};
	});
	const animatedPhotoProgress3 = useAnimatedStyle(() => {
		return {
			height: interpolate(progress.value, [1, 2, 3], [8, 24, 8]),
			display: props.data.photos?.length > 2 ? "flex" : "none",
		};
	});
	const animatedPhotoProgress4 = useAnimatedStyle(() => {
		return {
			height: interpolate(progress.value, [2, 3], [8, 24]),
			display: props.data.photos?.length > 3 ? "flex" : "none",
		};
	});

	const handleScroll = ({ nativeEvent }) => {
		progress.value = nativeEvent.contentOffset.y / nativeEvent.layoutMeasurement.height;
	};

	const handleDismiss = () => {
		navigation.goBack();
	};

	const panHandler = React.useMemo(() =>
		Gesture.Pan()
			.onUpdate((event) => {})
			.onEnd((event) => {})
	);
	const composedGesture = Gesture.Race(tapHandler, panHandler);

	return (
		<View
			style={{
				width: "100%",
				height: "100%",
				justifyContent: "center",
				backgroundColor: "rgba(0,0,0,0.7)",
			}}
		>
			<Pressable
				onPress={handleDismiss}
				style={{
					position: "absolute",
					top: 0,
					left: 0,
					right: 0,
					bottom: 0,
				}}
			/>

			<Animated.View
				name={"card"}
				style={{
					// width: "100%",
					zIndex: 1,
				}}
			>
				<GestureDetector gesture={composedGesture}>
					<Animated.View>
						<Animated.View
							style={[
								commonStyles.photo,
								{
									height: Math.min(width * 1.35, height * 0.7),
									backfaceVisibility: "visible",
									elevation: 0,
								},
								animatedFrontFace,
							]}
						>
							{props.data.photos.length > 0 ? (
								// <FlatList
								// 	scrollEventThrottle={16}
								// 	style={{ width: "100%" }}
								// 	pagingEnabled={true}
								// 	showsVerticalScrollIndicator={false}
								// 	onScroll={handleScroll}
								// 	data={props.data.photos}
								// 	keyExtractor={(item) => {
								// 		return item.Photo_Order;
								// 	}}
								// 	renderItem={({ item }) => {
								// 		return (
								// 			// <View>
								// 			<CustomImage
								// 				url={item?.PhotoLink ?? "AAA"}
								// 				style={{
								// 					height: width * 1.35,
								// 					maxHeight: height * 0.7,
								// 					resizeMode: "cover",
								// 					backgroundColor: colors.cool_gray,
								// 				}}
								// 			/>
								// 			// </View>
								// 		);
								// 	}}
								// />
								<ScrollView
									scrollEventThrottle={16}
									style={{ width: "100%" }}
									pagingEnabled={true}
									showsVerticalScrollIndicator={false}
									onScroll={handleScroll}
								>
									{props.data.photos.map((item, idx) => {
										return (
											<CustomImage
												key={idx}
												url={item?.PhotoLink ?? "AAA"}
												style={{
													height: width * 1.35,
													maxHeight: height * 0.7,
													resizeMode: "cover",
													backgroundColor: colors.cool_gray,
												}}
											/>
										);
									})}
								</ScrollView>
							) : (
								<View
									style={{
										width: "100%",
										height: "100%",
										justifyContent: "center",
										alignItems: "center",
									}}
								>
									<Ionicons name="person" color="white" size={width * 0.5} />
								</View>
							)}
							<Animated.View
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
								<Animated.View
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
								<Animated.View
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
								<Animated.View
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
								<Animated.View
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
							</Animated.View>
							<Animated.View
								style={[
									{
										position: "absolute",
										top: 20,
										right: 20,
										backfaceVisibility: "hidden",
									},
									animatedFrontFace,
								]}
							>
								<TouchableOpacity onPress={handleDismiss}>
									<AntDesign name="closecircleo" size={25} color="white" />
								</TouchableOpacity>
							</Animated.View>
							<Animated.View
								style={[
									{
										width: "100%",
										position: "absolute",
										backfaceVisibility: "hidden",
										bottom: 0,
									},
									animatedFrontFace,
								]}
							>
								<LinearGradient
									colors={["rgba(0,0,0,0.005)", " rgba(0,0,0,0.1)", "rgba(0,0,0,0.5)"]}
									locations={[0, 0.1, 1]}
									start={{ x: 0.5, y: 0 }}
									end={{ x: 0.5, y: 1 }}
									style={{
										minHeight: height * 0.12,
										paddingVertical: 10,
									}}
								>
									<View
										style={{
											width: "100%",
											height: "100%",
											flexDirection: "row",
											alignItems: "center",
											justifyContent: "space-between",
											paddingHorizontal: 20,
											backfaceVisibility: "hidden",
										}}
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
												{props.data.Name} • {age}
											</Text>
											<Text
												style={{
													color: colors.white,
													fontSize: Math.min(24, width * 0.045),
													fontFamily: "PoppinsItalic",
													lineHeight: Math.min(27, width * 0.05),
												}}
											>
												{props.data.School}
												{"\n"}
												{props.data.Major}
											</Text>
										</View>
									</View>
								</LinearGradient>
							</Animated.View>
						</Animated.View>
						{/* PART: backface */}
						<Animated.View
							name={"backface"}
							style={[
								commonStyles.photo,
								animatedBackFace,
								{
									height: Math.min(width * 1.35, height * 0.7),
									position: "absolute",
									backfaceVisibility: "hidden",
									backgroundColor: "transparent",
									elevation: 0,
								},
							]}
						>
							<BlurView
								intensity={100}
								tint="dark"
								style={{ width: "100%", height: "100%", position: "absolute" }}
							/>
							<View
								name={"colorFilter"}
								style={{
									width: "100%",
									height: "100%",
									position: "absolute",
									backgroundColor: "rgba(0,0,0,0.25)",
								}}
							/>
							<ScrollView
								showsVerticalScrollIndicator={false}
								style={{
									width: "80%",
									marginVertical: 30,
								}}
							>
								<View
									style={{
										width: "100%",
										alignItems: "center",
									}}
								>
									{checkText(gender) && (
										<Text
											name={"Gender"}
											style={{
												color: colors.light_gray,
												fontSize: 18,
												textAlign: "center",
												paddingVertical: 5,
											}}
										>
											Cinsiyet {"\n"}
											<Text
												style={{
													fontFamily: "PoppinsSemiBold",
													fontSize: 22,
												}}
											>
												{gender}
											</Text>
										</Text>
									)}
									{/* {checkText(props.data.Din) && (
										<Text
											name={"Religion"}
											style={{
												color: colors.light_gray,
												fontSize: 18,
												textAlign: "center",
												paddingVertical: 5,
											}}
										>
											Dini İnanç {"\n"}
											<Text
												style={{
													fontFamily: "PoppinsSemiBold",
													fontSize: 22,
												}}
											>
												{props.data.Din}
											</Text>
										</Text>
									)} */}
									{checkText(props.data.Burc) && (
										<Text
											name={"Burc"}
											style={{
												color: colors.light_gray,
												fontSize: 18,
												textAlign: "center",
												paddingVertical: 5,
											}}
										>
											Burç {"\n"}
											<Text
												style={{
													fontFamily: "PoppinsSemiBold",
													fontSize: 22,
												}}
											>
												{signList[props.data.Beslenme].choice}
											</Text>
										</Text>
									)}
									{checkText(props.data.Burc) && (
										<Text
											name={"Beslenme"}
											style={{
												color: colors.light_gray,
												fontSize: 18,
												textAlign: "center",
												paddingVertical: 5,
											}}
										>
											Beslenme Tercihi {"\n"}
											<Text
												style={{
													fontFamily: "PoppinsSemiBold",
													fontSize: 22,
												}}
											>
												{dietList[props.data.Beslenme].choice}
											</Text>
										</Text>
									)}
									{checkText(props.data.Alkol) && (
										<Text
											name={"Alkol"}
											style={{
												color: colors.light_gray,
												fontSize: 18,
												textAlign: "center",
												paddingVertical: 5,
											}}
										>
											Alkol Kullanımı {"\n"}
											<Text
												style={{
													fontFamily: "PoppinsSemiBold",
													fontSize: 22,
												}}
											>
												{smokeAndDrinkList[props.data.Alkol].choice}
											</Text>
										</Text>
									)}
									{checkText(props.data.Sigara) && (
										<Text
											name={"Sigara"}
											style={{
												color: colors.light_gray,
												fontSize: 18,
												textAlign: "center",
												paddingVertical: 5,
											}}
										>
											Sigara Kullanımı {"\n"}
											<Text
												style={{
													fontFamily: "PoppinsSemiBold",
													fontSize: 22,
												}}
											>
												{smokeAndDrinkList[props.data.Sigara].choice}
											</Text>
										</Text>
									)}
									{checkText(props.data.interest) && (
										<Text
											name={"interest"}
											style={{
												color: colors.light_gray,
												fontSize: 18,
												textAlign: "center",
												paddingVertical: 5,
											}}
										>
											İlgi Alanları {"\n"}
											{props.data.interest.map((item, index) => {
												return (
													<Text
														key={index}
														style={{
															fontFamily: "PoppinsSemiBold",
															fontSize: 22,
														}}
													>
														{item.InterestName}
														{props.data.interest.length > index + 1 ? (
															<Text
																style={{
																	fontFamily: "PoppinsSemiBold",
																	fontSize: 22,
																}}
															>
																{" "}
																|{" "}
															</Text>
														) : null}
													</Text>
												);
											})}
										</Text>
									)}
									{checkText(props.data.About) && (
										<Text
											name={"About"}
											style={{
												color: colors.light_gray,
												fontSize: 18,
												textAlign: "center",
												paddingVertical: 5,
											}}
										>
											Hakkında{"\n"}
											<Text
												style={{
													fontFamily: "PoppinsSemiBold",
													fontSize: 22,
												}}
											>
												{props.data.About}
											</Text>
										</Text>
									)}
								</View>
							</ScrollView>
						</Animated.View>
					</Animated.View>
				</GestureDetector>
			</Animated.View>
		</View>
	);
};

export default ChatProfile;
