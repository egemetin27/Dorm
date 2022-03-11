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
} from "react-native";
import { Octicons, MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import * as SecureStore from "expo-secure-store";

import commonStyles from "../../visualComponents/styles";
import { colors, GradientText, Gradient } from "../../visualComponents/colors";
import axios from "axios";
import { url } from "../../connection";

const { height, width } = Dimensions.get("window");


import {
	API,
	graphqlOperation,
  } from 'aws-amplify';
import {getMsgUser} from "../../src/graphql/queries"
import {createMsgUser} from "../../src/graphql/mutations"
const CategoryList = [
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
		// age,
		School: university,
		Major: major,
		photos: photoList,
	} = person;

	const age = "DUZELT";

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
					{/* TODO: name • age {'\n'} university {'\n'} major */}
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
const Category = (props) => {
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
					marginRight: props.index + 1 == CategoryList.length ? 15 : 0,
					backgroundColor:
						props.selectedCategory == props.index
							? "transparent"
							: colors.white,
				},
			]}
		>
			{props.selectedCategory == props.index && (
				<Gradient style={{ position: "absolute" }} />
			)}

			<Pressable
				onPress={() => props.setSelectedCategory(props.index)}
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
								tintColor:
									props.selectedCategory == props.index
										? colors.white
										: colors.cool_gray,
							},
						]}
						source={props.children.url}
					/>
				</View>

				<View
					name={"name"}
					style={{ width: "100%", height: "40%", alignItems: "center" }}
				>
					<Text
						style={{
							fontSize: width * 0.035,
							color:
								props.selectedCategory == props.index
									? colors.white
									: colors.cool_gray,
						}}
					>
						{props.children.key}
					</Text>
				</View>
			</Pressable>
		</View>
	);
};
const Event = ({ event, openEvents, index, length }) => {
	const { Description, Date, StartTime, Location } = event;

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

				{/* <Text style={{ color: colors.white, fontSize: 15, paddingLeft: 10, fontStyle: "italic" }}>
					date
				</Text> */}
			</Gradient>
		</Pressable>
	);
};

export default function MainPage({ navigation }) {
	const [selectedCategory, setSelectedCategory] = React.useState(1);
	const [eventList, setEventList] = React.useState([]);
	const [peopleList, setPeopleList] = React.useState([]);

	React.useEffect(async () => {
		let abortController = new AbortController();

		const userDataStr = await SecureStore.getItemAsync("userData");
		const userData = JSON.parse(userDataStr);
		const userID = userData.UserId;

		const people = await axios
			.post(url + "/Swipelist", { UserId: userID })
			.then((res) => {
				setPeopleList(res.data);
			})
			.catch((err) => {
				console.log(err);
			});

		const events = await axios
			.get(url + "/EventList")
			.then((res) => {
				setEventList(res.data);
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
		console.log(data);

		const userID = data.UserId.toString();
		const userName = data.Name;
		const fetchUser = async () => {	
		  
			const userData = await API.graphql(
			  graphqlOperation(
				getMsgUser,
				{ id: userID }
				)
			)
			console.log(userData);
					
			if (userData.data.getMsgUser) {
			  console.log("User is already registered in database");
			  return;
			}
			else{
				console.log("User does not exists");
			}
	
			const newUser = {
			  id: userID,
			  name: userName,
			  imageUri: null,
			}
			console.log(newUser);
			await API.graphql(
				graphqlOperation(
				  createMsgUser,
				  { input: newUser}
				)
			  )
			
			console.log("New user created");
		}
	
		fetchUser();
	  }, [])

	return (
		<View style={commonStyles.Container}>
			<ScrollView style={{ width: width }} showsVerticalScrollIndicator={false}>
				<View
					name={"PeopleHeader"}
					style={[commonStyles.Header, { height: height * 0.05 }]}
				>
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
					<View
						name={"Categories"}
						style={{ width: "100%", height: height * 0.12 }}
					>
						<FlatList
							horizontal={true}
							showsHorizontalScrollIndicator={false}
							data={CategoryList}
							renderItem={({ item, index }) => (
								<Category
									index={index}
									selectedCategory={selectedCategory}
									setSelectedCategory={setSelectedCategory}
								>
									{item}
								</Category>
							)}
						/>
					</View>
					<View name={"Events"} style={{ width: "100%", height: height / 3 }}>
						<FlatList
							horizontal={true}
							showsHorizontalScrollIndicator={false}
							keyExtractor={(item) => {
								item.EventId.toString();
							}}
							data={eventList}
							renderItem={({ item, index }) => (
								<Event
									index={index}
									event={item}
									length={eventList.length}
									openEvents={(idx) => {
										navigation.navigate("EventCards", {
											idx: idx,
											list: eventList,
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