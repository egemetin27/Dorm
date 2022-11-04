import { createNativeStackNavigator } from "@react-navigation/native-stack";
import EventCards from "../../../Pages/User/EventCards";
import EventList from "../../../Pages/User/home/event-list.route";
import ProfileCards from "../../../Pages/User/ProfileCards";

const EventStack = () => {
	const HomeStack = createNativeStackNavigator();

	return (
		<HomeStack.Navigator initialRouteName="EventList" screenOptions={{ headerShown: false }}>
			<HomeStack.Screen name="EventList" component={EventList} />
			<HomeStack.Screen name="EventCards" component={EventCards} />
			<HomeStack.Screen
				name="ProfileCards"
				component={ProfileCards}
				initialParams={{ mode: "event" }}
			/>
		</HomeStack.Navigator>
	);
};

export default EventStack;
