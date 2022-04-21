import React from "react";
import ReactNative, { View, Text, Image, Dimensions } from "react-native";
import {
	ScrollView,
	GestureDetector,
	Gesture,
	TouchableOpacity,
    TouchableWithoutFeedback,
} from "react-native-gesture-handler";
import Animated, {
	Extrapolate,
	interpolate,
	runOnJS,
	useAnimatedReaction,
	useAnimatedStyle,
	useSharedValue,
	withDelay,
	withSpring,
	withTiming,
} from "react-native-reanimated";
import { snapPoint } from "react-native-redash";
import { Ionicons, AntDesign } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

import commonStyles from "../../visualComponents/styles";
import { colors, Gradient } from "../../visualComponents/colors";
import axios from "axios";
import { url } from "../../connection";
import { getAge, getGender } from "../../nonVisualComponents/generalFunctions";

const { width, height } = Dimensions.get("window");
const SNAP_POINTS = [-width * 1.5, 0, width * 1.5];
import { API, graphqlOperation } from "aws-amplify";
import { getMsgUser } from "../../src/graphql/queries";

const ChatProfile = (props) => {
    const progress = useSharedValue(0);
    const x = useSharedValue(0);
    const destination = useSharedValue(0);
    const turn = useSharedValue(1);
    const backFace = useSharedValue(false);
    const [backfaceIndex, setBackfaceIndex] = React.useState(0);
    
    const gender = getGender(props.data.Gender);
	const age = getAge(props.data.Birth_Date);

    const checkText = (text) => {
		// return false if null
		if (text == "null" || text == null || text == "undefined" || text.length == 0) return false;
		return true;
	};

  
    const tapHandler = Gesture.Tap()
		.numberOfTaps(2)
		.onStart(() => {
			turn.value = withTiming(-turn.value);
			backFace.value = !backFace.value;
		});


    const animatedFrontFace = useAnimatedStyle(() => {
        // if (index != indexOfFrontCard) return {};
        // if (index != 0) return {};
        return {
            transform: [
                {
                    rotateY: `${interpolate(turn.value, [1, -1], [0, 180])}deg`,
                },
            ],
        };
    });


    const animatedBackFace = useAnimatedStyle(() => {
		return {
			zIndex: turn.value == 1 ? -1 : 1,
			transform: [
				{
					rotateY: `${interpolate(turn.value, [1, -1], [180, 360])}deg`,
				},
			],
		};
	});


    const animatedPhotoProgress = (index) =>
		useAnimatedStyle(() => {
			return {
				height: interpolate(progress.value - index, [-1, 0, 1], [8, 24, 8]),
			};
		});

    
    const handleScroll = ({ nativeEvent }) => {
		progress.value = nativeEvent.contentOffset.y / nativeEvent.layoutMeasurement.height;
	};

    useAnimatedReaction(
		() => {
			return progress.value;
		},
		() => {
			runOnJS(setBackfaceIndex)(Math.round(progress.value));
		}
	);
    
    const composedGesture = Gesture.Race(tapHandler);
   
    return (
        <View >
            <View
                name = {"card"}
                style = {{
                    width: "100%", 
                    zIndex: 1,
                }}
            >
                <GestureDetector gesture={composedGesture}>
                    <Animated.View>
                        <Animated.View
                            style = {[
                                commonStyles.photo,
                                {
                                    width: width*0.9,
                                    maxHeight: height*0.7,
                                    backfaceVisibility: "hidden",
                                },
                                animatedFrontFace,

                            ]}
                        >
                            {props.data.photos.length > 0 ? (
                                <ScrollView
                                    scrollEventThrottle={16}
                                    style = {{ width: "100%" }}
                                    pagingEnabled = {true}
                                    showsVerticalScrollIndicator={false}
                                    onScroll = {handleScroll}
                                >
                                    {props.data.photos.map((item,idx) => {
                                        return (
                                            <Image
                                                key={idx}
                                                source = {{
                                                    uri: item?.PhotoLink ?? "AAA",
                                                }}
                                                style={{
                                                    height: width * 1.35,
                                                    maxHeight: height * 0.7,
                                                    resizeMode: "cover",
                                                    backgroundColor: colors.cool_gray,
                                                }}
                                            />
                                        );
                                    })}

                                </ScrollView>

                            ): (
                                <View
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        justifyContent: "center",
                                        alignItems: "center",
                                    }}
                                >
                                    <Ionicons name="person" color="white" size={width *0.5} />
                                </View>

                            )}
                            <View 
                                style= {{
                                    position: "absolute",
                                    left: 20,
                                    top: 20,
                                    justifyContent: "space-between",
                                    minHeight: props.data.photos.length*10+16,
                                }}
                            >
                                {props.data.photos.map((_, index) => {
                                    return(
                                        <Animated.View
                                            key={index}
                                            style = {[
                                                {
                                                    minHeight:  8,
                                                    width: 8,
                                                    borderRadius: 4,
                                                    backgroundColor: colors.white,
                                                },
                                                animatedPhotoProgress(index),
                                            ]}
                                        />
                                    );
                                })}
                            </View>
                            {
                            <View 
                                style={{
                                    position: "absolute",
                                    top: 20,
                                    right: 20,
                                }}
                            >
                                <TouchableOpacity
                                    onPress={() => {
                                        props.close();
                                    }}
                                >
                                    <AntDesign 
                                        name="closecircleo" 
                                        size={25} 
                                        color="white" />
                                    

                                </TouchableOpacity>

                            </View>
                            }
                            <LinearGradient
                                colors={["rgba(0,0,0,0.005)", " rgba(0,0,0,0.1)", "rgba(0,0,0,0.5)"]}
                                locations={[0, 0.1, 1]}
								start={{ x: 0.5, y: 0 }}
								end={{ x: 0.5, y: 1 }}
								style={{
								    minHeight: height * 0.12,
								    width: "100%",
								    position: "absolute",
								    bottom: 0,
									paddingVertical: 10,
							    }}
                            >
                                <View
                                    style = {{
                                        width: "100%",
                                        height: "100%",
                                        flexDirection: "row",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                        paddingHorizontal: 20,
                                    }}
                                >
                                    <View 
                                        style = {{ flexShrink: 1 }}
                                    >
                                        <Text
                                            style = {{
                                                color: colors.white,
                                                fontSize: Math.min(35, width * 0.06),
                                                fontFamily: "PoppinsSemiBold",
                                                letterSpacing: 1.05,
                                            }}
                                        >
                                            {props.data.Name} • {age}
                                        </Text>
                                        <Text
                                            style= {{
                                                color: colors.white,
                                                fontSize: Math.min(24, width*0.045),
                                                fontFamily: "PoppinsItalic",
                                                lineHeight: Math.min(27, width * 0.05),
                                            }}
                                        >
                                            {props.data.School}
                                            {"\n"}
                                            {props.data.Major}
                                        </Text>
                                    </View>
                                </View>
                            </LinearGradient>
                        </Animated.View>
                        <Animated.View
                            name = {"backface"}
                            style = {[
                                commonStyles.photo,
                                animatedBackFace,
                                {
                                    width: width * 0.9,
                                    maxHeight: height *0.7,
                                    position: "absolute",
                                    backfaceVisibility: "hidden",
                                    backgroundColor: colors.cool_gray,
                                }
                            ]}
                        >
                            
                            <Image
                                source = {{
                                    uri:
                                        props.data.photos.length > 0
                                            ? props.data.photos[backfaceIndex].PhotoLink
                                            : "Nothing to see here",
                                }}
                                blurRadius={20}
                                style={{
                                    position:"absolute",
                                    aspectRatio: 1/1.5,
                                    width: width*0.9,
                                    maxHeight: height*0.7,
                                    resizeMode: "cover",
                                    transform: [{rotateY: "180deg"}],
                                }}
                            />
                            <View
                                name = {"colorFilter"}
                                style = {{
                                    width: "100%",
                                    height: "100%",
                                    position: "absolute",
                                    backgroundColor: "rgba(0,0,0,0.25)",
                                }}
                            />
                            <ReactNative.ScrollView
                                showsVerticalScrollIndicator = {false}
                                style = {{
                                    width: "80%",
                                    marginVertical: 30,
                                }}
                            >
                                
                                <View
                                    style={{
                                        width: "100%",
                                        alignItems: "center",
                                    }}
                                >
                                    
                                    {checkText(gender) && (
                                        <Text
                                            name= {"Gender"}
                                            style={{
                                                color: colors.light_gray,
                                                fontSize: 18,
                                                textAlign: "center",
                                                paddingVertical: 5,
                                            }}
                                        >
                                            Cinsiyet {"\n"}
                                            <Text 
                                                style = {{
                                                    fontFamily: "PoppinsSemiBold",
                                                    fontSize: 22,
                                                }}
                                            >
                                                {gender}
                                            </Text>
                                        </Text>                                                    
                                    )}
                                    {checkText(props.data.Din) && (
                                        <Text
                                        name= {"Religion"}
                                        style={{
                                            color: colors.light_gray,
                                            fontSize: 18,
                                            textAlign: "center",
                                            paddingVertical: 5,
                                        }}
                                    >
                                        Dini İnanç {"\n"}
                                        <Text 
                                            style = {{
                                                fontFamily: "PoppinsSemiBold",
                                                fontSize: 22,
                                            }}
                                        >
                                            {props.data.Din}
                                        </Text>
                                    </Text>     
                                    )}
                                    {checkText(props.data.Burc) && (
                                        <Text
                                        name= {"Burc"}
                                        style={{
                                            color: colors.light_gray,
                                            fontSize: 18,
                                            textAlign: "center",
                                            paddingVertical: 5,
                                        }}
                                    >
                                        Burç {"\n"}
                                        <Text 
                                            style = {{
                                                fontFamily: "PoppinsSemiBold",
                                                fontSize: 22,
                                            }}
                                        >
                                            {props.data.Burc}
                                        </Text>
                                    </Text>     
                                    )}
                                    {checkText(props.data.Beslenme) && (
                                        <Text
                                        name= {"Beslenme"}
                                        style={{
                                            color: colors.light_gray,
                                            fontSize: 18,
                                            textAlign: "center",
                                            paddingVertical: 5,
                                        }}
                                    >
                                        Beslenme Tercihi {"\n"}
                                        <Text 
                                            style = {{
                                                fontFamily: "PoppinsSemiBold",
                                                fontSize: 22,
                                            }}
                                        >
                                            {props.data.Beslenme}
                                        </Text>
                                    </Text>     
                                    )}
                                    {checkText(props.data.Alkol) && (
                                        <Text
                                        name= {"Alkol"}
                                        style={{
                                            color: colors.light_gray,
                                            fontSize: 18,
                                            textAlign: "center",
                                            paddingVertical: 5,
                                        }}
                                    >
                                        Alkol Kullanımı {"\n"}
                                        <Text 
                                            style = {{
                                                fontFamily: "PoppinsSemiBold",
                                                fontSize: 22,
                                            }}
                                        >
                                            {props.data.Alkol}
                                        </Text>
                                    </Text>     
                                    )}
                                    {checkText(props.data.Sigara) && (
                                        <Text
                                        name= {"Sigara"}
                                        style={{
                                            color: colors.light_gray,
                                            fontSize: 18,
                                            textAlign: "center",
                                            paddingVertical: 5,
                                        }}
                                    >
                                        Sigara Kullanımı {"\n"}
                                        <Text 
                                            style = {{
                                                fontFamily: "PoppinsSemiBold",
                                                fontSize: 22,
                                            }}
                                        >
                                            {props.data.Sigara}
                                        </Text>
                                    </Text>     
                                    )}
                                    {checkText(props.data.interest) && (
                                        <Text
                                            name= {"interest"}
                                            style={{
                                                color: colors.light_gray,
                                                fontSize: 18,
                                                textAlign: "center",
                                                paddingVertical: 5,
                                            }}
                                        >
                                            İlgi Alanları {"\n"}
                                            {props.data.interest.map((item,index) => {
                                                return(
                                                    <Text
                                                        key={index}
                                                        style = {{
                                                            fontFamily: "PoppinsSemiBold",
                                                            fontSize: 22,
                                                        }}
                                                    >
                                                        {item.InterestName}
                                                        {props.data.interest.length > index + 1 ?
                                                            (
                                                                <Text style= {{
                                                                    fontFamily: "PoppinsSemiBold",
                                                                    fontSize: 22,
                                                                }}>
                                                                    {" "} | {" "}
                                                                </Text>
                                                            )
                                                            : 
                                                            (null)
                                                        }

                                                    </Text>
                                                );
                                            })}
                                        </Text>     
                                    )}
                                    {checkText(props.data.About) && (
                                        <Text
                                            name={"About"}
                                            style={{
                                                color: colors.light_gray,
                                                fontSize: 18,
                                                textAlign: "center",
                                                paddingVertical: 5,
                                            }}
                                        >
                                            Hakkında{"\n"}
                                            <Text
                                                style={{
                                                    fontFamily: "PoppinsSemiBold",
                                                    fontSize: 22,
                                                }}
                                            >
                                                {props.data.About}
                                            </Text>

                                        </Text>
                                    )}

                                </View>

                            </ReactNative.ScrollView>

                        </Animated.View>
                    </Animated.View>
                </GestureDetector>

            </View>
        </View>
    )
}

export default ChatProfile;