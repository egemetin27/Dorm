import React from "react";
import { Text, View, Pressable, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { Gradient } from "../visualComponents/colors";
import CustomImage from "./custom-image.component";

import { getAge } from "../utils/date.utils";
import commonStyles from "../visualComponents/styles";
import { colors } from "../visualComponents/colors";

const { width, height } = Dimensions.get("window");

const PersonCard = ({ person, openProfiles, index, length, setIsAppReady }) => {
	const {
		Name: name,
		Birth_Date: bDay,
		School: university,
		Major: major,
		photos: photoList,
	} = person;

	const age = getAge(bDay);

	return (
		<Pressable
			onPress={() => {
				openProfiles(index);
			}}
			style={[
				commonStyles.photo,
				{
					height: "95%",
					backgroundColor: colors.white,
					marginHorizontal: 0,
					marginLeft: 15,
					marginRight: index + 1 == length ? 15 : 0,
				},
			]}
		>
			{photoList?.length > 0 ? (
				<CustomImage
					url={photoList[0]?.PhotoLink}
					style={{ width: "100%", height: "100%", resizeMode: "cover" }}
				/>
			) : (
				<Ionicons name="person" color="white" size={60} />
			)}

			<Gradient
				colors={["rgba(0,0,0,0.01)", "rgba(0,0,0,0.1)", "rgba(0,0,0,0.75)"]}
				locations={[0, 0.1, 1]}
				start={{ x: 0.5, y: 0 }}
				end={{ x: 0.5, y: 1 }}
				style={{
					height: height * 0.08,
					width: "100%",
					position: "absolute",
					justifyContent: "flex-end",
					paddingBottom: height * 0.005,
					bottom: 0,
					paddingHorizontal: width * 0.02,
				}}
			>
				<View
					style={{
						flexDirection: "row",
					}}
				>
					<View style={{ flexShrink: 1 }}>
						<Text
							numberOfLines={1}
							style={{
								width: "100%",
								color: colors.white,
								fontSize: height * 0.02,
								lineHeight: height * 0.025,
								fontFamily: "PoppinsSemiBold",
								//letterSpacing: 1.05,
							}}
						>
							{name}
						</Text>
					</View>
					<Text
						style={{
							color: colors.white,
							fontSize: height * 0.02,
							lineHeight: height * 0.025,
							fontFamily: "PoppinsSemiBold",
							//letterSpacing: 1.05,
						}}
					>
						{" "}
						• {age}
					</Text>
				</View>
				<Text
					numberOfLines={1}
					style={{
						paddingTop: height * 0.002,
						color: colors.white,
						fontFamily: "PoppinsItalic",
						fontSize: height * 0.015,
						lineHeight: height * 0.018,
					}}
				>
					{university}
				</Text>
				<Text
					numberOfLines={1}
					style={{
						paddingTop: height * 0.002,
						color: colors.white,
						fontFamily: "PoppinsItalic",
						fontSize: height * 0.015,
						lineHeight: height * 0.018,
					}}
				>
					{major}
				</Text>
			</Gradient>
		</Pressable>
	);
};

export default PersonCard;
