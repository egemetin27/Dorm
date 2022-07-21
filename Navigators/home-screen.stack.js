import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Home from "../Pages/User/Home";
import ProfileCards from "../Pages/User/ProfileCards";
import EventCards from "../Pages/User/EventCards";

function HomeStackScreen() {
	const HomeStack = createNativeStackNavigator();

	return (
		<HomeStack.Navigator screenOptions={{ headerShown: false }}>
			<HomeStack.Screen name="Home" component={Home} />
			<HomeStack.Screen name="ProfileCards" component={ProfileCards} />
			<HomeStack.Screen name="EventCards" component={EventCards} />
		</HomeStack.Navigator>
	);
}

export default HomeStackScreen;
