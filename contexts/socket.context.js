import { suppressDeprecationWarnings } from "moment";
import { createContext, useRef, useEffect, useState } from "react";
import { io } from "socket.io-client";
import axios from "axios";

import url from "../connection";
import { Session } from "../nonVisualComponents/SessionVariables";

import crypto from "../functions/crypto";

export const SocketContext = createContext({
	matchList: [],
	connect: () => {},
	sendMessage: () => {},
});

const fetchImage = async (otherPersonId) => {
	const encryptedData = crypto.encrypt({ userId: Session.User.userId, otherId: otherPersonId });
	// const encryptedData = crypto.encrypt({ userId: 31, otherId: otherPersonId });
	const imageUrl = await axios
		.post(url + "/getProfilePic", encryptedData, {
			// headers: { "access-token": "d1u-triy_2Ly39cqBJ4UAN3rjeM4fZdX" },
			headers: { "access-token": Session.User.sesToken },
		})
		.then((res) => res.data[0].PhotoLink)
		.catch((err) => {
			console.log(`error on /getProfilePic: ${JSON.stringify(err.response.toJSON())}`);
			return "";
		});
	return imageUrl;
};

const SocketProvider = ({ children }) => {
	const [rawList, setRawList] = useState([]);
	const [matchList, setMatchList] = useState([]);
	const socket = useRef();

	const connect = () => {
		socket.current = io("http://message.eba-e2mjn2ef.eu-central-1.elasticbeanstalk.com/", {
			// socket.current = io("http://192.168.1.29:3001", {
			reconnectionDelayMax: 10000,
			auth: {
				// userId: 31,
				// token: "d1u-triy_2Ly39cqBJ4UAN3rjeM4fZdX",
				userId: Session.User.userId,
				token: Session.User.sesToken,
			},
		});
		socket.current.on("connectionInfo", (list) => {
			if (list == "0") {
				socket.current.emit("connectionInfo", "");
				return;
			}
			setRawList(list);
		});
	};

	useEffect(() => {
		(async () => {
			if (rawList.length > 0) {
				const newList = await Promise.all(
					rawList.map(async (match) => {
						var imageUrl = "";
						var otherId = 0;
						if (Session.User.userId != match.MId1) {
							// if (31 != match.MId1) {
							imageUrl = await fetchImage(match.MId1);
							otherId = match.MId1;
						} else {
							imageUrl = await fetchImage(match.MId2);
							otherId = match.MId2;
						}
						var { MId1, MId2, ...newMatchInstance } = match;
						newMatchInstance = { ...newMatchInstance, imageUrl, otherId };

						return newMatchInstance;
					})
				);
				setMatchList(newList);
			}
		})();
	}, [rawList]);

	// const connectionInfo = () => {
	// 	socket.current.on("connectionInfo", (message) => {
	// 		if (message == "0") socket.current.emit("connectionInfo", "");
	// 		console.log(message);
	// 	});
	// };

	const sendMessage = () => {
		console.log("sending message");
	};

	const value = { matchList, connect, sendMessage };
	return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
};

export default SocketProvider;
