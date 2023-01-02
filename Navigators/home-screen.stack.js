import { useMemo, useContext, useState } from "react";
import { Dimensions, View, Text, Pressable } from "react-native";

import { DrawerActions, useFocusEffect } from "@react-navigation/native";
import { setStatusBarBackgroundColor, setStatusBarStyle } from "expo-status-bar";
import {
	createDrawerNavigator,
	DrawerContentScrollView,
	DrawerItem,
	DrawerItemList,
} from "@react-navigation/drawer";
import EventStack from "./home-stack/event-stack/event-screen.stack";

import { colors, GradientText } from "../visualComponents/colors";
import PersonStack from "./home-stack/person-stack/person-screen.stack";
import { AuthContext } from "../contexts/auth.context";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import crypto from "../functions/crypto";
import axios from "axios";
import url from "../connection";

const { height, width } = Dimensions.get("window");

const LABELS = ["event", "flirt", "friend"];

const DrawerButtonIcon = ({ isSelected = false, color = colors.purple }) => {
	const sizeAfterMultiplied = width * 0.16;

	return (
		<View
			style={{
				height: sizeAfterMultiplied,
				aspectRatio: 1,
				borderRadius: sizeAfterMultiplied / 2,
				borderColor: color,
				borderWidth: sizeAfterMultiplied / 8,
				alignItems: "center",
				justifyContent: "center",
			}}
		>
			{isSelected && (
				<View
					style={{
						height: sizeAfterMultiplied / 2,
						aspectRatio: 1,
						borderRadius: sizeAfterMultiplied / 4,
						backgroundColor: color,
					}}
				/>
			)}
		</View>
	);
};

const SubCategoryButton = ({
	isSelected = false,
	color = colors.event,
	label = "",
	style = {},
	onPress = () => {},
}) => {
	return (
		<Pressable
			onPress={onPress}
			style={[
				{
					height: height * 0.042,
					width: "100%",
					alignItems: "center",
					flexDirection: "row",
					backgroundColor: isSelected ? color : colors.backgroundColor,
					paddingLeft: "10%",
					borderRadius: height * 0.021,
					borderColor: color,
					borderWidth: 1.2,
				},
				style,
			]}
		>
			<Text
				style={{
					fontFamily: "PoppinsBold",
					fontSize: width * 0.04,
					color: isSelected ? colors.backgroundColor : color,
				}}
			>
				{label}
			</Text>
			<View
				style={{
					height: height * 0.032,
					aspectRatio: 1,
					alignItems: "center",
					justifyContent: "center",
					backgroundColor: colors.backgroundColor,
					borderColor: color,
					borderWidth: isSelected ? 0 : 1.2,
					marginLeft: "auto",
					borderRadius: height * 0.042,
					marginRight: height * 0.005,
				}}
			>
				<View
					style={{
						aspectRatio: 1,
						height: height * 0.02,
						borderRadius: height * 0.01,
						backgroundColor: isSelected ? color : colors.backgroundColor,
					}}
				/>
			</View>
		</Pressable>
	);
};

