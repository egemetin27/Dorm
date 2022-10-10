import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../../contexts/auth.context";
import useBackHandler from "../../hooks/useBackHandler";
import axios from "axios";
import { Dimensions, Image, Text, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import LikePerson from "../../components/likeperson-card-small.component";
import { colors, Gradient } from "../../visualComponents/colors";
import styles from "../../visualComponents/styles";
import { StatusBar } from "expo-status-bar";
import url from "../../connection";

const { height, width } = Dimensions.get("window");

const yourLikesIcon = require("../../assets/yourlikes.png");

const peopleList = [
    {
        Name: "Deniz",
        City: "İstanbul",
        Birth_Date: "2000-09-22",
        UserId: 11188,
        Gender: 0,
        Surname: "Günel",
        School: "Boğaziçi Üniversitesi",
        Major: "Psikoloji",
        Din: null,
        Burc: null,
        Beslenme: null,
        Alkol: null,
        Sigara: null,
        About: "Arada bi 90'lar pop, arada bi kahve",
        photos: [
            {
                UserId: 11188,
                Photo_Order: 1,
                PhotoLink: "https://d13pzveje1c51z.cloudfront.net/14f6d32a522d336345e649622c659fc4",
            },
        ],
        interest: [
            {
                InterestName: "☕ Kahve",
                UserId: 11188,
            },
            {
                InterestName: "🎸 Müzik",
                UserId: 11188,
            },
            {
                InterestName: "🎹 Klasik",
                UserId: 11188,
            },
            {
                InterestName: "🏳️‍🌈 LGBTQ+ destekçi",
                UserId: 11188,
            },
            {
                InterestName: "🥬 Vejetaryen",
                UserId: 11188,
            },
        ],
    },
    {
        Name: "Erdem",
        City: "İstanbul",
        Birth_Date: "2001-09-22",
        UserId: 1188,
        Gender: 1,
        Surname: "Arı",
        School: "Mimar Sinan Üniversitesi",
        Major: "Mimarlık",
        Din: null,
        Burc: null,
        Beslenme: null,
        Alkol: null,
        Sigara: null,
        About: "Handpoke Tattoo Artist  ;)",
        photos: [
            {
                UserId: 1188,
                Photo_Order: 1,
                PhotoLink: "https://d13pzveje1c51z.cloudfront.net/945a239e8b9038adb15116de7705675e",
            },
        ],
        interest: [
            {
                InterestName: "🎸 Müzik",
                UserId: 1188,
            },
            {
                InterestName: "🎹 Klasik",
                UserId: 1188,
            },
            {
                InterestName: "🏀 Basketbol",
                UserId: 1188,
            },
            {
                InterestName: "☕ Kahve",
                UserId: 1188,
            },
        ],
    },
    {
        Name: "Deniz",
        City: "İstanbul",
        Birth_Date: "2000-09-22",
        UserId: 11189,
        Gender: 0,
        Surname: "Günel",
        School: "Boğaziçi Üniversitesi",
        Major: "Psikoloji",
        Din: null,
        Burc: null,
        Beslenme: null,
        Alkol: null,
        Sigara: null,
        About: "Arada bi 90'lar pop, arada bi kahve",
        photos: [
            {
                UserId: 11188,
                Photo_Order: 1,
                PhotoLink: "https://d13pzveje1c51z.cloudfront.net/816469bda21b9f4f7c87b8562417def6",
            },
        ],
        interest: [
            {
                InterestName: "☕ Kahve",
                UserId: 11188,
            },
            {
                InterestName: "🎸 Müzik",
                UserId: 11188,
            },
            {
                InterestName: "🎹 Klasik",
                UserId: 11188,
            },
            {
                InterestName: "🏳️‍🌈 LGBTQ+ destekçi",
                UserId: 11188,
            },
            {
                InterestName: "🥬 Vejetaryen",
                UserId: 11188,
            },
        ],
    },
    {
        Name: "Erdem",
        City: "İstanbul",
        Birth_Date: "2001-09-22",
        UserId: 1190,
        Gender: 1,
        Surname: "Arı",
        School: "Mimar Sinan Üniversitesi",
        Major: "Mimarlık",
        Din: null,
        Burc: null,
        Beslenme: null,
        Alkol: null,
        Sigara: null,
        About: "Handpoke Tattoo Artist  ;)",
        photos: [
            {
                UserId: 1188,
                Photo_Order: 1,
                PhotoLink: "https://d13pzveje1c51z.cloudfront.net/816469bda21b9f4f7c87b8562417def6",
            },
        ],
        interest: [
            {
                InterestName: "🎸 Müzik",
                UserId: 1188,
            },
            {
                InterestName: "🎹 Klasik",
                UserId: 1188,
            },
            {
                InterestName: "🏀 Basketbol",
                UserId: 1188,
            },
            {
                InterestName: "☕ Kahve",
                UserId: 1188,
            },
        ],
    },
    {
        Name: "Deniz",
        City: "İstanbul",
        Birth_Date: "2000-09-22",
        UserId: 111911,
        Gender: 0,
        Surname: "Günel",
        School: "Boğaziçi Üniversitesi",
        Major: "Psikoloji",
        Din: null,
        Burc: null,
        Beslenme: null,
        Alkol: null,
        Sigara: null,
        About: "Arada bi 90'lar pop, arada bi kahve",
        photos: [
            {
                UserId: 111911,
                Photo_Order: 1,
                PhotoLink: "https://d13pzveje1c51z.cloudfront.net/14f6d32a522d336345e649622c659fc4",
            },
        ],
        interest: [
            {
                InterestName: "☕ Kahve",
                UserId: 11188,
            },
            {
                InterestName: "🎸 Müzik",
                UserId: 11188,
            },
            {
                InterestName: "🎹 Klasik",
                UserId: 11188,
            },
            {
                InterestName: "🏳️‍🌈 LGBTQ+ destekçi",
                UserId: 11188,
            },
            {
                InterestName: "🥬 Vejetaryen",
                UserId: 11188,
            },
        ],
    },
    {
        Name: "Erdem",
        City: "İstanbul",
        Birth_Date: "2001-09-22",
        UserId: 119222,
        Gender: 1,
        Surname: "Arı",
        School: "Mimar Sinan Üniversitesi",
        Major: "Mimarlık",
        Din: null,
        Burc: null,
        Beslenme: null,
        Alkol: null,
        Sigara: null,
        About: "Handpoke Tattoo Artist  ;)",
        photos: [
            {
                UserId: 119222,
                Photo_Order: 1,
                PhotoLink: "https://d13pzveje1c51z.cloudfront.net/ecc1f4aeeeb9c47a6e924478344f73fc",
            },
        ],
        interest: [
            {
                InterestName: "🎸 Müzik",
                UserId: 1188,
            },
            {
                InterestName: "🎹 Klasik",
                UserId: 1188,
            },
            {
                InterestName: "🏀 Basketbol",
                UserId: 1188,
            },
            {
                InterestName: "☕ Kahve",
                UserId: 1188,
            },
        ],
    },
];

export default function LikeCards({ navigation, route }) {
    const [likeCount, setLikeCount] = useState(44);
    //const [peopleList, setPeopleList] = useState([]);
    const [isLoading, setIsLoading] = useState(false); // TODO !!!!!!!!!!

    const {
        user: { userId, matchMode, sesToken, Photo },
        signOut,
        updateProfile,
    } = useContext(AuthContext);

    useBackHandler(() => navigation.goBack());
    const likeFlatListRef = useRef();

    // useEffect(() => {
    //     const dataToSend = crypto.encrypt({
    // 		userId: userId,
    // 	});
    //     axios
    //         .post(url + "/statistics/like", dataToSend, { headers: { "access-token": sesToken } })
    //         .then((res) => {
    //             console.log(res.data);
    //             const list = JSON.parse(res.data);
    //             setPeopleList(list);
    //             setIsLoading(false);
    //         })
    //         .catch((err) => { console.log(err); });
    // }, []);

    useBackHandler(() => navigation.goBack());

    if (isLoading) {
        return (
            // <View style={[styles.Container, { justifyContent: "center" }]}>
            <View style={{ backgroundColor: colors.backgroundColor }}>
                <StatusBar style="dark" />
                <ActivityIndicator animating={true} color={"rgba(100, 60, 248, 1)"} size={"large"} />
            </View>
        );
    }

    return (
        <View styles={[styles.Container, { backgroundColor: "#FF6978", }]}>
            <StatusBar style="dark" backgroundColor={"#FF6978"} />
            <View style={{ position: "absolute", top: 0, left: 0, bottom: 0, right: 0, backgroundColor: "#FF6978" }} />
            <View style={{ height: height * 0.3, width: width, alignContent: "center", alignItems: "center", backgroundColor: "#FF6978" }}>
                <Text style={{
                    fontFamily: "PoppinsBold", letterSpacing: width * 0.001, fontSize: height * 0.024,
                    marginTop: height * 0.02, marginHorizontal: width * 0.05, color: colors.white
                }}>
                    seni beğenenler
                </Text>
                <Image
                    source={require("../../assets/yourlikes.png")}
                    style={{ backgroundColor: null, marginVertical: height * 0.04 }}
                />
                <Text style={{
                    fontFamily: "PoppinsBold", marginVertical: height * 0.02, marginHorizontal: width * 0.05,
                    borderColor: colors.black, borderWidth: height * 0.002, borderRadius: 20, borderColor: colors.white,
                    paddingHorizontal: width * 0.04, paddingVertical: height * 0.005, color: colors.white
                }}>
                    {likeCount} kişi senden hoşlanıyor
                </Text>
            </View>
            <View style={{
                // height: "100%",
                // alignItems: "center",
                // justifyContent: "center",
                width: width,
                backgroundColor: colors.white,
                borderRadius: 30,
                overflow: "hidden",
            }}>
                <FlatList
                    data={peopleList}
                    ref={likeFlatListRef}
                    maxToRenderPerBatch={1}
                    numColumns={2}
                    showsVerticalScrollIndicator={false}
                    initialNumToRender={4}
                    style={{
                    }}
                    contentContainerStyle={{
                        paddingBottom: height * 0.62,
                        paddingTop: height * 0.025,
                    }}
                    keyExtractor={(item, index) => item?.UserId?.toString() ?? index}
                    renderItem={({ item, index }) => (
                        // <View style={{height: 400, width: width * 0.3, backgroundColor: "blue", marginHorizontal: 10, marginVertical: 10}} />
                        <LikePerson
                            index={index}
                            person={item}
                            openProfiles={(idx) => {
                                //mode={item.mode}
                            }}
                        />
                    )}
                    ListFooterComponent={() =>
                        peopleList.length === 0 ? (
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
            </View>
            <Gradient
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
            />
            <Text>son</Text>
        </View>
    );
}