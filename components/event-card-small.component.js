import { memo, useMemo } from "react";
import { Text, View, Pressable, Dimensions, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { Gradient } from "../visualComponents/colors";
import CustomImage from "./custom-image.component";

import { formatDate } from "../utils/date.utils";
import commonStyles from "../visualComponents/styles";
import { colors } from "../visualComponents/colors";

const { width, height } = Dimensions.get("window");

const EventCard = ({ event, openEvents, index }) => {
	const { Description, Date, StartTime, Location, photos } = useMemo(() => event, [event]);

	return (
		<Pressable
			onPress={() => {
				openEvents(index);
			}}
			style={[
				commonStyles.photo,
				styles.eventCardContainer,
				{
					marginLeft: index % 2 == 0 ? width * 0.04 : width * 0.02,
					marginRight: index % 2 == 1 ? width * 0.04 : width * 0.02,
				},
			]}
		>
			<CustomImage
				url={photos?.length > 0 ? photos[0] : null}
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

const styles = StyleSheet.create({
	eventCardContainer: {
		height: width * 0.66,
		backgroundColor: colors.cool_gray,
		marginBottom: 16,
	},
});

export default memo(EventCard);
