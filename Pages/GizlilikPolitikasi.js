import React, {useState} from "react";
import {
	View,
	Text,
	ScrollView,
	StyleSheet,
	TouchableOpacity,
	Dimensions,
	Image,
    KeyboardAvoidingView,
    Platform,
    TouchableWithoutFeedback,
    Keyboard,
    TextInput,
    FlatList
} from "react-native";
import { Feather, Octicons } from "@expo/vector-icons";


import commonStyles from "../visualComponents/styles";
import { colors, Gradient, GradientText } from "../visualComponents/colors";

const { width, height } = Dimensions.get("window");


export default function GizlilikPolitikasi({ navigation, route }) {

	return (
        <View style={styles.inner}>
            <View name={"Header"} style={[styles.header]}>
				<TouchableOpacity
					style = {{width: "12%", paddingBottom: 5}}
					name={"backButton"}
					onPress={() => {
						navigation.goBack();
					}}
				>
					<Feather name="chevron-left" size={36} color="#4A4A4A" />
				</TouchableOpacity>
                <GradientText
					text={"Gizlilik Politikası"}
					style={{ fontSize: 36, fontWeight: "bold", paddingLeft: 0 }}
				/>
			</View>
            <View>
                <Text>
                    ----
                </Text>
            </View>
        </View>
      );
}

const styles = StyleSheet.create({
	header: {
		backgroundColor: colors.white,
		width: "100%",
		height: 100,
		elevation: 20,
		flexDirection: "row",
		alignItems: "flex-end",
		paddingLeft: 10,
		paddingBottom: 10,
	},
	buttonContainer: {
		width: width,
		flexDirection: "row",
		justifyContent: "space-between",
		paddingVertical: 16,
		paddingHorizontal: 20,
		alignItems: "center",
	},
	buttonText: {
		fontSize: 20,
		color: "#4A4A4A",
		fontWeight: "600",
	},
    inner: {
        flex: 1,
    },
    container: {
        flex: 1
    },
});
