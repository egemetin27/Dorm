import { createContext, useRef, useContext, useMemo } from "react";
import axios from "axios";

import { AuthContext } from "./auth.context";
import { MessageContext } from "./message.context";
import crypto from "../functions/crypto";
import { useNavigation } from "@react-navigation/native";

export const SocketContext = createContext({
	connect: () => {},
	disconnect: () => {},
	sendMessage: () => {},
	readMessage: () => {},
});

const SocketProvider = ({ children }) => {
	const {
		user: { userId, sesToken },
	} = useContext(AuthContext);
	const { handleNewMessage } = useContext(MessageContext);

	const navigation = useNavigation();

	const ws = useRef();
	const interval = useRef();

	const handleReceive = (data) => {
		const pack = data.package;

		if (typeof pack == "string") {
			console.log(pack);
			return;
		}
		const eventType = pack[0];
		const message = pack[1];

		switch (eventType) {
			case "message":
				handleNewMessage(message);
				break;
			case "match":
				console.log(`match: ${message}`);
				break;
			default:
				break;
		}
	};

	const organizeOutput = (msg, type) => {
		var now = Date.now();

		const message = { ...msg, sourceId: userId, unread: 1, date: now };
		const pack = { package: [type, message, sesToken] };
		return pack;
	};

	const getTicket = async () => {
		const encryptedId = crypto.encrypt({ userId });
		const ticket = await axios
			.post(
				// "http://192.168.1.29:3002/connectionTicket",
				"https://devmessage.meetdorm.com/connectionTicket",
				// { userId },
				encryptedId,
				{
					headers: { "access-token": sesToken },
				}
			)
			.then((res) => {
				return crypto.decrypt(res.data);
			})
			.catch((err) => {
				console.log("error on /connectionTicket");
				console.log(err);
			});
		return ticket;
	};

	const connect = async () => {
		if (!userId) {
			console.log("ERROR ON CONNECTING TO SOCKET");
			return;
		}
		const ticket = await getTicket();

		// ws.current = new WebSocket(`ws://192.168.1.29:3002?userId=${userId}&ticket=${ticket}`);
		ws.current = new WebSocket(`https://devmessage.meetdorm.com?userId=${userId}&ticket=${ticket}`);

		ws.current.onopen = (e) => {
			interval.current = setInterval(() => {
				const encryptedData = crypto.encrypt(organizeOutput("", "ping"));
				encryptedData.userId = userId;
				ws.current.send(JSON.stringify(encryptedData));
			}, 50000);
		};
		ws.current.onmessage = (event) => {
			if (event.data != "pong") {
				const decryptedResponse = crypto.decrypt(event.data);

				handleReceive(decryptedResponse);
			}
		};
		ws.current.onclose = (e) => {
			clearInterval(interval.current);
			console.log("socket closed");
			// console.log(e);
		};
		ws.current.onerror = (e) => {
			console.log("error on socket");
			// console.log(e);
			setTimeout(connect, 5000);
		};
	};

	const disconnect = () => {
		clearInterval(interval.current);
		const socket = ws.current;
		if (!socket || socket?.readyState != WebSocket.OPEN) return;
		// if (socket?.readyState != WebSocket.OPEN) return;
		ws.current.close();
	};

	const sendMessage = async (msg, type) => {
		if (ws.current.readyState != WebSocket.OPEN) {
			navigation.navigate("CustomModal", {
				modalType: "CONNECTION_ERROR",
			});
			return false;
		}

		const messageToSent = organizeOutput(msg, type);

		const encryptedMessage = crypto.encrypt(messageToSent);
		encryptedMessage.userId = userId;

		ws.current.send(JSON.stringify(encryptedMessage));
		handleNewMessage(messageToSent.package[1]);
		return true;
	};

	const readMessage = (matchId, destId) => {
		if (ws.current.readyState != WebSocket.OPEN) {
			console.log("CANNOT READ");
			return;
		}
		console.log("READING");

		const readData = organizeOutput({ matchId, destId, message: "" }, "read");
		const encryptedReadData = crypto.encrypt(readData);
		encryptedReadData.userId = userId;

		ws.current.send(JSON.stringify(encryptedReadData));
	};

	const value = { connect, disconnect, sendMessage, readMessage };
	return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
};

export default SocketProvider;
