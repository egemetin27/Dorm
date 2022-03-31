import React from "react";
import {
	StyleSheet,
	Text,
	View,
	TouchableOpacity,
	Dimensions,
	FlatList,
	Image,
	Pressable,
	ScrollView,
	Alert,
	BackHandler,
	ActivityIndicator,
	Platform,
	TextInput,
} from "react-native";
import { Octicons, MaterialCommunityIcons, Ionicons, Entypo } from "@expo/vector-icons";
import * as SecureStore from "expo-secure-store";
import { StatusBar } from "expo-status-bar";

import commonStyles from "../../visualComponents/styles";
import { colors, GradientText, Gradient } from "../../visualComponents/colors";
import axios from "axios";
import { url } from "../../connection";
import { getAge } from "../../nonVisualComponents/generalFunctions";

const { height, width } = Dimensions.get("window");

import { API, graphqlOperation } from "aws-amplify";
import { getMsgUser } from "../../src/graphql/queries";
import { createMsgUser, updateMsgUser } from "../../src/graphql/mutations";
import { Constants } from "@aws-amplify/core";
import * as Notifications from "expo-notifications";
import { useSafeAreaFrame } from "react-native-safe-area-context";
import { CustomModal } from "../../visualComponents/customComponents";
import { color } from "react-native-reanimated";

const CategoryList = [
	{
		key: "Tümü",
		// url: "",
		url: require("../../assets/HomeScreenCategoryIcons/AllEvents.png"),
	},
	{
		key: "Favorilerin",
		url: require("../../assets/HomeScreenCategoryIcons/Favs.png"),
	},
	{
		key: "Kaçmaz",
		url: require("../../assets/HomeScreenCategoryIcons/Hot.png"),
	},
	// { key: "Mekan", url: require("../../assets/HomeScreenCategoryIcons/Location.png") },
	{
		key: "Kampüs",
		url: require("../../assets/HomeScreenCategoryIcons/Campus.png"),
	},
	{
		key: "Kültür",
		url: require("../../assets/HomeScreenCategoryIcons/Culture.png"),
	},
	{
		key: "Konser",
		url: require("../../assets/HomeScreenCategoryIcons/Concert.png"),
	},
	{
		key: "Filmler",
		url: require("../../assets/HomeScreenCategoryIcons/Movies.png"),
	},
];

const People = ({ person, openProfiles, index, length, setIsAppReady }) => {
	const {
		Name: name,
		Birth_Date: bDay,
		School: university,
		Major: major,
		photos: photoList,
	} = person;

	const age = getAge(bDay);

	return (
		<Pressable
			onPress={() => {
				setIsAppReady(false);
				openProfiles(index);
			}}
			style={[
				commonStyles.photo,
				{
					height: "95%",
					backgroundColor: colors.cool_gray,
					marginHorizontal: 0,
					marginLeft: 15,
					marginRight: index + 1 == length ? 15 : 0,
				},
			]}
		>
			{photoList.length > 0 ? (
				<Image
					source={{ uri: photoList[0]?.PhotoLink }}
					style={{ width: "100%", height: "100%", resizeMode: "cover" }}
				/>
			) : (
				<Ionicons name="person" color="white" size={60} />
			)}

			<Gradient
				colors={["rgba(0,0,0,0.01)", "rgba(0,0,0,0.1)", "rgba(0,0,0,0.75)"]}
				locations={[0, 0.1, 1]}
				start={{ x: 0.5, y: 0 }}
				end={{ x: 0.5, y: 1 }}
				style={{
					height: height * 0.08,
					width: "100%",
					position: "absolute",
					justifyContent: "flex-end",
					paddingBottom: height * 0.005,
					bottom: 0,
					paddingHorizontal: width * 0.02,
				}}
			>
				<View
					style={{
						flexDirection: "row",
					}}
				>
					<View style={{ flexShrink: 1 }}>
						<Text
							numberOfLines={1}
							style={{
								width: "100%",
								color: colors.white,
								fontSize: height * 0.02,
								lineHeight: height * 0.025,
								fontFamily: "PoppinsSemiBold",
								letterSpacing: 1.05,
							}}
						>
							{name}
						</Text>
					</View>
					<Text
						style={{
							color: colors.white,
							fontSize: height * 0.02,
							lineHeight: height * 0.025,
							fontFamily: "PoppinsSemiBold",
							letterSpacing: 1.05,
						}}
					>
						{" "}
						• {age}
					</Text>
				</View>
				<Text
					numberOfLines={2}
					style={{
						paddingTop: height * 0.002,
						color: colors.white,
						fontFamily: "PoppinsItalic",
						fontSize: height * 0.015,
						lineHeight: height * 0.018,
					}}
				>
					{university}
					{"\n"}
					{major}
				</Text>
			</Gradient>
		</Pressable>
	);
};

