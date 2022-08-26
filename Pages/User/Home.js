import React, { useContext } from "react";
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
	RefreshControlBase,
} from "react-native";
import { Octicons, MaterialCommunityIcons, Entypo, Feather, Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";

import commonStyles from "../../visualComponents/styles";
import { colors, GradientText, Gradient } from "../../visualComponents/colors";
import axios from "axios";
import url from "../../connection";

import { useSafeAreaFrame } from "react-native-safe-area-context";
import { CustomModal } from "../../visualComponents/customComponents";
import { AuthContext } from "../../contexts/auth.context";
import { Session } from "../../nonVisualComponents/SessionVariables";

import crypto from "../../functions/crypto";
import { formatDate } from "../../utils/date.utils";
import CustomImage from "../../components/custom-image.component";

import People from "../../components/person-card-small.component";
import Event from "../../components/event-card-small.component";
import { FilterContext } from "../../contexts/filter.context";

const { height, width } = Dimensions.get("window");

const categories = [
	{
		key: "Tümü",
		databaseKey: "",

		url: require("../../assets/HomeScreenCategoryIcons/AllEvents.png"),
	},
	{
		key: "Favorilerin",
		databaseKey: "isLiked",
		url: require("../../assets/HomeScreenCategoryIcons/Favs.png"),
	},
	{
		key: "Kaçmaz",
		databaseKey: "Kacmaz",
		url: require("../../assets/HomeScreenCategoryIcons/Hot.png"),
	},
	{
		key: "Gece",
		databaseKey: "Gece",
		url: require("../../assets/HomeScreenCategoryIcons/Gece.png"),
	},
	{
		key: "Festival",
		databaseKey: "festival",
		url: require("../../assets/HomeScreenCategoryIcons/festival.png"),
	},
	{
		key: "Konser",
		databaseKey: "Konser",
		url: require("../../assets/HomeScreenCategoryIcons/Concert.png"),
	},
	{
		key: "Kampüs",
		databaseKey: "Kampus",
		url: require("../../assets/HomeScreenCategoryIcons/Campus.png"),
	},
	{
		key: "Kültür",
		databaseKey: "Culture",
		url: require("../../assets/HomeScreenCategoryIcons/Culture.png"),
	},
	{
		key: "Filmler",
		databaseKey: "Film",
		url: require("../../assets/HomeScreenCategoryIcons/Movies.png"),
	},
];

const Category = ({
	index,
	userId,
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
		const filtered = eventList.filter((item) => item[categories[idx].databaseKey] == 1);
		setShownEvents(filtered);
	};

	return (
		<View
			style={[
				commonStyles.photo,
				{
					height: "80%",
					borderRadius: 15,
					aspectRatio: 1 / 1,
					marginHorizontal: 0,
					marginLeft: Math.min(20, width * 0.03),
					marginRight: index + 1 == categories.length ? Math.min(20, width * 0.03) : 0,
					backgroundColor: colors.white,
					shadowColor: "#000000",
					shadowOffset: {
						width: 0,
						height: 6,
					},
					shadowOpacity: 1,
					shadowRadius: 8.3,
					elevation: 4,
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

export default function MainPage({ navigation }) {
	const { user, signOut } = useContext(AuthContext);
	const { filters } = useContext(FilterContext);

	const [isAppReady, setIsAppReady] = React.useState(false);
	const [selectedCategory, setSelectedCategory] = React.useState(0);
	const [eventList, setEventList] = React.useState([]);
	const [shownEvents, setShownEvents] = React.useState([]);
	const [peopleList, setPeopleList] = React.useState([]);
	const [myPP, setMyPP] = React.useState("");
	const [matchMode, setMatchMode] = React.useState(0);
	const [listEmptyMessage, setLisetEmptyMessage] = React.useState(
		"Şu an için etrafta kimse kalmadı gibi duruyor. Ama sakın umutsuzluğa kapılma. En kısa zamanda tekrar uğramayı unutma!"
	);
	const eventsFlatListRef = React.useRef();
	const peopleFlatListRef = React.useRef();

	const handleFilterButton = () => {
		navigation.navigate("FilterModal");
	};

	React.useEffect(async () => {
		let abortController = new AbortController();

		const userId = user?.userId;
		const myMode = user?.matchMode;
		const myPhoto = user?.Photo[0]?.PhotoLink ?? "";

		setMatchMode(myMode);
		setMyPP(myPhoto);

		async function prepare() {
			const swipeListData = crypto.encrypt({
				userId: userId,
				...filters,
			});

			await axios
				.post(url + "/Swipelist", swipeListData, {
					headers: { "access-token": user.sesToken },
				})
				.then((res) => {
					const data = crypto.decrypt(res.data);

					setPeopleList(data);
				})
				.catch((err) => {
					if (err.response) {
						if (err.response.status == 410) {
							Alert.alert("Oturumunuzun süresi doldu!");
							signOut();
						}
						if (err.response.status == 411) {
							setPeopleList([]);
							setLisetEmptyMessage(
								// "Diğerler insanları görmek istiyorsan görünmez moddan çıkmalısın!"
								// "Görünmez moddayken diğer kişileri göremezsin"
								"Görünmez modda olduğun için kişileri sana gösteremiyoruz :("
							);
							return;
						}
					} else {
						console.log(err);
					}
					console.log("error on swipelist");
					console.log(err);
				});

			const eventListData = crypto.encrypt({ userId: userId, campus: user.School });
			await axios
				.post(url + "/EventList", eventListData, {
					headers: { "access-token": user.sesToken },
				})
				.then((res) => {
					const data = crypto.decrypt(res.data);
					setEventList(data);
					setShownEvents(data);
				})
				.catch((err) => {
					console.log("error on /eventList");
					console.log(err);
				});
		}
		try {
			await prepare();
		} catch (err) {
			console.log(err);
		} finally {
			setIsAppReady(true);
		}

		return () => {
			abortController.abort();
		};
	}, [filters]);

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
		if (eventsFlatListRef.current && shownEvents.length > 0) {
			eventsFlatListRef.current.scrollToIndex({ index: 0 });
		}
	}, [shownEvents]);

	React.useEffect(() => {
		if (peopleFlatListRef.current) {
			peopleFlatListRef.current.scrollToIndex({ index: 0 });
		}
	}, [peopleList]);

	if (!isAppReady) {
		return (
			<View style={[commonStyles.Container, { justifyContent: "center" }]}>
				<StatusBar style="dark" backgroundColor={"#F4F3F3"} hideTransitionAnimation="slide" />

				<ActivityIndicator animating={true} color={"rgba(100, 60, 248, 1)"} size={"large"} />
			</View>
		);
	}

	return (
		<View style={[commonStyles.Container, { justifyContent: "space-between" }]}>
			{/* The items above events are all part of header of Events View to scroll in events in the page */}
			<View name={"Events"} style={{ width: width, height: height}}>
				{shownEvents.length > 0 ? 
					<FlatList
						horizontal={false}
						ref={eventsFlatListRef}
						numColumns={2}
						showsHorizontalScrollIndicator={false}
						showsVerticalScrollIndicator={false}
						contentContainerStyle={{alignSelf: 'flex-start'}}
						keyExtractor={(item) => item?.EventId?.toString() ?? ""}
						data={shownEvents}
						ListHeaderComponent={() => {
							return (
								// All the items above events
								<View style={{width: width}}>
									<StatusBar style="dark" backgroundColor={"#F4F3F3"} />
									<View
										name={"PeopleHeader"}
										style={[
											{
												marginTop: height * 0.01,
												flexDirection: "row",
												alignItems: "center",
												justifyContent: "space-between",
												width: "100%",
												height: height * 0.05,
											},
										]}
									>
										<GradientText
											text={"Kişiler"}
											style={{
												fontSize: Math.min(height * 0.035, 35),
												fontFamily: "NowBold",
												letterSpacing: 1.2,
												marginLeft: 20,
											}}
										/>
										<View style={{ marginRight: 20 }}>
											<TouchableOpacity
												style={{
													paddingHorizontal: 15,
													paddingVertical: 10,
													// backgroundColor: "red",
												}}
												onPress={() => {
													setFiltreModal(true);
												}}
											>
												<View>
													<Octicons
														style={{ transform: [{ rotate: "-90deg" }] }}
														name="settings"
														size={Math.min(height * 0.035, 30)}
														color={colors.cool_gray}
													/>
												</View>
											</TouchableOpacity>
										</View>
									</View>
									<View
										name={"People"}
										style={{
											width: "100%",
											height: height * 0.3,
											justifyContent: "center",
										}}
									>
										{peopleList?.length > 0 ? (
											<FlatList
												ref={peopleFlatListRef}
												keyExtractor={(item, index) => item?.userId?.toString() ?? index}
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
															navigation.replace("ProfileCards", {
																idx: idx,
																list: peopleList.slice(0, 45),
																matchMode: matchMode,
																myID: user.userId,
																sesToken: user.sesToken,
																myPP: myPP,
															});
														}}
													/>
												)}
											/>
										) : (
											<View style={{ paddingHorizontal: width * 0.075 }}>
												<Text
													style={{
														textAlign: "center",
														fontFamily: "PoppinsSemiBold",
														fontSize: Math.min(width * 0.042, 20),
														color: colors.gray,
													}}
												>
													{listEmptyMessage}
												</Text>
											</View>
										)}
									</View>
									<View
										name={"EventHeader"}
										style={[commonStyles.Header, { height: height * 0.05, marginTop: height * 0.01 }]}
									>
										<GradientText
											text={"Etkinlikler"}
											style={{
												fontSize: Math.min(height * 0.035, 32),
												fontFamily: "NowBold",
												letterSpacing: 1.2,
												marginLeft: 20,
											}}
										/>
									</View>

									<View name={"Categories"} style={{ width: "100%", height: height* 0.09 }}>
										<FlatList
											horizontal={true}
											showsHorizontalScrollIndicator={false}
											data={categories}
											renderItem={({ item, index }) => (
												<Category
													index={index}
													userId={user.sesToken}
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
								</View>
							);
							}}
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
										myID: user.userId,
										sesToken: user.sesToken,
									});
								}}
							/>
						)}
					/>
					: (
					<View
						style={{
							width: "100%",
							height: "100%",
							justifyContent: "center",
							alignItems: "center",
							paddingHorizontal: "10%",
						}}
					>
						<Text
							style={{
								textAlign: "center",
								fontFamily: "PoppinsSemiBold",
								fontSize: Math.min(width * 0.042, 20),
								color: colors.gray,
							}}
						>
							Maalesef burada gösterebileceğimiz bir etkinlik kalmamış...
						</Text>
					</View>
				)}
			</View>
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
		minWidth: width / 4,
		height: width / 8,
		borderRadius: width / 16,
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
