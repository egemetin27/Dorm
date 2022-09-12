import { useContext, useEffect, useRef, useState } from "react";
import {
	StyleSheet,
	Text,
	View,
	TouchableOpacity,
	Dimensions,
	FlatList,
	Image,
	Pressable,
	Alert,
	BackHandler,
	ActivityIndicator,
} from "react-native";
import { Octicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";

import commonStyles from "../../visualComponents/styles";
import { colors, GradientText, Gradient } from "../../visualComponents/colors";
import axios from "axios";
import url from "../../connection";

//import { useSafeAreaFrame } from "react-native-safe-area-context";
import { AuthContext } from "../../contexts/auth.context";
//import { Session } from "../../nonVisualComponents/SessionVariables";

import crypto from "../../functions/crypto";

import People from "../../components/person-card-small.component";
import Event from "../../components/event-card-small.component";
import { FilterContext } from "../../contexts/filter.context";
import { NotificationContext } from "../../contexts/notification.context";

const { height, width } = Dimensions.get("window");

const categories = [
	{
		key: "Tümü",
		databaseKey: "",

		url: require("../../assets/HomeScreenCategoryIcons/AllEvents.png"),
	},
	{
		key: "Favoriler",
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
		key: "Konser",
		databaseKey: "Konser",
		url: require("../../assets/HomeScreenCategoryIcons/Concert.png"),
	},
	{
		key: "Festival",
		databaseKey: "festival",
		url: require("../../assets/HomeScreenCategoryIcons/Festival.png"),
	},
	{
		key: "Deneyim",
		databaseKey: "experience",
		url: require("../../assets/HomeScreenCategoryIcons/Experience.png"),
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
		key: "Film/Dizi",
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
		const filtered = eventList.filter((item) => {
			if (!item[categories[idx]?.databaseKey]) return false;
			return item[categories[idx]?.databaseKey] == 1;
		});
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
				style={{ width: "100%", paddingHorizontal: 2 }}
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
							fontSize: height * 0.014,
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

const ListEmpty = () => {
	return (
		<View>
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
	);
};

export default function MainPage({ navigation }) {
	const { user, signOut, peopleListIndex, setPeopleIndex } = useContext(AuthContext);
	const { eventLiked, setEventLike } = useContext(NotificationContext);
	const { filters } = useContext(FilterContext);

	const [isAppReady, setIsAppReady] = useState(false);
	const [selectedCategory, setSelectedCategory] = useState(0);
	const [eventList, setEventList] = useState([]);
	const [shownEvents, setShownEvents] = useState([]);
	const [peopleList, setPeopleList] = useState([]);
	const [myPP, setMyPP] = useState("");
	const [matchMode, setMatchMode] = useState(0);
	const [listEmptyMessage, setLisetEmptyMessage] = useState(
		"Şu an için etrafta kimse kalmadı gibi duruyor. Ama sakın umutsuzluğa kapılma. En kısa zamanda tekrar uğramayı unutma!"
	);
	//const eventsFlatListRef = useRef();
	const peopleFlatListRef = useRef();

	const handleFilterButton = () => {
		navigation.navigate("FilterModal");
	};

	useEffect(() => {
		const homeStart = async () => {
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
					.post(url + "/lists/Swipelist", swipeListData, {
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
			}
			try {
				await prepare();
			} catch (err) {
				console.log(err);
			}

			return () => {
				abortController.abort();
			};
		};
		homeStart().catch(console.error);
	}, [filters]);

	useEffect(() => {
		const eventlike = async () => {
			let abortController = new AbortController();
			const userId = user?.userId;
			try {
				const eventListData = crypto.encrypt({ userId: userId, campus: user.School });
				await axios
					.post(url + "/lists/EventList", eventListData, {
						headers: { "access-token": user.sesToken },
					})
					.then((res) => {
						const data = crypto.decrypt(res.data);
						setEventList(data);
						setShownEvents(data);
						setEventLike(null);
						//console.log(eventList);
					})
					.catch((err) => {
						console.log("error on /eventList");
						console.log(err);
					});
			} catch (err) {
				console.log(err);
			} finally {
				setIsAppReady(true);
			}
			return () => {
				abortController.abort();
			};
		};
		eventlike().catch(console.error);
	}, [eventLiked]);

	useEffect(() => {
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
		setPeopleIndex(-1);
		return () => backHandler.remove();
	}, []);

	// useEffect(() => {
	// 	if (eventsFlatListRef.current && shownEvents.length > 0) {
	// 		eventsFlatListRef.current.scrollToIndex({ index: 0 });
	// 	}
	// }, [shownEvents]);

	// useEffect(() => {
	// 	if (peopleFlatListRef.current) {
	// 		peopleFlatListRef.current.scrollToIndex({ index: 0 });
	// 	}
	// }, [peopleList]);

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
			<StatusBar style="dark" backgroundColor={"#F4F3F3"} />

			{/* The items above events are all part of header of Events View to scroll in events in the page */}
			{/* <View name={"Events"} style={{ width: width, height: height }}> */}

			<FlatList
				horizontal={false}
				//ref={eventsFlatListRef}
				numColumns={2}
				showsHorizontalScrollIndicator={false}
				initialNumToRender={8}
				showsVerticalScrollIndicator={false}
				contentContainerStyle={{ alignSelf: "flex-start" }}
				keyExtractor={(item, idx) => item?.EventId?.toString()}
				data={shownEvents}
				ListHeaderComponent={() => {
					// All the items above events
					return (
						<View style={{ width: width }}>
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
								<View style={{ marginRight: 14 }}>
									<TouchableOpacity
										style={{
											paddingHorizontal: 14,
											height: "100%",
											justifyContent: "center",
										}}
										onPress={handleFilterButton}
									>
										<Octicons
											style={
												{
													//transform: [{ rotate: "-90deg" }],
												}
											}
											name="filter"
											size={Math.min(height * 0.032, 30)}
											color={colors.cool_gray}
										/>
									</TouchableOpacity>
								</View>
							</View>
							<View
								name={"People"}
								style={{
									width: "100%",
									height: height * 0.285,
									justifyContent: "center",
								}}
							>
								{peopleList?.length > 0 ? (
									<FlatList
										ref={peopleFlatListRef}
										maxToRenderPerBatch={1}
										keyExtractor={(item, index) => item?.userId?.toString() ?? index}
										horizontal={true}
										showsHorizontalScrollIndicator={false}
										data={peopleList.slice(peopleListIndex, peopleListIndex + 5) ?? null}
										renderItem={({ item, index }) => (
											<People
												setIsAppReady={setIsAppReady}
												index={index}
												person={item}
												length={5}
												openProfiles={(idx) => {
													navigation.navigate("ProfileCards", {
														idx: idx,
														//lastIndex: 45,
														list: peopleList.slice(peopleListIndex, 45),
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

							<View name={"Categories"} style={{ width: "100%", height: height * 0.09 }}>
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
						index={index}
						event={item}
						// length={shownEvents.length}
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
				ListFooterComponent={() =>
					shownEvents.length === 0 ? (
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
					) : null
				}
			/>

			{/* </View> */}
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
