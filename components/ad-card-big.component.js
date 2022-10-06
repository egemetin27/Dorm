import { useContext, useEffect, useRef, useState } from "react";
import {
    StyleSheet,
    Text,
    View,
    Dimensions,
    FlatList,
    //Animated,
    TouchableOpacity,
    Image,
    Pressable,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
// import {
// 	ScrollView,
// 	GestureDetector,
// 	Gesture,
// 	TouchableOpacity,
// 	FlatList,
// } from "react-native-gesture-handler";
import Reanimated, {
    color,
    //Extrapolate,
    interpolate,
    //runOnJS,
    useAnimatedStyle,
    useSharedValue,
    //withDelay,
    //withSpring,
    withTiming,
} from "react-native-reanimated";

import CustomImage from "./custom-image.component";

import commonStyles from "../visualComponents/styles";
import { colors, Gradient } from "../visualComponents/colors";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import url from "../connection";
import { AuthContext } from "../contexts/auth.context";
import crypto from "../functions/crypto";

const { height, width } = Dimensions.get("window");



const backgroundIcon = require("../assets/Tutorial/star.png");


const AdCard = ({
    card,
    index,
    indexOfFrontCard,
    onDoubleTap,
}) => {
    const { bigTitle, questionTitle, description } = card;

    const { user: { City, School, userId, sesToken }, seteventCardTutorialDone, setmySchoolCardTutorialDone, setcampusGhostCardTutorialDone } = useContext(AuthContext);

    const [backgroundIcon, setBackgroundIcon] = useState(null);
    const [eventList, setEventList] = useState([]);

    const face = useSharedValue(1); // 1 => front, -1 => back
    const navigation = useNavigation();

    const animatedFrontFace = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    rotateY: `${interpolate(face.value, [1, -1], [0, 180])}deg`,
                },
            ],
        };
    });

    useEffect(() => {
        if (card.type == "event") {
            setBackgroundIcon(require("../assets/Tutorial/star.png"));
            const button = async () => {
                try {
                    const eventListData = crypto.encrypt({ userId: userId, campus: School, city: City });
                    await axios
                        .post(url + "/lists/EventList", eventListData, {
                            headers: { "access-token": sesToken },
                        })
                        .then((res) => {
                            const data = crypto.decrypt(res.data);
                            setTimeout(() => {
                                setEventList(data);
                            }, 50);
                        })
                        .catch((err) => {
                            console.log("error on /eventList");
                            console.log(err);
                            // console.log(err.response.data);
                        });
                } catch (err) {
                    console.log(err);
                } 
            };
            button();
        }
        else if (card.type == "campusGhost") setBackgroundIcon(require("../assets/Tutorial/ghost-empty.png"));
        if (card.type == "mySchool") setBackgroundIcon(require("../assets/Tutorial/school-empty.png"));
    }, [card.type]);

    return (
        // <View>
        <View>
            {/* Front Face Start */}
            <Reanimated.View style={[styles.card_style, animatedFrontFace]}>
                <Reanimated.View
                    style={[
                        { position: "absolute", top: 20, right: 20, backfaceVisibility: "hidden" },
                        animatedFrontFace,
                    ]}
                >
                </Reanimated.View>
                <Reanimated.View
                    style={[
                        {
                            backfaceVisibility: "hidden",
                            position: "absolute",
                            left: 20,
                            top: 20,
                        },
                        animatedFrontFace,
                    ]}
                >
                </Reanimated.View>
                <Gradient
                    style={{
                        position: "absolute",
                        bottom: 0,
                        justifyContent: "center",
                        alignItems: "center",
                        width: "100%",
                        height: "100%",
                    }}
                    start={{ x: 0.5, y: 0 }}
                    end={{ x: 0.5, y: 1 }}
                    colors={["#AA7BFF", "#1C158F"]}
                >
                    <Reanimated.View
                        style={[
                            {
                                width: "100%",
                                height: "100%",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "space-between",
                                paddingHorizontal: 20,
                                backfaceVisibility: "hidden",
                            },
                            animatedFrontFace,
                        ]}
                    >
                        <Image
                            style={[{
                                top: - height * 0.022,
                                left: width * 0.71,
                                height: width * 0.22,
                                width: width * 0.22,
                                resizeMode: "contain",
                                position: "absolute",
                                opacity: 0.65,
                            }]}
                            source={backgroundIcon}
                        />
                        <Image
                            style={[{
                                top: height * 0.042,
                                left: width * 0.072,
                                height: width * 0.15,
                                width: width * 0.15,
                                resizeMode: "contain",
                                position: "absolute",
                                opacity: 0.6,
                            }]}
                            source={backgroundIcon}
                        />
                        <Image
                            style={[{
                                top: height * 0.15,
                                left: width * 0.685,
                                height: width * 0.057,
                                width: width * 0.057,
                                resizeMode: "contain",
                                position: "absolute",
                                opacity: 0.55,
                            }]}
                            source={backgroundIcon}
                        />
                        <Image
                            style={[{
                                top: height * 0.183,
                                left: width * 0.755,
                                height: width * 0.048,
                                width: width * 0.048,
                                resizeMode: "contain",
                                position: "absolute",
                                opacity: 0.5,
                            }]}
                            source={backgroundIcon}
                        />
                        <Image
                            style={[{
                                top: height * 0.31,
                                left: width * 0.085,
                                height: width * 0.068,
                                width: width * 0.068,
                                resizeMode: "contain",
                                position: "absolute",
                                opacity: 0.3,
                            }]}
                            source={backgroundIcon}
                        />
                        <Image
                            style={[{
                                top: height * 0.37,
                                left: width * 0.632,
                                height: width * 0.22,
                                width: width * 0.22,
                                resizeMode: "contain",
                                position: "absolute",
                                opacity: 0.2,
                            }]}
                            source={backgroundIcon}
                        />
                        <Image
                            style={[{
                                top: height * 0.52,
                                left: width * 0.122,
                                height: width * 0.065,
                                width: width * 0.065,
                                resizeMode: "contain",
                                position: "absolute",
                                opacity: 0.18,
                            }]}
                            source={backgroundIcon}
                        />
                        <Image
                            style={[{
                                top: height * 0.62,
                                left: width * 0.52,
                                height: width * 0.09,
                                width: width * 0.09,
                                resizeMode: "contain",
                                position: "absolute",
                                opacity: 0.13,
                            }]}
                            source={backgroundIcon}
                        />
                        <View style={{ flexShrink: 1 }}>
                            <Image
                                style={[styles.image]}
                                source={
                                    card.type == "event" ? require("../assets/Tutorial/eventStar.png") :
                                        (card.type == "campusGhost" ? require("../assets/Tutorial/ghost.png") :
                                            (card.type == "mySchool" ? require("../assets/Tutorial/school.png") : null)
                                        )
                                }
                            />
                            <Text
                                style={[styles.bigTitle]}
                            >
                                {bigTitle}
                            </Text>
                            <Text
                                style={[styles.question]}
                            >
                                {questionTitle}
                            </Text>
                            <Text
                                style={[styles.description]}
                            >
                                {description}
                            </Text>
                            <View style={[styles.button]}>
                                <Pressable onPress={async () => {
                                    if (card.type == "mySchool") {
                                        AsyncStorage.getItem("Constants").then(async (res) => {
                                            const list = JSON.parse(res);
                                            const toSave = { ...list, mySchoolCardTutorialDone: true };
                                            await AsyncStorage.setItem("Constants", JSON.stringify(toSave));
                                        });
                                        setmySchoolCardTutorialDone();
                                        navigation.navigate("Settings");
                                        return;
                                    }  
                                    else if (card.type == "campusGhost") {
                                        AsyncStorage.getItem("Constants").then(async (res) => {
                                            const list = JSON.parse(res);
                                            const toSave = { ...list, campusGhostCardTutorialDone: true };
                                            await AsyncStorage.setItem("Constants", JSON.stringify(toSave));
                                        });
                                        setcampusGhostCardTutorialDone();
                                        navigation.navigate("Settings");
                                        return;
                                    }  
                                    else if (card.type == "event") {
                                        AsyncStorage.getItem("Constants").then(async (res) => {
                                            const list = JSON.parse(res);
                                            const toSave = { ...list, eventCardTutorialDone: true };
                                            await AsyncStorage.setItem("Constants", JSON.stringify(toSave));
                                        });
                                        seteventCardTutorialDone();
                                        setTimeout(() => {
                                            navigation.navigate("EventCards", {
                                                idx: 0,
                                                list: eventList,
                                                myID: userId,
                                                sesToken: sesToken,
                                            });
                                       }, 150);
                                    }  
                                }}>
                                    <Text style={{
                                        color: colors.white,
                                        fontSize: width * 0.04,
                                    }}>
                                        {card.type == "event" ? `Hemen Keşfet` : `Hemen Dene`}
                                    </Text>
                                </Pressable>
                            </View>
                        </View>
                    </Reanimated.View>
                </Gradient>
            </Reanimated.View>
            {/* Front Face End */}
        </View>
        // {/* </View> */}
    );
};

