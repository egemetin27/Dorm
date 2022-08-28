import { useContext, useEffect, useState } from "react";
import { View, Image, Text, Dimensions, StyleSheet } from "react-native";
import { MessageContext } from "../../contexts/message.context";
import { NotificationContext } from "../../contexts/notification.context";
import { GradientText, colors } from "../../visualComponents/colors";
const { width, height } = Dimensions.get("screen");
const profileIcon = require("../../assets/TabBarIcons/profile.png");
const messagesIcon = require("../../assets/TabBarIcons/messages.png");

const TabbarButton = ({ icon, label, focused }) => {
	const { unreadCheck } = useContext(MessageContext);
	const { unReadCheck } = useContext(NotificationContext);
	const [unRead, SetUnRead] = useState(false);
	useEffect(() => {
		SetUnRead(unReadCheck);
	}, [unReadCheck]);
	return (
		<View style={styles.container}>
			{((unReadCheck == true && label == "Mesajlar")) ? 
				<Image
					source={messagesIcon}
					style={{
						tintColor: colors.green,
						maxHeight: "50%",
						maxWidth: "16%",
						resizeMode: "contain",
					}}
					key={Math.random}
				/>
				:
				<Image
					source={icon}
					style={{
						tintColor: focused ? {} : colors.cool_gray,
						maxHeight: "50%",
						maxWidth: "16%",
						resizeMode: "contain",
					}}
			/>}
				
			{focused ? (
				<GradientText style={styles.gradient_label} text={label} />
				) : (
					<Text style={styles.label}>{label}</Text>
				)}
			</View>
		);
	};
	export default TabbarButton;
	const styles = StyleSheet.create({
		container: {
			flex: 1,
			width: width * 0.33,
			alignItems: "center",
			justifyContent: "flex-end",
		},
		gradient_label: {
			fontSize: height * 0.016,
			fontFamily: "PoppinsBold",
		},
		label: {
			fontSize: height * 0.016,
			fontFamily: "PoppinsBold",
			color: colors.cool_gray,
		},
	});