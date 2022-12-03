import { useContext, useRef, useState, useEffect, Fragment, useMemo } from "react";
import {
	StyleSheet,
	Text,
	View,
	TextInput,
	Dimensions,
	Pressable,
	Animated,
	TouchableOpacity,
	ScrollView,
	KeyboardAvoidingView,
	FlatList,
	ActivityIndicator,
	Alert,
	Image,
	Platform,
} from "react-native";
import commonStyles from "../../visualComponents/styles";
import { colors, GradientText, Gradient } from "../../visualComponents/colors";
import { MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import Carousel from "react-native-reanimated-carousel";
import { setStatusBarBackgroundColor, setStatusBarStyle, StatusBar } from "expo-status-bar";

import { CustomPicker } from "../../visualComponents/customComponents";
import axios from "axios";
import url from "../../connection";
import { getAge } from "../../utils/date.utils";
import crypto from "../../functions/crypto";
import { AuthContext } from "../../contexts/auth.context";
import CustomImage from "../../components/custom-image.component";
import CustomRadio from "../../components/custom-radio.component";
import { ListsContext } from "../../contexts/lists.context";
import useBackHandler from "../../hooks/useBackHandler";
import { useFocusEffect } from "@react-navigation/native";
import IconTextBox from "../../components/icon-text-box.component";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { height, width } = Dimensions.get("screen");

// const FIELDS = [
// 	{ label: "Temel Bilgilerim", IconTextList: [{text: "asd",icon: require("../../assets/school.png")}] },
// 	{ label: "dorm'dan Beklentim", IconTextList: [{text: "zxc",icon: require("../../assets/school.png")}, {text: "qwe",icon: require("../../assets/school.png")}] }
// ];

export default function Profile({ navigation }) {
	const { lists } = useContext(ListsContext);
	const { user, updateProfile } = useContext(AuthContext);
	const { matchMode, School: university } = user;

	const { top } = useSafeAreaInsets();

	const [isReady, setIsReady] = useState(false);
	const [isEditable, setEditibility] = useState(false);
	const [genderVisible, setGenderVisible] = useState(false);
	const [interestedSexVisible, setInterestedSexVisible] = useState(false);
	const [expectationVisible, setExpectationVisible] = useState(false);
	const [cityVisible, setCityVisible] = useState(false);
	const [signVisible, setSignVisible] = useState(false);
	const [dietVisible, setDietVisible] = useState(false);
	const [smokeVisible, setSmokeVisible] = useState(false);
	const [drinkVisible, setDrinkVisible] = useState(false);

	const [name, setName] = useState("");
	const [major, setMajor] = useState("");
	const [age, setAge] = useState("");
	const [sex, setSex] = useState("");
	const [interestedSex, setInterestedSex] = useState("");
	const [expectation, setExpectation] = useState("");
	const [school, setSchool] = useState("");
	//const [religion, setReligion] = useState("");
	const [sign, setSign] = useState("");
	const [diet, setDiet] = useState("");
	const [drink, setDrink] = useState("");
	const [smoke, setSmoke] = useState("");
	const [hobbies, setHobbies] = useState([]);
	const [about, setAbout] = useState("");
	const [city, setCity] = useState("");

	// const nameRef = useRef(new Animated.Value(0)).current;
	// const majorRef = useRef(new Animated.Value(0)).current;
	// //const religionRef = useRef(new Animated.Value(0)).current;
	// const signRef = useRef(new Animated.Value(0)).current;
	// const dietRef = useRef(new Animated.Value(0)).current;
	// const drinkRef = useRef(new Animated.Value(0)).current;
	// const smokeRef = useRef(new Animated.Value(0)).current;
	// const hobbiesRef = useRef(new Animated.Value(0)).current;
	// const aboutRef = useRef(new Animated.Value(0)).current;

	useBackHandler(() => navigation.goBack());

	// useFocusEffect(() => {
	// 	Platform.OS != "ios" && setStatusBarBackgroundColor("#F4F3F3", true);
	// 	setStatusBarStyle("dark");
	// });

	useEffect(() => {
		const profile = async () => {
			try {
				setName(user.Name + " " + user.Surname);
				setAge(getAge(user.Birth_date).toString());
				setSex(user.Gender == "null" ? "" : lists.genderList[user.Gender]);
				setInterestedSex(
					user.InterestedSex == "null" ? "" : lists.interestedSexList[user.InterestedSex]
				);
				setExpectation(user.Expectation == "null" ? "" : lists.expectationList[user.Expectation]);
				setSchool(user.School);
				setMajor(user.Major == "null" ? "" : user.Major);
				//setReligion(user.Din == "null" ? "" : user.Din);
				setSign(user.Burc == "null" ? "" : lists.signList[user.Burc]);
				setDiet(user.Beslenme == "null" ? "" : lists.dietList[user.Beslenme]);
				setDrink(user.Alkol == "null" ? "" : lists.smokeAndDrinkList[user.Alkol]);
				//setCity(user.City == "null" ? lists.cityList[0] : lists.cityList[user.City]);
				lists.cityList.some((item) => {
					if (item.choice === user.City) {
						setCity(item);
						return true;
					}
				});
				setSmoke(user.Sigara == "null" ? "" : lists.smokeAndDrinkList[user.Sigara]);
				setAbout(user.About == "null" ? "" : user.About);
				setHobbies(() => user.interest);
			} finally {
				setTimeout(() => {
					setIsReady(true);
				}, 500);
			}
		};
		profile().catch(console.err);
	}, []);

	const FIELDS = useMemo(
		() => [
			{
				label: "",
				IconTextList: [
					{
						text: major,
						icon: require("../../assets/workspace_premium.png"),
						visible: () => handleEdit("", null),
					},
				],
				visible: null,
			},
			{
				label: "Temel Bilgilerim",
				IconTextList: [
					{
						text: sex.choice,
						icon:
							sex.choice == "Kadın"
								? require("../../assets/female.png")
								: require("../../assets/female.png"), // TODO !!! for male png
						visible: setGenderVisible,
					},
					{
						text: sign.choice,
						icon: require("../../assets/sign.png"),
						visible: setSignVisible,
					},
					{
						text: diet.choice,
						icon: require("../../assets/forkknife.png"),
						visible: setDietVisible,
					},
					{
						text: drink.choice,
						icon: require("../../assets/drink.png"),
						visible: setDrinkVisible,
					},
					{
						text: smoke.choice,
						icon: require("../../assets/smoke.png"),
						visible: setSmokeVisible,
					},
				],
				visible: "multiple",
			},
			{
				label: "dorm'dan Beklentim",
				IconTextList: [
					{
						text: expectation.choice ?? "",
						icon: require("../../assets/search.png"),
						visible: setExpectationVisible,
					},
				],
				visible: setExpectationVisible,
			},
			{
				label: "İlgi Duyduğum",
				IconTextList: [
					{
						text: interestedSex.choice ?? "",
						icon: require("../../assets/favorite.png"),
						visible: setInterestedSexVisible,
					},
				],
				visible: setInterestedSexVisible,
			},
			{
				label: "İlgi Alanlarım",
				IconTextList:
					hobbies != null
						? hobbies.map((interest) => ({
								text: interest.InterestName,
								icon: null,
								visible: null,
						  }))
						: [],
				visible: null,
			},
			{
				label: "Konumum",
				IconTextList: [
					{
						text: city.choice,
						icon: require("../../assets/favorite.png"),
						visible: setCityVisible,
					},
				],
				visible: setCityVisible,
			},
		],
		[major, sex, sign, diet, smoke, hobbies, city, drink, expectation, interestedSex]
	);

	const handleEdit = (label, visible) => {
		console.log(label);
		if (label == "İlgi Alanlarım") {
			navigation.push("Hobbies", {
				isNewUser: false,
			});
		} else if (label === "Hakkımda") navigation.push("ProfileEditPage", { field: "Hakkımda" });
		else if (label !== "") {
			if (visible === "multiple") {
				// For now, do nothing here
			} else {
				visible(true);
			}
		} else if (label === "")
			// Only major does not have a label so far
			navigation.push("ProfileEditPage", { field: "Major" });
	};

	const handleSave = async () => {
		const lName =
			name.trim().lastIndexOf(" ") == -1 ? "" : name.trim().slice(name.trim().lastIndexOf(" ") + 1);
		const fName = name.trim().slice(0, name.lastIndexOf(" "));

		if (fName == "" || lName == "") {
			await navigation.navigate("CustomModal", {
				modalType: "EMPTY_NAME",
			});
			return;
		}
		console.log(lName + " " + fName);
		const dataRaw = {
			userId: user.userId,
			Name: fName,
			Surname: lName,
			Gender: sex.key,
			InterestedSex: interestedSex.key,
			Expectation: expectation.key,
			Major: major,
			City: city.choice,
			Burc: sign.key,
			Beslenme: diet.key,
			Alkol: drink.key,
			Sigara: smoke.key,
			About: about,
		};

		const dataToSend = crypto.encrypt(dataRaw);

		await axios
			.post(url + "/profile/IdentityUpdate", dataToSend, {
				headers: { "access-token": user.sesToken },
			})
			.then(async (res) => {
				updateProfile({ ...dataRaw });
			})
			.catch((err) => {
				console.log(err);
			});

		setEditibility(false);
		// const newData = { Name: name, Gender: sex.key,  }; // TODO: add new data here and both save them to local and send to database
	};

	if (!isReady)
		return (
			<View style={[commonStyles.Container, { justifyContent: "center" }]}>
				<StatusBar style="dark" />
				<ActivityIndicator animating={true} color={"rgba(100, 60, 248, 1)"} size={"large"} />
			</View>
		);

	return (
		<View style={[commonStyles.Container, { alignItems: "center", alignSelf: "center" }]}>
			<StatusBar style="dark" />
			<View
				style={{
					height: height * 0.045 + top,
					width: "100%",
					backgroundColor: "#F4F3F3",
					elevation: 10,
					flexDirection: "row",
					//alignItems: "flex-end",
					//paddingBottom: height * 0.02,
					//justifyContent: "flex-end",
					justifyContent: "space-between",
					paddingTop: top,
				}}
			>
				<View style={{ marginLeft: 20 }}>
					{isEditable ? (
						<TouchableOpacity
							onPress={() => {
								setEditibility(!isEditable);
								navigation.replace("MainScreen", {
									screen: "Profil",
								});
							}}
						>
							<MaterialCommunityIcons
								name="arrow-left"
								size={height * 0.035}
								color={colors.gray}
								style={{ paddingRight: 15 }}
							/>
						</TouchableOpacity>
					) : (
						<View
							style={{
								width: "100%",
								paddingRight: width * 0.28,
								marginLeft: width * 0.34,
							}}
						>
							<GradientText
								style={{
									fontSize: height * 0.025,
									fontFamily: "PoppinsSemiBold",
									letterSpacing: 1.2,
								}}
								text={"profilim"}
							/>
						</View>
					)}
				</View>
				<View style={{ flexDirection: "row" }}>
					{isEditable && (
						<TouchableOpacity
							onPress={() => {
								handleSave();
							}}
						>
							<GradientText
								style={{
									fontSize: 25,
									letterSpacing: 1.2,
									paddingRight: 15,
								}}
								text={"Kaydet"}
							/>
						</TouchableOpacity>
					)}

					{isEditable ? (
						<></>
					) : (
						<TouchableOpacity
							onPress={async () => {
								navigation.navigate("Settings");
							}}
						>
							<MaterialCommunityIcons
								name="cog"
								size={27}
								color={colors.gray}
								style={{
									paddingRight: 15,
								}}
							/>
						</TouchableOpacity>
					)}
				</View>
			</View>
			<KeyboardAvoidingView
				style={{
					flex: 1,
					flexDirection: "column",
					justifyContent: "center",
				}}
				behavior="height"
			>
				<ScrollView
					showsVerticalScrollIndicator={false}
					contentContainerStyle={{
						width: width,
						paddingBottom: 20,
					}}
					keyboardShouldPersistTaps="handled"
				>
					<View name={"Photos"} style={[styles.photosContainer]}>
						{user.Photo && user.Photo.length != 0 ? (
							// TODO: styling should be implemented more resiliently
							<Carousel
								loop={false}
								mode={"parallax"}
								modeConfig={{
									parallaxScrollingOfset: 100,
									parallaxScrollingScale: 0.8,
								}}
								style={{
									overflow: "hidden",
									transform: [{ scale: 1.1 }],
									width: width * 0.98,
									justifyContent: "center",
								}}
								width={width * 0.905}
								data={user.Photo.length <= 4 ? [...user.Photo, "Add Photo"] : user.Photo}
								panGestureHandlerProps={{
									activeOffsetX: [-10, 10],
								}}
								renderItem={({ item }) => (
									<View style={[styles.photo]}>
										{item != "Add Photo" ? (
											<Pressable
												onPress={() => {
													if (isEditable) {
														setEditibility(false);
														navigation.navigate("ProfilePhotos");
													}
												}}
											>
												<CustomImage
													url={item.PhotoLink}
													style={{
														height: height * 0.58,
														aspectRatio: 2 / 2.8,
														resizeMode: "cover",
													}}
												/>
											</Pressable>
										) : (
											<Pressable
												onPress={() => {
													navigation.navigate("ProfilePhotos");
												}}
											>
												<View style={styles.photo}>
													<Feather name="plus" size={width / 8} color={colors.gray} />
												</View>
											</Pressable>
										)}
									</View>
								)}
							/>
						) : (
							<Pressable
								onPress={() => {
									navigation.navigate("ProfilePhotos");
								}}
							>
								<View style={[styles.photo]}>
									<Feather name="plus" size={width / 8} color={colors.gray} />
								</View>
							</Pressable>
						)}
					</View>

					<View style={{ paddingHorizontal: width * 0.047 }}>
						{!isEditable && (
							<View style={{ alignSelf: "center", width: "100%" }}>
								<Pressable onPress={() => setEditibility(true)}>
									<Gradient
										style={[
											{
												paddingVertical: height * 0.011,
												marginBottom: height * 0.013,
												paddingHorizontal: 20,
												justifyContent: "center",
												alignItems: "center",
												borderRadius: 32,
											},
										]}
									>
										<Text
											style={{
												color: colors.white,
												fontSize: width * 0.042,
											}}
										>
											Profilini Düzenle
										</Text>
									</Gradient>
								</Pressable>
							</View>
						)}

						<View style={{ width: "100%" }}>
							<Text
								style={{
									fontFamily: "PoppinsSemiBold",
									fontSize: width * 0.078,
								}}
							>
								{name}, {age}
							</Text>
						</View>

						<View
							style={{
								width: "100%",
								//marginLeft: width * 0.04,
								flexDirection: "row",
								flex: 1,
								alignItems: "center",
								marginTop: height * 0.006,
								marginBottom: height * 0.012,
							}}
						>
							<Image
								source={require("../../assets/school.png")}
								style={{
									maxHeight: height * 0.025,
									maxWidth: height * 0.025,
									aspectRatio: 1,
									resizeMode: "contain",
									marginRight: width * 0.04,
								}}
							/>
							<Text
								style={{
									fontFamily: "Poppins",
									fontSize: width * 0.05,
								}}
							>
								{university}
							</Text>
						</View>

						<View>
							{FIELDS.map(({ label, IconTextList, visible }, index) => {
								return (
									<Pressable
										onPress={isEditable ? () => handleEdit(label, visible) : () => {}}
										key={index}
									>
										<View style={!isEditable ? styles.inputContainer : styles.inputContainerEditOn}>
											{label != "" && (
												<Text style={!isEditable ? styles.label : styles.labelEditOn}>{label}</Text>
											)}

											<View
												style={{
													flex: 1,
													flexDirection: "row",
													flexWrap: "wrap",
													maxWidth: width * 0.95,
												}}
											>
												{IconTextList != null &&
													IconTextList.map(({ text, icon, visible }, index) => {
														return (
															<IconTextBox
																setVisible={isEditable ? visible : null}
																text={text}
																icon={icon}
																key={index}
																area={label}
															/>
														);
													})}
											</View>
											{isEditable && (
												<MaterialCommunityIcons
													name="arrow-right"
													size={height * 0.03}
													color={"#5E17EB"}
													style={{
														position: "absolute",
														right: 0,
														top: 0,
														margin: width * 0.02,
													}}
												/>
											)}
										</View>
									</Pressable>
								);
							})}
							<Pressable
								onPress={
									isEditable
										? () => {
												handleEdit("Hakkımda", null);
										  }
										: null
								}
							>
								<View style={isEditable ? styles.aboutEditOn : styles.about}>
									<Text style={isEditable ? styles.aboutLabelEditOn : styles.aboutLabel}>
										Hakkımda
									</Text>
									<Text
										style={[
											styles.input,
											{
												//color: colors.black,
												//height: height * 0.15,
												width: "95%",
												fontFamily: "Poppins",
												marginBottom: "1%",
												marginTop: "3%",
												textAlign: "left",
												textAlignVertical: "top",
											},
										]}
									>
										{about}
									</Text>
									{isEditable && (
										<MaterialCommunityIcons
											name="arrow-right"
											size={height * 0.03}
											color={"#5E17EB"}
											style={{
												position: "absolute",
												right: 0,
												top: 0,
												margin: width * 0.02,
											}}
										/>
									)}
								</View>
							</Pressable>
						</View>
					</View>
				</ScrollView>
			</KeyboardAvoidingView>

			<CustomPicker
				data={lists.genderList}
				visible={genderVisible}
				setVisible={setGenderVisible}
				setChoice={setSex}
				style={{ height: height * 0.26, width: width * 0.624 }}
			/>
			<CustomPicker
				data={lists.interestedSexList}
				visible={interestedSexVisible}
				setVisible={setInterestedSexVisible}
				setChoice={setInterestedSex}
				style={{ height: height * 0.194, width: width * 0.45 }}
			/>
			<CustomPicker
				data={lists.expectationList.slice(1)}
				visible={expectationVisible}
				setVisible={setExpectationVisible}
				setChoice={setExpectation}
				style={{ height: height * 0.38, width: width * 0.68 }}
			/>
			<CustomPicker
				data={lists.cityList}
				visible={cityVisible}
				setVisible={setCityVisible}
				setChoice={setCity}
				style={{ width: width * 0.45 }}
			/>
			<CustomPicker
				data={lists.signList.slice(1)}
				visible={signVisible}
				setVisible={setSignVisible}
				setChoice={setSign}
				style={{ height: height * 0.5, width: width * 0.6 }}
			/>
			<CustomPicker
				data={lists.dietList.slice(1)}
				visible={dietVisible}
				setVisible={setDietVisible}
				setChoice={setDiet}
				style={{ height: (6 * height) / 16, width: width * 0.6 }}
			/>
			<CustomPicker
				data={lists.smokeAndDrinkList.slice(1)}
				visible={drinkVisible}
				setVisible={setDrinkVisible}
				setChoice={setDrink}
				style={{ height: (5 * height) / 16, width: width * 0.6 }}
			/>
			<CustomPicker
				data={lists.smokeAndDrinkList.slice(1)}
				visible={smokeVisible}
				setVisible={setSmokeVisible}
				setChoice={setSmoke}
				style={{ height: (5 * height) / 16, width: width * 0.6 }}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	photosContainer: {
		//marginVertical: height * 0.01,
		height: height * 0.59,
		width: width,
		justifyContent: "center",
		alignItems: "center",
		marginTop: height * 0.005,
		//marginBottom: height * 0.04,
	},
	photo: {
		marginHorizontal: 15,
		height: height * 0.58,
		maxWidth: width * 0.92,
		aspectRatio: 1 / 1.4,
		backgroundColor: colors.white,
		borderRadius: 15,
		alignItems: "center",
		justifyContent: "center",
		alignSelf: "center",
		overflow: "hidden",
		elevation: 3,
		shadowOffset: {
			width: 0,
			height: 1,
		},
		shadowOpacity: 0.22,
		shadowRadius: 2.22,
	},
	placeHolder: {
		paddingTop: "1%",
		position: "absolute",
		alignSelf: "center",
		color: "#B6B6B6",
	},
	inputContainer: {
		marginTop: height * 0.012,
		marginBottom: height * 0.01,
	},
	inputContainerEditOn: {
		marginTop: height * 0.012,
		marginBottom: height * 0.01,
		borderRadius: width * 0.02,
		borderColor: colors.black,
		borderWidth: width * 0.002,
		borderStyle: "dashed",
		position: "relative",
		right: width * 0.013,
		bottom: width * 0.032,
		paddingTop: width * 0.018,
		paddingLeft: width * 0.013,
		borderColor: "#5E17EB",
	},
	input: {
		paddingBottom: "1%",
		marginTop: "3%",
		//textAlignVertical: "bottom",
		textAlign: "center",
		width: "100%",
		paddingTop: "3%",
		fontSize: Math.min(height * 0.021, width * 0.042),
	},
	label: {
		marginBottom: height * 0.0125,
		fontSize: width * 0.034,
	},
	labelEditOn: {
		marginBottom: height * 0.0125,
		fontSize: width * 0.034,
		color: "#5E17EB",
	},
	about: {
		marginTop: height * 0.01,
	},
	aboutEditOn: {
		marginTop: height * 0.01,
		borderRadius: width * 0.02,
		borderColor: colors.black,
		borderWidth: width * 0.002,
		borderStyle: "dashed",
		position: "relative",
		right: width * 0.013,
		bottom: width * 0.032,
		paddingTop: width * 0.018,
		paddingLeft: width * 0.013,
		borderColor: "#5E17EB",
	},
	aboutLabel: {
		fontFamily: "Poppins",
		fontSize: width * 0.034,
	},
	aboutLabelEditOn: {
		fontFamily: "Poppins",
		fontSize: width * 0.034,
		color: "#5E17EB",
	},
});
