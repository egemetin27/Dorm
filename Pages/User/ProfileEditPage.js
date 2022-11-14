import { useContext, useEffect, useState } from "react";
import {
    ActivityIndicator,
    Dimensions,
    KeyboardAvoidingView,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import useBackHandler from "../../hooks/useBackHandler";
import { colors, Gradient, GradientText } from "../../visualComponents/colors";
import commonStyles from "../../visualComponents/styles";
import { MaterialIcons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { AuthContext } from "../../contexts/auth.context";
import crypto from "../../functions/crypto";
import axios from "axios";
import url from "../../connection";

const { height, width } = Dimensions.get("screen");

const FIELDS = [
    {
        title: "Hakkımda",
        key: "About",
        description:
            "Kendine eğlenceli ve vurucu bir giriş yaz. Maksimum 120 karakter yazabilirsin.",
        maxLength: 120,
        style: { height: height * 0.14 },
        numLines: 4,
    },
    {
        title: "Hangi bölümde okuyorsun?",
        key: "Major",
        description: "",
        maxLength: 30,
        style: { height: null },
        numLines: 1,
    },
];

export default function ProfileEditPage({ navigation, route }) {
    const [isReady, setIsReady] = useState(false);

    const { user, updateProfile } = useContext(AuthContext);

    const [input, setInput] = useState("");
    const [topic, setTopic] = useState({
        title: "",
        description: "",
        maxLength: 30,
    });

    const insets = useSafeAreaInsets();
    useBackHandler(() => navigation.goBack());

    useEffect(() => {
        console.log(route.params.field);
        if (route.params.field === "Hakkımda") {
            setTopic(FIELDS[0]);
            setInput(user.About);
        } else if (route.params.field === "Major") {
            setTopic(FIELDS[1]);
            setInput(user.Major);
        }
        // else if (field == "Temel Bilgilerim") setTopic(FIELDS[1]);
        // else if (field == "dorm'dan Beklentim") setTopic(FIELDS[1]);
        // else if (field == "Major") setTopic(FIELDS[1]);
        setIsReady(true);
    }, []);

    const handleSave = async () => {
        const dataRaw = user;
        dataRaw[topic.key] = input;
        //console.log({ userRaw });
        const dataToSend = crypto.encrypt(dataRaw);

        await axios
            .post(url + "/profile/IdentityUpdate", dataToSend, {
                headers: { "access-token": user.sesToken },
            })
            .then(async (res) => {
                updateProfile({ ...dataRaw });
            })
            .catch((err) => {
                console.log(err);
            });

        // const newData = { Name: name, Gender: sex.key,  }; // TODO: add new data here and both save them to local and send to database
    };

    if (!isReady)
        return (
            <View
                style={[commonStyles.Container, { justifyContent: "center" }]}
            >
                <StatusBar style="dark" />
                <ActivityIndicator
                    animating={true}
                    color={"rgba(100, 60, 248, 1)"}
                    size={"large"}
                />
            </View>
        );

    return (
        <View
            style={[
                commonStyles.Container,
                // { alignItems: "center", alignSelf: "center" },
            ]}
        >
            <View style={[styles.header, { marginTop: insets.top }]}>
                <View style={{ flex: 1, alignItems: "flex-start" }}>
                    <Pressable style={styles.button}>
                        <MaterialIcons
                            onPress={() => {
                                navigation.goBack();
                            }}
                            name="keyboard-backspace"
                            size={27}
                            color="black"
                        />
                    </Pressable>
                </View>
            </View>
            <KeyboardAvoidingView
                style={{
                    flex: 1,
                    flexDirection: "column",
                    justifyContent: "space-between",
                }}
                behavior="height"
                width={width * 0.85}
            >
                <View>
                    <GradientText text={topic.title} style={styles.title} />
                    {topic.description != "" && (
                        <Text style={styles.description}>
                            {topic.description}
                        </Text>
                    )}
                    <TextInput
                        style={[styles.input, topic.style]}
                        value={input}
                        onChangeText={setInput}
                        maxLength={topic.maxLength}
                        numberOfLines={topic.numLines}
                        multiline={true}
                    ></TextInput>
                </View>
                <View
                    style={{
                        alignSelf: "flex-end",
                        width: width * 0.35,
                        marginBottom: height * 0.05,
                    }}
                >
                    <Pressable
                        onPress={async () => {
                            await handleSave();
                            navigation.replace("MainScreen", {
                                screen: "Profil",
                            });
                        }}
                    >
                        <Gradient
                            style={[
                                {
                                    paddingVertical: height * 0.007,
                                    marginBottom: height * 0.013,
                                    paddingHorizontal: 20,
                                    justifyContent: "center",
                                    alignItems: "center",
                                    borderRadius: 32,
                                },
                            ]}
                        >
                            <Text
                                style={{
                                    color: colors.white,
                                    fontSize: width * 0.044,
                                }}
                            >
                                Kaydet
                            </Text>
                        </Gradient>
                    </Pressable>
                </View>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    title: {
        fontFamily: "PoppinsBold",
        fontSize: width * 0.056,
        marginBottom: height * 0.01,
    },
    description: {
        fontFamily: "PoppinsSemiLight",
        fontSize: width * 0.036,
        marginBottom: height * 0.01,
    },
    input: {
        textAlignVertical: "top",
        borderWidth: 1,
        borderRadius: 15,
        borderColor: "#5E17EB",
        padding: width * 0.031,
        fontFamily: "Poppins",
    },
    button: {
        paddingHorizontal: 10,
        paddingVertical: 6,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: width * 0.02,
        paddingVertical: Math.min(height * 0.03, 20),
    },
});
