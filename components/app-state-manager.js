import { useContext, useEffect, useRef, useState } from "react";
import { AppState } from "react-native";
import { useNavigation } from "@react-navigation/native";

import { SocketContext } from "../contexts/socket.context";

const AppStateManager = ({ children }) => {
	const navigation = useNavigation();
	const { connect, disconnect } = useContext(SocketContext);

	const appState = useRef(AppState.currentState);
	const [appStateVisible, setAppStateVisible] = useState(appState.current);

	useEffect(() => {
		const subscription = AppState.addEventListener("change", (nextAppState) => {
			if (appState.current.match(/inactive|background/) && nextAppState === "active") {
				// app came to foreground
				if (
					navigation.getState().routes[0].name == "MainScreen" &&
					(navigation.getState().routes[0]?.state?.routes[1]?.path == "messages" ||
						navigation.getState().routes[0]?.state?.index == 2)
				) {
					// console.log("TRYING TO CONNECT");
					connect();
					const navState = navigation.getState();
					if (navState?.routes[navState?.routes?.length - 1].name == "Chat") {
						navigation.goBack();
					}
				}
			} else {
				disconnect();
			}

			appState.current = nextAppState;
			// setAppStateVisible(appState.current);
			// console.log("AppState", appState.current);
		});

		return () => {
			subscription.remove();
		};
	}, []);

	return <>{children}</>;
};

export default AppStateManager;
