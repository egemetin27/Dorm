import { createContext, useRef, useEffect, useState, useContext } from "react";
import axios from "axios";

import { AuthContext } from "./auth.context";
import { MessageContext } from "./message.context";
import crypto from "../functions/crypto";

export const SocketContext = createContext({
	connect: () => {},
	disconnect: () => {},
	sendMessage: () => {},
	readMessage: () => {},
});

const SocketProvider = ({ children }) => {
	const { user } = useContext(AuthContext);
	const { handleNewMessage } = useContext(MessageContext);

	const { userId, sesToken } = user ?? { userId: 0, sesToken: "" };

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
				console.log(err);
			});
		return ticket;
	};

	const connect = async () => {
		const ticket = await getTicket();

		// ws.current = new WebSocket(`ws://192.168.1.29:3002?userId=${userId}&ticket=${ticket}`);
		ws.current = new WebSocket(`https://devmessage.meetdorm.com?userId=${userId}&ticket=${ticket}`);

		ws.current.onopen = (e) => {
			console.log({ e });
			interval.current = setInterval(() => {
				const encryptedData = crypto.encrypt(organizeOutput("", "ping"));
				encryptedData.userId = userId;
				ws.current.send(JSON.stringify(encryptedData));
			}, 50000);
		};
		ws.current.onmessage = (event) => {
			console.log({ event });
			if (event.data != "pong") {
				const decryptedResponse = crypto.decrypt(event.data);

				handleReceive(decryptedResponse);
			}
		};
		ws.current.onclose = (e) => {
			clearInterval(interval.current);
			console.log("socket closed:", e);
		};
		ws.current.onerror = (e) => {
			console.log("error on socket:", e);
			setTimeout(connect, 5000);
		};
	};

	const disconnect = () => {
		clearInterval(interval.current);
		ws.current.close();
	};

	const sendMessage = async (msg, type) => {
		const messageToSent = organizeOutput(msg, type);

		const encryptedMessage = crypto.encrypt(messageToSent);
		encryptedMessage.userId = userId;

		// setTimeout(() => {
		// 	ws.current.send(JSON.stringify(encryptedMessage));
		// }, 500);

		ws.current.send(JSON.stringify(encryptedMessage));
		handleNewMessage(messageToSent.package[1]);
	};

	const readMessage = (matchId, destId) => {
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
