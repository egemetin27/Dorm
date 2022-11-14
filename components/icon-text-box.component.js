import { Dimensions, Image, Pressable, Text, View } from "react-native";

const { height, width } = Dimensions.get("window");

const IconTextBox = ({ icon, text, setVisible, area, ...props }) => {
    if (text == "") return <View></View>;

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
            <View
                style={{
                    marginRight: width * 0.03,
                    flexDirection: "row",
                    //flex: 1,
                    //flexWrap: "wrap",
                    alignItems: "center",
                    //justifyContent: "flex-start",
                    //height: height * 0.04,
                    //width: 120,
                    borderRadius: 20,
                    borderWidth: width * 0.0016,
                    paddingVertical: height * 0.0057,
                    marginBottom: height * 0.016,
                    paddingRight: width * 0.04,
                }}
            >
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

export default IconTextBox;