const Category = ({
	index,
	userID,
	selectedCategory,
	setSelectedCategory,
	setShownEvents,
	eventList,
	children,
}) => {
	const filterEvents = async (idx) => {
		if (idx == 0) {
			setShownEvents(eventList);
			return;
		}
		if (idx == 1) {
			const filtered = eventList.filter((item) => item.isLiked == 1);
			setShownEvents(filtered);
			return;
		}
		if (idx == 2) {
			const filtered = eventList.filter((item) => item.Kacmaz == 1);
			setShownEvents(filtered);
			return;
		}
		if (idx == 3) {
			const filtered = eventList.filter((item) => item.Kampus == 1);
			setShownEvents(filtered);
			return;
		}
		if (idx == 4) {
			const filtered = eventList.filter((item) => item.Culture == 1);
			setShownEvents(filtered);
			return;
		}
		if (idx == 5) {
			const filtered = eventList.filter((item) => item.Konser == 1);
			setShownEvents(filtered);
			return;
		}
		if (idx == 6) {
			const filtered = eventList.filter((item) => item.Film == 1);
			setShownEvents(filtered);
			return;
		}
	};

	return (
		<View
			style={[
				commonStyles.photo,
				{
					height: "70%",
					borderRadius: 15,
					aspectRatio: 1 / 1,
					marginHorizontal: 0,
					marginLeft: 15,
					marginRight: index + 1 == CategoryList.length ? 15 : 0,
					backgroundColor: selectedCategory == index ? "transparent" : colors.white,
				},
			]}
		>
			{selectedCategory == index && (
				<Gradient style={{ position: "absolute", width: "100%", height: "100%" }} />
			)}

			<Pressable
				onPress={() => {
					setSelectedCategory(index);
					filterEvents(index);
				}}
				style={{ width: "100%" }}
			>
				<View
					name={"icon"}
					style={{
						width: "100%",
						height: "60%",
						alignItems: "center",
						justifyContent: "center",
					}}
				>
					<Image
						style={[
							styles.categoryIcon,
							{
								tintColor: selectedCategory == index ? colors.white : colors.cool_gray,
							},
						]}
						source={children.url}
					/>
				</View>

				<View name={"name"} style={{ width: "100%", height: "40%", alignItems: "center" }}>
					<Text
						numberOfLines={1}
						adjustsFontSizeToFit={true}
						style={{
							fontSize: width * 0.035,
							color: selectedCategory == index ? colors.white : colors.cool_gray,
						}}
					>
						{children.key}
					</Text>
				</View>
			</Pressable>
		</View>
	);
};
const Event = ({ event, openEvents, index, length, setIsAppReady }) => {
	const { Description, Date, StartTime, Location, photos } = event;

	return (
		<Pressable
			onPress={() => {
				setIsAppReady(false);
				openEvents(index);
			}}
			style={[
				commonStyles.photo,
				{
					height: "95%",
					backgroundColor: colors.cool_gray,
					marginHorizontal: 0,
					marginLeft: 15,
					marginRight: index + 1 == length ? 15 : 0,
				},
			]}
		>
			<Image
				source={{ uri: photos.length > 0 ? photos[0] : "AAAA" }}
				style={{ width: "100%", height: "100%", resizeMode: "cover" }}
			/>
			<Gradient
				colors={["rgba(0,0,0,0.01)", "rgba(0,0,0,0.1)", "rgba(0,0,0,0.75)"]}
				locations={[0, 0.1, 1]}
				start={{ x: 0.5, y: 0 }}
				end={{ x: 0.5, y: 1 }}
				style={{
					height: height * 0.08,
					width: "100%",
					position: "absolute",
					justifyContent: "flex-end",
					paddingBottom: height * 0.005,
					bottom: 0,
					paddingHorizontal: width * 0.02,
				}}
			>
				<Text
					numberOfLines={1}
					style={{
						color: colors.white,
						fontSize: height * 0.02,
						lineHeight: height * 0.025,
						fontFamily: "PoppinsSemiBold",
						letterSpacing: 1.05,
					}}
				>
					{Description}
				</Text>
				<View
					name={"date"}
					style={{
						width: "100%",
						flexDirection: "row",
						justifyContent: "space-between",
						paddingTop: height * 0.002,
					}}
				>
					<Text
						style={{
							color: colors.white,
							fontSize: height * 0.015,
							lineHeight: height * 0.018,
						}}
					>
						{Date}
					</Text>
					<Text
						style={{
							color: colors.white,
							fontSize: height * 0.015,
							lineHeight: height * 0.018,
						}}
					>
						{StartTime}
					</Text>
				</View>
				<View
					name={"location"}
					style={{
						width: "100%",
						flexDirection: "row",
						alignItems: "flex-end",
						paddingTop: height * 0.002,
					}}
				>
					<MaterialCommunityIcons
						name="map-marker-radius"
						size={height * 0.018}
						color={colors.white}
						style={{ paddingRight: width * 0.005 }}
					/>
					<Text
						numberOfLines={1}
						style={{
							color: colors.white,
							fontSize: height * 0.015,
							lineHeight: height * 0.018,
						}}
					>
						{Location}
					</Text>
				</View>
			</Gradient>
		</Pressable>
	);
};

