import React from "react";
import { View, Text, Image, Dimensions, TouchableOpacity } from "react-native";
import { useSharedValue } from "react-native-reanimated";
import { StatusBar } from "expo-status-bar";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import commonStyles from "../../visualComponents/styles";
import { GradientText, colors } from "../../visualComponents/colors";
import url from "../../connection";

import Gender from "../afterRegisteration/Gender";
import MatchMode from "../afterRegisteration/MatchMode";
import Expectation from "../afterRegisteration/Expectation";
import SexOrientation from "../afterRegisteration/SexOrientation";
import Interested from "../afterRegisteration/Interested";
import crypto from "../../functions/crypto";

const { height, width } = Dimensions.get("screen");

export default function AfterRegister({ route, navigation }) {
	const insest = useSafeAreaInsets();
	const [pageNum, setPageNum] = React.useState(1);

	const [gender, setGender] = React.useState(1); // 1: Kadın, 2: Erkek, 3: Non-Binary, 4: Belirsiz
	const [matchMode, setMatchMode] = React.useState(1); // 1: Flört, 2: Arkadaş
	const [expectation, setExpectation] = React.useState(1); // 1: Takılmak, 2: Kısa Süre, 3: Uzun Süre, 4: Arkadaş, 5: Etkinlik, 6: Belirsiz
	const [interested, setInterested] = React.useState(1); // 1: Kadın, 2: Erkek, 3: Herkes
	const [sexualOrientation, setSexualOrientation] = React.useState(1); // 1: Hetero, 2: Bi, 3: Homo, 4: Pan, 5: Aseksüel

	const genderSwitch = useSharedValue(true);
	const orientationSwitch = useSharedValue(true);

	const { profile } = route.params;

	const handleSubmit = async () => {
		// TODO: send the choices to database

		const choices = {
			userId: profile.userId,
			gender: gender - 1,
			matchMode: matchMode - 1,
			expectation: expectation - 1,
			interestedSex: interested - 1,
			sexualOrientation: sexualOrientation - 1,
			SOVisibility: orientationSwitch.value ? "1" : "0",
			genderVisibility: genderSwitch.value ? "1" : "0",
		};

		// console.log(choices);
		const encryptedData = crypto.encrypt(choices);
		await axios
			.post(url + "/AfterRegister", encryptedData, {
				headers: { "access-token": profile.sesToken },
			})
			.then((res) => {
				navigation.replace("Hobbies", { ...profile, isNewUser: true });
			})
			.catch((error) => {
				console.log({ error });
			});
		console.log("Submitting");
	};

	return (
		<View
			style={[
				commonStyles.Container,
				{ paddingTop: insest.top * 1.5, paddingBottom: insest.bottom },
			]}
		>
			<StatusBar style={"dark"} />

			<View style={{ width: "100%", height: "100%" }}>
				<View style={[commonStyles.Header, { paddingHorizontal: 30, marginTop: 0 }]}>
					<TouchableOpacity
						onPress={() => {
							setPageNum(pageNum - 1);
						}}
					>
						<Text style={{ color: colors.medium_gray, fontSize: 18 }}>
							{pageNum > 1 ? "Geri" : ""}
						</Text>
					</TouchableOpacity>
					<TouchableOpacity
						onPress={() => {
							pageNum < 5 ? setPageNum(pageNum + 1) : handleSubmit();
						}}
					>
						<Text style={{ color: colors.medium_gray, fontSize: 18 }}>İleri</Text>
					</TouchableOpacity>
				</View>
				{pageNum == 1 && <MatchMode value={matchMode} setValue={setMatchMode} />}
				{pageNum == 2 && <Gender value={gender} setValue={setGender} isEnabled={genderSwitch} />}
				{pageNum == 3 && <Expectation value={expectation} setValue={setExpectation} />}
				{pageNum == 4 && <Interested value={interested} setValue={setInterested} />}
				{pageNum == 5 && (
					<SexOrientation
						value={sexualOrientation}
						setValue={setSexualOrientation}
						isEnabled={orientationSwitch}
					/>
				)}
			</View>
		</View>
	);
}
