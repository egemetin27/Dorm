import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import EventCards from "../../../Pages/User/EventCards";
import EventList from "../../../Pages/User/home/event-list.route";
import ProfileCards from "../../../Pages/User/ProfileCards";

const EventStack = () => {
	const HomeStack = createNativeStackNavigator();
	const { top } = useSafeAreaInsets();
	return (
		<View style={{ flex: 1, paddingTop: top }}>
			<StatusBar style="dark" />
			<HomeStack.Navigator initialRouteName="EventList" screenOptions={{ headerShown: false }}>
				<HomeStack.Screen name="EventList" component={EventList} />
				<HomeStack.Screen name="EventCards" component={EventCards} />
				<HomeStack.Screen
					name="ProfileCards"
					component={ProfileCards}
					initialParams={{ mode: "event" }}
				/>
			</HomeStack.Navigator>
		</View>
	);
};

export default EventStack;
