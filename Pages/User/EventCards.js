import { createRef, useContext, useEffect, useState } from "react";
import ReactNative, {
    View,
    Text,
    Image,
    StyleSheet,
    Dimensions,
    Pressable,
    BackHandler,
    Linking,
    Alert,
} from "react-native";
import {
    ScrollView,
    TouchableOpacity,
    GestureDetector,
    Gesture,
} from "react-native-gesture-handler";
import Animated, {
    interpolate,
    //log,
    runOnJS,
    //useAnimatedReaction,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from "react-native-reanimated";
import Carousel from "react-native-reanimated-carousel";
import { Feather } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";

import commonStyles from "../../visualComponents/styles";
import { colors, Gradient, GradientText } from "../../visualComponents/colors";
import axios from "axios";
import url from "../../connection";
import { CustomModal } from "../../visualComponents/customComponents";
import { AuthContext } from "../../contexts/auth.context";
import { formatDate } from "../../utils/date.utils";

import { useNavigation } from "@react-navigation/native";

import crypto from "../../functions/crypto";
import { NotificationContext } from "../../contexts/notification.context";
import { checkField } from "../../utils/null-check.utils";
import TapIndicator from "../../components/tap-indicator.component";

const { width, height } = Dimensions.get("window");

const FIELDS = {
    Description: { label: "Etkinliğin Adı" },
    Location: { label: "Konum" },
    Date: { label: "Tarih", function: formatDate },
    endDate: { label: "Bitiş Tarihi" },
    StartTime: { label: "Başlangıç Saati" },
    Category: { label: "Kategori" },
    director: { label: "Yönetmen" },
    genre: { label: "Tür" },
    lineUp: { label: "Sanatçılar" },
    platform: { label: "Platform" },
    // BuyLink: { label: "Link" },
    // Organizator: { label: "Bilet Platformu" },
};

const reverseCardIcon = require("../../assets/reversePhoto.png");

const Card = ({ event, user, signOut, index }) => {
    const {
        EventId,
        BuyLink: buyLink,
        Description: name,
        Date: date,
        StartTime: time,
        Organizator: seller,
        photos: photoList,
        isLiked,
        likeMessage,
    } = event;

    // console.log(JSON.stringify(event, null, "\t"));
    // console.log(name, date);

    const navigation = useNavigation();

    const [showTapIndicator, setShowTapIndicator] = useState(true);
    const [favFlag, setFavFlag] = useState(isLiked == 1 ? true : false);
    // const [likeEventModal, setLikeEventModal] = useState(false);
    const [seeWhoLikedModal, setSeeWhoLikedModal] = useState(false);
    //const [backfaceIndex, setBackfaceIndex] = useState(0);
    const { setEventLike } = useContext(NotificationContext);
    const { eventTutorialDone } = useContext(AuthContext);

    const turn = useSharedValue(1); // 1 => front, -1 => back

    useEffect(() => {
        setFavFlag(isLiked == 1);
    }, [isLiked]);

    const animatedCard = useAnimatedStyle(() => {
        return {
            transform: [
                { rotateY: `${interpolate(turn.value, [1, -1], [0, 180])}deg` },
            ],
        };
    });

    const animatedBackFace = useAnimatedStyle(() => {
        return {
            zIndex: turn.value == -1 ? 1 : -1,
            transform: [
                {
                    rotateY: `${interpolate(
                        turn.value,
                        [1, -1],
                        [180, 360]
                    )}deg`,
                },
            ],
        };
    });

    const handleDoubleTab = () => {
        const encryptedData = crypto.encrypt({
            userId: user.userId,
            eventId: EventId,
        });
        axios.post(url + "/statistics/detailEventClick", encryptedData, {
            headers: { "access-token": user.sesToken },
        });
        if (!eventTutorialDone && showTapIndicator) {
            setTimeout(() => {
                navigation.navigate("BeginningTutorialModal", {
                    index: 11,
                    EventId: EventId,
                });
            }, 400);
        }
        setShowTapIndicator(false);
    };

    const tapHandler = Gesture.Tap()
        .numberOfTaps(2)
        .onEnd(() => {
            if (turn.value == 1) {
                runOnJS(handleDoubleTab);
            }
            turn.value = withTiming(-turn.value);
        });

    const reverseCardfromIcon = () => {
        if (turn.value == 1) {
            runOnJS(handleDoubleTab);
        }
        turn.value = withTiming(-turn.value);
    };

    // how much the Fav star should go up relative to the height of the surrounding circle (height * constant = marginBottom)
    const MARGIN_CONSTANT = 0.190983 / 2;

    const handleLikeButton = async () => {
        const id = user.userId;
        if (favFlag) {
            setEventLike(false);
            setFavFlag(false);
            const encryptedData = crypto.encrypt({
                userId: id,
                eventId: EventId,
                name: name,
            });
            await axios
                .post(url + "/userAction/dislikeEvent", encryptedData, {
                    headers: { "access-token": user.sesToken },
                })
                .then((res) => {})
                .catch((err) => {
                    setEventLike(true);
                    setFavFlag(true);
                });
            return;
        }
        const encryptedData = crypto.encrypt({
            userId: id,
            eventId: EventId,
            likeMode: 1,
        });
        setEventLike(true);
        setFavFlag(true);
        await axios
            .post(url + "/userAction/likeEvent", encryptedData, {
                headers: { "access-token": user.sesToken },
            })
            .then((res) => {
                if (likeMessage.length > 0) {
                    navigation.navigate("CustomModal", {
                        modalType: "EVENT_LIKED_MESSAGE",
                        body: likeMessage,
                    });
                }
            })
            .catch((err) => {
                setEventLike(false);
                setFavFlag(false);
            });
    };

    // const likeEvent = async () => {
    //     const encryptedData = crypto.encrypt({
    //         userId: id,
    //         eventId: EventId,
    //         likeMode: 1,
    //     });
    //     await axios
    //         .post(url + "/userAction/likeEvent", encryptedData, {
    //             headers: { "access-token": user.sesToken },
    //         })
    //         .then((res) => {
    //             setFavFlag(true);
    //             if (likeMessage.length > 0) {
    //                 navigation.navigate("CustomModal", {
    //                     modalType: "EVENT_LIKED_MESSAGE",
    //                     body: likeMessage,
    //                 });
    //             }
    //         })
    //         .catch((err) => {
    //             // Alert.alert(err.response.status);
    //         });
    //     setEventLike(true);
    // };

    const explorePeople = async () => {
        if (!favFlag) {
            setSeeWhoLikedModal(true);
            return;
        }

        if (user.Invisible.toString() == "1") {
            navigation.navigate("CustomModal", {
                modalType: "CANNOT_SEE_EVENT_LIKES",
            });
            return;
        }
        const encryptedData = crypto.encrypt({
            eventId: EventId,
            userId: user.userId,
        });
        await axios
            .post(url + "/lists/eventParticipants", encryptedData, {
                headers: { "access-token": user.sesToken },
            })
            .then((res) => {
                const data =
                    typeof res.data == "object" &&
                    Object.keys(res.data).length == 0
                        ? res.data
                        : crypto.decrypt(res.data);
                if (data.length > 0) {
                    navigation.push("ProfileCards", {
                        idx: 0,
                        list: data,
                        fromEvent: true,
                        eventId: EventId,
                        eventName: name,
                    });
                } else {
                    navigation.navigate("CustomModal", {
                        modalType: "NO_LIKES_ON_EVENT",
                    });
                }
            })
            .catch((err) => {
                if (err?.response?.status == 410) {
                    Alert.alert("Oturumunuzun süresi doldu!");
                    signOut();
                    return;
                }
                console.log(err);
            });
    };

    const likeButton = createRef();

    return (
        <View
            name={"cards"}
            style={{ width: "100%", flex: 1, justifyContent: "center" }}
            // style={{ width: "100%", backgroundColor: "green" }}
        >
            <GestureDetector gesture={tapHandler} waitFor={likeButton}>
                <Animated.View>
                    <Animated.View
                        style={[
                            commonStyles.photo,
                            {
                                height: Math.min(width * 1.35, height * 0.7),
                                backfaceVisibility: "hidden",
                                elevation: 0,
                            },
                            animatedCard,
                        ]}
                    >
                        <ScrollView
                            scrollEventThrottle={16}
                            style={{ width: "100%" }}
                            pagingEnabled={true}
                            showsVerticalScrollIndicator={false}
                            // onScroll={handleScroll}
                        >
                            <Image
                                source={{
                                    uri: photoList[0] ?? "AAA",
                                }}
                                style={{
                                    height: Math.min(
                                        height * 0.7,
                                        width * 1.35
                                    ),
                                    resizeMode: "cover",
                                    backgroundColor: colors.cool_gray,
                                }}
                            />
                            {/* {photoList?.map((item, index) => {
								return (
									<Image
										key={index}
										source={{
											uri: item ?? "AAA",
										}}
										style={{
											height: Math.min(height * 0.7, width * 1.35),
											resizeMode: "cover",
											backgroundColor: colors.cool_gray,
										}}
									/>
								);
							})} */}
                        </ScrollView>

                        <View // photo order indicator dots
                            style={{
                                position: "absolute",
                                left: 20,
                                top: 20,
                                justifyContent: "space-between",
                                minHeight: photoList.length * 10 + 16,
                            }}
                        >
                            <Animated.View
                                style={[
                                    {
                                        // minHeight: 8,
                                        height: 24,
                                        width: 8,
                                        borderRadius: 4,
                                        backgroundColor: colors.white,
                                        elevation: 12,
                                    },
                                    // useAnimatedStyle(() => {
                                    // 	return {
                                    // 		height: interpolate(progress.value - index, [-1, 0, 1], [8, 24, 8]),
                                    // 	};
                                    // }),
                                ]}
                            />
                            {/* {photoList?.map((_, index) => {
								return (
									<Animated.View
										key={index}
										style={[
											{
												// minHeight: 8,
												height: 24,
												width: 8,
												borderRadius: 4,
												backgroundColor: colors.white,
											},
											// useAnimatedStyle(() => {
											// 	return {
											// 		height: interpolate(progress.value - index, [-1, 0, 1], [8, 24, 8]),
											// 	};
											// }),
										]}
									/>
								);
							})} */}
                        </View>

                        <Pressable
                            onPress={reverseCardfromIcon}
                            style={{
                                position: "absolute",
                                right: 15,
                                top: 15,
                            }}
                        >
                            <Animated.View>
                                <Image
                                    source={reverseCardIcon}
                                    style={{
                                        resizeMode: "contain",
                                        width: width * 0.1,
                                        height: width * 0.1,
                                        tintColor: colors.white,
                                    }}
                                />
                            </Animated.View>
                        </Pressable>

                        {/*Report button for event card }
						<View style={{ position: "absolute", top: 20, right: 20 }}>
							<TouchableOpacity onPress={() => {}}>
								<Image
									style={{
										height: 25,
										tintColor: colors.white,
										resizeMode: "contain",
									}}
									source={require("../../assets/report.png")}
								/>
							</TouchableOpacity>
						</View>
						{ */}
                        <View
                            style={{
                                width: "100%",
                                position: "absolute",
                                bottom: 0,
                                maxHeight: Math.min(
                                    width * 0.405,
                                    height * 0.21
                                ),
                            }}
                        >
                            <Gradient
                                colors={[
                                    "rgba(0,0,0,0.001)",
                                    "rgba(0,0,0,0.45)",
                                    "rgba(0,0,0,0.65)",
                                ]}
                                locations={[0, 0.4, 1]}
                                start={{ x: 0.5, y: 0 }}
                                end={{ x: 0.5, y: 1 }}
                                style={{
                                    height: "100%",
                                    paddingTop: height * 0.052,
                                    paddingBottom: height * 0.019,
                                    width: "100%",
                                    justifyContent: "flex-start",
                                }}
                            >
                                <View
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        flex: 1,
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                        flexDirection: "row",
                                        paddingHorizontal: height * 0.022,
                                    }}
                                >
                                    <View
                                        style={{
                                            flex: 1,
                                            height: "100%",
                                            paddingRight: "3%",
                                            justifyContent: "flex-start",
                                        }}
                                    >
                                        <Text
                                            numberOfLines={1}
                                            style={{
                                                color: colors.white,
                                                fontSize: Math.min(
                                                    36,
                                                    height * 0.03
                                                ),
                                                lineHeight:
                                                    Math.min(
                                                        height * 0.03,
                                                        36
                                                    ) * 1.2,
                                                fontFamily: "PoppinsSemiBold",
                                                letterSpacing: -0.2,
                                            }}
                                        >
                                            {name}
                                        </Text>
                                        {date != "NaN/NaN/NaN" &&
                                            date != "" && (
                                                <Text
                                                    style={{
                                                        color: colors.white,
                                                        fontSize: Math.min(
                                                            height * 0.02,
                                                            24
                                                        ),
                                                        lineHeight:
                                                            Math.min(
                                                                height * 0.02,
                                                                24
                                                            ) * 1.2,
                                                        fontFamily:
                                                            "PoppinsItalic",
                                                    }}
                                                >
                                                    {formatDate(date)}
                                                </Text>
                                            )}

                                        {time != "" && (
                                            <Text
                                                style={{
                                                    color: colors.white,
                                                    fontSize: Math.min(
                                                        height * 0.02,
                                                        24
                                                    ),
                                                    lineHeight:
                                                        Math.min(
                                                            height * 0.02,
                                                            24
                                                        ) * 1.2,
                                                    fontFamily: "PoppinsItalic",
                                                }}
                                            >
                                                {time}
                                            </Text>
                                        )}
                                    </View>
                                    {/* <View style={{ zIndex: 5 }}> */}
                                    <TouchableOpacity
                                        onPress={handleLikeButton}
                                    >
                                        <View
                                            style={{
                                                backgroundColor: colors.white,
                                                height: Math.max(
                                                    Math.min(
                                                        width * 0.1,
                                                        height * 0.08
                                                    ),
                                                    60
                                                ),
                                                aspectRatio: 1 / 1,
                                                borderRadius:
                                                    Math.max(
                                                        Math.min(
                                                            width * 0.1,
                                                            height * 0.08
                                                        ),
                                                        60
                                                    ) / 2,
                                            }}
                                        >
                                            <View
                                                style={{
                                                    width: "100%",
                                                    height: "100%",
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                }}
                                            >
                                                {favFlag ? (
                                                    <Image
                                                        style={{
                                                            aspectRatio: 1,
                                                            height:
                                                                (Math.max(
                                                                    Math.min(
                                                                        width *
                                                                            0.1,
                                                                        height *
                                                                            0.08
                                                                    ),
                                                                    60
                                                                ) *
                                                                    2) /
                                                                3,
                                                            resizeMode:
                                                                "contain",
                                                            marginBottom:
                                                                MARGIN_CONSTANT *
                                                                40,
                                                        }}
                                                        source={require("../../assets/Fav_filled.png")}
                                                    />
                                                ) : (
                                                    <Image
                                                        style={{
                                                            aspectRatio: 1,
                                                            height:
                                                                (Math.max(
                                                                    Math.min(
                                                                        width *
                                                                            0.1,
                                                                        height *
                                                                            0.08
                                                                    ),
                                                                    60
                                                                ) *
                                                                    2) /
                                                                3,
                                                            resizeMode:
                                                                "contain",
                                                            marginBottom:
                                                                MARGIN_CONSTANT *
                                                                40,
                                                        }}
                                                        source={require("../../assets/Fav.png")}
                                                    />
                                                )}
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            </Gradient>
                        </View>
                        {showTapIndicator &&
                            !eventTutorialDone &&
                            index == 0 && (
                                <View
                                    style={{
                                        alignSelf: "center",
                                        top: height * 0.3,
                                        color: colors.soft_red,
                                        position: "absolute",
                                    }}
                                >
                                    <TapIndicator />
                                </View>
                            )}
                    </Animated.View>

                    {/* PART: backface */}
                    <Animated.View
                        name={"backface"}
                        style={[
                            commonStyles.photo,
                            {
                                elevation: 0,
                                height: Math.min(width * 1.35, height * 0.7),
                                position: "absolute",
                                backfaceVisibility: "hidden",
                                backgroundColor: "transparent",
                            },
                            animatedBackFace,
                        ]}
                    >
                        <Image
                            source={{
                                uri: photoList[0],
                            }}
                            blurRadius={20}
                            style={{
                                position: "absolute",
                                height: Math.min(width * 1.35, height * 0.7),
                                aspectRatio: 1 / 1.5,
                                resizeMode: "cover",
                                transform: [{ rotateY: "180deg" }],
                            }}
                        />
                        <View
                            name={"colorFilter"}
                            style={{
                                width: "100%",
                                height: "100%",
                                position: "absolute",
                                backgroundColor: "rgba(64,64,64,0.5)",
                            }}
                        />
                        <ScrollView
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={{
                                // marginTop: 30,
                                paddingBottom: 10,
                                justifyContent: "center",
                            }}
                            style={{
                                marginTop: 30,
                                marginBottom: 10,
                                width: "80%",
                            }}
                        >
                            {/* <View style={{ width: "100%", alignItems: "center" }}> */}
                            {Object.keys(FIELDS).map((field) => {
                                const foo = FIELDS[field]?.function ?? null;

                                const text = foo
                                    ? foo(event[field])
                                    : event[field];

                                if (!event[field] || checkField(text))
                                    return <View key={field} />;
                                return (
                                    <Text
                                        key={field}
                                        name={"Name"}
                                        style={{
                                            color: colors.light_gray,
                                            fontSize: Math.min(
                                                height * 0.025,
                                                width * 0.04
                                            ),
                                            textAlign: "center",
                                            paddingVertical: 5,
                                        }}
                                    >
                                        {FIELDS[field]?.label}
                                        {"\n"}
                                        <Text
                                            style={{
                                                fontFamily: "PoppinsSemiBold",
                                                fontSize: Math.min(
                                                    height * 0.03,
                                                    width * 0.048
                                                ),
                                            }}
                                        >
                                            {text}
                                        </Text>
                                    </Text>
                                );
                            })}

                            {buyLink != "" && (
                                <View
                                    style={{
                                        width: "100%",
                                        alignItems: "center",
                                    }}
                                >
                                    <Text
                                        name={"Seller"}
                                        style={{
                                            textAlign: "center",
                                            color: colors.light_gray,
                                            fontSize: Math.min(
                                                height * 0.025,
                                                width * 0.04
                                            ),
                                            paddingTop: 5,
                                        }}
                                    >
                                        Bilet Platformu
                                    </Text>
                                    <Pressable
                                        onPress={async () => {
                                            if (turn.value != -1) return;

                                            const data = crypto.encrypt({
                                                eventId: EventId,
                                                userId: user.userId,
                                            });

                                            await axios
                                                .post(
                                                    url +
                                                        "/statistics/eventLinkClick",
                                                    data,
                                                    {
                                                        headers: {
                                                            "access-token":
                                                                user.sesToken,
                                                        },
                                                    }
                                                )
                                                .catch((err) =>
                                                    console.log(err)
                                                );

                                            await Linking.openURL(buyLink);
                                        }}
                                        // style={{ backgroundColor: "pink" }}
                                    >
                                        <View
                                            style={{
                                                flexDirection: "row",
                                                alignItems: "center",
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    color: colors.light_gray,
                                                    textDecorationLine:
                                                        "underline",
                                                    fontSize: Math.min(
                                                        height * 0.03,
                                                        width * 0.048
                                                    ),
                                                    fontFamily:
                                                        "PoppinsSemiBold",
                                                }}
                                            >
                                                {seller}
                                            </Text>
                                            <Text
                                                style={{
                                                    // textAlign: "center",
                                                    fontSize: Math.min(
                                                        height * 0.03,
                                                        width * 0.048
                                                    ),
                                                    color: colors.light_gray,
                                                }}
                                            >
                                                {"⇗"}
                                            </Text>
                                        </View>
                                    </Pressable>
                                </View>
                            )}
                        </ScrollView>

                        <View
                            style={{
                                width: "80%",
                                marginBottom: height * 0.05,
                            }}
                        >
                            <TouchableOpacity onPress={explorePeople}>
                                <View
                                    style={{
                                        paddingHorizontal: 10,
                                        paddingVertical: 15,
                                        borderRadius: 10,
                                        borderWidth: 1,
                                        borderColor: colors.light_gray,
                                        justifyContent: "center",
                                        alignItems: "center",
                                        marginTop: 10,
                                    }}
                                >
                                    <Text
                                        numberOfLines={1}
                                        adjustsFontSizeToFit={true}
                                        style={{
                                            fontSize: Math.min(width * 0.1, 18),
                                            color: colors.light_gray,
                                        }}
                                    >
                                        Etkinliği Beğenen Kişileri Keşfet
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </Animated.View>
                </Animated.View>
            </GestureDetector>
            {/* <CustomModal
				visible={likeEventModal}
				dismiss={() => {
					setLikeEventModal(false);
				}}
			>
				<Gradient
					style={{
						width: Math.min(width * 0.8, 400),
						aspectRatio: 1.8,
						borderRadius: 30,
						alignItems: "center",
					}}
				>
					<View style={{ position: "absolute", top: 5, right: 10 }}>
						<Pressable
							style={{ padding: 5 }}
							onPress={() => {
								setLikeEventModal(false);
							}}
						>
							<Feather name="x" size={Math.min(width * 0.05, 28)} color={colors.light_gray} />
						</Pressable>
					</View>
					<View
						style={{
							width: "75%",
							height: "100%",
							paddingVertical: "5%",
							alignItems: "center",
						}}
					>
						<Text
							style={{
								color: colors.white,
								fontSize: Math.min(20, width * 0.04),
								fontFamily: "PoppinsBold",
								textAlign: "center",
							}}
						>
							Daha iyi bir eşleşme deneyimi için bu etkinlikteki beklentilerini merak ediyoruz
						</Text>
						<View
							style={{
								flexDirection: "row",
								flex: 1,
								alignItems: "center",
								justifyContent: "space-around",
								width: "100%",
							}}
						>
							<View
								style={{ width: "45%", aspectRatio: 2.1, borderRadius: 10, overflow: "hidden" }}
							>
								<ReactNative.TouchableOpacity
									onPress={() => {
										likeEvent(0);
										setLikeEventModal(false);
									}}
									style={{
										width: "100%",
										height: "100%",
										backgroundColor: colors.light_gray,
										justifyContent: "center",
										alignItems: "center",
									}}
								>
									<GradientText text={"Flört"} style={{ fontFamily: "PoppinsSemiBold" }} />
								</ReactNative.TouchableOpacity>
							</View>
							<View
								style={{ width: "45%", aspectRatio: 2.1, borderRadius: 10, overflow: "hidden" }}
							>
								<ReactNative.TouchableOpacity
									onPress={() => {
										likeEvent(1);
										setLikeEventModal(false);
									}}
									style={{
										width: "100%",
										height: "100%",
										backgroundColor: colors.light_gray,
										justifyContent: "center",
										alignItems: "center",
									}}
								>
									<GradientText text={"Arkadaş"} style={{ fontFamily: "PoppinsSemiBold" }} />
								</ReactNative.TouchableOpacity>
							</View>
						</View>
					</View>
				</Gradient>
			</CustomModal> */}
            <CustomModal
                visible={seeWhoLikedModal}
                dismiss={() => {
                    setSeeWhoLikedModal(false);
                }}
            >
                <Gradient
                    style={{
                        width: Math.min(width * 0.7, 300),
                        maxWidth: width * 0.8,
                        paddingVertical: 30,
                        borderRadius: 30,
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <View style={{ position: "absolute", top: 5, right: 10 }}>
                        <Pressable
                            style={{ padding: 5 }}
                            onPress={() => {
                                setSeeWhoLikedModal(false);
                            }}
                        >
                            <Feather
                                name="x"
                                size={Math.min(width * 0.05, 28)}
                                color={colors.light_gray}
                            />
                        </Pressable>
                    </View>

                    <View
                        style={{
                            paddingHorizontal: "10%",
                            alignItems: "center",
                        }}
                    >
                        <Text
                            style={{
                                color: colors.white,
                                fontSize: Math.min(20, width * 0.04),
                                fontFamily: "PoppinsBold",
                                textAlign: "center",
                            }}
                        >
                            Etkinliğe gidenleri keşfetmen için etkinliği
                            favorilere eklemiş olmalısın!
                        </Text>
                    </View>

                    <View style={{ width: "70%", marginTop: 20 }}>
                        <ReactNative.TouchableOpacity
                            onPress={() => {
                                // likeEvent()
                                handleLikeButton();
                                setSeeWhoLikedModal(false);
                            }}
                            style={{
                                paddingVertical: 10,
                                backgroundColor: colors.light_gray,
                                justifyContent: "center",
                                alignItems: "center",
                                borderRadius: 10,
                            }}
                        >
                            <GradientText
                                text={"Etkinliği Beğen"}
                                style={{ fontFamily: "PoppinsSemiBold" }}
                            />
                        </ReactNative.TouchableOpacity>
                    </View>
                </Gradient>
            </CustomModal>
        </View>
    );
};

export default function EventCards({ navigation, route }) {
    const { user, signOut, eventTutorialDone } = useContext(AuthContext);

    const { idx, list } = route.params;

    useEffect(() => {
        if (!eventTutorialDone) {
            setTimeout(() => {
                navigation.navigate("BeginningTutorialModal", {
                    index: 6,
                    EventId: list[idx].EventId,
                });
            }, 200);
        }
    }, []);

    useEffect(() => {
        const backhandler = async () => {
            const backAction = () => {
                // navigation.replace("MainScreen", {
                // 	screen: "AnaSayfa",
                // 	params: { screen: "Home" },
                // });
                navigation.goBack();
                return true;
            };
            const backHandler = BackHandler.addEventListener(
                "hardwareBackPress",
                backAction
            );
            return () => backHandler.remove();
        };
        backhandler();
    }, []);

    const sendEventSeen = (index) => {
        const encryptedData = crypto.encrypt({
            userId: user.userId,
            eventId: list[index].EventId,
        });
        axios
            .post(url + "/statistics/EventClick", encryptedData, {
                headers: { "access-token": user.sesToken },
            })
            .then()
            .catch((err) => {
                console.log(err);
            });
    };

    useEffect(() => {
        sendEventSeen(idx);
    }, []);

    return (
        <View style={commonStyles.Container}>
            <View
                style={{
                    backgroundColor: "#F4F3F3",
                    // maxHeight: height * 0.15,
                    paddingVertical: height * 0.015,

                    width: width,
                    flexDirection: "row",
                    justifyContent: "space-between",
                    paddingHorizontal: 20,
                    alignItems: "center",
                    elevation: 10,
                    shadowOffset: {
                        width: 0,
                        height: 5,
                    },
                    shadowOpacity: 0.34,
                    shadowRadius: 6.27,
                }}
            >
                <TouchableOpacity
                    onPress={() => {
                        // navigation.replace("MainScreen", {
                        // 	screen: "AnaSayfa",
                        // 	params: { screen: "Home" },
                        // });
                        navigation.goBack();
                    }}
                >
                    <Feather
                        name="chevron-left"
                        size={30}
                        color={colors.cool_gray}
                    />
                </TouchableOpacity>
                <Image
                    source={require("../../assets/dorm_text.png")}
                    resizeMode="contain"
                    style={{ height: height * 0.04, flex: 1 }}
                />
                <Feather name="chevron-left" size={30} color={"#F4F3F3"} />
            </View>
            {list.length > 0 && (
                <View style={{ flex: 1 }}>
                    <Carousel
                        onSnapToItem={sendEventSeen}
                        windowSize={list.length > 5 ? 5 : list.length}
                        defaultIndex={idx}
                        width={width}
                        loop={false}
                        data={list}
                        renderItem={({ item, index }) => (
                            <Card
                                event={item}
                                user={user}
                                index={index}
                                signOut={signOut}
                            />
                        )}
                    />
                </View>
            )}
            <View
                style={{
                    width: width,
                    paddingHorizontal: width * 0.05,
                    marginBottom: height * 0.02,
                }}
            >
                <Text
                    numberOfLines={3}
                    adjustsFontSizeToFit={true}
                    style={{
                        textAlign: "center",
                        fontSize: width * 0.038,
                        color: colors.medium_gray,
                        letterSpacing: 0.2,
                    }}
                >
                    Etkinlikle ilgili ayrıntılı bilgi almak ve etkinliğe
                    gidenleri keşfetmek için karta çift dokun
                </Text>
            </View>
        </View>
    );
}