export default function MainPage({ navigation }) {
	const [isAppReady, setIsAppReady] = React.useState(false);
	const [selectedCategory, setSelectedCategory] = React.useState(0);
	const [eventList, setEventList] = React.useState([]);
	const [shownEvents, setShownEvents] = React.useState([]);
	const [peopleList, setPeopleList] = React.useState([]);
	const [myID, setMyID] = React.useState(null);
	const [sesToken, setSesToken] = React.useState("");
	const eventsRef = React.useRef();

	//Filtre Modal
	const [filtreModal, setFiltreModal] = React.useState(false);
	const [minAge, setMinAge] = React.useState(18);
	const [maxAge, setMaxAge] = React.useState(99);
	const [filtreCinsiyet, setFiltreCinsiyet] = React.useState(-1);
	const [filtreEgzersiz, setFiltreEgsersiz] = React.useState(-1);
	const [filtreUniversite, setFiltreUniversite] = React.useState(-1);
	const [filtreAlkol, setFiltreAlkol] = React.useState(-1);
	const [filtreSigara, setFiltreSigara] = React.useState(-1);
	const [filtreBurc, setFiltreBurc] = React.useState(-1);
	const [filtreDin, setFiltreDin] = React.useState(-1);
	const [filtreYemek, setFiltreYemek] = React.useState(-1);

	async function registerForPushNotificationAsync() {
		let token;
		const { status: existingStatus } = await Notifications.getPermissionsAsync();
		let finalStatus = existingStatus;
		console.log(existingStatus);
		console.log(finalStatus);
		if (existingStatus != "granted") {
			const { status } = await Notifications.requestPermissionsAsync();
			finalStatus = status;
		}
		if (finalStatus != "granted") {
			alert("Failed to get push token for notifications.");
			return null;
		}
		token = (await Notifications.getExpoPushTokenAsync()).data;
		console.log(token);

		if (Platform.OS == "android") {
			Notifications.setNotificationChannelAsync("default", {
				name: "default",
				importance: Notifications.AndroidImportance.MAX,
				vibrationPattern: [0, 250, 250, 250],
				lightColor: "#FF231F7C",
			});
		}

		return token;
	}

	React.useEffect(async () => {
		let abortController = new AbortController();
		const userDataStr = await SecureStore.getItemAsync("userData");
		const userData = JSON.parse(userDataStr);
		const userID = userData.UserId.toString();
		const myToken = userData.sesToken;
		setMyID(userID);
		setSesToken(myToken);

		async function prepare() {
			await axios
				.post(url + "/Swipelist", { UserId: userID }, { headers: { "access-token": myToken } })
				.then((res) => {
					setPeopleList(res.data);
				})
				.catch((err) => {
					console.log(err);
				});
			await axios
				.post(url + "/EventList", { UserId: userID }, { headers: { "access-token": myToken } })
				.then((res) => {
					setEventList(res.data);
					setShownEvents(res.data);
				})
				.catch((err) => {
					console.log(err);
				});
		}

		const token = await registerForPushNotificationAsync();
		console.log("-----------------");
		console.log(token);
		console.log("-----------------");

		const userName = userData.Name;
		async function fetchUser() {
			const newUser = {
				id: userID,
				name: userName,
				pushToken: null,
			};

			const userData = await API.graphql(graphqlOperation(getMsgUser, { id: userID }));
			if (userData.data.getMsgUser) {
				console.log("User is already registered in database");

				await API.graphql(
					graphqlOperation(updateMsgUser, {
						input: { id: userID, name: userName, pushToken: token },
					})
				);

				return;
			} else {
				console.log("User does not exists");
			}

			console.log(newUser);
			await API.graphql(graphqlOperation(createMsgUser, { input: newUser }));

			console.log("New user created");
		}

		try {
			await prepare();
			await fetchUser();
		} catch (err) {
			console.log(err);
		} finally {
			setIsAppReady(true);
		}

		return () => {
			abortController.abort();
		};
	}, []);

	React.useEffect(() => {
		const backAction = () => {
			Alert.alert("Emin Misin?", "Uygulamayı Kapatmak İstiyor Musun?", [
				{
					text: "Vazgeç",
					onPress: () => null,
					style: "cancel",
				},
				{ text: "EVET", onPress: () => BackHandler.exitApp() },
			]);
			return true;
		};

		const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);

		return () => backHandler.remove();
	}, []);

	React.useEffect(() => {
		if (eventsRef.current && shownEvents.length > 0) {
			eventsRef.current.scrollToIndex({ index: 0 });
		}
	});

	if (!isAppReady) {
		return (
			<View style={[commonStyles.Container, { justifyContent: "center" }]}>
				<StatusBar style="dark" />

				<ActivityIndicator animating={true} color={"rgba(100, 60, 248, 1)"} size={"large"} />
			</View>
		);
	}

	return (
		<View style={commonStyles.Container}>
			<StatusBar style="dark" translucent={false} backgroundColor={"#F4F3F3"} />
			<ScrollView style={{ width: width }} showsVerticalScrollIndicator={false}>
				<View
					name={"PeopleHeader"}
					style={[commonStyles.Header, { height: height * 0.05, marginTop: height * 0.01 }]}
				>
					<GradientText
						text={"Kişiler"}
						style={{
							fontSize: height * 0.035,
							fontFamily: "NowBold",
							letterSpacing: 1.2,
							marginLeft: 20,
						}}
					/>
					<TouchableOpacity
						style={{ marginRight: 20 }}
						onPress={() => {
							setFiltreModal(true);
						}}
					>
						<Octicons
							style={{ transform: [{ rotate: "-90deg" }] }}
							name="settings"
							size={30}
							color={colors.cool_gray}
						/>
					</TouchableOpacity>
				</View>
				<View
					name={"People"}
					style={{
						height: height * 0.33,
						width: "100%",
						justifyContent: "center",
					}}
				>
					{peopleList.length > 0 ? (
						<FlatList
							keyExtractor={(item) => item.UserId.toString()}
							horizontal={true}
							showsHorizontalScrollIndicator={false}
							data={peopleList.slice(0, 4)}
							renderItem={({ item, index }) => (
								<People
									setIsAppReady={setIsAppReady}
									index={index}
									person={item}
									setIsAppReady={setIsAppReady}
									length={peopleList.slice(0, 4).length}
									openProfiles={(idx) => {
										// var arr = new Array(...peopleList);
										// const element = arr[idx];
										// arr.splice(idx, 1);
										// arr.splice(0, 0, element);
										navigation.replace("ProfileCards", {
											idx: idx,
											list: peopleList,
											myID: myID,
											sesToken: sesToken,
										});
									}}
								/>
							)}
						/>
					) : (
						<Text
							style={{
								textAlign: "center",
								fontFamily: "PoppinsSemiBold",
								fontSize: 30,
								color: colors.gray,
							}}
						>
							Eşleşecek Kimse Yok :{"(("}
						</Text>
					)}
				</View>
				<View
					name={"EventHeader"}
					style={[commonStyles.Header, { height: height * 0.05, marginTop: height * 0.01 }]}
				>
					<GradientText
						text={"Etkinlikler"}
						style={{
							fontSize: height * 0.035,
							fontFamily: "NowBold",
							letterSpacing: 1.2,
							marginLeft: 20,
						}}
					/>
				</View>

				<View name={"EventsContainer"} style={{ width: "100%" }}>
					<View name={"Categories"} style={{ width: "100%", height: height * 0.12 }}>
						<FlatList
							horizontal={true}
							showsHorizontalScrollIndicator={false}
							data={CategoryList}
							renderItem={({ item, index }) => (
								<Category
									index={index}
									userID={myID}
									selectedCategory={selectedCategory}
									setSelectedCategory={setSelectedCategory}
									setShownEvents={setShownEvents}
									eventList={eventList}
								>
									{item}
								</Category>
							)}
						/>
					</View>
					<View name={"Events"} style={{ width: "100%", height: height * 0.33 }}>
						<FlatList
							ref={eventsRef}
							horizontal={true}
							showsHorizontalScrollIndicator={false}
							keyExtractor={(item) => item.EventId.toString()}
							data={shownEvents}
							renderItem={({ item, index }) => (
								<Event
									setIsAppReady={setIsAppReady}
									index={index}
									event={item}
									length={shownEvents.length}
									openEvents={(idx) => {
										navigation.navigate("EventCards", {
											idx: idx,
											list: shownEvents,
											myID: myID,
											sesToken: sesToken,
										});
									}}
								/>
							)}
						/>
					</View>
				</View>
			</ScrollView>

			<CustomModal
				visible={filtreModal}
				dismiss={() => {
					setFiltreModal(false);
				}}
			>
				<View
					style={{
						maxHeight: height * 0.9,
						maxWidth: width * 0.84,
						backgroundColor: colors.white,
						borderRadius: 10,
						alignItems: "center",
						paddingHorizontal: 10,
					}}
				>
					<View
						style={{
							width: "100%",
							marginTop: 20,
							maxHeight: height * 0.75,
						}}
					>
						<View
							style={{
								flexDirection: "row",
								width: "100%",
								alignItems: "flex-start",
								justifyContent: "space-around",
							}}
						>
							<View>
								<GradientText
									text={"Filtreme"}
									style={{
										fontSize: 22,
										fontFamily: "NowBold",
										letterSpacing: 1.2,
										marginLeft: 5,
									}}
								/>
								<Text style={{ color: colors.gray }}>5 Filtre kullanma hakkın var</Text>
							</View>
							<TouchableOpacity
								onPress={() => {
									setFiltreModal(false);
								}}
							>
								<Entypo name="cross" size={24} color="black" />
							</TouchableOpacity>
						</View>
						<View
							style={{
								borderBottomColor: "black",
								borderBottomWidth: 1,
								marginTop: 5,
								marginBottom: 10,
							}}
						/>
						<ScrollView horizontal={false} style={{ marginHorizontal: 10 }}>
							<GradientText text={"Yaş"} style={styles.filtreCategory} />
							<View
								style={{
									paddingTop: 10,
									justifyContent: "space-evenly",
									alignContent: "center",
									flexDirection: "row",
									marginBottom: 10,
								}}
							>
								<Text>Min:</Text>
								<TextInput
									style={{ width: width * 0.2 }}
									onChangeText={setMinAge}
									textAlign={"center"}
									placeholder="18"
									placeholderTextColor="#60605e"
									numeric
									keyboardType={"numeric"}
								/>
								<Text>Max:</Text>
								<TextInput
									style={{ width: width * 0.2 }}
									onChangeText={setMaxAge}
									textAlign={"center"}
									placeholder="99"
									placeholderTextColor="#60605e"
									numeric
									keyboardType={"numeric"}
								/>
							</View>

							<GradientText text={"Cinsiyet"} style={styles.filtreCategory} />
							<ScrollView horizontal={true}>
								<Pressable
									onPress={() => {
										filtreCinsiyet == 0 ? setFiltreCinsiyet(-1) : setFiltreCinsiyet(0);
									}}
									style={{
										backgroundColor: colors.white,
										alignSelf: "flex-start",
										marginLeft: 20,
										minWidth: width / 4,
										height: width / 8,
										borderRadius: width / 16,
										overflow: "hidden",
									}}
								>
									{filtreCinsiyet != 0 ? (
										<View
											style={{
												paddingHorizontalHorizontal: 10,
												width: "100%",
												height: "100%",
												justifyContent: "center",
												alignItems: "center",
											}}
										>
											<Text style={{ color: colors.black }}>Kadın</Text>
										</View>
									) : (
										<Gradient
											style={{
												paddingHorizontalHorizontal: 10,
												width: "100%",
												height: "100%",
												justifyContent: "center",
												alignItems: "center",
											}}
										>
											<Text style={{ color: colors.white }}>Kadın</Text>
										</Gradient>
									)}
								</Pressable>
								<Pressable
									onPress={() => {
										filtreCinsiyet == 1 ? setFiltreCinsiyet(-1) : setFiltreCinsiyet(1);
									}}
									style={{
										backgroundColor: colors.white,
										alignSelf: "flex-start",
										marginLeft: 20,
										minWidth: width / 4,
										height: width / 8,
										borderRadius: width / 16,
										overflow: "hidden",
									}}
								>
									{filtreCinsiyet != 1 ? (
										<View
											style={{
												paddingHorizontalHorizontal: 10,
												width: "100%",
												height: "100%",
												justifyContent: "center",
												alignItems: "center",
											}}
										>
											<Text style={{ color: colors.black }}>Erkek</Text>
										</View>
									) : (
										<Gradient
											style={{
												paddingHorizontalHorizontal: 10,
												width: "100%",
												height: "100%",
												justifyContent: "center",
												alignItems: "center",
											}}
										>
											<Text style={{ color: colors.white }}>Erkek</Text>
										</Gradient>
									)}
								</Pressable>

								<Pressable
									onPress={() => {
										filtreCinsiyet == 2 ? setFiltreCinsiyet(-1) : setFiltreCinsiyet(2);
									}}
									style={{
										backgroundColor: colors.white,
										alignSelf: "flex-start",
										marginLeft: 20,
										minWidth: width / 4,
										height: width / 8,
										borderRadius: width / 16,
										overflow: "hidden",
									}}
								>
									{filtreCinsiyet != 2 ? (
										<View
											style={{
												paddingHorizontalHorizontal: 10,
												width: "100%",
												height: "100%",
												justifyContent: "center",
												alignItems: "center",
											}}
										>
											<Text style={{ color: colors.black }}>Non-Binary</Text>
										</View>
									) : (
										<Gradient
											style={{
												paddingHorizontalHorizontal: 10,
												width: "100%",
												height: "100%",
												justifyContent: "center",
												alignItems: "center",
											}}
										>
											<Text style={{ color: colors.white }}>Non-Binary</Text>
										</Gradient>
									)}
								</Pressable>

								<Pressable
									onPress={() => {
										setFiltreCinsiyet(-1);
									}}
									style={{
										backgroundColor: colors.white,
										alignSelf: "flex-start",
										marginLeft: 20,
										minWidth: width / 4,
										height: width / 8,
										borderRadius: width / 16,
										overflow: "hidden",
									}}
								>
									{filtreCinsiyet != -1 ? (
										<View
											style={{
												paddingHorizontalHorizontal: 10,
												width: "100%",
												height: "100%",
												justifyContent: "center",
												alignItems: "center",
											}}
										>
											<Text style={{ color: colors.black }}>Hepsi</Text>
										</View>
									) : (
										<Gradient
											style={{
												paddingHorizontalHorizontal: 10,
												width: "100%",
												height: "100%",
												justifyContent: "center",
												alignItems: "center",
											}}
										>
											<Text style={{ color: colors.white }}>Hepsi</Text>
										</Gradient>
									)}
								</Pressable>
							</ScrollView>
							<GradientText text={"Egzersiz"} style={styles.filtreCategory} />

							<ScrollView horizontal={true}>
								<Pressable
									onPress={() => {
										filtreEgzersiz == 0 ? setFiltreEgsersiz(-1) : setFiltreEgsersiz(0);
									}}
									style={{
										backgroundColor: colors.white,
										alignSelf: "flex-start",
										marginLeft: 20,
										minWidth: width / 4,
										height: width / 8,
										borderRadius: width / 16,
										overflow: "hidden",
									}}
								>
									{filtreEgzersiz != 0 ? (
										<View
											style={{
												paddingHorizontalHorizontal: 10,
												width: "100%",
												height: "100%",
												justifyContent: "center",
												alignItems: "center",
											}}
										>
											<Text style={{ color: colors.black }}>Aktif</Text>
										</View>
									) : (
										<Gradient
											style={{
												paddingHorizontalHorizontal: 10,
												width: "100%",
												height: "100%",
												justifyContent: "center",
												alignItems: "center",
											}}
										>
											<Text style={{ color: colors.white }}>Aktif</Text>
										</Gradient>
									)}
								</Pressable>
								<Pressable
									onPress={() => {
										filtreEgzersiz == 1 ? setFiltreEgsersiz(-1) : setFiltreEgsersiz(1);
									}}
									style={{
										backgroundColor: colors.white,
										alignSelf: "flex-start",
										marginLeft: 20,
										minWidth: width / 4,
										height: width / 8,
										borderRadius: width / 16,
										overflow: "hidden",
									}}
								>
									{filtreEgzersiz != 1 ? (
										<View
											style={{
												paddingHorizontalHorizontal: 10,
												width: "100%",
												height: "100%",
												justifyContent: "center",
												alignItems: "center",
											}}
										>
											<Text style={{ color: colors.black }}>Bazen</Text>
										</View>
									) : (
										<Gradient
											style={{
												paddingHorizontalHorizontal: 10,
												width: "100%",
												height: "100%",
												justifyContent: "center",
												alignItems: "center",
											}}
										>
											<Text style={{ color: colors.white }}>Bazen</Text>
										</Gradient>
									)}
								</Pressable>

								<Pressable
									onPress={() => {
										filtreEgzersiz == 2 ? setFiltreEgsersiz(-1) : setFiltreEgsersiz(2);
									}}
									style={{
										backgroundColor: colors.white,
										alignSelf: "flex-start",
										marginLeft: 20,
										minWidth: width / 4,
										height: width / 8,
										borderRadius: width / 16,
										overflow: "hidden",
									}}
								>
									{filtreEgzersiz != 2 ? (
										<View
											style={{
												paddingHorizontalHorizontal: 10,
												width: "100%",
												height: "100%",
												justifyContent: "center",
												alignItems: "center",
											}}
										>
											<Text style={{ color: colors.black }}>Hiç</Text>
										</View>
									) : (
										<Gradient
											style={{
												paddingHorizontalHorizontal: 10,
												width: "100%",
												height: "100%",
												justifyContent: "center",
												alignItems: "center",
											}}
										>
											<Text style={{ color: colors.white }}>Hiç</Text>
										</Gradient>
									)}
								</Pressable>
							</ScrollView>

							<GradientText text={"Üniversite"} style={styles.filtreCategory} />
							<GradientText text={"Alkol Kullanımı"} style={styles.filtreCategory} />

							<ScrollView horizontal={true}>
								<Pressable
									onPress={() => {
										filtreAlkol == 0 ? setFiltreAlkol(-1) : setFiltreAlkol(0);
									}}
									style={{
										backgroundColor: colors.white,
										alignSelf: "flex-start",
										marginLeft: 20,
										minWidth: width / 4,
										height: width / 8,
										borderRadius: width / 16,
										overflow: "hidden",
									}}
								>
									{filtreAlkol != 0 ? (
										<View
											style={{
												paddingHorizontalHorizontal: 10,
												width: "100%",
												height: "100%",
												justifyContent: "center",
												alignItems: "center",
											}}
										>
											<Text style={{ color: colors.black }}>Sıklıkla</Text>
										</View>
									) : (
										<Gradient
											style={{
												paddingHorizontalHorizontal: 10,
												width: "100%",
												height: "100%",
												justifyContent: "center",
												alignItems: "center",
											}}
										>
											<Text style={{ color: colors.white }}>Sıklıkla</Text>
										</Gradient>
									)}
								</Pressable>

								<Pressable
									onPress={() => {
										filtreAlkol == 1 ? setFiltreAlkol(-1) : setFiltreAlkol(1);
									}}
									style={{
										backgroundColor: colors.white,
										alignSelf: "flex-start",
										marginLeft: 20,
										minWidth: width / 4,
										height: width / 8,
										borderRadius: width / 16,
										overflow: "hidden",
									}}
								>
									{filtreAlkol != 1 ? (
										<View
											style={{
												paddingHorizontalHorizontal: 10,
												width: "100%",
												height: "100%",
												justifyContent: "center",
												alignItems: "center",
											}}
										>
											<Text style={{ color: colors.black }}>Sosyal Olarak</Text>
										</View>
									) : (
										<Gradient
											style={{
												paddingHorizontalHorizontal: 10,
												width: "100%",
												height: "100%",
												justifyContent: "center",
												alignItems: "center",
											}}
										>
											<Text style={{ color: colors.white }}>Sosyal Olarak</Text>
										</Gradient>
									)}
								</Pressable>

								<Pressable
									onPress={() => {
										filtreAlkol == 2 ? setFiltreAlkol(-1) : setFiltreAlkol(2);
									}}
									style={{
										backgroundColor: colors.white,
										alignSelf: "flex-start",
										marginLeft: 20,
										minWidth: width / 4,
										height: width / 8,
										borderRadius: width / 16,
										overflow: "hidden",
									}}
								>
									{filtreAlkol != 2 ? (
										<View
											style={{
												paddingHorizontalHorizontal: 10,
												width: "100%",
												height: "100%",
												justifyContent: "center",
												alignItems: "center",
											}}
										>
											<Text style={{ color: colors.black }}>Hiç</Text>
										</View>
									) : (
										<Gradient
											style={{
												paddingHorizontalHorizontal: 10,
												width: "100%",
												height: "100%",
												justifyContent: "center",
												alignItems: "center",
											}}
										>
											<Text style={{ color: colors.white }}>Hiç</Text>
										</Gradient>
									)}
								</Pressable>
							</ScrollView>

							<GradientText text={"Sigara"} style={styles.filtreCategory} />
							<ScrollView horizontal={true}>
								<Pressable
									onPress={() => {
										filtreSigara == 0 ? setFiltreSigara(-1) : setFiltreSigara(0);
									}}
									style={{
										backgroundColor: colors.white,
										alignSelf: "flex-start",
										marginLeft: 20,
										minWidth: width / 4,
										height: width / 8,
										borderRadius: width / 16,
										overflow: "hidden",
									}}
								>
									{filtreSigara != 0 ? (
										<View
											style={{
												paddingHorizontalHorizontal: 10,
												width: "100%",
												height: "100%",
												justifyContent: "center",
												alignItems: "center",
											}}
										>
											<Text style={{ color: colors.black }}>Sıklıkla</Text>
										</View>
									) : (
										<Gradient
											style={{
												paddingHorizontalHorizontal: 10,
												width: "100%",
												height: "100%",
												justifyContent: "center",
												alignItems: "center",
											}}
										>
											<Text style={{ color: colors.white }}>Sıklıkla</Text>
										</Gradient>
									)}
								</Pressable>

								<Pressable
									onPress={() => {
										filtreSigara == 1 ? setFiltreSigara(-1) : setFiltreSigara(1);
									}}
									style={{
										backgroundColor: colors.white,
										alignSelf: "flex-start",
										marginLeft: 20,
										minWidth: width / 4,
										height: width / 8,
										borderRadius: width / 16,
										overflow: "hidden",
									}}
								>
									{filtreSigara != 1 ? (
										<View
											style={{
												paddingHorizontalHorizontal: 10,
												width: "100%",
												height: "100%",
												justifyContent: "center",
												alignItems: "center",
											}}
										>
											<Text style={{ color: colors.black }}>Sosyal Olarak</Text>
										</View>
									) : (
										<Gradient
											style={{
												paddingHorizontalHorizontal: 10,
												width: "100%",
												height: "100%",
												justifyContent: "center",
												alignItems: "center",
											}}
										>
											<Text style={{ color: colors.white }}>Sosyal Olarak</Text>
										</Gradient>
									)}
								</Pressable>

								<Pressable
									onPress={() => {
										filtreSigara == 2 ? setFiltreSigara(-1) : setFiltreSigara(2);
									}}
									style={{
										backgroundColor: colors.white,
										alignSelf: "flex-start",
										marginLeft: 20,
										minWidth: width / 4,
										height: width / 8,
										borderRadius: width / 16,
										overflow: "hidden",
									}}
								>
									{filtreSigara != 2 ? (
										<View
											style={{
												paddingHorizontalHorizontal: 10,
												width: "100%",
												height: "100%",
												justifyContent: "center",
												alignItems: "center",
											}}
										>
											<Text style={{ color: colors.black }}>Hiç</Text>
										</View>
									) : (
										<Gradient
											style={{
												paddingHorizontalHorizontal: 10,
												width: "100%",
												height: "100%",
												justifyContent: "center",
												alignItems: "center",
											}}
										>
											<Text style={{ color: colors.white }}>Hiç</Text>
										</Gradient>
									)}
								</Pressable>
							</ScrollView>

							<GradientText text={"Burç"} style={styles.filtreCategory} />
							<GradientText text={"Din"} style={styles.filtreCategory} />
							<GradientText text={"Yeme Biçimi"} style={styles.filtreCategory} />
							<GradientText text={"İlgi Alanları"} style={styles.filtreCategory} />
						</ScrollView>
						<View style={{ height: 15 }}></View>
					</View>
					<TouchableOpacity
						onPress={() => {
							alert("filtreyi gönder");
						}}
						style={{
							maxWidth: "90%",
							height: "10%",
							maxHeight: 60,
							aspectRatio: 9 / 2,
							borderRadius: 12,
							overflow: "hidden",
						}}
					>
						<Gradient
							style={{
								justifyContent: "center",
								alignItems: "center",
								width: "100%",
								height: "100%",
							}}
						>
							<Text style={{ color: colors.white, fontSize: 20, fontFamily: "PoppinsSemiBold" }}>
								Filtrele
							</Text>
						</Gradient>
					</TouchableOpacity>
				</View>
			</CustomModal>
		</View>
	);
}

const styles = StyleSheet.create({
	categoryIcon: {
		marginTop: "10%",
		height: "80%",
		maxWidth: "50%",
		resizeMode: "contain",
	},
	filtreCategory: {
		fontSize: 22,
		fontFamily: "NowBold",
		letterSpacing: 1.2,
		marginLeft: 10,
		marginBottom: 10,
	},
});
