import { View, Dimensions, Pressable, StyleSheet } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

import TabbarButton from "../components/tabbar-button/tabbar-buton.component";

import Profile from "../Pages/User/Profile";
import HomeStackScreen from "./home-screen.stack";
import LikeStackScreen from "./like-screen.navigator";
import Messages from "../Pages/User/messages/messages.route";

import { colors } from "../visualComponents/colors";

const profileIcon = require("../assets/TabBarIcons/profile.png");
const homeIcon = require("../assets/TabBarIcons/logoGradient.png");
const messagesIcon = require("../assets/TabBarIcons/messages.png");
const pinkLikeIcon = require("../assets/TabBarIcons/favorite.png");

const { width, height } = Dimensions.get("window");
const Tab = createBottomTabNavigator();

function Tabbar({ route, navigation }) {
	const insets = useSafeAreaInsets();

	// const { unReadCheck, setUnreadChecker } = useContext(NotificationContext);
	return (
		<View
			style={{
				flex: 1,
				// paddingTop: insets.top,
				backgroundColor: colors.backgroundColor,
			}}
		>
			<Tab.Navigator
				backBehavior="initialRoute"
				screenOptions={{
					tabBarStyle: {
						// backgroundColor: colors.backgroundColor,
						// height: height * 0.07,
						// paddingBottom: height * 0.0144,
						height: height * 0.07 + insets.bottom,
						paddingBottom: height * 0.0144 + insets.bottom,
						zIndex: 0,
					},
					headerShown: false,
					tabBarShowLabel: false,
					tabBarHideOnKeyboard: true,
				}}
				detachInactiveScreens={true}
				initialRouteName={"AnaSayfa"}
			>
				<Tab.Screen
					name="Profil"
					component={Profile}
					// initialParams={{ photoList: pList }}
					options={{
						tabBarButton: (props) => (
							<Pressable
								{...props}
								style={[props.style, { zIndex: 1 }]}
								onPress={() => {
									navigation.navigate("MainScreen", {
										screen: "Profil",
									});
								}}
							/>
						),
						tabBarIcon: ({ focused }) => (
							<TabbarButton focused={focused} label="Profil" icon={profileIcon} />
						),
					}}
				/>
				<Tab.Screen
					name="AnaSayfa"
					component={HomeStackScreen}
					options={{
						tabBarButton: (props) => (
							<Pressable
								{...props}
								onPress={() => {
									navigation.navigate("MainScreen", {
										screen: "AnaSayfa",
									});
									// if (
									// 	props?.accessibilityState?.selected &&
									// 	props?.children?.props?.children[0].props?.route.state
									// ) {
									// 	navigation.navigate("MainScreen", {
									// 		screen: "AnaSayfa",
									// 	});
									// } else if (!props?.accessibilityState?.selected) {
									// 	// const jumpToAction = TabActions.jumpTo("AnaSayfa", {
									// 	// 	screen: "Home",
									// 	// });
									// 	// navigation.dispatch(jumpToAction);
									// 	navigation.navigate("MainScreen", {
									// 		screen: "AnaSayfa",
									// 	});
									// }
								}}
							/>
						),
						tabBarIcon: ({ focused }) => (
							<TabbarButton focused={focused} label="Ana Sayfa" icon={homeIcon} />
						),
					}}
				/>
				<Tab.Screen
					name="Like"
					component={LikeStackScreen}
					options={{
						tabBarIcon: ({ focused }) => (
							<TabbarButton focused={focused} label="Likes" icon={pinkLikeIcon} />
						),
					}}
				/>
				<Tab.Screen
					name="Mesajlar"
					component={Messages}
					options={{
						tabBarIcon: ({ focused }) => (
							<TabbarButton focused={focused} label="Mesajlar" icon={messagesIcon} />
						),
					}}
				/>
			</Tab.Navigator>
		</View>
	);
}

export default Tabbar;
