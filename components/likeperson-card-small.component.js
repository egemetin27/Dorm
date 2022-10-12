import { Text, View, Pressable, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { Gradient } from "../visualComponents/colors";
import CustomImage from "./custom-image.component";

import { getAge } from "../utils/date.utils";
import commonStyles from "../visualComponents/styles";
import { colors } from "../visualComponents/colors";

const { width, height } = Dimensions.get("window");

const LikePerson = ({ person, openProfiles, index, blur, mode = "flört" }) => {
	const {
		Name: name,
		Birth_Date: bDay,
		School: university,
		Major: major,
		photos: photoList,
	} = person;

	const firstPhoto = photoList.find(({ Photo_Order }) => {
		return Photo_Order.toString() === "1";
	});

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
					width: width * 0.425,
					backgroundColor: colors.white,
					marginLeft: index % 2 == 0 ? width * 0.05 : width * 0.025,
					marginRight: index % 2 == 1 ? width * 0.05 : width * 0.025,
					marginBottom: height * 0.025,
				},
			]}
		>
			{photoList?.length > 0 ? (
				<CustomImage
					url={firstPhoto.PhotoLink}
					blur={blur}
					style={{ width: "100%", height: "100%", resizeMode: "cover" }}
				/>
			) : (
				<Ionicons name="person" color="white" size={60} />
			)}

			<Gradient
				colors={["rgba(0,0,0,0.04)", "rgba(0,0,0,0.75)", "rgba(0,0,0,1)"]}
				locations={[0, 0.5, 1]}
				start={{ x: 0.5, y: 0 }}
				end={{ x: 0.5, y: 1 }}
				style={{
					height: blur == 1 ? 0 : height * 0.095,
					width: "100%",
					position: "absolute",
					justifyContent: "flex-end",
					//paddingBottom: height * 0.005,
					bottom: 0,
					paddingHorizontal: width * 0.023,
				}}
			>
				<View
					style={{
						flexDirection: "row",
						marginBottom: height * 0.004,
					}}
				>
					<View style={{ flexShrink: 1 }}>
						<Text
							numberOfLines={1}
							style={{
								width: "100%",
								color: colors.white,
								fontSize: height * 0.018,
								lineHeight: height * 0.025,
								fontFamily: "PoppinsSemiBold",
								letterSpacing: 0.6,
							}}
						>
							{name}
						</Text>
					</View>
					<Text
						style={{
							color: colors.white,
							fontSize: height * 0.018,
							lineHeight: height * 0.025,
							fontFamily: "PoppinsSemiBold",
							letterSpacing: 0.6,
						}}
					>
						{" "}
						 • {age}
					</Text>
				</View>
				<Text
					numberOfLines={1}
					style={{
						paddingTop: height * 0.0023,
						color: colors.white,
						fontFamily: "Poppins",
						fontSize: height * 0.012,
						lineHeight: height * 0.018,
					}}
				>
					{university}
				</Text>
				<Text
					numberOfLines={1}
					style={{
						paddingTop: height * 0.002,
						paddingBottom: height * 0.007,
						color: colors.white,
						fontFamily: "PoppinsItalic",
						fontSize: height * 0.011,
						lineHeight: height * 0.013,
					}}
				>
					{major}
				</Text>
			</Gradient>
			<Text style={{
				position: "absolute", top: height * 0.013, left: width * 0.02, fontSize: height * 0.015,
				fontFamily: "PoppinsBold", color: colors.white, letterSpacing: 0.7,
				borderRadius: 15, paddingHorizontal: width * 0.02, paddingVertical: height * 0.0009,
				backgroundColor: mode == "Flört" ? "#FF6978" : "#FACA18",
			}}>
				{mode}
			</Text>
		</Pressable>
	);
};

export default LikePerson;
