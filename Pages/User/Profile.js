import React from "react";
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
	Image,
} from "react-native";
import commonStyles from "../../visualComponents/styles";
import { colors, GradientText, Gradient } from "../../visualComponents/colors";
import { Ionicons, MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import Carousel from "react-native-reanimated-carousel";
import * as SecureStore from "expo-secure-store";
import { StatusBar } from "expo-status-bar";

import { CustomPicker } from "../../visualComponents/customComponents";
import axios from "axios";
import { url } from "../../connection";
import { getAge } from "../../nonVisualComponents/generalFunctions";
import { genderList, signList } from "../../nonVisualComponents/Lists";
const { height, width } = Dimensions.get("window");

export default function Profile({ route, navigation }) {
	const [progressBarVisible, setVisibility] = React.useState(true);
	const [progress, setProgress] = React.useState(0);
	const animatedProgress = React.useRef(new Animated.Value(0)).current; // Progressi yap

	const [isEditable, setEditibility] = React.useState(false);
	const [genderVisible, setGenderVisible] = React.useState(false);
	const [signVisible, setSignVisible] = React.useState(false);

	const [userID, setUserID] = React.useState(null);

	const [name, setName] = React.useState("");
	const [major, setMajor] = React.useState("");
	const [age, setAge] = React.useState("");
	const [sex, setSex] = React.useState("");
	const [school, setSchool] = React.useState("");
	const [religion, setReligion] = React.useState("");
	const [sign, setSign] = React.useState("");
	const [diet, setDiet] = React.useState("");
	const [alcohol, setAlcohol] = React.useState("");
	const [smoke, setSmoke] = React.useState("");
	const [hobbies, setHobbies] = React.useState("");
	const [about, setAbout] = React.useState("");
	const [PHOTO_LIST, setPhotoList] = React.useState("");

	// const [userData, setUserData] = React.useState({
	// 	userID: "",
	// 	name: "",
	// 	major: "",
	// 	age: "",
	// 	sex: "",
	// 	school: "",
	// 	religion: "",
	// 	sign: "",
	// 	diet: "",
	// 	alcohol: "",
	// 	smoke: "",
	// 	hobbies: "",
	// 	about: "",
	// 	PhotoList: "",
	// });

	const [city, setCity] = React.useState([0, 1, 0]);

	const nameRef = React.useRef(new Animated.Value(0)).current;
	const majorRef = React.useRef(new Animated.Value(0)).current;
	const religionRef = React.useRef(new Animated.Value(0)).current;
	const signRef = React.useRef(new Animated.Value(0)).current;
	const dietRef = React.useRef(new Animated.Value(0)).current;
	const alcoholRef = React.useRef(new Animated.Value(0)).current;
	const smokeRef = React.useRef(new Animated.Value(0)).current;
	const hobbiesRef = React.useRef(new Animated.Value(0)).current;
	const aboutRef = React.useRef(new Animated.Value(0)).current;

	React.useEffect(async () => {
		const dataStr = await SecureStore.getItemAsync("userData");
		const data = JSON.parse(dataStr);

		setUserID(data.UserId);
		setName(data.Name + " " + data.Surname);
		setAge(getAge(data.Birth_date));
		setSex(genderList[data.Gender]);
		setSchool(data.School);
		setMajor(data.Major);
		setReligion(data.Din);
		setSign(data.Burc);
		setDiet(data.Beslenme);
		setAlcohol(data.Alkol);
		setSmoke(data.Sigara);
		setAbout(data.About);
		setPhotoList(data.Photo);
		setHobbies(data.interest);

		// setUserData({
		// 	userID: data.UserId,
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
	}, []);

	const handleSave = async () => {
		const lName = name.slice(name.lastIndexOf(" ") + 1);
		const fName = name.slice(0, name.lastIndexOf(" "));

		const dataToSend = {
			UserId: userID,
			Name: fName,
			Surname: lName,
			Gender: sex.key,
			Major: major,
			Din: religion,
			Burc: sign,
			Beslenme: diet,
			Alkol: alcohol,
			Sigara: smoke,
			About: about,
		};

		await axios
			.post(url + "/IdentityUpdate", dataToSend)
			.then(async (res) => {
				const dataStr = await SecureStore.getItemAsync("userData");
				const user = JSON.parse(dataStr);
				const toBeStored = { ...user, ...dataToSend };
				const toBeStoredStr = JSON.stringify(toBeStored);
				await SecureStore.setItemAsync("userData", toBeStoredStr);
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

	return (
		<View style={[commonStyles.Container, { alignItems: "center" }]}>
			<StatusBar style="dark" />
			<View
				style={{
					height: 100,
					width: "100%",
					backgroundColor: "#F4F3F3",
					elevation: 10,
				}}
			>
				<View name={"Header"} style={commonStyles.Header}>
					<View style={{ marginLeft: 20 }}>
						{isEditable ? (
							<TouchableOpacity onPress={() => setEditibility(!isEditable)}>
								<MaterialCommunityIcons
									name="arrow-left"
									size={30}
									color={colors.gray}
									style={{ paddingRight: 15 }}
								/>
							</TouchableOpacity>
						) : (
							<GradientText
								style={{ fontSize: 30, fontWeight: "bold", letterSpacing: 1.2 }}
								text={"Profilim"}
							/>
						)}
					</View>
					<View style={{ flexDirection: "row", alignSelf: "center" }}>
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
									const userStr = await SecureStore.getItemAsync("userData");
									const user = JSON.parse(userStr);

									navigation.navigate("Settings", {
										invisibility: user.Invisible == "1" ? true : false,
										campusGhost: user.BlockCampus == "1" ? true : false,
										schoolLover: user.OnlyCampus == "1" ? true : false,
										userID: user.UserId,
										sesToken: user.sesToken,
									});
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
			</View>
			{/* {progressBarVisible && (
				<View name={"Progress Bar Container"} style={styles.progressBarContainer}>
					<View style={{ marginLeft: 20 }}>
						<Text
							style={{ fontSize: 18, fontWeight: "bold", letterSpacing: 0.8, paddingBottom: 5 }}
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
								<Gradient style={{ borderRadius: 7, alignItems: "center" }}></Gradient>
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
			<ScrollView
				showsVerticalScrollIndicator={false}
				contentContainerStyle={{ width: width }}
				keyboardShouldPersistTaps="handled"
			>
				<KeyboardAvoidingView>
					<View name={"Photos"} style={[styles.photosContainer]}>
						{PHOTO_LIST && PHOTO_LIST.length != 0 ? (
							// TODO: styling should be implemented more resiliently
							<Carousel
								loop={false}
								mode={"parallax"}
								modeConfig={{
									parallaxScrollingOfset: 100,
									parallaxScrollingScale: 0.8,
								}}
								style={{ overflow: "visible", transform: [{ scale: 1.1 }] }}
								width={width * 0.7}
								data={PHOTO_LIST}
								renderItem={({ item }) => (
									<View style={[styles.photo]}>
										<Pressable
											onPress={() => {
												if (isEditable) {
													setEditibility(false);
													navigation.navigate("ProfilePhotos", {
														photoList: PHOTO_LIST,
														userID: userID,
													});
												}
											}}
										>
											<Image
												style={{ height: height / 2.8, aspectRatio: 2 / 3 }}
												resizeMode="contain"
												source={{ uri: item.PhotoLink }}
											/>
										</Pressable>
									</View>
								)}
							/>
						) : (
							<Pressable
								onPress={() => {
									navigation.replace("ProfilePhotos", {
										photoList: PHOTO_LIST,
										userID: userID,
									});
								}}
							>
								<View style={[styles.photo]}>
									<Feather name="plus" size={width / 8} color={colors.gray} />
								</View>
							</Pressable>
						)}
					</View>

					<View name={"Info"} style={{ paddingBottom: 50 }}>
						<View name={"Name"} style={[styles.inputContainer, { backgroundColor: colors.white }]}>
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
						</View>
						<View name={"Age"} style={[styles.inputContainer, { backgroundColor: colors.white }]}>
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
							<TextInput
								style={[styles.input, { color: colors.black }]}
								editable={false}
								value={age.toString()}
							/>
						</View>
						<View name={"Sex"} style={[styles.inputContainer, { backgroundColor: colors.white }]}>
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
						<View
							name={"School"}
							style={[styles.inputContainer, { backgroundColor: colors.white }]}
						>
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
							<TextInput
								style={[styles.input, { color: colors.black }]}
								editable={false}
								value={school}
							/>
						</View>
						<View
							name={"City"}
							style={[
								styles.inputContainer,
								{ backgroundColor: colors.white },
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
							<TextInput
								style={[styles.input, { color: colors.black }]}
								editable={false}
								value={getCityName()}
							/>
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
												}}
											>
												<Text style={{ color: colors.white }}>Ankara</Text>
											</Gradient>
										) : (
											<View
												style={{
													backgroundColor: colors.white,
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
												}}
											>
												<Text style={{ color: colors.white }}>İstanbul</Text>
											</Gradient>
										) : (
											<View
												style={{
													backgroundColor: colors.white,
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
												}}
											>
												<Text style={{ color: colors.white }}>İzmir</Text>
											</Gradient>
										) : (
											<View
												style={{
													backgroundColor: colors.white,
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

						<View name={"Major"} style={[styles.inputContainer, { backgroundColor: colors.white }]}>
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
						</View>

						<View
							name={"Religion"}
							style={[styles.inputContainer, { backgroundColor: colors.white }]}
						>
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
						</View>

						<View name={"Sign"} style={[styles.inputContainer, { backgroundColor: colors.white }]}>
							<Animated.Text
								style={[
									styles.placeHolder,
									{
										transform: [
											{
												translateY:
													sign == ""
														? signRef.interpolate({
																inputRange: [0, 1],
																outputRange: [0, -20],
														  })
														: -20,
											},
										],
										fontSize:
											sign == ""
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
							<Pressable
								onPress={
									isEditable
										? () => {
												setSignVisible(true);
										  }
										: () => {}
								}
							>
								<Text style={[styles.input, { color: colors.black }]}>{sign.choice}</Text>
							</Pressable>
						</View>

						<View name={"Diet"} style={[styles.inputContainer, { backgroundColor: colors.white }]}>
							<Animated.Text
								style={[
									styles.placeHolder,
									{
										transform: [
											{
												translateY:
													diet == ""
														? dietRef.interpolate({
																inputRange: [0, 1],
																outputRange: [0, -20],
														  })
														: -20,
											},
										],
										fontSize:
											diet == ""
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
							<TextInput
								editable={isEditable}
								style={[styles.input, { color: colors.black }]}
								onChangeText={setDiet}
								value={diet}
								onFocus={() => {
									handleFocus(dietRef);
								}}
								onBlur={() => {
									if (diet == "") handleBlur(dietRef);
								}}
							/>
						</View>

						<View
							name={"Alcohol"}
							style={[styles.inputContainer, { backgroundColor: colors.white }]}
						>
							<Animated.Text
								style={[
									styles.placeHolder,
									{
										transform: [
											{
												translateY:
													alcohol == ""
														? alcoholRef.interpolate({
																inputRange: [0, 1],
																outputRange: [0, -20],
														  })
														: -20,
											},
										],
										fontSize:
											alcohol == ""
												? alcoholRef.interpolate({
														inputRange: [0, 1],
														outputRange: [20, 15],
												  })
												: 15,
									},
								]}
							>
								Alkol Kullanımım
							</Animated.Text>
							<TextInput
								editable={isEditable}
								style={[styles.input, { color: colors.black }]}
								onChangeText={setAlcohol}
								value={alcohol}
								onFocus={() => {
									handleFocus(alcoholRef);
								}}
								onBlur={() => {
									if (alcohol == "") handleBlur(alcoholRef);
								}}
							/>
						</View>

						<View name={"Smoke"} style={[styles.inputContainer, { backgroundColor: colors.white }]}>
							<Animated.Text
								style={[
									styles.placeHolder,
									{
										transform: [
											{
												translateY:
													smoke == ""
														? smokeRef.interpolate({
																inputRange: [0, 1],
																outputRange: [0, -20],
														  })
														: -20,
											},
										],
										fontSize:
											smoke == ""
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
							<TextInput
								editable={isEditable}
								style={[styles.input, { color: colors.black }]}
								onChangeText={setSmoke}
								value={smoke}
								onFocus={() => {
									handleFocus(smokeRef);
								}}
								onBlur={() => {
									if (smoke == "") handleBlur(smokeRef);
								}}
							/>
						</View>

						<Pressable
							disabled={!isEditable}
							onPress={() => {
								if (isEditable) {
									navigation.replace("Hobbies", {
										hobbyList: hobbies,
										userID: userID,
										email: "",
										password: "",
									});
								}
							}}
						>
							<View
								name={"Hobbies"}
								style={[styles.inputContainer, { backgroundColor: colors.white }]}
							>
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
										},
									]}
								>
									<FlatList
										// style={{ backgroundColor: "blue" }}
										contentContainerStyle={{
											alignItems: "flex-end",
											paddingBottom: 12,
											paddingHorizontal: 20,
										}}
										keyExtractor={(item) => item.InterestName}
										horizontal={true}
										showsHorizontalScrollIndicator={false}
										data={hobbies}
										renderItem={({ item }) => {
											return (
												<Text style={{ color: colors.black, fontSize: 20 }}>
													{item.InterestName}
												</Text>
											);
										}}
										ItemSeparatorComponent={() =>
											// prettier-ignore
											<Text style={{ color: colors.gray, fontSize: 20 }}>  |  </Text>
										}
									/>
								</View>
							</View>
						</Pressable>
						<View
							name={"About"}
							style={[
								styles.inputContainer,
								{ backgroundColor: colors.white, height: height * 0.2 },
							]}
						>
							<Animated.Text
								style={[
									styles.placeHolder,
									{
										// top: 0,
										// padding: 20,
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
							<TextInput
								multiline={true}
								editable={isEditable}
								style={[
									styles.input,
									{
										color: colors.black,
										height: height * 0.16,
										textAlign: "left",
										textAlignVertical: "top",
									},
								]}
								onChangeText={setAbout}
								value={about}
								onFocus={() => {
									handleFocus(aboutRef);
								}}
								onBlur={() => {
									if (about == "") handleBlur(aboutRef);
								}}
							/>
						</View>
					</View>
				</KeyboardAvoidingView>
			</ScrollView>

			<CustomPicker
				data={genderList}
				visible={genderVisible}
				setVisible={setGenderVisible}
				setChoice={setSex}
			/>

			<CustomPicker
				data={signList}
				visible={signVisible}
				setVisible={setSignVisible}
				setChoice={setSign}
				style={{ height: height * 0.5, width: width * 0.6 }}
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
		width: "100%",
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
	},
	placeHolder: {
		position: "absolute",
		alignSelf: "center",
		color: "#B6B6B6",
	},
	inputContainer: {
		marginTop: 20,
		position: "relative",
		width: width * 0.85,
		height: 64,
		borderRadius: 12,
		alignSelf: "center",
		alignItems: "center",
		justifyContent: "center",
	},
	input: {
		textAlignVertical: "bottom",
		textAlign: "center",
		width: width * 0.75,
		height: 36,
		fontSize: 20,
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
