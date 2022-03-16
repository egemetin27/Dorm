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
} from "react-native";
import { Octicons, MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
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
import { createMsgUser } from "../../src/graphql/mutations";

const CategoryList = [
	{
		key: "Tüm Etkinlikler",
		url: "",
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

const People = ({ person, openProfiles, index, length }) => {
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
			onPress={() => openProfiles(index)}
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
				colors={["rgba(0,0,0,0.005)", "rgba(0,0,0,0.3)"]}
				start={{ x: 0.5, y: 0 }}
				end={{ x: 0.5, y: 1 }}
				style={{
					height: "25%",
					width: "100%",
					position: "absolute",
					bottom: 0,
					justifyContent: "flex-end",
					paddingBottom: width * 0.02,
				}}
			>
				<Text
					style={{
						color: colors.white,
						fontSize: width * 0.045,
						paddingLeft: 10,
						fontWeight: "bold",
						letterSpacing: 1.05,
					}}
				>
					{name} • {age}
				</Text>
				<Text
					style={{
						color: colors.white,
						fontSize: width * 0.035,
						paddingLeft: 10,
						fontStyle: "italic",
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
			{selectedCategory == index && <Gradient style={{ position: "absolute" }} />}

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
const Event = ({ event, openEvents, index, length }) => {
	const { Description, Date, StartTime, Location, photos } = event;

	return (
		<Pressable
			onPress={() => openEvents(index)}
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
				colors={["rgba(0,0,0,0.005)", "rgba(0,0,0,0.3)"]}
				start={{ x: 0.5, y: 0 }}
				end={{ x: 0.5, y: 1 }}
				style={{
					height: "25%",
					width: "100%",
					position: "absolute",
					bottom: 0,
				}}
			>
				<Text
					style={{
						color: colors.white,
						fontSize: width * 0.045,
						paddingLeft: 10,
						fontWeight: "bold",
						letterSpacing: 1.05,
					}}
				>
					{Description}
				</Text>
				<View name={"info"} style={{ width: "100%" }}>
					<View
						name={"date"}
						style={{
							width: "100%",
							flexDirection: "row",
							justifyContent: "space-between",
						}}
					>
						<Text
							style={{
								color: colors.white,
								fontSize: width * 0.035,
								paddingLeft: 10,
							}}
						>
							{Date}
						</Text>
						<Text
							style={{
								color: colors.white,
								fontSize: width * 0.035,
								paddingRight: 10,
							}}
						>
							{StartTime}
						</Text>
					</View>
				</View>
				<View
					name={"location"}
					style={{ width: "100%", flexDirection: "row", alignItems: "center" }}
				>
					<MaterialCommunityIcons
						name="map-marker-radius"
						size={15}
						color={colors.white}
						style={{ paddingLeft: 10 }}
					/>
					<Text
						style={{
							color: colors.white,
							fontSize: width * 0.035,
							paddingRight: 10,
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
	const [selectedCategory, setSelectedCategory] = React.useState(0);
	const [eventList, setEventList] = React.useState([]);
	const [shownEvents, setShownEvents] = React.useState([]);
	const [peopleList, setPeopleList] = React.useState([]);
	const [myID, setMyID] = React.useState(null);
	const eventsRef = React.useRef();

	React.useEffect(() => {
		if (shownEvents.length > 0) eventsRef.current.scrollToIndex({ index: 0 });
	});

	React.useEffect(async () => {
		let abortController = new AbortController();

		const userDataStr = await SecureStore.getItemAsync("userData");
		const userData = JSON.parse(userDataStr);
		const userID = userData.UserId;
		setMyID(userID);
		await axios
			.post(url + "/Swipelist", { UserId: userID })
			.then((res) => {
				setPeopleList(res.data);
			})
			.catch((err) => {
				console.log(err);
			});
		await axios
			.post(url + "/EventList", { UserId: userID })
			.then((res) => {
				setEventList(res.data);
				setShownEvents(res.data);
			})
			.catch((err) => {
				console.log(err);
			});

		return () => {
			abortController.abort();
		};
	}, []);

	React.useEffect(async () => {
		const dataStr = await SecureStore.getItemAsync("userData");
		const data = JSON.parse(dataStr);

		const userID = data.UserId.toString();
		const userName = data.Name;
		const fetchUser = async () => {
			const userData = await API.graphql(graphqlOperation(getMsgUser, { id: userID }));
			if (userData.data.getMsgUser) {
				console.log("User is already registered in database");
				return;
			} else {
				console.log("User does not exists");
			}

			const newUser = {
				id: userID,
				name: userName,
				imageUri: null,
			};
			console.log(newUser);
			await API.graphql(graphqlOperation(createMsgUser, { input: newUser }));

			console.log("New user created");
		};

		fetchUser();
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

	return (
		<View style={commonStyles.Container}>
			<StatusBar style="dark" />
			<ScrollView style={{ width: width }} showsVerticalScrollIndicator={false}>
				<View name={"PeopleHeader"} style={[commonStyles.Header, { height: height * 0.05 }]}>
					<GradientText
						text={"Kişiler"}
						style={{
							fontSize: 30,
							fontWeight: "bold",
							letterSpacing: 1.2,
							marginLeft: 20,
						}}
					/>
					<TouchableOpacity
						style={{ marginRight: 20 }}
						onPress={() => {
							Alert.alert("Bu özellik tam sürümde eklenecek");
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
						height: height / 3,
						width: "100%",
						justifyContent: "center",
					}}
				>
					{peopleList.length > 0 ? (
						<FlatList
							keyExtractor={(item) => {
								item.UserId.toString();
							}}
							horizontal={true}
							showsHorizontalScrollIndicator={false}
							data={peopleList}
							renderItem={({ item, index }) => (
								<People
									index={index}
									person={item}
									length={peopleList.length}
									openProfiles={(idx) => {
										var arr = new Array(...peopleList);
										const element = arr[idx];
										arr.splice(idx, 1);
										arr.splice(0, 0, element);
										navigation.navigate("ProfileCards", {
											idx: idx,
											list: arr,
											myID: myID,
										});
									}}
								/>
							)}
						/>
					) : (
						<Text
							style={{
								textAlign: "center",
								fontWeight: "bold",
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
					style={[commonStyles.Header, { height: height * 0.05, marginTop: 5 }]}
				>
					<GradientText
						text={"Etkinlikler"}
						style={{
							fontSize: 30,
							fontWeight: "bold",
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
					<View name={"Events"} style={{ width: "100%", height: height / 3 }}>
						<FlatList
							ref={eventsRef}
							horizontal={true}
							showsHorizontalScrollIndicator={false}
							keyExtractor={(item) => {
								item.EventId.toString();
							}}
							data={shownEvents}
							renderItem={({ item, index }) => (
								<Event
									index={index}
									event={item}
									length={shownEvents.length}
									openEvents={(idx) => {
										navigation.navigate("EventCards", {
											idx: idx,
											list: shownEvents,
										});
									}}
								/>
							)}
						/>
					</View>
				</View>
			</ScrollView>
		</View>
	);
}

const styles = StyleSheet.create({
	categoryIcon: {
		marginTop: "10%",
		height: "80%",
		resizeMode: "contain",
	},
});
