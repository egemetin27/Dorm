import { useCallback, useContext, useEffect, useState } from "react";
import { View, Text, Dimensions, StyleSheet, FlatList } from "react-native";

import { GradientText, colors } from "../../../visualComponents/colors";
import Switch from "./switch.component";
import NewMatchBox from "./new-match-box.component";
import NonEmptyChatBox from "./non-empty-chat-box.component";

import { SocketContext } from "../../../contexts/socket.context";
import { MessageContext } from "../../../contexts/message.context";
import { AuthContext } from "../../../contexts/auth.context";

//import { sort } from "../../../utils/array.utils";
import { useFocusEffect } from "@react-navigation/native";
import useBackHandler from "../../../hooks/useBackHandler";
import { setStatusBarBackgroundColor, setStatusBarStyle, StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width, height } = Dimensions.get("screen");

const Messages = ({ navigation, route }) => {
	// const { user } = useContext(AuthContext);
	const { connect, disconnect } = useContext(SocketContext);
	const { matchesList, getLastMessage, getMessagesList, unreadChatIDS } =
		useContext(MessageContext);
	// const [chatMode, setChatMode] = useState(route.params?.matchMode ?? (user.matchMode || 0));
	const [sortedNonEmptyChats, setSortedNonEmptyChats] = useState([]);

	// const unreadInFlirt = matchesList["0"].nonEmptyChats.some(({ MatchId }) => {
	// 	return unreadChatIDS.includes(MatchId.toString());
	// });
	// const unreadInFriend = matchesList["1"].nonEmptyChats.some(({ MatchId }) => {
	// 	return unreadChatIDS.includes(MatchId.toString());
	// });

	const { top } = useSafeAreaInsets();

	useBackHandler(() => navigation.goBack());

	// useFocusEffect(() => {
	// 	Platform.OS != "ios" && setStatusBarBackgroundColor("#F4F3F3", true);
	// 	setStatusBarStyle("dark");
	// });

	useFocusEffect(
		useCallback(() => {
			getMessagesList();
			connect();
			return disconnect;
		}, [])
	);

	// useEffect(() => {
	// 	// connect to the socket when mounted and disconnect when unmounted
	// 	getMessagesList();
	// 	connect();
	// 	return disconnect;
	// }, []);

	useEffect(() => {
		// sort increasingly chat boxes with respect to last message date
		const sortedList = matchesList.nonEmptyChats;
		sortedList.sort((a, b) => {
			return getLastMessage(a.MatchId).date < getLastMessage(b.MatchId).date ? 1 : -1;
		});

		setSortedNonEmptyChats(sortedList);
	}, [matchesList.nonEmptyChats]);

	// const handleScroll = ({ nativeEvent }) => {
	// 	console.log({ nativeEvent });
	// 	// console.log(nativeEvent.velocity.y > 0);
	// };

	// const handleSearch = () => {
	// 	// fetch("https://exp.host/--/api/v2/push/send", {
	// 	// 	method: "POST",
	// 	// 	headers: {
	// 	// 		Accept: "application/json",
	// 	// 		"Content-Type": "application/json",
	// 	// 	},
	// 	// 	body: JSON.stringify({
	// 	// 		to: token,
	// 	// 		sound: "default",
	// 	// 		title: "Dorm",
	// 	// 		body: "Yeni bir eşleşmeniz var!",
	// 	// 	}),
	// 	// });
	// };

	return (
		<View style={[styles.container, { paddingTop: top }]}>
			<StatusBar style="dark" />
			<View style={styles.header}>
				<View
					style={{
						flexDirection: "row",
						justifyContent: "center",
						// paddingRight: width * 0.05,
						// paddingHorizontal: width * 0.05,
					}}
				>
					<GradientText text={"sohbetlerim"} style={styles.header_text} />
					{/* <Pressable style={styles.search_button} onPress={handleSearch}>
						<Ionicons name="search" size={height * 0.04} color="#9D9D9D" />
					</Pressable> */}
				</View>
				<View>
					<View style={styles.empty_chat_title_wrapper}>
						<GradientText text={`Eşleştiğin kişiler`} style={styles.empty_chat_title} />
					</View>
					<FlatList
						horizontal={true}
						showsHorizontalScrollIndicator={false}
						keyExtractor={(item) => item.MatchId}
						data={matchesList.emptyChats}
						contentContainerStyle={styles.empty_chat_list}
						ItemSeparatorComponent={() => <View style={{ width: width * 0.02 }} />}
						renderItem={({ item, index }) => <NewMatchBox match={item} />}
					/>
				</View>
				<View style={styles.header_line} />
			</View>
			<View style={styles.non_empty_chat_title_wrapper}>
				<GradientText text={"Sohbetlerim"} style={styles.non_empty_chat_title}></GradientText>
			</View>
			<FlatList
				// onScroll={handleScroll}
				showsVerticalScrollIndicator={false}
				keyExtractor={(item) => item.MatchId}
				data={sortedNonEmptyChats}
				contentContainerStyle={styles.non_empty_chat_list}
				ListEmptyComponent={() => (
					<View
						style={{
							width: width * 0.96,
							paddingHorizontal: width * 0.05,
						}}
					>
						<Text adjustsFontSizeToFit={true} style={{ textAlign: "center", color: "#9D9D9D" }}>
							Keşfetmeye Başla. Ana sayfaya giderek diğer kullanıcılarla eşleştiğinde buradan onlara
							mesaj atabileceksin. Sana mesaj atmak isteyen bir sürü kişi var, sadece senin
							kaydırmanı bekliyorlar.
						</Text>
					</View>
				)}
				ItemSeparatorComponent={() => <View style={{ height: height * 0.02 }} />}
				renderItem={({ item, index }) => <NonEmptyChatBox match={item} />}
			/>
		</View>
	);
};

export default Messages;

const styles = StyleSheet.create({
	container: {
		backgroundColor: colors.backgroundNew,
		flex: 1,
	},
	header: {
		// backgroundColor: "#F8F8F8",
		paddingTop: height * 0.025,
		paddingBottom: height * 0.012,
	},
	header_line: {
		width: "100%",
		height: 2,
		backgroundColor: colors.purpleGray,
		marginTop: 6,
		marginLeft: width * 0.03,
	},

	header_text: {
		fontFamily: "PoppinsBold",
		fontSize: height * 0.035,
		letterSpacing: 1.1,
	},
	search_button: {
		padding: 2,
	},
	empty_chat_list: {
		maxHeight: height * 0.16,
		flexGrow: 1,
		paddingVertical: height * 0.01,
		paddingHorizontal: width * 0.02,
	},
	non_empty_chat_list: {
		paddingVertical: height * 0.02,
	},
	empty_chat_title_wrapper: {
		paddingHorizontal: width * 0.03,
	},
	empty_chat_title: {
		fontFamily: "PoppinsSemiBold",
		fontSize: height * 0.027,
		letterSpacing: 1.1,
	},
	non_empty_chat_title_wrapper: {
		paddingTop: height * 0.012,
		paddingHorizontal: width * 0.03,
	},
	non_empty_chat_title: {
		fontFamily: "PoppinsSemiBold",
		fontSize: height * 0.027,
		letterSpacing: 1.1,
	},
});
