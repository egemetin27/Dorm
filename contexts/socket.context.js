import { createContext, useRef, useEffect, useState, useContext } from "react";
import axios from "axios";

import { AuthContext } from "./auth.context";
import { MessageContext } from "./message.context";

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

	const handleReceive = ({ data }) => {
		const pack = JSON.parse(data).package;

		if (typeof pack == "string") {
			console.log({ pack });
			return;
		}
		const eventType = pack[0];
		const message = pack[1];
		// const token = pack[2]

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
		const ticket = await axios
			.post(
				"https://devmessage.meetdorm.com/connectionTicket",
				{ userId },
				{ headers: { "access-token": sesToken } }
			)
			.then((res) => res.data)
			.catch((err) => {
				console.log(err);
			});
		return ticket;
	};

	const connect = async () => {
		const ticket = await getTicket();

		ws.current = new WebSocket(`https://devmessage.meetdorm.com?userId=${userId}&ticket=${ticket}`);

		ws.current.onopen = (e) => {
			interval.current = setInterval(() => {
				console.log("AA");
				ws.current.send(JSON.stringify(organizeOutput("", "ping")));
			}, 50000);
			console.log("connected");
		};
		ws.current.onmessage = (event) => {
			handleReceive(event);
		};
		ws.current.onclose = (e) => {
			console.log("socket closed:", e);
		};
		ws.current.onerror = (e) => {
			console.log("error on socket:", e);
			setTimeout(connect, 200);
		};
	};

	const disconnect = () => {
		clearInterval(interval.current);
		ws.current.close();
	};

	const sendMessage = (msg, type) => {
		const messageToSent = organizeOutput(msg, type);

		ws.current.send(JSON.stringify(messageToSent));

		handleNewMessage(messageToSent.package[1]);
	};

	const readMessage = (matchId) => {
		const readData = organizeOutput({ matchId, message: "" }, "read");
		console.log({ readData });

		ws.current.send(JSON.stringify(readData));
	};

	const value = { connect, disconnect, sendMessage, readMessage };
	return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
};

export default SocketProvider;
