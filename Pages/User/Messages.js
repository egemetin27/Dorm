import React, { useState } from "react";


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
	Button,
r} from "react-native";
import commonStyles from "../../visualComponents/styles";
import { Ionicons, MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import { colors, GradientText, Gradient } from "../../visualComponents/colors";
const { height, width } = Dimensions.get("window");
import { color } from "react-native-reanimated";
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { msgData } from "../msgData";
import MsgBox from "./MsgBox";
import NewMatchBox from "./NewMatchBox";
import { SafeAreaView } from "react-native-safe-area-context";
import { render } from "react-dom";
import { red } from "react-native-redash";
import * as SecureStore from "expo-secure-store";

/*
	React.useEffect(async () => {
		const dataStr = await SecureStore.getItemAsync("userData");
		const data = JSON.parse(dataStr);
		console.log(data);
		setUserID(data.UserId);
		setUserName(data.Name);
	}, []);

	

	// run this snippet only when App is first mounted
	React.useEffect( () => {
		const fetchUser = async () => {	
		  
			const userData = await API.graphql(
			  graphqlOperation(
				getMsgUser,
				{ id: userID }
				)
			)
			console.log(userData);

			const testData = await API.graphql(
				graphqlOperation(
				  listUserChats,
				  { filter: {
					  or: [
						  { userChatFirstUserId: {eq: "6771"}},
						  { userChatSecondUserId: {eq: "6772"}}
					  ]
				  }}
				  )
			)
			console.log(testData);
					
			if (userData.data.getMsgUser) {
			  console.log("User is already registered in database");
			  return;
			}
	
			const newUser = {
			  id: userID,
			  name: userName,
			  imageUri: "https://m.media-amazon.com/images/M/MV5BMTg0MzkzMTQtNWRlZS00MGU2LTgwYTktMjkyNTZkZTAzNTQ3XkEyXkFqcGdeQXVyMTM1MTE1NDMx._V1_FMjpg_UY720_.jpg",
			}
	
			await API.graphql(
			  graphqlOperation(
				createMsgUser,
				{ input: newUser }
			  )
			)
		  
		}
	
		fetchUser();
	  }, [])
	*/


	export default function Messages({ route, navigation }) {
		const [chatMode, setChatMode] = React.useState([1, 0]);
		const [lists, setLists] = useState(msgData);
	
		const deleteItem = (index) => {
			const arr = [...lists];
			arr.splice(index,1);
			setLists(arr);
		};

		const openChat = async () => {
			navigation.navigate("Chat", {
				
				chatUserID: 1,
				chatID: 1,
			});
		};
	
		return (
			<View style={[commonStyles.Container, { alignItems: "center" , flex: 1}]}>
				<View name={"Header"} style={commonStyles.Header}>
					<View style={{ marginLeft: 20 }}>
						{
							<GradientText
								style={{ fontSize: 27, fontWeight: "bold", letterSpacing: 1.2 }}
								text={"Sohbetlerim"}
							/>
						}
					</View>
					<View style={{ flexDirection: "row", alignSelf: "center" }}>
						<TouchableOpacity onPress={() =>{}}>
							
							<Feather
								name="search"
								size={27}
								color={colors.gray}
								style={{ paddingRight: 15 }}
							/>
							
						</TouchableOpacity>
					</View>
				</View>
				<View style = {{
					Container: {width: "100%"},
					flexDirection: "row",
					justifyContent: "center",
					marginTop: 10
				}}>
					<View style = {{flex: 1}}>
						{
							chatMode[0] == 1 ? (
								<Gradient style = {{ height: height * 0.06}}>
									<TouchableOpacity style= {{
										backgroundColor: "#F4F3F3",
										paddingBottom: 16,
										
									}}>
										<GradientText
											style={{ marginLeft: width * 0.1, fontSize: 18, fontWeight: "bold", letterSpacing: 1.2, justifyContent: "center", alignItems: "center" }}
											text={"Flört Modu"}
										/>
									</TouchableOpacity>
	
								</Gradient>
	
							) : (
								<Pressable style = {{alignItems: "center", justifyContent: "center"}} onPress={() => {setChatMode([1, 0]);}}>
									  <Text style={{fontSize: 20, color: colors.cool_gray}}>
										  Flört Modu
									</Text>
								</Pressable>
	
						)}
					</View>
					<View style = {{flex: 1}}>
						{
							chatMode[1] == 1 ? (
								<Gradient style = {{ height: height * 0.06}}>
									<TouchableOpacity style= {{
										backgroundColor: "#F4F3F3",
										paddingBottom: 16,
										
									}}>
										<GradientText
											style={{ marginLeft: width * 0.05, fontSize: 18, fontWeight: "bold", letterSpacing: 1.2, justifyContent: "center", alignItems: "center" }}
											text={"Arkadaş Modu"}
										/>
									</TouchableOpacity>
	
								</Gradient>
	
							) : (
								<Pressable style = {{alignItems: "center", justifyContent: "center"}} onPress={() => {setChatMode([0, 1]);}}>
									  <Text style={{fontSize: 20, color: colors.cool_gray}}>
										  Arkadaş Modu
									</Text>
								</Pressable>
	
						)}
					</View>
	
	
				</View>
	
				<View>
					{
						chatMode[0] == 1 ? (
							<View>
								<View style={{marginBottom:10}} />
	
								<View>
	
									<FlatList
										horizontal = {true}
										showsHorizontalScrollIndicator={false}
										data={lists}
										renderItem={({item,index}) => {
											if (item.mode == 0 && item.Message == null) {
												return <NewMatchBox data= {item}/>;
											}
										}}
	
									/>
								</View>
								<View style={{marginBottom:10}} />
								<View>
									<FlatList
										style = {{
											flexDirection: "row",
											borderRadius: 8,
										}}
										data = {lists}
										renderItem={({item,index}) => {
											if (item.mode == 0 && item.Message != null) {
												return <MsgBox data= {item} handleDelete = {() => deleteItem(index)} openChat = {() => openChat()}/>;
											}
										}}
									/>
								</View>
							</View>
							
							
						) : (
							<View>
								<View style={{marginBottom:10}} />
								<View>
	
									<FlatList
										horizontal = {true}
										showsHorizontalScrollIndicator={false}
										data={lists}
										renderItem={({item,index}) => {
											if (item.mode == 1 && item.Message == null) {
												return <NewMatchBox data= {item}/>;
											}
										}}
	
									/>
								</View>
								<View style={{marginBottom:10}} />
								<View>
									<FlatList
										style = {{
											flexDirection: "row",
											borderRadius: 8,
										}}
										data = {lists}
										renderItem={({item,index}) => {
											if (item.mode == 1 && item.Message != null) {
												return <MsgBox data= {item} handleDelete = {() => deleteItem(index)} openChat = {() => openChat()}/>;
											}
										}}
									/>
								</View>
							</View>
					)}
				</View>
					
			</View>
		);
	}