export default AdCard;

const styles = StyleSheet.create({
    backfaceHidden: {
        backfaceVisibility: "hidden",
    },
    button: {
        //position: "absolute",
        marginLeft: width * 0.1,
        width: width * 0.488,
        height: height * 0.055,
        borderRadius: 16,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 2,
        borderColor: colors.white,
        marginBottom: height * 0.05,
    },
    description: {
        paddingTop: height * 0.03,
        paddingBottom: height * 0.035,
        width: width * 0.7,
        color: colors.white,
        //fontSize: Math.min(24, width * 0.045),
        fontFamily: "PoppinsSemiBold",
        lineHeight: Math.min(27, width * 0.05),
        letterSpacing: -0.5,
        fontSize: width * 0.04,
        textAlign: "center",
    },
    question: {
        //paddingTop: height * 0.002,
        width: width * 0.7,
        color: colors.white,
        //fontSize: Math.min(35, width * 0.06),
        fontFamily: "PoppinsSemiBold",
        letterSpacing: -0.41,
        //fontFamily: "PoppinsBold",
        fontSize: width * 0.048,
        textAlign: "center",
    },
    bigTitle: {
        width: width * 0.7,
        color: colors.white,
        paddingTop: height * 0.025,
        //fontSize: Math.min(35, width * 0.06),
        fontFamily: "PoppinsBoldItalic",
        letterSpacing: 0.4,
        //fontFamily: "PoppinsBold",
        fontSize: width * 0.1,
        textAlign: "center",
    },
    image: {
        marginTop: height * 0.09,
        tintColor: colors.white,
        width: width * 0.141,
        resizeMode: "contain",
        alignSelf: "center",
    },
    card_style: [
        commonStyles.photo,
        {
            height: Math.min(width * 1.35, height * 0.7),
            elevation: 0,
        },
    ]
});
