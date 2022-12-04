import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ModalPage from "../../components/modal.component";
import EventProvider from "../../contexts/events.context";
import FilterProvider from "../../contexts/filter.context";
import MessageProvider from "../../contexts/message.context";
import PeopleProvider from "../../contexts/people.context";
import SocketProvider from "../../contexts/socket.context";
import Hobbies from "../../Pages/afterRegisteration/Hobbies";
import KullaniciSozlesmesi from "../../Pages/KullaniciSozlesmesi";
import MahremiyetPolitikasi from "../../Pages/MahremiyetPolitikasi";
import FilterModal from "../../Pages/modals/filter.modal";
import Settings from "../../Pages/Settings";
import ToplulukKurallari from "../../Pages/ToplulukKurallari";
import Chat from "../../Pages/User/chat/chat.route";
import ProfileEditPage from "../../Pages/User/ProfileEditPage";
import ProfilePhotos from "../../Pages/User/ProfilePhotos";
import Tabbar from "../tabbar.stack";

const Stack = createNativeStackNavigator();
export default function LoggedInStack() {
	return (
		<MessageProvider>
			<SocketProvider>
				<FilterProvider>
					<PeopleProvider>
						<EventProvider>
							<Stack.Navigator screenOptions={{ headerShown: false }}>
								<Stack.Screen name="MainScreen" component={Tabbar} />
								<Stack.Screen name="Settings" component={Settings} />
								<Stack.Screen name="MahremiyetPolitikasi" component={MahremiyetPolitikasi} />
								<Stack.Screen name="KullaniciSozlesmesi" component={KullaniciSozlesmesi} />
								<Stack.Screen name="ToplulukKurallari" component={ToplulukKurallari} />
								<Stack.Screen name="Chat" component={Chat} />
								<Stack.Screen name="ProfilePhotos" component={ProfilePhotos} />
								<Stack.Screen name="Hobbies" component={Hobbies} />
								<Stack.Screen name="ProfileEditPage" component={ProfileEditPage} />
								<Stack.Screen
									name="CustomModal"
									component={ModalPage}
									options={{
										presentation: "transparentModal",
										animation: "fade",
									}}
								/>
								<Stack.Screen
									name="FilterModal"
									component={FilterModal}
									options={{
										presentation: "transparentModal",
										animation: "fade",
									}}
								/>
							</Stack.Navigator>
						</EventProvider>
					</PeopleProvider>
				</FilterProvider>
			</SocketProvider>
		</MessageProvider>
	);
}
