import { createContext, useRef, useEffect, useState, useContext } from "react";
import axios from "axios";

import { AuthContext } from "./auth.context";
import { MessageContext } from "./message.context";

export const SocketContext = createContext({
	matchList: [],
	connect: () => {},
	sendMessage: () => {},
});

const SocketProvider = ({ children }) => {
	const { user } = useContext(AuthContext);
	const { handleNewMessage } = useContext(MessageContext);

	const { userId, sesToken } = user ?? { userId: 0, sesToken: "" };

	const ws = useRef();

	// const ticket = "mnxA4MpNWDdscI_We8VzmZ9si6BzZDx2";
	// const userId = 31;

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
		// TODO: msg = {destId, matchId, message}
		var date = new Date();
		date.setHours(date.getHours() - date.getTimezoneOffset() / 60);
		var now = date.toISOString().slice(0, 22);
		const message = { ...msg, sourceId: userId, unread: 1, date: now };
		const pack = { package: [type, message, sesToken] };
		return pack;
	};

	const getTicket = async () => {
		// const res = await fetch(
		// 	"message.eba-e2mjn2ef.eu-central-1.elasticbeanstalk.com/connectionTicket",
		// 	{
		// 		method: "POST",
		// 		headers: {
		// 			"Content-Type": "application/json",
		// 			"access-token": sesToken,
		// 		},
		// 		body: JSON.stringify({ userId }),
		// 	}
		// )
		// 	.then((res) => res.json())
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
		// ws.current = new WebSocket(`ws://192.168.1.29:3001?userId=${userId}&ticket=${ticket}`);
		// ws.current = new WebSocket(`ws://192.168.1.29:3001`);
		ws.current.onopen = (e) => {
			console.log("connected");
		};
		ws.current.onmessage = (event) => {
			// console.log(`Received: ${e.data}`);
			// var msg = JSON.parse(e.data);
			// console.log(msg);
			handleReceive(event);
		};
		ws.current.onclose = (e) => {
			console.log("closed");
			// console.log("Reconnecting: ", e.message);
		};
		ws.current.onerror = (e) => {
			console.log("error");
			setTimeout(connect, 5000);
			// console.log(`Error: ${e.message}`);
		};
	};

	const disconnect = () => {
		ws.current.close();
	};

	const sendMessage = (msg, type) => {
		const messageToSent = organizeOutput(msg, type);

		handleNewMessage(messageToSent.package[1]);

		ws.current.send(JSON.stringify(messageToSent));
	};

	const value = { connect, disconnect, sendMessage };
	return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
};

export default SocketProvider;
