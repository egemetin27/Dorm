import {
    Dimensions,
    Image,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";

const { height, width } = Dimensions.get("window");

const IconTextBox = ({ icon, text, topic, setVisible, area, ...props }) => {
    if (text == "")
        return (
            <Pressable
                onPress={() => {
                    setVisible != null
                        ? area != ""
                            ? setVisible(true)
                            : setVisible()
                        : null;
                }}
            >
                <View style={styles.box}>
                    {icon != null && (
                        <Image
                            source={icon}
                            style={{
                                height: height * 0.22,
                                width: height * 0.022,
                                aspectRatio: 1,
                                resizeMode: "contain",
                                marginLeft: width * 0.02,
                            }}
                        />
                    )}
                    <Text
                        style={{
                            fontFamily: "PoppinsSemiLight",
                            fontSize: width * 0.042,
                            marginLeft: width * 0.032,
                        }}
                    >
                        {topic + " belirtilmedi"}
                    </Text>
                </View>
            </Pressable>
        );

    return (
        <Pressable
            onPress={() => {
                setVisible != null
                    ? area != ""
                        ? setVisible(true)
                        : setVisible()
                    : null;
            }}
        >
            <View style={styles.box}>
                {icon != null && (
                    <Image
                        source={icon}
                        style={{
                            height: height * 0.22,
                            width: height * 0.022,
                            aspectRatio: 1,
                            resizeMode: "contain",
                            marginLeft: width * 0.02,
                        }}
                    />
                )}
                <Text
                    style={{
                        fontFamily: "PoppinsSemiLight",
                        fontSize: width * 0.042,
                        marginLeft: width * 0.032,
                    }}
                >
                    {text}
                </Text>
            </View>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    box: {
        marginRight: width * 0.03,
        flexDirection: "row",
        alignItems: "center",
        borderRadius: 20,
        borderWidth: width * 0.0016,
        paddingVertical: height * 0.0057,
        marginBottom: height * 0.016,
        paddingRight: width * 0.04,
    },
});

export default IconTextBox;
