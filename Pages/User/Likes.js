import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../../contexts/auth.context";
import useBackHandler from "../../hooks/useBackHandler";
import axios from "axios";
import { ActivityIndicator, Dimensions, Image, Text, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import LikePerson from "../../components/likeperson-card-small.component";
import { colors, Gradient } from "../../visualComponents/colors";
import styles from "../../visualComponents/styles";
import { setStatusBarBackgroundColor, setStatusBarStyle, StatusBar } from "expo-status-bar";
import url from "../../connection";
import crypto from "../../functions/crypto";
import { useFocusEffect } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { height, width } = Dimensions.get("window");

//const yourLikesIcon = require("../../assets/yourlikes.png");

export default function Likes({ navigation, route }) {
	useBackHandler(() => navigation.goBack());

	const [likeCount, setLikeCount] = useState(-1);
	const [blurList, setBlurList] = useState([]);
	const [peopleList, setPeopleList] = useState([]);
	const [peopleListWoBlur, setPeopleListWoBLur] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [timeLeft, setTimeLeft] = useState(24 * 3600);

	const { top } = useSafeAreaInsets();

	const {
		user: { userId, sesToken, blurCount },
	} = useContext(AuthContext);

	const likeFlatListRef = useRef();

	// useFocusEffect(() => {
	// 	Platform.OS != "ios" && setStatusBarBackgroundColor("#FF6978", true);
	// 	setStatusBarStyle("dark");
	// });

	useEffect(() => {
		const getLikes = async () => {
			const dataToSend = crypto.encrypt({
				userId: userId,
			});
			await axios
				.post(url + "/lists/usersLikedYou", dataToSend, {
					headers: { "access-token": sesToken },
				})
				.then((res) => {
					const data = crypto.decrypt(res.data);
					// console.log(JSON.stringify(data, null, "\t"));
					setPeopleList(data["swipe_list"]);
					setTimeLeft(Math.floor(24 * 3600 - data.diff / 1000));
					setLikeCount(blurCount);
					const blurlist = blurList;
					const listWoBlur = [];
					data["swipe_list"].map((person) => {
						blurlist.push(person.blur);
						if (person.blur != 1) {
							listWoBlur.push(person);
						}
					});
					setBlurList(blurlist);
					setPeopleListWoBLur(listWoBlur);
					setTimeout(() => {
						setIsLoading(false);
					}, 100);
				})
				.catch((err) => {
					console.log(err.response);
				});
		};
		getLikes();
	}, []);

	useEffect(() => {
		if (likeCount == 0) {
			let interval = setInterval(() => {
				setTimeLeft((lastTimerCount) => {
					if (lastTimerCount <= 1) {
						setLikeCount(likeCount + 1);
						clearInterval(interval);
					}
					return lastTimerCount - 1;
				});
			}, 1000);

			return () => clearInterval(interval);
		}
	}, [likeCount]);

	useBackHandler(() => navigation.goBack());

	const handleOpen = (index, blur, otherUser) => {
		if (blur != 1) {
			let idx = 0;
			peopleListWoBlur.some((person, indx) => {
				if (peopleList[index].UserId == person.UserId) {
					return true;
				}
				idx += 1;
			});
			navigation.navigate("LikeCards", {
				idx: idx,
				list: peopleListWoBlur.slice(0, 30),
			});
		} else if (likeCount > 0) {
			const sendBlurChanged = async () => {
				const dataToSend = crypto.encrypt({
					userId: userId,
					otherUser: otherUser,
				});
				await axios
					.post(url + "/profile/changeBlur", dataToSend, {
						headers: { "access-token": sesToken },
					})
					.then((res) => {
						//console.log(res.data);
						const newBlurList = blurList.map((blur, idx) => {
							if (idx == index) return 0;
							return blur;
						});
						//console.log(newBlurList);
						res.data.blurCount == 0 && setTimeLeft(24 * 3600 - 1);
						setBlurList(newBlurList);
						setPeopleListWoBLur((oldList) => {
							const person = peopleList.find(({ UserId }) => {
								return UserId.toString() === otherUser.toString();
							});
							return [person, ...oldList];
						});
						setLikeCount(res.data.blurCount ?? likeCount - 1);
					})
					.catch((err) => {
						console.log(err);
					});
			};
			sendBlurChanged();
		} else {
			navigation.navigate("CustomModal", { modalType: "MAX_BLUR" });
		}
	};

	if (isLoading) {
		return (
			// <View style={[styles.Container, { justifyContent: "center" }]}>
			<View
				style={[
					styles.Container,
					{
						justifyContent: "center",
						backgroundColor: colors.backgroundColor,
					},
				]}
			>
				<StatusBar style="dark" />
				<ActivityIndicator animating={true} color={"rgba(100, 60, 248, 1)"} size={"large"} />
			</View>
		);
	}

	return (
		<View styles={[styles.Container]}>
			<StatusBar style="light" />
			<View
				style={{
					position: "absolute",
					top: 0,
					left: 0,
					bottom: 0,
					right: 0,
					backgroundColor: "#FF6978",
				}}
			/>
			<View
				style={{
					height: height * 0.29 + top,
					// height: height * 0.29,
					width: width,
					alignContent: "center",
					alignItems: "center",
					backgroundColor: "#FF6978",
					paddingTop: top,
				}}
			>
				<Text
					style={{
						fontFamily: "PoppinsBold",
						letterSpacing: width * 0.001,
						fontSize: height * 0.024,
						marginTop: height * 0.022,
						marginHorizontal: width * 0.05,
						color: colors.white,
					}}
				>
					seni beğenenler
				</Text>
				<Image
					source={require("../../assets/waving_hand.png")}
					style={{
						backgroundColor: null,
						marginTop: height * 0.02,
						height: height * 0.09,
						resizeMode: "contain",
					}}
				/>

				<Text
					style={{
						fontFamily: "PoppinsBold",
						marginTop: height * 0.035,
						marginBottom: height * 0.01,
						marginHorizontal: width * 0.05,
						borderColor: colors.black,
						borderWidth: height * 0.002,
						borderRadius: 20,
						borderColor: colors.white,
						paddingHorizontal: width * 0.04,
						paddingVertical: height * 0.01,
						color: colors.white,
					}}
				>
					{likeCount === 0
						? `Sonraki hak için: \t${("0" + Math.floor((timeLeft % (24 * 3600)) / 3600)).slice(
								-2
						  )}:${("0" + Math.floor((timeLeft % 3600) / 60)).slice(-2)}:${(
								"0" +
								(timeLeft % 60)
						  ).slice(-2)}`
						: `${likeCount} kişiyi görme hakkınız var!`}

					{/* {likeCount == 0
						? `Sonraki hak için: \t${("0" + Math.floor((timeLeft % (24 * 3600)) / 3600)).slice(-2)}:
						${("0" + Math.floor((timeLeft % 3600) / 60)).slice(-2)}:
						${("0" + (timeLeft % 60)).slice(-2)}`
						: `${likeCount} kişiyi görme hakkınız var!`} */}
				</Text>

				{/* <Text style={{
                    fontFamily: "PoppinsBold", marginTop: height * 0.008, marginHorizontal: width * 0.05,
                    borderColor: colors.black, borderWidth: height * 0.002, borderRadius: 20, borderColor: colors.white,
                    paddingHorizontal: width * 0.04, paddingVertical: height * 0.005, color: colors.white
                }}>
                    {peopleList.length} kişi seni sağa kaydırmış!
                </Text> */}
			</View>
			<View
				style={{
					// height: "100%",
					// alignItems: "center",
					// justifyContent: "center",
					width: width,
					backgroundColor: colors.white,
					borderRadius: 30,
					overflow: "hidden",
				}}
			>
				<FlatList
					data={peopleList}
					ref={likeFlatListRef}
					maxToRenderPerBatch={1}
					numColumns={2}
					showsVerticalScrollIndicator={false}
					initialNumToRender={4}
					style={{}}
					contentContainerStyle={{
						paddingBottom: height * 0.58,
						paddingTop: height * 0.025,
					}}
					keyExtractor={(item, index) => item?.UserId?.toString() ?? index}
					renderItem={({ item, index }) => (
						<LikePerson
							index={index}
							person={item}
							blur={blurList[index]}
							mode={item.eventId == 0 ? (item.likeMode == 1 ? "Arkadaşlık" : "Flört") : "Etkinlik"}
							openProfiles={(idx) => {
								handleOpen(idx, blurList[index], item.UserId);
							}}
						/>
					)}
					ListFooterComponent={() =>
						peopleList.length === 0 ? (
							<Text
								style={{
									textAlign: "center",
									fontFamily: "PoppinsSemiBold",
									fontSize: Math.min(width * 0.05, 25),
									marginTop: height * 0.13,
									color: colors.gray,
								}}
							>
								İlginç! Henüz seni sağa kaydıran olmamış
								{"\n\n\n\n\n"} Seninle eşleşmek isteyenleri bu sayfada görebilirsin
							</Text>
						) : null
					}
				/>
			</View>
			{/* <Gradient
                style={{
                    position: "absolute",
                    bottom: 0,
                    justifyContent: "center",
                    alignItems: "center",
                    width: width,
                    height: height * 0.55,
                    paddingBottom: height * 0.4,
                }}
                start={{ x: 0.5, y: 0 }}
                end={{ x: 0.5, y: 1 }}
                colors={["rgba(255, 105, 120, 0)", "rgba(255, 105, 120, 0.65)"]}
            /> */}
			{/* <Text>son</Text> */}
		</View>
	);
}
