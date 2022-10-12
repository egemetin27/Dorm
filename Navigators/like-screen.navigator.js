import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LikeCards from "../Pages/User/LikeCards";
import Likes from "../Pages/User/Likes";


function LikeStackScreen() {
	const LikeStack = createNativeStackNavigator();

	return (
		<LikeStack.Navigator screenOptions={{ headerShown: false }}>
			<LikeStack.Screen name="Likes" component={Likes} />
			<LikeStack.Screen name="LikeCards" component={LikeCards} />
		</LikeStack.Navigator>
	);
}

export default LikeStackScreen;
