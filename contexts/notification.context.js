import { createContext, useContext, useEffect, useRef, useState, useMemo } from "react";
import { Platform } from "react-native";
import * as Notifications from "expo-notifications";
import { isDevice } from "expo-device";
import axios from "axios";
//import * as Linking from "expo-linking";

import { AuthContext } from "./auth.context";

import url from "../connection";
import crypto from "../functions/crypto";

Notifications.setNotificationHandler({
	handleNotification: async () => ({
		shouldShowAlert: true,
		shouldPlaySound: true,
		shouldSetBadge: false,
	}),
});

const handleNotification = (notification) => {
	// console.log({ notification });
};

const handleNotificationResponse = (response) => {
	// console.log(response.notification.request.content.data);
	const { mesData, url } = { mesData: null, ...response.notification.request.content.data };
	console.log(url);
	// Linking.openURL(url);
};

export const NotificationContext = createContext({
	unReadCheck: false,
	eventLiked: false,
	setUnreadChecker: () => {},
	setEventLike: () => {},
});

const NotificationProvider = ({ children }) => {
	const { user } = useContext(AuthContext);
	const [unReadCheck, setUnreadCheck] = useState(false);
	const [eventLiked, setEventLiked] = useState(null);
	//const { setUnread } = useContext(MessageContext);
	//const [notification, setNotification] = useState(false);

	const { userId, sesToken } = useMemo(() => user ?? { userId: 0, sesToken: "" }, [user]);

	const notificationListener = useRef();
	//const responseListener = useRef();

	useEffect(() => {
		if (user) {
			registerForPushNotificationsAsync();

			notificationListener.current = Notifications.addNotificationReceivedListener(
				(notification) => {
					//console.log("The push notification message content: " + notification.request.content.body);
					setUnreadChecker(true);
				}
			);

			//responseListener.current = Notifications.addNotificationResponseReceivedListener();

			return () => {
				Notifications.removeNotificationSubscription(notificationListener.current);
				//Notifications.removeNotificationSubscription(responseListener.current);
			};
		}
	}, [user]);

	const setUnreadChecker = (bool) => {
		setUnreadCheck(bool);
	};

	const setEventLike = (bool) => {
		setEventLiked(bool);
	};

	// const lastNotificationResponse = Notifications.useLastNotificationResponse();
	// useEffect(() => {
	// 	if (
	// 		lastNotificationResponse &&
	// 		lastNotificationResponse.notification.request.content.data.url &&
	// 		lastNotificationResponse.actionIdentifier === Notifications.DEFAULT_ACTION_IDENTIFIER
	// 	) {
	// 		Linking.openURL(lastNotificationResponse.notification.request.content.data.url);
	// 	}
	// }, [lastNotificationResponse]);

	// useEffect(() => {
	// 	// if (isLoggedIn) {
	// 	notificationListener.current =
	// 		Notifications.addNotificationReceivedListener(handleNotification);
	// 	responseListener.current = Notifications.addNotificationResponseReceivedListener(
	// 		handleNotificationResponse
	// 	);

	// 	return () => {
	// 		Notifications.removeNotificationSubscription(notificationListener.current);
	// 		Notifications.removeNotificationSubscription(responseListener.current);
	// 	};
	// 	// }
	// }, []);

	const registerForPushNotificationsAsync = async () => {
		if (isDevice) {
			const { status: existingStatus } = await Notifications.getPermissionsAsync();
			let finalStatus = existingStatus;
			if (existingStatus !== "granted") {
				const { status } = await Notifications.requestPermissionsAsync();
				finalStatus = status;
			}
			if (finalStatus !== "granted") {
				alert("Bildirim için gerekli izin verilmedi. Bildirim alamayacaksın.");
				return;
			}
			const token = (await Notifications.getExpoPushTokenAsync()).data;

			const encryptedToken = crypto.encrypt({
				userId: userId,
				token,
			});

			axios
				.post("https://devmessage.meetdorm.com/registerToken", encryptedToken, {
					headers: { "access-token": sesToken },
				})
				.then()
				.catch((err) => console.log("error on /registerToken", err));

			return token;
		} else {
			alert("Bildirim alabilmek için fiziksel bir cihaz kullanmalısın.");
		}

		if (Platform.OS === "android") {
			Notifications.setNotificationChannelAsync("default", {
				name: "default",
				importance: Notifications.AndroidImportance.MAX,
				vibrationPattern: [0, 250, 250, 250],
				lightColor: "#FF231F7C",
			});
		}
	};

	const value = {
		unReadCheck,
		eventLiked,
		setUnreadChecker,
		setEventLike,
	};

	return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
};

export default NotificationProvider;
