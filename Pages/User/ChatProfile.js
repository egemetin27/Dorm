import { useContext, useMemo, useRef } from "react";
import { View, Text, Dimensions, Pressable } from "react-native";
import {
	ScrollView,
	GestureDetector,
	Gesture,
	TouchableOpacity,
	FlatList,
} from "react-native-gesture-handler";
import Animated, {
	//Extrapolate,
	interpolate,
	//runOnJS,
	//useAnimatedReaction,
	useAnimatedStyle,
	useSharedValue,
	//withDelay,
	//withSpring,
	withTiming,
} from "react-native-reanimated";
//import { snapPoint } from "react-native-redash";
import { Ionicons, AntDesign } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
//import FastImage from "react-native-fast-image";

import { sort } from "../../utils/array.utils";
import commonStyles from "../../visualComponents/styles";
import { colors, Gradient } from "../../visualComponents/colors";
import { getGender } from "../../nonVisualComponents/generalFunctions";
import { getAge } from "../../utils/date.utils";
import { dietList, signList, smokeAndDrinkList } from "../../nonVisualComponents/Lists";

const { width, height } = Dimensions.get("window");
//const SNAP_POINTS = [-width * 1.5, 0, width * 1.5];
//import { API, graphqlOperation } from "aws-amplify";
//import { getMsgUser } from "../../src/graphql/queries";
import CustomImage from "../../components/custom-image.component";
import { BlurView } from "expo-blur";
import { ListsContext } from "../../contexts/lists.context";
import { checkField } from "../../utils/null-check.utils";
import { getInterests } from "../../functions/get-interests";

const ChatProfile = ({ navigation, route }) => {
	const { getDiet, getGender, getSign, getSmokeAndDrinkList } = useContext(ListsContext);

	const props = route.params;
	const card = route.params.data;

	const BACK_FACE_FIELDS = useRef({
		Gender: { label: "Cinsiyet", function: (idx) => getGender(idx) },
		Burc: { label: "Burç", function: (idx) => getSign(idx) },
		Sigara: { label: "Sigara Kullanımı", function: (idx) => getSmokeAndDrinkList(idx) },
		Alkol: { label: "Alkol Kullanımı", function: (idx) => getSmokeAndDrinkList(idx) },
		Beslenme: { label: "Beslenme Tercihi", function: (idx) => getDiet(idx) },
		interest: { label: "İlgi Alanları", function: (list) => getInterests(list) },
		About: { label: "Hakkında", function: (val) => val },
		// Din: { label: "Dini İnanç", function: (val) => val },
	}).current;

	const progress = useSharedValue(0);
	//const x = useSharedValue(0);
	//const destination = useSharedValue(0);
	const turn = useSharedValue(1);
	const backFace = useSharedValue(false);

	const gender = getGender(props.data.Gender);
	const age = getAge(props.data.Birth_Date);

	const photoList = useMemo(() => sort(props.data.photos, "Photo_Order"), [props]);

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

	const panHandler = useMemo(() =>
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
							{photoList.length > 0 ? (
								// <FlatList
								// 	scrollEventThrottle={16}
								// 	style={{ width: "100%" }}
								// 	pagingEnabled={true}
								// 	showsVerticalScrollIndicator={false}
								// 	onScroll={handleScroll}
								// 	data={photoList}
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
									{photoList.map((item, idx) => {
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

									// if (field == "interest" && typeof value === "string") {
									// 	console.log({ value });
									// }
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
						</Animated.View>
					</Animated.View>
				</GestureDetector>
			</Animated.View>
		</View>
	);
};

export default ChatProfile;
