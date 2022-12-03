import { useMemo, useContext } from "react";
import { Dimensions, View, Text } from "react-native";

import { useFocusEffect } from "@react-navigation/native";
import { setStatusBarBackgroundColor, setStatusBarStyle } from "expo-status-bar";
import {
	createDrawerNavigator,
	DrawerContentScrollView,
	DrawerItemList,
} from "@react-navigation/drawer";
import EventStack from "./home-stack/event-stack/event-screen.stack";

import { colors, GradientText } from "../visualComponents/colors";
import PersonStack from "./home-stack/person-stack/person-screen.stack";
import { AuthContext } from "../contexts/auth.context";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

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

function CustomDrawerContent(props) {
	const index = useMemo(() => props.state.index, [props]);
	// console.log(JSON.stringify(props, null, "\t"));
	return (
		<DrawerContentScrollView
			{...props}
			style={{
				borderRightWidth: width * 0.02,
				borderRightColor: colors[LABELS[index]],
				backgroundColor: colors.backgroundNew,
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
			<DrawerItemList {...props} />
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
				options={{
					drawerLabel: ({ focused }) => (
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
								<>
									<View style={{ width: "100%", height: 2, backgroundColor: colors.event }}></View>
								</>
							)}
						</>
					),
					drawerIcon: ({ focused, size }) => {
						return <DrawerButtonIcon isSelected={focused} color={colors.event} />;
					},
				}}
			/>
			<Drawer.Screen
				name="Flirt"
				component={PersonStack}
				options={{
					drawerLabel: () => (
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
					),
					drawerIcon: ({ focused, size }) => (
						<DrawerButtonIcon isSelected={focused} color={colors.flirt} />
					),
				}}
				initialParams={{ mode: "flirt" }}
			/>
			<Drawer.Screen
				name="Friend"
				component={PersonStack}
				options={{
					drawerLabel: () => (
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
					),
					drawerIcon: ({ focused, size }) => (
						<DrawerButtonIcon isSelected={focused} color={colors.friend} />
					),
				}}
				initialParams={{ mode: "friend" }}
			/>
		</Drawer.Navigator>
	);
}

export default HomeStackScreen;
