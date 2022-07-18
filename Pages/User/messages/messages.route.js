import { useContext, useEffect, useState } from "react";
import { View, Text, Image, Dimensions, StyleSheet, Pressable, FlatList } from "react-native";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import FastImage from "react-native-fast-image";

import { SocketContext } from "../../../contexts/socket.context";
import { GradientText, Gradient } from "../../../visualComponents/colors";
import Switch from "./switch.component";
import NewMatchBox from "./new-match-box.component";
import NonEmptyChatBox from "./non-empty-chat-box.component";

const { width, height } = Dimensions.get("screen");

const Messages = () => {
	const { connect, matchList } = useContext(SocketContext);
	const [matchMode, setMatchMode] = useState(1);

	const [matches, setMatches] = useState({
		0: {
			emptyChats: [],
			nonEmptyChats: [],
		},
		1: {
			emptyChats: [],
			nonEmptyChats: [],
		},
	});

	useEffect(() => {
		connect();
	}, []);

	useEffect(() => {
		if (matchList.length > 0) {
			const flirts = matchList.filter((match) => match.matchMode == 0);
			const friends = matchList.filter((match) => match.matchMode == 1);

			setMatches({
				0: {
					emptyChats: flirts.filter((item) => item.ChatEmpty == 1),
					nonEmptyChats: flirts.filter((item) => item.ChatEmpty != 1),
				},
				1: {
					emptyChats: friends.filter((item) => item.ChatEmpty == 1),
					nonEmptyChats: friends.filter((item) => item.ChatEmpty != 1),
				},
			});
		}
	}, [matchList]);

	const handleSearch = () => {
		console.log("Search Button Pressed");
	};

	return (
		<View style={styles.container}>
			<StatusBar />
			<View style={styles.header}>
				<View
					style={{
						flexDirection: "row",
						justifyContent: "space-between",
						paddingHorizontal: width * 0.05,
					}}
				>
					<GradientText text={"Sohbetlerim"} style={styles.header_text} />
					<Pressable style={styles.search_button} onPress={handleSearch}>
						<Ionicons name="search" size={height * 0.04} color="#9D9D9D" />
					</Pressable>
				</View>
				<Switch
					choiceList={["Flört Modu", "Arkadaş Modu"]}
					choice={matchMode}
					setChoice={setMatchMode}
				/>
			</View>
			<View>
				<FlatList
					horizontal={true}
					showsHorizontalScrollIndicator={false}
					data={matches[matchMode].emptyChats}
					keyExtractor={(item) => item.MatchId}
					contentContainerStyle={styles.empty_chat_list}
					ListEmptyComponent={() => (
						<View
							style={{
								width: width * 0.96,
								paddingHorizontal: width * 0.05,
							}}
						>
							<Text adjustsFontSizeToFit={true} style={{ textAlign: "center", color: "#9D9D9D" }}>
								Keşfetmeye Başla. Ana sayfaya giderek diğer kullanıcılarla eşleştiğinde buradan
								onlara mesaj atabileceksin. Sana mesaj atmak isteyen bir sürü kişi var, sadece senin
								kaydırmanı bekliyorlar.
							</Text>
						</View>
					)}
					ItemSeparatorComponent={() => {
						return <View style={{ width: width * 0.02 }} />;
					}}
					renderItem={({ item, index }) => {
						console.log({ item });
						return <NewMatchBox user={item} />;
					}}
				/>
			</View>
			<FlatList
				showsVerticalScrollIndicator={false}
				// data={[
				// 	...matches[matchMode].emptyChats,
				// 	...matches[matchMode].emptyChats,
				// 	...matches[matchMode].emptyChats,
				// 	...matches[matchMode].emptyChats,
				// 	...matches[matchMode].emptyChats,
				// 	...matches[matchMode].emptyChats,
				// ]}
				data={matches[matchMode].nonEmptyChats}
				keyExtractor={(item) => item.MatchId}
				contentContainerStyle={styles.non_empty_chat_list}
				ItemSeparatorComponent={() => {
					return <View style={{ height: height * 0.02 }} />;
				}}
				renderItem={({ item, index }) => <NonEmptyChatBox user={item} />}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		backgroundColor: "#F8F8F8",
		flex: 1,
	},

	header: {
		backgroundColor: "#F8F8F8",
		paddingTop: height * 0.025,
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 5,
	},

	header_text: {
		fontSize: height * 0.035,
		fontFamily: "PoppinsExtraBold",
		letterSpacing: 1.2,
	},

	search_button: {
		padding: 2,
	},

	empty_chat_list: {
		height: height * 0.16,
		paddingVertical: height * 0.01,
		paddingHorizontal: width * 0.02,
		flexGrow: 1,
	},
	non_empty_chat_list: {
		paddingBottom: height * 0.02,
		paddingHorizontal: width * 0.02,
	},
});

export default Messages;
