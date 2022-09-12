import { useContext, useRef, useState, useEffect } from "react";
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
} from "react-native";
import commonStyles from "../../visualComponents/styles";
import { colors, GradientText } from "../../visualComponents/colors";
import { MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import Carousel from "react-native-reanimated-carousel";
import { StatusBar } from "expo-status-bar";

import { CustomPicker } from "../../visualComponents/customComponents";
import axios from "axios";
import url from "../../connection";
import { getAge } from "../../utils/date.utils";
import crypto from "../../functions/crypto";
import { AuthContext } from "../../contexts/auth.context";
import CustomImage from "../../components/custom-image.component";
import CustomRadio from "../../components/custom-radio.component";
//import { Session } from "../../nonVisualComponents/SessionVariables";
import { ListsContext } from "../../contexts/lists.context";
const { height, width } = Dimensions.get("screen");

export default function Profile({ route, navigation }) {
	const { lists } = useContext(ListsContext);
	const { user, updateProfile } = useContext(AuthContext);
	const { matchMode } = user;

	const [isReady, setIsReady] = useState(false);
	const [isEditable, setEditibility] = useState(false);
	const [genderVisible, setGenderVisible] = useState(false);
	const [sexualOrientationVisible, setSexualOrientationVisible] = useState(false);
	const [expectationVisible, setExpectationVisible] = useState(false);
	const [signVisible, setSignVisible] = useState(false);
	const [dietVisible, setDietVisible] = useState(false);
	const [smokeVisible, setSmokeVisible] = useState(false);
	const [drinkVisible, setDrinkVisible] = useState(false);

	const [name, setName] = useState("");
	const [major, setMajor] = useState("");
	const [age, setAge] = useState("");
	const [sex, setSex] = useState("");
	const [sexualOrientation, setSexualOrientation] = useState("");
	const [expectation, setExpectation] = useState("");
	const [school, setSchool] = useState("");
	//const [religion, setReligion] = useState("");
	const [sign, setSign] = useState("");
	const [diet, setDiet] = useState("");
	const [drink, setDrink] = useState("");
	const [smoke, setSmoke] = useState("");
	const [hobbies, setHobbies] = useState("");
	const [about, setAbout] = useState("");

	const [city, setCity] = useState([0, 1, 0]);

	const nameRef = useRef(new Animated.Value(0)).current;
	const majorRef = useRef(new Animated.Value(0)).current;
	//const religionRef = useRef(new Animated.Value(0)).current;
	const signRef = useRef(new Animated.Value(0)).current;
	const dietRef = useRef(new Animated.Value(0)).current;
	const drinkRef = useRef(new Animated.Value(0)).current;
	const smokeRef = useRef(new Animated.Value(0)).current;
	const hobbiesRef = useRef(new Animated.Value(0)).current;
	const aboutRef = useRef(new Animated.Value(0)).current;

	// useEffect(() => {
	// 	const backAction = () => {
	// 		navigation.replace("MainScreen", { screen: "AnaSayfa" });
	// 		return true;
	// 	};
	// 	const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);
	// 	return () => backHandler.remove();
	// }, []);

	useEffect(() => {
		const profile = async () => {
			try {
				setName(user.Name + " " + user.Surname);
				setAge(getAge(user.Birth_date).toString());
				setSex(user.Gender == "null" ? "" : lists.genderList[user.Gender]);
				setSexualOrientation(
					user.InterestedSex == "null" ? "" : lists.sexualOrientationList[user.InterestedSex]
				);
				setExpectation(user.Expectation == "null" ? "" : lists.expectationList[user.Expectation]);
				setSchool(user.School);
				setMajor(user.Major == "null" ? "" : user.Major);
				//setReligion(user.Din == "null" ? "" : user.Din);

				setSign(user.Burc == "null" ? lists.signList[0] : lists.signList[user.Burc]);
				setDiet(user.Beslenme == "null" ? lists.dietList[0] : lists.dietList[user.Beslenme]);
				setDrink(
					user.Alkol == "null" ? lists.smokeAndDrinkList[0] : lists.smokeAndDrinkList[user.Alkol]
				);
				setSmoke(
					user.Sigara == "null" ? lists.smokeAndDrinkList[0] : lists.smokeAndDrinkList[user.Sigara]
				);

				/*
				setSign(getChoice(data.Burc, signList));
				setDiet(getChoice(data.Beslenme, dietList));
				setDrink(getChoice(data.Alkol, smokeAndDrinkList));
				setSmoke(getChoice(data.Sigara, smokeAndDrinkList));
				*/

				setAbout(user.About == "null" ? "" : user.About);
				//setPhotoList(user.Photo);
				setHobbies(user.interest);
				// setUserData({
				// 	userId: data.userId,
				// 	name: data.Name + " " + data.Surname,
				// 	major: data.Major,
				// 	age: getAge(data.Birth_date),
				// 	sex: GENDER_LIST[data.Gender],
				// 	school: data.School,
				// 	religion: data.Din,
				// 	sign: data.Burc,
				// 	diet: data.Beslenme,
				// 	alcohol: data.Alkol,
				// 	smoke: data.Sigara,
				// 	hobbies: data.interest,
				// 	about: data.About,
				// 	PhotoList: data.Photo,
				// });
			} finally {
				setIsReady(true);
			}
		};
		profile().catch(console.err);
	}, []);

	const handleSave = async () => {
		const lName = name.slice(name.lastIndexOf(" ") + 1);
		const fName = name.slice(0, name.lastIndexOf(" "));

		const dataRaw = {
			userId: user.userId,
			Name: fName,
			Surname: lName,
			Gender: sex.key,
			InterestedSex: sexualOrientation.key,
			Expectation: expectation.key,
			Major: major,
			//Din: religion,
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

		// const newData = { Name: name, Gender: sex.key,  }; // TODO: add new data here and both save them to local and send to database
	};

	const getCityName = () => {
		if (city[0]) {
			return "Ankara";
		} else if (city[1]) {
			return "İstanbul";
		} else return "İzmir";
	};

	const handleFocus = (ref) => {
		Animated.timing(ref, {
			useNativeDriver: false,
			toValue: 1,
			duration: 150,
		}).start();
	};

	const handleBlur = (ref) => {
		Animated.timing(ref, {
			useNativeDriver: false,
			toValue: 0,
			duration: 150,
		}).start();
	};

	const handleMatchModeChange = (index) => {
		if (matchMode == index) {
			return;
		}

		const dataToBeSent = crypto.encrypt({
			userId: user.userId,
			matchMode: index.toString(),
		});

		axios
			.post(url + "/profile/matchMode", dataToBeSent, {
				headers: { "access-token": user.sesToken },
			}) // There is a typo (not Change but Chage) TODO: make userId variable
			.then(async (res) => {
				console.log(res.data);

				updateProfile({ matchMode: index.toString() });
			})
			.catch((error) => {
				console.log("Match Mode Error: ", error);
			});
	};

	if (!isReady)
		return (
			<View style={[commonStyles.Container, { justifyContent: "center" }]}>
				<StatusBar style="dark" />
				<ActivityIndicator animating={true} color={"rgba(100, 60, 248, 1)"} size={"large"} />
			</View>
		);

	return (
		<View style={[commonStyles.Container, { alignItems: "center" }]}>
			<StatusBar style="dark" backgroundColor={"#F4F3F3"} />
			<View
				style={{
					height: height * 0.08,
					width: "100%",
					backgroundColor: "#F4F3F3",
					elevation: 10,
					flexDirection: "row",
					alignItems: "flex-end",
					paddingBottom: height * 0.02,
					justifyContent: "space-between",
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
						<GradientText
							style={{ fontSize: height * 0.035, fontFamily: "NowBold", letterSpacing: 1.2 }}
							text={"Profilim"}
						/>
					)}
				</View>
				<View style={{ flexDirection: "row" }}>
					{isEditable ? (
						<TouchableOpacity
							onPress={() => {
								setEditibility(false);
								handleSave();
							}}
						>
							<GradientText
								style={{ fontSize: 25, letterSpacing: 1.2, paddingRight: 15 }}
								text={"Kaydet"}
							/>
						</TouchableOpacity>
					) : (
						<TouchableOpacity
							onPress={() => {
								setEditibility(true);
							}}
						>
							<MaterialCommunityIcons
								name="pencil"
								size={27}
								color={colors.gray}
								style={{ paddingRight: 15 }}
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
								style={{ paddingRight: 15 }}
							/>
						</TouchableOpacity>
					)}
				</View>
			</View>
			{/* {progressBarVisible && (
				<View name={"Progress Bar Container"} style={styles.progressBarContainer}>
					<View style={{ marginLeft: 20 }}>
						<Text
							style={{ fontSize: 18, fontFamily: "PoppinsSemiBold", letterSpacing: 0.8, paddingBottom: 5 }}
						>
							Profilinin %{progress}'ı tamam!
						</Text>
						<View style={styles.progressBarBackground}>
							<Animated.View
								style={[
									{
										height: 9,
										borderRadius: 7,
										width: animatedProgress.interpolate({
											inputRange: [0, 4],
											outputRange: [28, 140],
										}),
									},
								]}
							>
								<Gradient style={{ borderRadius: 7, alignItems: "center", width: "100%",height: "100%"}}></Gradient>
							</Animated.View>
						</View>
					</View>
					<TouchableOpacity
						style={{ marginRight: 20 }}
						onPress={() => {
							setVisibility(false);
						}}
					>
						<Ionicons name="close" size={32} color="#B6B6B6" />
					</TouchableOpacity>
				</View>
			)} */}
			<KeyboardAvoidingView
				style={{ flex: 1, flexDirection: "column", justifyContent: "center" }}
				behavior="height"
			>
				<ScrollView
					showsVerticalScrollIndicator={false}
					contentContainerStyle={{ width: width }}
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
									overflow: "visible",
									transform: [{ scale: 1.1 }],
									width: width * 0.95,
									justifyContent: "center",
								}}
								width={width * 0.7}
								data={user.Photo.length <= 4 ? [...user.Photo, "Add Photo"] : user.Photo}
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
													style={{ height: height / 2.8, aspectRatio: 2 / 3, resizeMode: "cover" }}
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

					<View style={{ width: "100%", alignItems: "center", marginTop: 35, marginBottom: 5 }}>
						<CustomRadio
							horizontal={true}
							list={["Flört Modu", "Arkadaşlık Modu"]}
							listItemStyle={{
								width: width * 0.4,
								aspectRatio: 3 / 1,
								borderRadius: (width * 0.4) / 6,
							}}
							index={matchMode}
							setIndex={(index) => {
								handleMatchModeChange(index);
							}}
						/>
					</View>

					<View name={"Info"} style={{ paddingBottom: 40 }}>
						<View name={"Name"} style={[styles.inputContainer, {}]}>
							<Animated.Text
								style={[
									styles.placeHolder,
									{
										transform: [
											{
												translateY:
													name == ""
														? nameRef.interpolate({
																inputRange: [0, 1],
																outputRange: [0, -20],
														  })
														: -20,
											},
										],
										fontSize:
											name == ""
												? nameRef.interpolate({
														inputRange: [0, 1],
														outputRange: [20, 15],
												  })
												: 15,
									},
								]}
							>
								Adım
							</Animated.Text>

							{!isEditable ? (
								<Text style={[styles.input, { color: colors.black }]}>{name}</Text>
							) : (
								<TextInput
									editable={isEditable}
									style={[styles.input, { color: colors.black }]}
									onChangeText={setName}
									value={name}
									onFocus={() => {
										handleFocus(nameRef);
									}}
									onBlur={() => {
										if (name == "") handleBlur(nameRef);
									}}
								/>
							)}
						</View>

						<View name={"Age"} style={[styles.inputContainer, {}]}>
							<Text
								style={[
									styles.placeHolder,
									{
										transform: [
											{
												translateY: -20,
											},
										],
										fontSize: 15,
									},
								]}
							>
								Yaşım
							</Text>
							<Text style={[styles.input, { color: colors.black }]}>{age.toString()}</Text>
						</View>

						<View name={"Sex"} style={[styles.inputContainer, {}]}>
							<Text
								style={[
									styles.placeHolder,
									{
										transform: [
											{
												translateY: -20,
											},
										],
										fontSize: 15,
									},
								]}
							>
								Cinsiyetim
							</Text>
							<Pressable
								onPress={
									isEditable
										? () => {
												setGenderVisible(true);
										  }
										: () => {}
								}
							>
								<Text style={[styles.input, { color: colors.black }]}>{sex.choice}</Text>
							</Pressable>
						</View>

						<View name={"SexualOrientation"} style={[styles.inputContainer, {}]}>
							<Text
								style={[
									styles.placeHolder,
									{
										transform: [
											{
												translateY: -20,
											},
										],
										fontSize: 15,
									},
								]}
							>
								İlgi Duyduğum
							</Text>
							<Pressable
								onPress={
									isEditable
										? () => {
												setSexualOrientationVisible(true);
										  }
										: () => {}
								}
							>
								<Text style={[styles.input, { color: colors.black }]}>
									{sexualOrientation.choice}
								</Text>
							</Pressable>
						</View>

						<View name={"Expectation"} style={[styles.inputContainer, {}]}>
							<Text
								style={[
									styles.placeHolder,
									{
										transform: [
											{
												translateY: -20,
											},
										],
										fontSize: 15,
									},
								]}
							>
								dorm'dan Beklentim
							</Text>
							<Pressable
								onPress={
									isEditable
										? () => {
												setExpectationVisible(true);
										  }
										: () => {}
								}
							>
								<Text style={[styles.input, { color: colors.black }]}>{expectation.choice}</Text>
							</Pressable>
						</View>

						<View name={"School"} style={[styles.inputContainer, {}]}>
							<Animated.Text
								style={[
									styles.placeHolder,
									{
										transform: [
											{
												translateY: -20,
											},
										],
										fontSize: 15,
									},
								]}
							>
								Okulum
							</Animated.Text>
							{/* <TextInput
								style={[styles.input, { color: colors.black }]}
								editable={false}
								value={school}
							/> */}
							<Text style={[styles.input, { color: colors.black }]}>{school}</Text>
						</View>

						<View
							name={"City"}
							style={[
								styles.inputContainer,
								{},
								// { backgroundColor: isEditable ? "transparent" : colors.white },
							]}
						>
							<Text
								style={[
									styles.placeHolder,
									{
										transform: [
											{
												translateY: -20,
											},
										],
										fontSize: 15,
									},
								]}
							>
								Yaşadığım Şehir
							</Text>
							<Text style={[styles.input, { color: colors.black }]}>{getCityName()}</Text>
							{/* <TextInput
								style={[styles.input, { color: colors.black }]}
								editable={false}
								value={getCityName()}
							/> */}

							{/* {!isEditable ? (
								<TextInput
									style={[styles.input, { color: colors.black }]}
									editable={false}
									value={getCityName()}
								/>
							) : (
								<View style={{ flexDirection: "row", marginTop: 60 }}>
									<Pressable
										onPress={() => {
											setCity([1, 0, 0]);
										}}
										style={{
											marginHorizontal: width / 50,
											width: width / 4,
											height: width / 8,
											borderRadius: width / 16,
											overflow: "hidden",
										}}
									>
										{city[0] == 1 ? (
											<Gradient
												style={{
													justifyContent: "center",
													alignItems: "center",
													width: "100%",
													height: "100%"
												}}
											>
												<Text style={{ color: colors.white }}>Ankara</Text>
											</Gradient>
										) : (
											<View
												style={{
													
													height: "100%",
													justifyContent: "center",
													alignItems: "center",
												}}
											>
												<Text style={{ color: colors.black }}>Ankara</Text>
											</View>
										)}
									</Pressable>
									<Pressable
										// onPress={() => {
										// 	setCity([0, 1, 0]);
										// }}
										style={{
											marginHorizontal: width / 50,
											width: width / 4,
											height: width / 8,
											borderRadius: width / 16,
											overflow: "hidden",
										}}
									>
										{city[1] == 1 ? (
											<Gradient
												style={{
													justifyContent: "center",
													alignItems: "center", 
													width: "100%",
													height: "100%"
												}}
											>
												<Text style={{ color: colors.white }}>İstanbul</Text>
											</Gradient>
										) : (
											<View
												style={{
													
													height: "100%",
													justifyContent: "center",
													alignItems: "center",
												}}
											>
												<Text style={{ color: colors.black }}>İstanbul</Text>
											</View>
										)}
									</Pressable>
									<Pressable
										onPress={() => {
											setCity([0, 0, 1]);
										}}
										style={{
											marginHorizontal: width / 50,
											width: width / 4,
											height: width / 8,
											borderRadius: width / 16,
											overflow: "hidden",
										}}
									>
										{city[2] == 1 ? (
											<Gradient
												style={{
													justifyContent: "center",
													alignItems: "center", 
													width: "100%",
													height: "100%"
												}}
											>
												<Text style={{ color: colors.white }}>İzmir</Text>
											</Gradient>
										) : (
											<View
												style={{
													
													height: "100%",
													justifyContent: "center",
													alignItems: "center",
												}}
											>
												<Text style={{ color: colors.black }}>İzmir</Text>
											</View>
										)}
									</Pressable>
								</View>
							)} */}
						</View>

						<View name={"Major"} style={[styles.inputContainer, {}]}>
							<Animated.Text
								style={[
									styles.placeHolder,
									{
										transform: [
											{
												translateY:
													major == ""
														? majorRef.interpolate({
																inputRange: [0, 1],
																outputRange: [0, -20],
														  })
														: -20,
											},
										],
										fontSize:
											major == ""
												? majorRef.interpolate({
														inputRange: [0, 1],
														outputRange: [20, 15],
												  })
												: 15,
									},
								]}
							>
								Bölümüm
							</Animated.Text>

							{!isEditable ? (
								<Text style={[styles.input, { color: colors.black }]}>{major}</Text>
							) : (
								<TextInput
									editable={isEditable}
									style={[styles.input, { color: colors.black }]}
									onChangeText={setMajor}
									value={major}
									onFocus={() => {
										handleFocus(majorRef);
									}}
									onBlur={() => {
										if (major == "") handleBlur(majorRef);
									}}
								/>
							)}
						</View>

						{/* <View name={"Religion"} style={[styles.inputContainer, {}]}>
							<Animated.Text
								style={[
									styles.placeHolder,
									{
										transform: [
											{
												translateY:
													religion == ""
														? religionRef.interpolate({
																inputRange: [0, 1],
																outputRange: [0, -20],
														  })
														: -20,
											},
										],
										fontSize:
											religion == ""
												? religionRef.interpolate({
														inputRange: [0, 1],
														outputRange: [20, 15],
												  })
												: 15,
									},
								]}
							>
								Dini İnancım
							</Animated.Text>
							<TextInput
								editable={isEditable}
								style={[styles.input, { color: colors.black }]}
								onChangeText={setReligion}
								value={religion}
								onFocus={() => {
									handleFocus(religionRef);
								}}
								onBlur={() => {
									if (religion == "") handleBlur(religionRef);
								}}
							/>
						</View> */}

						<View name={"Sign"} style={[styles.inputContainer, {}]}>
							<Pressable
								style={{ width: "100%", alignItems: "center", justifyContent: "center" }}
								onPress={
									isEditable
										? () => {
												setSignVisible(true);
										  }
										: () => {}
								}
							>
								<Animated.Text
									style={[
										styles.placeHolder,
										{
											transform: [
												{
													translateY:
														sign.choice == ""
															? signRef.interpolate({
																	inputRange: [0, 1],
																	outputRange: [0, -20],
															  })
															: -20,
												},
											],
											fontSize:
												sign.choice == ""
													? signRef.interpolate({
															inputRange: [0, 1],
															outputRange: [20, 15],
													  })
													: 15,
										},
									]}
								>
									Burcum
								</Animated.Text>
								<Text style={[styles.input, { color: colors.black }]}>{sign.choice}</Text>
							</Pressable>
						</View>

						<View name={"Diet"} style={[styles.inputContainer, {}]}>
							<Pressable
								style={{ width: "100%", alignItems: "center", justifyContent: "center" }}
								onPress={
									isEditable
										? () => {
												setDietVisible(true);
										  }
										: () => {}
								}
							>
								<Animated.Text
									style={[
										styles.placeHolder,
										{
											transform: [
												{
													translateY:
														diet.choice == ""
															? dietRef.interpolate({
																	inputRange: [0, 1],
																	outputRange: [0, -20],
															  })
															: -20,
												},
											],
											fontSize:
												diet.choice == ""
													? dietRef.interpolate({
															inputRange: [0, 1],
															outputRange: [20, 15],
													  })
													: 15,
										},
									]}
								>
									Beslenme Tercihim
								</Animated.Text>
								<Text style={[styles.input, { color: colors.black }]}>{diet.choice}</Text>
							</Pressable>
						</View>

						<View name={"Alcohol"} style={[styles.inputContainer, {}]}>
							<Pressable
								style={{ width: "100%", alignItems: "center", justifyContent: "center" }}
								onPress={
									isEditable
										? () => {
												setDrinkVisible(true);
										  }
										: () => {}
								}
							>
								<Animated.Text
									style={[
										styles.placeHolder,
										{
											transform: [
												{
													translateY:
														drink.choice == ""
															? drinkRef.interpolate({
																	inputRange: [0, 1],
																	outputRange: [0, -20],
															  })
															: -20,
												},
											],
											fontSize:
												drink.choice == ""
													? drinkRef.interpolate({
															inputRange: [0, 1],
															outputRange: [20, 15],
													  })
													: 15,
										},
									]}
								>
									Alkol Kullanımım
								</Animated.Text>
								<Text style={[styles.input, { color: colors.black }]}>{drink.choice}</Text>
							</Pressable>
						</View>

						<View name={"Smoke"} style={[styles.inputContainer, {}]}>
							<Pressable
								style={{ width: "100%", alignItems: "center", justifyContent: "center" }}
								onPress={
									isEditable
										? () => {
												setSmokeVisible(true);
										  }
										: () => {}
								}
							>
								<Animated.Text
									style={[
										styles.placeHolder,
										{
											transform: [
												{
													translateY:
														smoke.choice == ""
															? smokeRef.interpolate({
																	inputRange: [0, 1],
																	outputRange: [0, -20],
															  })
															: -20,
												},
											],
											fontSize:
												smoke.choice == ""
													? smokeRef.interpolate({
															inputRange: [0, 1],
															outputRange: [20, 15],
													  })
													: 15,
										},
									]}
								>
									Sigara Kullanımım
								</Animated.Text>
								<Text style={[styles.input, { color: colors.black }]}>{smoke.choice}</Text>
							</Pressable>
						</View>

						<Pressable
							disabled={!isEditable}
							onPress={async () => {
								if (isEditable) {
									handleSave();
									navigation.push("Hobbies", {
										isNewUser: false,
									});
								}
							}}
						>
							<View name={"Hobbies"} style={[styles.inputContainer, {}]}>
								<Animated.Text
									style={[
										styles.placeHolder,
										{
											transform: [
												{
													translateY:
														hobbies == ""
															? hobbiesRef.interpolate({
																	inputRange: [0, 1],
																	outputRange: [0, -20],
															  })
															: -20,
												},
											],
											fontSize:
												hobbies == ""
													? hobbiesRef.interpolate({
															inputRange: [0, 1],
															outputRange: [20, 15],
													  })
													: 15,
										},
									]}
								>
									İlgi Alanlarım
								</Animated.Text>
								<View
									style={[
										{
											width: "100%",
											height: "100%",
											// paddingHorizontal: "5%",
											// paddingTop: "3%",
										},
									]}
								>
									<FlatList
										// style={{ backgroundColor: "blue" }}
										contentContainerStyle={{
											alignItems: "flex-end",
											// paddingBottom: 12,
											// paddingHorizontal: 20,
											height: "100%",
											paddingTop: "3%",
											paddingHorizontal: "5%",
										}}
										keyExtractor={(item) => item.InterestName}
										horizontal={true}
										showsHorizontalScrollIndicator={false}
										data={hobbies}
										renderItem={({ item }) => {
											return (
												<Text
													style={{
														color: colors.black,
														fontSize: Math.min(height * 0.023, width * 0.05),
													}}
												>
													{item.InterestName}
												</Text>
											);
										}}
										ItemSeparatorComponent={() => (
											<Text
												style={[
													{ color: colors.gray, fontSize: Math.min(height * 0.023, width * 0.05) },
												]}
											>
												{" "}
												|{" "}
											</Text>
										)}
									/>
								</View>
							</View>
						</Pressable>
						<View name={"About"} style={[styles.inputContainer, { height: height * 0.19 }]}>
							<Animated.Text
								style={[
									styles.placeHolder,
									{
										// top: 0,
										// padding: 20,
										paddingTop: "5%",
										transform: [
											{
												translateY:
													about == ""
														? aboutRef.interpolate({
																inputRange: [0, 1],
																outputRange: [0, -75],
														  })
														: -75,
											},
											{
												scale: aboutRef.interpolate({
													inputRange: [0, 1],
													outputRange: [1.2, 1],
												}),
											},
										],
										fontSize:
											about == ""
												? aboutRef.interpolate({
														inputRange: [0, 1],
														outputRange: [20, 15],
												  })
												: 15,
									},
								]}
							>
								Hakkımda
							</Animated.Text>
							{!isEditable ? (
								<Text
									style={[
										styles.input,
										{
											color: colors.black,
											height: height * 0.15,
											width: "95%",
											marginHorizontal: "3%",
											marginBottom: "1%",
											marginTop: "3%",
											textAlign: "left",
											textAlignVertical: "top",
										},
									]}
								>
									{about}
								</Text>
							) : (
								<TextInput
									multiline={true}
									editable={isEditable}
									style={[
										styles.input,
										{
											color: colors.black,
											height: height * 0.15,
											width: "95%",
											marginBottom: "1%",
											marginTop: "3%",
											marginHorizontal: "3%",
											textAlign: "left",
											textAlignVertical: "top",
										},
									]}
									numberOfLines={4}
									maxLength={110}
									onChangeText={setAbout}
									value={about}
									onFocus={() => {
										handleFocus(aboutRef);
									}}
									onBlur={() => {
										if (about == "") handleBlur(aboutRef);
									}}
								/>
							)}
						</View>
					</View>
				</ScrollView>
			</KeyboardAvoidingView>

			<CustomPicker
				data={lists.genderList.slice(0, 4)}
				visible={genderVisible}
				setVisible={setGenderVisible}
				setChoice={setSex}
				style={{ height: height * 0.26, width: width * 0.624 }}
			/>

			<CustomPicker
				data={lists.sexualOrientationList.slice(1)}
				visible={sexualOrientationVisible}
				setVisible={setSexualOrientationVisible}
				setChoice={setSexualOrientation}
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
	progressBarContainer: {
		height: height / 12,
		width: width / 1.1,
		borderRadius: height / 60,
		backgroundColor: colors.white,
		alignItems: "center",
		flexDirection: "row",
		justifyContent: "space-between",
		position: "absolute",
		marginTop: 120,
		zIndex: 2,
		elevation: 3,
		shadowColor: "rgba(58, 41, 106, 1)",
		shadowOffset: { width: 0, height: 10 },
		shadowRadius: 10,
	},
	progressBarBackground: {
		marginTop: 0,
		paddingHorizontal: 2,
		height: 12,
		width: 190,
		borderRadius: 12,
		backgroundColor: "#DDDDDD",
		justifyContent: "center",
	},
	photosContainer: {
		marginTop: 20,
		height: height / 2.8,
		width: width,
		justifyContent: "center",
		alignItems: "center",
	},
	photo: {
		marginHorizontal: 15,
		height: height / 2.8,
		aspectRatio: 1 / 1.5,
		backgroundColor: colors.white,
		borderRadius: 20,
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
		marginTop: 22,
		position: "relative",
		width: Math.min(width * 0.85, 600),
		height: Math.min(width * 0.165, 100),
		borderRadius: 12,
		alignSelf: "center",
		//alignItems: "center",
		justifyContent: "center",
		backgroundColor: colors.white,
	},
	input: {
		paddingBottom: "1%",
		marginTop: "3%",
		//textAlignVertical: "bottom",
		textAlign: "center",
		width: "100%",
		paddingTop: "3%",
		fontSize: Math.min(height * 0.023, width * 0.05),
	},
	modalContainer: {
		borderRadius: 20,
		backgroundColor: colors.white,
		height: height / 4,
		width: width / 2,
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
});
