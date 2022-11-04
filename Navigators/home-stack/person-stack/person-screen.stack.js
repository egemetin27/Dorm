import { createNativeStackNavigator } from "@react-navigation/native-stack";
import EventCards from "../../../Pages/User/EventCards";
import EventList from "../../../Pages/User/home/event-list.route";
import ProfileCards from "../../../Pages/User/ProfileCards";

const PersonStack = ({
	route: {
		params: { mode },
	},
}) => {
	const HomeStack = createNativeStackNavigator();

	return (
		<HomeStack.Navigator screenOptions={{ headerShown: false }}>
			<HomeStack.Screen name="ProfileCards" component={ProfileCards} initialParams={{ mode }} />
		</HomeStack.Navigator>
	);
};

export default PersonStack;
