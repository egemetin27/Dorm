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
	SafeAreaView,
} from "react-native";
import { Octicons, MaterialCommunityIcons, Ionicons, Entypo, Feather } from "@expo/vector-icons";
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
					backgroundColor: colors.white,
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
								//letterSpacing: 1.05,
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
							//letterSpacing: 1.05,
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
						style={{
							fontSize: height * 0.016,
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
						//letterSpacing: 1.05,
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
	const[toggleYas, setToggleYas] = React.useState(false);
	const[toggleCinsiyet, setToggleCinsiyet ] = React.useState(false);
	const[toggleEgsersiz, setToggleEgsersiz ] = React.useState(false);
	const[toggleUniversite, setToggleUniversite ] = React.useState(false);
	const[toggleAlkol, setToggleAlkol ] = React.useState(false);
	const[toggleSigara, setToggleSigara ] = React.useState(false);
	const[toggleBurc, setToggleBurc ] = React.useState(false);
	const[toggleDin, setToggleDin ] = React.useState(false);
	const[toggleYemek, setToggleYemek ] = React.useState(false);
	const[toggleHobi, setToggleHobi ] = React.useState(false);

	const [filtreModal, setFiltreModal] = React.useState(false);
	const [minAge, setMinAge] = React.useState(18);
	const [maxAge, setMaxAge] = React.useState(99);
	const [filterCinsiyet, setFilterCinsiyet] = React.useState([1,1,1]);
	const [filterEgsersiz, setFilterEgsersiz] = React.useState([1,1,1]);
	const [filterUniversite, setFilterUniversite] = React.useState();
	const [filterAlkol, setFilterAlkol] = React.useState([1,1,1]);
	const [filterSigara, setFilterSigara] = React.useState([1,1,1]);
	const [filterBurc, setFilterBurc] = React.useState([1,1,1,1,1,1,1,1,1,1,1,1]);
	const [filterDin, setFilterDin] = React.useState([1,1,1]);
	const [filterYemek, setFilterYemek] = React.useState([1,1,1,1,1]);
	const [filterHobi, setFilterHobi] = React.useState();

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

	const applyFilter = async () => {
		let abortController = new AbortController();
		const userDataStr = await SecureStore.getItemAsync("userData");
		const userData = JSON.parse(userDataStr);
		const userID = userData.UserId.toString();
		const myToken = userData.sesToken;
		setMyID(userID);
		setSesToken(myToken);
		/*
		const [minAge, setMinAge] = React.useState(18);
		const [maxAge, setMaxAge] = React.useState(99);
		const [filterCinsiyet, setFilterCinsiyet] = React.useState([1,1,1]);
		const [filterEgsersiz, setFilterEgsersiz] = React.useState([1,1,1]);
		const [filterUniversite, setFilterUniversite] = React.useState();
		const [filterAlkol, setFilterAlkol] = React.useState([1,1,1]);
		const [filterSigara, setFilterSigara] = React.useState([1,1,1]);
		const [filterBurc, setFilterBurc] = React.useState([1,1,1,1,1,1,1,1,1,1,1,1]);
		const [filterDin, setFilterDin] = React.useState([1,1,1]);
		const [filterYemek, setFilterYemek] = React.useState([1,1,1,1,1]);
		const [filterHobi, setFilterHobi] = React.useState();
		*/
		async function prepare() {
			await axios
				.post(
					url + "/Swipelist",
					{ 
						UserId: userID,
						Minyas: minAge,
						Maxyas: maxAge,
						Cinsiyet: filterCinsiyet,
						Egsersiz: filterEgsersiz,
						Alkol: filterAlkol,
						Sigara: filterAlkol,
						Yemek: filterYemek,
					},
					{ headers: { "access-token": myToken } }
				)
				.then((res) => {
					console.log(res.data);
					setPeopleList(res.data);
				})
				.catch((err) => {
					console.log(err);
				});
		}

		try {
			await prepare();
		} catch (err) {
			console.log(err);
		} 
	};

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
				.post(
					url + "/Swipelist",
					{ 
						UserId: userID,
						Minyas: 18,
						Maxyas: 99,
						Cinsiyet: [1, 1, 1],
						Egsersiz: [1, 1, 1],
						Alkol: [1, 1, 1],
						Sigara: [1, 1, 1],
						Yemek: [1, 1, 1, 1, 1],
					},
					{ headers: { "access-token": myToken } }
				)
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
		/*
		console.log("-----------------");
		console.log(token);
		console.log("-----------------");
		*/
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
			<StatusBar
				style="dark"
				translucent={false}
				backgroundColor={"#F4F3F3"}
				// hidden={Platform.OS == "ios"}
			/>
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
						data={peopleList.slice(0, 5)}
						renderItem={({ item, index }) => (
							<People
								setIsAppReady={setIsAppReady}
								index={index}
								person={item}
								length={peopleList.slice(0, 5).length}
								openProfiles={(idx) => {
									// var arr = new Array(...peopleList);
									// const element = arr[idx];
									// arr.splice(idx, 1);
									// arr.splice(0, 0, element);
									navigation.replace("ProfileCards", {
										idx: idx,
										list: peopleList,
										// list: peopleList.slice(0, 10),
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
								marginTop: 5,
								marginBottom: 10,
							}}
						/>
						<ScrollView horizontal={false} style={{ marginHorizontal: 10 }}>
							{/* Filtre Yas toggle */}
							<TouchableOpacity
								onPress={() => {
									setToggleYas(!toggleYas);
								}}
							>
								<View
									style={{
										flexDirection: "row",
										justifyContent: "flex-start",
										alignItems: "center",
									}}
								>
									<Text style={styles.filtreCategory}>
										Yaş
									</Text>
									<View style={{margin: 10}} />
									{
										toggleYas ? 
										(
											<Feather name="chevron-up" size={20} color="#4A4A4A" />
										) 
										: 
										(
											<Feather name="chevron-down" size={20} color="#4A4A4A" />
										)
									}
								</View>
								{
									toggleYas ? 
									(
										<View
											style= {{
												paddingTop:10,
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
									)
									:
									(
										null
									)
								}
							</TouchableOpacity>
							{/* Filtre Yas toggle */}

							{/* Filtre Cinsiyet toggle */}
							<TouchableOpacity
								onPress={() => {
									setToggleCinsiyet(!toggleCinsiyet);
								}}
							>
								<View
									style={{
										flexDirection: "row",
										justifyContent: "flex-start",
										alignItems: "center",
									}}
								>
									<Text style={styles.filtreCategory}>
										Cinsiyet
									</Text>
									<View style={{margin: 10}} />
									{
										toggleCinsiyet ? 
										(
											<Feather name="chevron-up" size={20} color="#4A4A4A" />
										) 
										: 
										(
											<Feather name="chevron-down" size={20} color="#4A4A4A" />
										)
									}
								</View>
								{
									toggleCinsiyet ? 
									(
										<ScrollView horizontal = {true}>
											<TouchableOpacity
												onPress={() => {
													if (filterCinsiyet[0] == 1) {
														setFilterCinsiyet([0, filterCinsiyet[1], filterCinsiyet[2]]);
													} else {
														setFilterCinsiyet([1, filterCinsiyet[1], filterCinsiyet[2]]);
													}
												}}
												style={styles.filtreButton}
											>
												{ filterCinsiyet[0] != 1 ? 
													(
														<View
															style = {styles.filtreView}
														>
															<Text 
																style = {{
																	fontFamily: "Poppins",
																	color: colors.black
																}} 
															>
																Kadın
															</Text>

														</View>
													) 
													: 
													(
														<Gradient
															style = {styles.filtreView}
														>
															<Text 
																style = {{
																	fontFamily: "Poppins",
																	color: colors.white,
																}} 
															>
																Kadın
															</Text>
														</Gradient>
													)
												}												
											</TouchableOpacity>

											<TouchableOpacity
												onPress={() => {
													if (filterCinsiyet[1] == 1) {
														setFilterCinsiyet([filterCinsiyet[0], 0, filterCinsiyet[2]]);
													} else {
														setFilterCinsiyet([filterCinsiyet[0], 1, filterCinsiyet[2]]);
													}
												}}
												style={styles.filtreButton}
											>
												{ filterCinsiyet[1] != 1 ? 
													(
														<View
															style = {styles.filtreView}
														>
															<Text 
																style = {{
																	fontFamily: "Poppins",
																	color: colors.black
																}} 
															>
																Erkek
															</Text>

														</View>
													) 
													: 
													(
														<Gradient
															style = {styles.filtreView}
														>
															<Text 
																style = {{
																	fontFamily: "Poppins",
																	color: colors.white,
																}} 
															>
																Erkek
															</Text>
														</Gradient>
													)
												}												
											</TouchableOpacity>
											<TouchableOpacity
												onPress={() => {
													if (filterCinsiyet[2] == 1) {
														setFilterCinsiyet([filterCinsiyet[0], filterCinsiyet[1], 0]);
													} else {
														setFilterCinsiyet([filterCinsiyet[0], filterCinsiyet[1], 1]);
													}
												}}
												style={styles.filtreButton}
											>
												{ filterCinsiyet[2] != 1 ? 
													(
														<View
															style = {styles.filtreView}
														>
															<Text 
																style = {{
																	fontFamily: "Poppins",
																	color: colors.black
																}} 
															>
																Non-Binary
															</Text>

														</View>
													) 
													: 
													(
														<Gradient
															style = {styles.filtreView}
														>
															<Text 
																style = {{
																	fontFamily: "Poppins",
																	color: colors.white,
																}} 
															>
																Non-Binary
															</Text>
														</Gradient>
													)
												}												
											</TouchableOpacity>
										</ScrollView>
									)
									:
									(
										null
									)
								}
							</TouchableOpacity>
							{/* Filtre Cinsiyet toggle */}
							{/* Filtre Egzersiz toggle */}
							<TouchableOpacity
								onPress={() => {
									setToggleEgsersiz(!toggleEgsersiz);
								}}
							>
								<View
									style={{
										flexDirection: "row",
										justifyContent: "flex-start",
										alignItems: "center",
									}}
								>
									<Text style={styles.filtreCategory}>
										Egzersiz
									</Text>
									<View style={{margin: 10}} />
									{
										toggleEgsersiz ? 
										(
											<Feather name="chevron-up" size={20} color="#4A4A4A" />
										) 
										: 
										(
											<Feather name="chevron-down" size={20} color="#4A4A4A" />
										)
									}
								</View>
								{
									toggleEgsersiz ? 
									(
										<ScrollView horizontal = {true}>
											<TouchableOpacity
												onPress={() => {
													if (filterEgsersiz[0] == 1) {
														setFilterEgsersiz([0, filterEgsersiz[1], filterEgsersiz[2]]);
													} else {
														setFilterEgsersiz([1, filterEgsersiz[1], filterEgsersiz[2]]);
													}
												}}
												style={styles.filtreButton}
											>
												{ filterEgsersiz[0] != 1 ? 
													(
														<View
															style = {styles.filtreView}
														>
															<Text 
																style = {{
																	fontFamily: "Poppins",
																	color: colors.black
																}} 
															>
																Aktif
															</Text>

														</View>
													) 
													: 
													(
														<Gradient
															style = {styles.filtreView}
														>
															<Text 
																style = {{
																	fontFamily: "Poppins",
																	color: colors.white,
																}} 
															>
																Aktif
															</Text>
														</Gradient>
													)
												}												
											</TouchableOpacity>

											<TouchableOpacity
												onPress={() => {
													if (filterEgsersiz[1] == 1) {
														setFilterEgsersiz([filterEgsersiz[0], 0, filterEgsersiz[2]]);
													} else {
														setFilterEgsersiz([filterEgsersiz[0], 1, filterEgsersiz[2]]);
													}
												}}
												style={styles.filtreButton}
											>
												{ filterEgsersiz[1] != 1 ? 
													(
														<View
															style = {styles.filtreView}
														>
															<Text 
																style = {{
																	fontFamily: "Poppins",
																	color: colors.black
																}} 
															>
																Bazen
															</Text>

														</View>
													) 
													: 
													(
														<Gradient
															style = {styles.filtreView}
														>
															<Text 
																style = {{
																	fontFamily: "Poppins",
																	color: colors.white,
																}} 
															>
																Bazen
															</Text>
														</Gradient>
													)
												}												
											</TouchableOpacity>
											<TouchableOpacity
												onPress={() => {
													if (filterCinsiyet[2] == 1) {
														setFilterEgsersiz([filterEgsersiz[0], filterEgsersiz[1], 0]);
													} else {
														setFilterEgsersiz([filterEgsersiz[0], filterEgsersiz[1], 1]);
													}
												}}
												style={styles.filtreButton}
											>
												{ filterEgsersiz[2] != 1 ? 
													(
														<View
															style = {styles.filtreView}
														>
															<Text 
																style = {{
																	fontFamily: "Poppins",
																	color: colors.black
																}} 
															>
																Hiç
															</Text>

														</View>
													) 
													: 
													(
														<Gradient
															style = {styles.filtreView}
														>
															<Text 
																style = {{
																	fontFamily: "Poppins",
																	color: colors.white,
																}} 
															>
																Hiç
															</Text>
														</Gradient>
													)
												}												
											</TouchableOpacity>
										</ScrollView>
									)
									:
									(
										null
									)
								}
							</TouchableOpacity>
							{/* Filtre Egzersiz toggle */}

							{/* Filtre Üniversite toggle */}
							<TouchableOpacity
								onPress={() => {
									setToggleUniversite(!toggleUniversite);
								}}
							>
								<View
									style={{
										flexDirection: "row",
										justifyContent: "flex-start",
										alignItems: "center",
									}}
								>
									<Text style={styles.filtreCategory}>
										Üniversite
									</Text>
									<View style={{margin: 10}} />
									{
										toggleUniversite ? 
										(
											<Feather name="chevron-up" size={20} color="#4A4A4A" />
										) 
										: 
										(
											<Feather name="chevron-down" size={20} color="#4A4A4A" />
										)
									}
								</View>
								{
									toggleUniversite ? 
									(
										null
									)
									:
									(
										null
									)
								}
							</TouchableOpacity>
							{/* Filtre Üniversite toggle */}

							{/* Filtre Alkol Kullanımı toggle */}
							<TouchableOpacity
								onPress={() => {
									setToggleAlkol(!toggleAlkol);
								}}
							>
								<View
									style={{
										flexDirection: "row",
										justifyContent: "flex-start",
										alignItems: "center",
									}}
								>
									<Text style={styles.filtreCategory}>
										Alkol Kullanımı
									</Text>
									<View style={{margin: 10}} />
									{
										toggleAlkol ? 
										(
											<Feather name="chevron-up" size={20} color="#4A4A4A" />
										) 
										: 
										(
											<Feather name="chevron-down" size={20} color="#4A4A4A" />
										)
									}
								</View>
								{
									toggleAlkol ? 
									(
										<ScrollView horizontal = {true}>
											<TouchableOpacity
												onPress={() => {
													if (filterAlkol[0] == 1) {
														setFilterAlkol([0, filterAlkol[1], filterAlkol[2]]);
													} else {
														setFilterAlkol([1, filterAlkol[1], filterAlkol[2]]);
													}
												}}
												style={styles.filtreButton}
											>
												{ filterAlkol[0] != 1 ? 
													(
														<View
															style = {styles.filtreView}
														>
															<Text 
																style = {{
																	fontFamily: "Poppins",
																	color: colors.black
																}} 
															>
																Sıklıkla
															</Text>

														</View>
													) 
													: 
													(
														<Gradient
															style = {styles.filtreView}
														>
															<Text 
																style = {{
																	fontFamily: "Poppins",
																	color: colors.white,
																}} 
															>
																Sıklıkla
															</Text>
														</Gradient>
													)
												}												
											</TouchableOpacity>

											<TouchableOpacity
												onPress={() => {
													if (filterAlkol[1] == 1) {
														setFilterAlkol([filterAlkol[0], 0, filterAlkol[2]]);
													} else {
														setFilterAlkol([filterAlkol[0], 1, filterAlkol[2]]);
													}
												}}
												style={styles.filtreButton}
											>
												{ filterAlkol[1] != 1 ? 
													(
														<View
															style = {styles.filtreView}
														>
															<Text 
																style = {{
																	fontFamily: "Poppins",
																	color: colors.black
																}} 
															>
																Sosyal Olarak
															</Text>

														</View>
													) 
													: 
													(
														<Gradient
															style = {styles.filtreView}
														>
															<Text 
																style = {{
																	fontFamily: "Poppins",
																	color: colors.white,
																}} 
															>
																Sosyal Olarak
															</Text>
														</Gradient>
													)
												}												
											</TouchableOpacity>
											<TouchableOpacity
												onPress={() => {
													if (filterCinsiyet[2] == 1) {
														setFilterAlkol([filterAlkol[0], filterAlkol[1], 0]);
													} else {
														setFilterAlkol([filterAlkol[0], filterAlkol[1], 1]);
													}
												}}
												style={styles.filtreButton}
											>
												{ filterAlkol[2] != 1 ? 
													(
														<View
															style = {styles.filtreView}
														>
															<Text 
																style = {{
																	fontFamily: "Poppins",
																	color: colors.black
																}} 
															>
																Hiç
															</Text>

														</View>
													) 
													: 
													(
														<Gradient
															style = {styles.filtreView}
														>
															<Text 
																style = {{
																	fontFamily: "Poppins",
																	color: colors.white,
																}} 
															>
																Hiç
															</Text>
														</Gradient>
													)
												}												
											</TouchableOpacity>
										</ScrollView>
									)
									:
									(
										null
									)
								}
							</TouchableOpacity>
							{/* Filtre Alkol Kullanımı toggle */}

							{/* Filtre Sigara toggle */}
							<TouchableOpacity
								onPress={() => {
									setToggleSigara(!toggleSigara);
								}}
							>
								<View
									style={{
										flexDirection: "row",
										justifyContent: "flex-start",
										alignItems: "center",
									}}
								>
									<Text style={styles.filtreCategory}>
										Sigara
									</Text>
									<View style={{margin: 10}} />
									{
										toggleSigara ? 
										(
											<Feather name="chevron-up" size={20} color="#4A4A4A" />
										) 
										: 
										(
											<Feather name="chevron-down" size={20} color="#4A4A4A" />
										)
									}
								</View>
								{
									toggleSigara ? 
									(
										<ScrollView horizontal = {true}>
											<TouchableOpacity
												onPress={() => {
													if (filterSigara[0] == 1) {
														setFilterSigara([0, filterSigara[1], filterSigara[2]]);
													} else {
														setFilterSigara([1, filterSigara[1], filterSigara[2]]);
													}
												}}
												style={styles.filtreButton}
											>
												{ filterSigara[0] != 1 ? 
													(
														<View
															style = {styles.filtreView}
														>
															<Text 
																style = {{
																	fontFamily: "Poppins",
																	color: colors.black
																}} 
															>
																Sıklıkla
															</Text>

														</View>
													) 
													: 
													(
														<Gradient
															style = {styles.filtreView}
														>
															<Text 
																style = {{
																	fontFamily: "Poppins",
																	color: colors.white,
																}} 
															>
																Sıklıkla
															</Text>
														</Gradient>
													)
												}												
											</TouchableOpacity>

											<TouchableOpacity
												onPress={() => {
													if (filterSigara[1] == 1) {
														setFilterSigara([filterSigara[0], 0, filterSigara[2]]);
													} else {
														setFilterSigara([filterSigara[0], 1, filterSigara[2]]);
													}
												}}
												style={styles.filtreButton}
											>
												{ filterSigara[1] != 1 ? 
													(
														<View
															style = {styles.filtreView}
														>
															<Text 
																style = {{
																	fontFamily: "Poppins",
																	color: colors.black
																}} 
															>
																Sosyal Olarak
															</Text>

														</View>
													) 
													: 
													(
														<Gradient
															style = {styles.filtreView}
														>
															<Text 
																style = {{
																	fontFamily: "Poppins",
																	color: colors.white,
																}} 
															>
																Sosyal Olarak
															</Text>
														</Gradient>
													)
												}												
											</TouchableOpacity>
											<TouchableOpacity
												onPress={() => {
													if (filterCinsiyet[2] == 1) {
														setFilterSigara([filterSigara[0], filterSigara[1], 0]);
													} else {
														setFilterSigara([filterSigara[0], filterSigara[1], 1]);
													}
												}}
												style={styles.filtreButton}
											>
												{ filterSigara[2] != 1 ? 
													(
														<View
															style = {styles.filtreView}
														>
															<Text 
																style = {{
																	fontFamily: "Poppins",
																	color: colors.black
																}} 
															>
																Hiç
															</Text>

														</View>
													) 
													: 
													(
														<Gradient
															style = {styles.filtreView}
														>
															<Text 
																style = {{
																	fontFamily: "Poppins",
																	color: colors.white,
																}} 
															>
																Hiç
															</Text>
														</Gradient>
													)
												}												
											</TouchableOpacity>
										</ScrollView>
									)
									:
									(
										null
									)
								}
							</TouchableOpacity>
							{/* Filtre Sigara toggle */}

							{/* Filtre Burç toggle */}
							<TouchableOpacity
								onPress={() => {
									setToggleBurc(!toggleBurc);
								}}
							>
								<View
									style={{
										flexDirection: "row",
										justifyContent: "flex-start",
										alignItems: "center",
									}}
								>
									<Text style={styles.filtreCategory}>
										Burç
									</Text>
									<View style={{margin: 10}} />
									{
										toggleBurc ? 
										(
											<Feather name="chevron-up" size={20} color="#4A4A4A" />
										) 
										: 
										(
											<Feather name="chevron-down" size={20} color="#4A4A4A" />
										)
									}
								</View>
								{
									toggleBurc ? 
									(
										null
									)
									:
									(
										null
									)
								}
							</TouchableOpacity>
							{/* Filtre Burç toggle */}

							{/* Filtre Din toggle */}
							<TouchableOpacity
								onPress={() => {
									setToggleDin(!toggleDin);
								}}
							>
								<View
									style={{
										flexDirection: "row",
										justifyContent: "flex-start",
										alignItems: "center",
									}}
								>
									<Text style={styles.filtreCategory}>
										Din
									</Text>
									<View style={{margin: 10}} />
									{
										toggleDin ? 
										(
											<Feather name="chevron-up" size={20} color="#4A4A4A" />
										) 
										: 
										(
											<Feather name="chevron-down" size={20} color="#4A4A4A" />
										)
									}
								</View>
								{
									toggleDin ? 
									(
										null
									)
									:
									(
										null
									)
								}
							</TouchableOpacity>
							{/* Filtre Din toggle */}

							{/* Filtre Yeme Biçimi toggle */}
							<TouchableOpacity
								onPress={() => {
									setToggleYemek(!toggleYemek);
								}}
							>
								<View
									style={{
										flexDirection: "row",
										justifyContent: "flex-start",
										alignItems: "center",
									}}
								>
									<Text style={styles.filtreCategory}>
										Yeme Biçimi
									</Text>
									<View style={{margin: 10}} />
									{
										toggleYemek ? 
										(
											<Feather name="chevron-up" size={20} color="#4A4A4A" />
										) 
										: 
										(
											<Feather name="chevron-down" size={20} color="#4A4A4A" />
										)
									}
								</View>
								{
									toggleYemek ? 
									(
										<ScrollView horizontal = {true}>
											<TouchableOpacity
												onPress={() => {
													if (filterYemek[0] == 1) {
														setFilterYemek([0, filterYemek[1], filterYemek[2], filterYemek[3], filterYemek[4] ]);
													} else {
														setFilterYemek([1, filterYemek[1], filterYemek[2], filterYemek[3], filterYemek[4] ]);
													}
												}}
												style={styles.filtreButton}
											>
												{ filterYemek[0] != 1 ? 
													(
														<View
															style = {styles.filtreView}
														>
															<Text 
																style = {{
																	fontFamily: "Poppins",
																	color: colors.black
																}} 
															>
																Vejetaryen
															</Text>

														</View>
													) 
													: 
													(
														<Gradient
															style = {styles.filtreView}
														>
															<Text 
																style = {{
																	fontFamily: "Poppins",
																	color: colors.white,
																}} 
															>
																Vejetaryen
															</Text>
														</Gradient>
													)
												}												
											</TouchableOpacity>
											<TouchableOpacity
												onPress={() => {
													if (filterYemek[1] == 1) {
														setFilterYemek([filterYemek[0], 0, filterYemek[2], filterYemek[3], filterYemek[4] ]);
													} else {
														setFilterYemek([filterYemek[0], 1, filterYemek[2], filterYemek[3], filterYemek[4] ]);
													}
												}}
												style={styles.filtreButton}
											>
												{ filterYemek[1] != 1 ? 
													(
														<View
															style = {styles.filtreView}
														>
															<Text 
																style = {{
																	fontFamily: "Poppins",
																	color: colors.black
																}} 
															>
																Vegan
															</Text>

														</View>
													) 
													: 
													(
														<Gradient
															style = {styles.filtreView}
														>
															<Text 
																style = {{
																	fontFamily: "Poppins",
																	color: colors.white,
																}} 
															>
																Vegan
															</Text>
														</Gradient>
													)
												}												
											</TouchableOpacity>
											<TouchableOpacity
												onPress={() => {
													if (filterYemek[2] == 1) {
														setFilterYemek([filterYemek[0], filterYemek[1], 0, filterYemek[3], filterYemek[4] ]);
													} else {
														setFilterYemek([filterYemek[0], filterYemek[1], 1, filterYemek[3], filterYemek[4] ]);
													}
												}}
												style={styles.filtreButton}
											>
												{ filterYemek[2] != 1 ? 
													(
														<View
															style = {styles.filtreView}
														>
															<Text 
																style = {{
																	fontFamily: "Poppins",
																	color: colors.black
																}} 
															>
																Pesketaryen
															</Text>

														</View>
													) 
													: 
													(
														<Gradient
															style = {styles.filtreView}
														>
															<Text 
																style = {{
																	fontFamily: "Poppins",
																	color: colors.white,
																}} 
															>
																Pesketaryen
															</Text>
														</Gradient>
													)
												}												
											</TouchableOpacity>
											<TouchableOpacity
												onPress={() => {
													if (filterYemek[3] == 1) {
														setFilterYemek([filterYemek[0], filterYemek[1], filterYemek[2], 0, filterYemek[4] ]);
													} else {
														setFilterYemek([filterYemek[0], filterYemek[1], filterYemek[2], 1, filterYemek[4] ]);
													}
												}}
												style={styles.filtreButton}
											>
												{ filterYemek[3] != 1 ? 
													(
														<View
															style = {styles.filtreView}
														>
															<Text 
																style = {{
																	fontFamily: "Poppins",
																	color: colors.black
																}} 
															>
																Glutensiz
															</Text>

														</View>
													) 
													: 
													(
														<Gradient
															style = {styles.filtreView}
														>
															<Text 
																style = {{
																	fontFamily: "Poppins",
																	color: colors.white,
																}} 
															>
																Glutensiz
															</Text>
														</Gradient>
													)
												}												
											</TouchableOpacity>
											<TouchableOpacity
												onPress={() => {
													if (filterYemek[4] == 1) {
														setFilterYemek([filterYemek[0], filterYemek[1], filterYemek[2], filterYemek[3], 0 ]);
													} else {
														setFilterYemek([filterYemek[0], filterYemek[1], filterYemek[2], filterYemek[3], 1 ]);
													}
												}}
												style={styles.filtreButton}
											>
												{ filterYemek[4] != 1 ? 
													(
														<View
															style = {styles.filtreView}
														>
															<Text 
																style = {{
																	fontFamily: "Poppins",
																	color: colors.black
																}} 
															>
																Hepsi
															</Text>

														</View>
													) 
													: 
													(
														<Gradient
															style = {styles.filtreView}
														>
															<Text 
																style = {{
																	fontFamily: "Poppins",
																	color: colors.white,
																}} 
															>
																Hepsi
															</Text>
														</Gradient>
													)
												}												
											</TouchableOpacity>

										</ScrollView>
									)
									:
									(
										null
									)
								}
							</TouchableOpacity>
							{/* Filtre Yeme Biçimi toggle */}

							{/* Filtre İlgi Alanları toggle */}
							<TouchableOpacity
								onPress={() => {
									setToggleHobi(!toggleHobi);
								}}
							>
								<View
									style={{
										flexDirection: "row",
										justifyContent: "flex-start",
										alignItems: "center",
									}}
								>
									<Text style={styles.filtreCategory}>
										İlgi Alanları
									</Text>
									<View style={{margin: 10}} />
									{
										toggleHobi ? 
										(
											<Feather name="chevron-up" size={20} color="#4A4A4A" />
										) 
										: 
										(
											<Feather name="chevron-down" size={20} color="#4A4A4A" />
										)
									}
								</View>
								{
									toggleHobi ? 
									(
										null
									)
									:
									(
										null
									)
								}
							</TouchableOpacity>
							{/* Filtre İlgi Alanları toggle */}

							
						</ScrollView>
						<View style={{ height: 15 }}></View>
					</View>
					<TouchableOpacity
						onPress={() => {
							applyFilter();
							setFiltreModal(false);
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
		fontSize: 20,
		fontFamily: "Poppins",
		color: colors.dark_gray,
		lineHeight: 30,
		marginLeft: 10,
		marginBottom: 10,
	},
	filtreButton: {
		backgroundColor: colors.white,
		alignSelf: "flex-start",
		marginLeft: 20,
		minWidth: width/4,
		height: width /8,
		borderRadius: width/16,
		overflow: "hidden",
	},
	filtreView: {
		paddingHorizontal: 10,
		width: "100%",
		height: "100%",
		justifyContent: "center",
		alignItems: "center",

	},
});
