import React from "react";
import { Text, View, Pressable, Dimensions } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { Gradient } from "../visualComponents/colors";
import CustomImage from "./custom-image.component";

import { formatDate } from "../utils/date.utils";
import commonStyles from "../visualComponents/styles";
import { colors } from "../visualComponents/colors";

const { width, height } = Dimensions.get("window");

const EventCard = ({ event, openEvents, index, length, setIsAppReady }) => {
	const { Description, Date, StartTime, Location, photos } = event;

	return (
		<Pressable
			onPress={() => {
				setIsAppReady(false);
				openEvents(index);
			}}
			style={[
				commonStyles.photo,
				{
					height: "95%",
					backgroundColor: colors.cool_gray,
					marginHorizontal: 0,
					marginLeft: 15,
					marginRight: index + 1 == length ? 15 : 0,
				},
			]}
		>
			<CustomImage
				url={photos?.length > 0 ? photos[0] : "AAAA"}
				style={{ width: "100%", height: "100%", resizeMode: "cover" }}
			/>
			<Gradient
				colors={["rgba(0,0,0,0.001)", "rgba(0,0,0,0.45)", "rgba(0,0,0,0.65)"]}
				locations={[0, 0.4, 1]}
				start={{ x: 0.5, y: 0 }}
				end={{ x: 0.5, y: 1 }}
				style={{
					height: "40%",
					paddingTop: "25%",
					// height: height * 0.08,
					width: "100%",
					position: "absolute",
					justifyContent: "flex-start",
					bottom: 0,
					paddingBottom: "2%",
					paddingHorizontal: "5%",
				}}
			>
				<Text
					numberOfLines={1}
					style={{
						color: colors.white,
						fontSize: height * 0.02,
						lineHeight: height * 0.025,
						fontFamily: "PoppinsSemiBold",
						//letterSpacing: 1.05,
					}}
				>
					{Description}
				</Text>
				<View
					name={"date"}
					style={{
						width: "100%",
						flexDirection: "row",
						justifyContent: "space-between",
						paddingTop: height * 0.002,
					}}
				>
					{Date != null && Date != "" && Date != "undefined" && Date != "NaN/NaN/NaN" && (
						<Text
							style={{
								color: colors.white,
								fontSize: height * 0.015,
								lineHeight: height * 0.018,
							}}
						>
							{formatDate(Date)}
						</Text>
					)}
					{StartTime != "" && (
						<Text
							style={{
								color: colors.white,
								fontSize: height * 0.015,
								lineHeight: height * 0.018,
							}}
						>
							{StartTime}
						</Text>
					)}
				</View>
				{Location != "" && (
					<View
						name={"location"}
						style={{
							width: "100%",
							flexDirection: "row",
							alignItems: "flex-end",
							paddingTop: height * 0.002,
						}}
					>
						<MaterialCommunityIcons
							name="map-marker-radius"
							size={height * 0.018}
							color={colors.white}
							style={{ paddingRight: width * 0.005 }}
						/>
						<Text
							numberOfLines={1}
							style={{
								color: colors.white,
								fontSize: height * 0.015,
								lineHeight: height * 0.018,
							}}
						>
							{Location}
						</Text>
					</View>
				)}
			</Gradient>
		</Pressable>
	);
};

export default EventCard;