function CustomDrawerContent(props) {
	const {
		user: { userId, sesToken, matchMode },
		updateProfile,
	} = useContext(AuthContext);

	const index = useMemo(() => props.state.index, [props]);
	const navigation = useMemo(() => {
		return props.navigation;
	}, [props]);
	// console.log(JSON.stringify(props, null, "\t"));
	const [eventModeIndex, setEventModeIndex] = useState(-1);

	const changeMode = async (_matchMode) => {
		console.log({ _matchMode });
		const dataToBeSent = crypto.encrypt({
			userId,
			matchMode: _matchMode,
		});

		await axios
			.post(url + "/profile/matchMode", dataToBeSent, {
				headers: { "access-token": sesToken },
			}) // There is a typo (not Change but Chage) TODO: make userId variable
			.then(async (res) => {
				updateProfile({ matchMode: _matchMode });
			})
			.catch((error) => {
				console.log("Match Mode Error: ", error);
			});
	};

	return (
		<DrawerContentScrollView
			{...props}
			style={{
				borderRightWidth: width * 0.02,
				borderRightColor: colors[LABELS[index]],
				backgroundColor: colors.backgroundColor,
				shadowColor: colors[LABELS[index]],
				elevation: 100,
			}}
		>
			<View
				style={{ marginTop: height * 0.05, marginLeft: width * 0.05, marginBottom: height * 0.02 }}
			>
				<GradientText
					colors={[colors.purpleNew, colors[LABELS[index]]]}
					text="dorm modunu seç"
					style={{ fontFamily: "PoppinsSemiBold", fontSize: width * 0.052 }}
					{...props}
				/>
			</View>
			<DrawerItem
				style={{
					width: width * 0.85,
				}}
				focused={index === 0}
				activeBackgroundColor={"transparent"}
				label={({ focused }) => (
					<>
						<Text
							style={{
								color: colors.event,
								fontFamily: "PoppinsSemiBold",
								fontSize: width * 0.05,
								// fontSize: height * 0.024,
							}}
						>
							Etkinlik Buddy
						</Text>
						<Text numberOfLines={3} style={{ fontSize: width * 0.032 }}>
							Seninle aynı etkinlikleri beğenen insanlarla tanış
						</Text>
						{focused && (
							<View style={{ height: height * 0.2, marginTop: 12 }}>
								<View
									style={{
										width: "100%",
										height: 2,
										backgroundColor: colors.event,
										marginBottom: 8,
									}}
								/>
								<View style={{ height: height * 0.08 }}>
									<Text
										style={{
											fontFamily: "PoppinsSemiLight",
											fontSize: width * 0.03,
											color: colors.event,
										}}
									>
										<Text style={{ fontFamily: "PoppinsSemiBold" }}>Etkinlik Buddy</Text>
										’e özel olarak profilini diğer bir modda’da göstererek insanlarla tanışmaya
										devam edebilirsin!
									</Text>
								</View>
								<View
									style={{
										height: height * 0.12 - 24,
										justifyContent: "space-between",
										marginTop: 12,
										// backgroundColor: "blue",
									}}
								>
									<SubCategoryButton
										isSelected={eventModeIndex === 0}
										label="Flört"
										onPress={async () => {
											await changeMode(3);
											setEventModeIndex(0);
											navigation.dispatch(DrawerActions.closeDrawer());
										}}
										style={{ marginBottom: "auto" }}
									/>
									<SubCategoryButton
										isSelected={eventModeIndex === 1}
										label="Arkadaşlık"
										onPress={async () => {
											await changeMode(4);
											setEventModeIndex(1);
											navigation.dispatch(DrawerActions.closeDrawer());
										}}
									/>
								</View>
							</View>
						)}
					</>
				)}
				icon={({ focused, size }) => {
					return (
						<View style={{ flexDirection: "column", alignItems: "center" }}>
							<DrawerButtonIcon isSelected={focused} color={colors.event} />
							{focused && (
								<View
									style={{
										height: height * 0.2,
										backgroundColor: colors.event,
										width: width * 0.072,
										borderRadius: width * 0.036,
										marginTop: 12,
									}}
								></View>
							)}
						</View>
					);
				}}
				onPress={async () => {
					navigation.jumpTo("Event");
					navigation.dispatch(DrawerActions.openDrawer());
					if (index !== 0) {
						// setEventModeIndex(matchMode);
						await changeMode(2);
					}
				}}
			/>
			<DrawerItem
				focused={index === 1}
				style={{
					width: width * 0.85,
				}}
				activeBackgroundColor={"transparent"}
				label={({ focused }) => (
					<>
						<Text
							style={{
								color: colors.flirt,
								fontFamily: "PoppinsSemiBold",
								fontSize: width * 0.05,
								// fontSize: height * 0.024,
							}}
						>
							Flört
						</Text>
						<Text numberOfLines={3} style={{ fontSize: width * 0.03 }}>
							O kıvılcımı bulmak için harekete geç
						</Text>
					</>
				)}
				icon={({ focused, size }) => {
					return <DrawerButtonIcon isSelected={focused} color={colors.flirt} />;
				}}
				onPress={async () => {
					// await changeMode(0);
					navigation.jumpTo("Flirt");

					// navigation.dispatch(DrawerActions.openDrawer());
				}}
			/>
			<DrawerItem
				focused={index === 2}
				style={{
					width: width * 0.85,
				}}
				activeBackgroundColor={"transparent"}
				label={({ focused }) => (
					<>
						<Text
							style={{
								color: colors.friend,
								fontFamily: "PoppinsSemiBold",
								fontSize: width * 0.05,
								// fontSize: height * 0.024,
							}}
						>
							Arkadaşlık
						</Text>
						<Text numberOfLines={3} style={{ fontSize: width * 0.03 }}>
							Beraber etkinliklere gideceğin yeni arkadaşlar edin
						</Text>
					</>
				)}
				icon={({ focused, size }) => {
					return <DrawerButtonIcon isSelected={focused} color={colors.friend} />;
				}}
				onPress={async () => {
					// await changeMode(1);
					navigation.jumpTo("Friend");

					// navigation.dispatch(DrawerActions.openDrawer());
				}}
			/>
			{/* <DrawerItemList {...props} /> */}
		</DrawerContentScrollView>
	);
}
function HomeStackScreen() {
	const {
		user: { matchMode },
	} = useContext(AuthContext);

	const { top } = useSafeAreaInsets();

	const initialRoute = useMemo(() => {
		if (matchMode === 0) return "Flirt";
		if (matchMode === 1) return "Friend";
		if (matchMode === 2) return "Event";
	}, [matchMode]);

	// useFocusEffect(() => {
	// 	// setStatusBarBackgroundColor(colors.backgroundNew, true);
	// 	// setStatusBarStyle("dark");
	// });

	const Drawer = createDrawerNavigator();

	return (
		<Drawer.Navigator
			initialRouteName={initialRoute}
			backBehavior="none"
			drawerContent={(props) => <CustomDrawerContent {...props} />}
			screenOptions={{
				headerShown: false,
				drawerActiveTintColor: colors.backgroundNew,
				// overlayColor: `${colors.friend}1a`,
				drawerStyle: {
					width: width * 0.85,
				},
				unmountOnBlur: true,
				drawerStatusBarAnimation: "fade",
				swipeEnabled: false,
				// drawerContentContainerStyle: { width: width * 0.9 },
				// drawerContentStyle: { width: width * 0.9 },
				// drawerHideStatusBarOnOpen: true,
			}}
		>
			<Drawer.Screen
				name="Event"
				component={EventStack}
				// options={{
				// 	drawerLabel: ({ focused }) => (
				// 		<>
				// 			<Text
				// 				style={{
				// 					color: colors.event,
				// 					fontFamily: "PoppinsSemiBold",
				// 					fontSize: width * 0.05,
				// 					// fontSize: height * 0.024,
				// 				}}
				// 			>
				// 				Etkinlik Buddy
				// 			</Text>
				// 			<Text numberOfLines={3} style={{ fontSize: width * 0.032 }}>
				// 				Seninle aynı etkinlikleri beğenen insanlarla tanış
				// 			</Text>
				// 			{focused && (
				// 				<>
				// 					<View style={{ width: "100%", height: 2, backgroundColor: colors.event }}></View>
				// 				</>
				// 			)}
				// 		</>
				// 	),
				// 	drawerIcon: ({ focused, size }) => {
				// 		return <DrawerButtonIcon isSelected={focused} color={colors.event} />;
				// 	},
				// }}
			/>
			<Drawer.Screen
				name="Flirt"
				component={PersonStack}
				// options={{
				// 	drawerLabel: () => (
				// 		<>
				// 			<Text
				// 				style={{
				// 					color: colors.flirt,
				// 					fontFamily: "PoppinsSemiBold",
				// 					fontSize: width * 0.05,
				// 					// fontSize: height * 0.024,
				// 				}}
				// 			>
				// 				Flört
				// 			</Text>
				// 			<Text numberOfLines={3} style={{ fontSize: width * 0.03 }}>
				// 				O kıvılcımı bulmak için harekete geç
				// 			</Text>
				// 		</>
				// 	),
				// 	drawerIcon: ({ focused, size }) => (
				// 		<DrawerButtonIcon isSelected={focused} color={colors.flirt} />
				// 	),
				// }}
				initialParams={{ mode: "flirt" }}
			/>
			<Drawer.Screen
				name="Friend"
				component={PersonStack}
				// options={{
				// 	drawerLabel: () => (
				// 		<>
				// 			<Text
				// 				style={{
				// 					color: colors.friend,
				// 					fontFamily: "PoppinsSemiBold",
				// 					fontSize: width * 0.05,
				// 					// fontSize: height * 0.024,
				// 				}}
				// 			>
				// 				Arkadaşlık
				// 			</Text>
				// 			<Text numberOfLines={3} style={{ fontSize: width * 0.03 }}>
				// 				Beraber etkinliklere gideceğin yeni arkadaşlar edin
				// 			</Text>
				// 		</>
				// 	),
				// 	drawerIcon: ({ focused, size }) => (
				// 		<DrawerButtonIcon isSelected={focused} color={colors.friend} />
				// 	),
				// }}
				initialParams={{ mode: "friend" }}
			/>
		</Drawer.Navigator>
	);
}

export default HomeStackScreen;
